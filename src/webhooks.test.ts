import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { WebhookError, verifyWebhook, webhooks, type ArticlePublishedPayload } from './index.js';

const SECRET = 'whsec_test';

const payload: ArticlePublishedPayload = {
  id: 'art_1',
  title: 'Planning a month of articles',
  slug: 'planning-a-month-of-articles',
  excerpt: null,
  metaTitle: null,
  metaDescription: null,
  bodyMarkdown: '# Planning',
  bodyHtml: '<h1>Planning</h1>',
  featuredImage: null,
  images: [],
  tags: ['planning'],
  keyword: 'content calendar',
  wordCount: 2,
  publishedAt: '2026-10-11T09:00:00.000Z',
  publishedUrl: 'https://yourbrand.com/blog/planning-a-month-of-articles',
};

function delivery(timestamp = Math.floor(Date.now() / 1000)) {
  const body = JSON.stringify({
    event: 'article.published',
    data: payload,
    timestamp: '2026-10-11T09:00:01.000Z',
  });
  const sign = (message: string) =>
    `sha256=${createHmac('sha256', SECRET).update(message).digest('hex')}`;
  const headers: Record<string, string> = {
    'X-FoPost-Event': 'article.published',
    'X-FoPost-Delivery': 'dlv_1',
    'X-FoPost-Timestamp': String(timestamp),
    'X-FoPost-Signature-256': sign(`${timestamp}.${body}`),
    'X-FoPost-Signature': sign(body),
  };
  return { body, headers };
}

describe('verifyWebhook', () => {
  it('accepts a timestamped signature and returns the envelope', async () => {
    const { body, headers } = delivery();
    const event = await verifyWebhook<ArticlePublishedPayload>(body, headers, SECRET);
    expect(event.event).toBe('article.published');
    expect(event.timestamp).toBe('2026-10-11T09:00:01.000Z');
    expect(event.data.publishedUrl).toBe(payload.publishedUrl);
    expect(event.data.slug).toBe(payload.slug);
  });

  it('verifies raw bytes and Headers instances the same way', async () => {
    const { body, headers } = delivery();
    const event = await webhooks.verify(
      new TextEncoder().encode(body),
      new Headers(headers),
      SECRET,
    );
    expect(event.event).toBe('article.published');
  });

  it('refuses a tampered body', async () => {
    const { body, headers } = delivery();
    const forged = body.replace('planning-a-month', 'planning-a-year');
    await expect(verifyWebhook(forged, headers, SECRET)).rejects.toMatchObject({
      code: 'invalid_signature',
    });
    await expect(verifyWebhook(forged, headers, SECRET)).rejects.toBeInstanceOf(WebhookError);
  });

  it('refuses a stale timestamp even when the signature matches', async () => {
    const { body, headers } = delivery(Math.floor(Date.now() / 1000) - 301);
    await expect(verifyWebhook(body, headers, SECRET)).rejects.toMatchObject({
      code: 'stale_delivery',
    });
  });

  it('accepts the body-only signature when no timestamp header is present', async () => {
    const { body, headers } = delivery();
    const {
      'X-FoPost-Timestamp': _timestamp,
      'X-FoPost-Signature-256': _timestamped,
      ...legacy
    } = headers;
    const event = await verifyWebhook(body, legacy, SECRET);
    expect(event.event).toBe('article.published');
  });

  it('refuses a body-only signature over a different body', async () => {
    const { body, headers } = delivery();
    const { 'X-FoPost-Timestamp': _t, 'X-FoPost-Signature-256': _s, ...legacy } = headers;
    await expect(verifyWebhook(`${body} `, legacy, SECRET)).rejects.toMatchObject({
      code: 'invalid_signature',
    });
  });

  it('refuses to verify without a secret or a signature', async () => {
    const { body, headers } = delivery();
    await expect(verifyWebhook(body, headers, '')).rejects.toMatchObject({
      code: 'missing_secret',
    });
    await expect(verifyWebhook(body, {}, SECRET)).rejects.toMatchObject({
      code: 'invalid_signature',
    });
  });
});
