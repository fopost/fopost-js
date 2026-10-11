/**
 * Signature verification for every outbound FoPost webhook.
 *
 *   import { verifyWebhook } from '@fopost/sdk';
 *
 *   export async function POST(request: Request) {
 *     const { event, data } = await verifyWebhook(
 *       await request.text(),
 *       request.headers,
 *       process.env.FOPOST_WEBHOOK_SECRET!,
 *     );
 *   }
 *
 * Web Crypto only, so this runs on Node, Deno and workers without a dependency.
 */

import type { BlogArticleWebhookPayload } from './types.js';

/** Refuse a delivery signed longer ago than this. Matches the API's own tolerance. */
export const SIGNATURE_TOLERANCE_SECONDS = 300;

export const SIGNATURE_HEADER = 'x-fopost-signature';
export const TIMESTAMPED_SIGNATURE_HEADER = 'x-fopost-signature-256';
export const TIMESTAMP_HEADER = 'x-fopost-timestamp';
export const EVENT_HEADER = 'x-fopost-event';
export const DELIVERY_HEADER = 'x-fopost-delivery';

/** Anything a framework hands us as headers. */
export type WebhookHeaders =
  Headers | Map<string, string> | Record<string, string | string[] | undefined>;

/** The exact bytes the API sent. A re-serialised object never verifies. */
export type WebhookBody = string | Uint8Array | ArrayBuffer;

/** The delivered envelope. `data` is the event-specific body. */
export type WebhookEvent<T = unknown> = {
  event: string;
  data: T;
  timestamp: string | null;
};

/** `data` of an `article.published` delivery. */
export type ArticlePublishedPayload = BlogArticleWebhookPayload & { publishedUrl: string };

export type ArticlePublishedEvent = WebhookEvent<ArticlePublishedPayload> & {
  event: 'article.published';
};

export type WebhookErrorCode =
  'missing_secret' | 'invalid_signature' | 'stale_delivery' | 'invalid_body';

export class WebhookError extends Error {
  readonly code: WebhookErrorCode;
  constructor(code: WebhookErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'WebhookError';
  }
}

export function webhookHeader(source: WebhookHeaders, name: string): string | null {
  if (typeof (source as Headers).get === 'function') {
    return (source as Headers).get(name) ?? (source as Headers).get(name.toLowerCase()) ?? null;
  }
  const record = source as Record<string, string | string[] | undefined>;
  const key = Object.keys(record).find((k) => k.toLowerCase() === name.toLowerCase());
  if (key === undefined) return null;
  const value = record[key];
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

const encoder = new TextEncoder();

function toBytes(body: WebhookBody): Uint8Array {
  if (typeof body === 'string') return encoder.encode(body);
  return body instanceof Uint8Array ? body : new Uint8Array(body);
}

function concat(prefix: Uint8Array, body: Uint8Array): Uint8Array {
  const out = new Uint8Array(prefix.length + body.length);
  out.set(prefix, 0);
  out.set(body, prefix.length);
  return out;
}

const hex = (bytes: ArrayBuffer): string =>
  [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');

async function hmac(secret: string, message: Uint8Array): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return hex(await globalThis.crypto.subtle.sign('HMAC', key, message as Uint8Array<ArrayBuffer>));
}

/** Constant time for equal-length digests, which is the only case that matters. */
function equals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const digest = (value: string | null): string | null =>
  value === null ? null : value.startsWith('sha256=') ? value.slice(7) : value;

/**
 * Signature check on its own. Prefers the replay-safe `X-FoPost-Signature-256`
 * and refuses it past the tolerance; falls back to `X-FoPost-Signature` only
 * when no timestamp header is present. Throws `WebhookError`.
 */
export async function verifyWebhookSignature(
  rawBody: WebhookBody,
  headers: WebhookHeaders,
  secret: string,
): Promise<void> {
  if (!secret) {
    throw new WebhookError('missing_secret', 'Pass the webhook secret to verify a delivery');
  }
  const body = toBytes(rawBody);

  const timestamped = digest(webhookHeader(headers, TIMESTAMPED_SIGNATURE_HEADER));
  if (timestamped !== null) {
    const timestamp = webhookHeader(headers, TIMESTAMP_HEADER);
    const sentAt = Number(timestamp);
    if (timestamp === null || timestamp === '' || !Number.isFinite(sentAt)) {
      throw new WebhookError('invalid_signature', 'Signed delivery carries no timestamp');
    }
    const age = Math.abs(Date.now() / 1000 - sentAt);
    if (age > SIGNATURE_TOLERANCE_SECONDS) {
      throw new WebhookError('stale_delivery', `Delivery is ${Math.round(age)}s old`);
    }
    const signed = concat(encoder.encode(`${timestamp}.`), body);
    if (!equals(timestamped, await hmac(secret, signed))) {
      throw new WebhookError('invalid_signature', 'Signature does not match the body');
    }
    return;
  }

  const plain = digest(webhookHeader(headers, SIGNATURE_HEADER));
  if (plain === null) {
    throw new WebhookError('invalid_signature', 'Delivery carries no signature header');
  }
  if (!equals(plain, await hmac(secret, body))) {
    throw new WebhookError('invalid_signature', 'Signature does not match the body');
  }
}

/** Verifies the delivery and returns its envelope. Pass the raw body, never a parsed object. */
export async function verifyWebhook<T = unknown>(
  rawBody: WebhookBody,
  headers: WebhookHeaders,
  secret: string,
): Promise<WebhookEvent<T>> {
  await verifyWebhookSignature(rawBody, headers, secret);

  let envelope: { event?: unknown; data?: unknown; timestamp?: unknown };
  try {
    const text = typeof rawBody === 'string' ? rawBody : new TextDecoder().decode(toBytes(rawBody));
    envelope = JSON.parse(text);
  } catch {
    throw new WebhookError('invalid_body', 'Webhook body is not JSON');
  }
  if (typeof envelope?.event !== 'string') {
    throw new WebhookError('invalid_body', 'Webhook body carries no event');
  }
  return {
    event: envelope.event,
    data: envelope.data as T,
    timestamp: typeof envelope.timestamp === 'string' ? envelope.timestamp : null,
  };
}

export const webhooks = { verify: verifyWebhook, verifySignature: verifyWebhookSignature };
