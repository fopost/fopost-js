import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

/**
 * The endpoint answers snake_case; the SDK's surface is camelCase. Both blocks
 * come back even when a network reports nothing per post.
 */
function client(body: unknown, status = 200) {
  const urls: string[] = [];
  const fetchImpl = (async (input: string | URL | Request) => {
    urls.push(String(input));
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { urls, fopost: new FoPost({ apiKey: 'k', fetch: fetchImpl }) };
}

describe('accounts.platformMetrics', () => {
  it('asks for raw=true and maps the wire body onto camelCase', async () => {
    const { urls, fopost } = client({
      data: {
        platform: 'facebook',
        account: {
          fetched_at: '2026-09-20T02:00:00.000Z',
          metrics: [
            {
              key: 'page_daily_video_ad_break_earnings',
              label: 'Ad Break Earnings',
              kind: 'currency_usd',
              value: 42.15,
            },
          ],
        },
        post: {
          external_post_id: '123_456',
          fetched_at: '2026-09-20T02:00:00.000Z',
          metrics: [],
        },
      },
    });

    const metrics = await fopost.accounts.platformMetrics('a1');

    expect(new URL(urls[0]).pathname).toBe('/v1/accounts/a1/insights');
    expect(new URL(urls[0]).searchParams.get('raw')).toBe('true');
    expect(metrics.platform).toBe('facebook');
    expect(metrics.account.fetchedAt).toBe('2026-09-20T02:00:00.000Z');
    expect(metrics.account.metrics[0].key).toBe('page_daily_video_ad_break_earnings');
    expect(metrics.post.externalPostId).toBe('123_456');
    expect(metrics.post.metrics).toEqual([]);
  });

  it('carries a series value through untouched', async () => {
    const { fopost } = client({
      data: {
        platform: 'youtube',
        account: {
          fetched_at: null,
          metrics: [
            {
              key: 'daily_views',
              label: 'Views by Day',
              kind: 'series',
              value: [{ day: '2026-09-19', views: 600 }],
            },
          ],
        },
        post: { external_post_id: null, fetched_at: null, metrics: [] },
      },
    });

    const metrics = await fopost.accounts.platformMetrics('a1');
    expect(metrics.account.metrics[0].value).toEqual([{ day: '2026-09-19', views: 600 }]);
    expect(metrics.account.fetchedAt).toBeNull();
  });

  it('throws the 503 a pending metric grant answers', async () => {
    const { fopost } = client(
      {
        error: 'platform_metrics_unavailable',
        message: 'google-business metrics are not available on this deployment yet.',
      },
      503,
    );

    await expect(fopost.accounts.platformMetrics('a1')).rejects.toMatchObject({
      status: 503,
      code: 'platform_metrics_unavailable',
    });
  });
});
