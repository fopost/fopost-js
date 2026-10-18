import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; url: string; body: unknown; headers: Record<string, string> };

function recordingClient(response: unknown = { data: {} }) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({
      method: init?.method ?? 'GET',
      url: String(input),
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
      headers: (init?.headers ?? {}) as Record<string, string>,
    });
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

const last = (calls: Call[]) => {
  const call = calls[calls.length - 1]!;
  const url = new URL(call.url);
  return { ...call, path: url.pathname, query: Object.fromEntries(url.searchParams) };
};

const scope = { workspaceId: 'ws', connectionId: 'c1', adAccountId: 'act_1' };

describe('ads: conversions API', () => {
  it('sends the Idempotency-Key header on the idempotent send', async () => {
    const result = { id: 'b1', accepted: 1, eventCount: 1, replayed: false };
    const { calls, client } = recordingClient({ data: result });
    const batch = await client.ads.sendConversions(
      {
        ...scope,
        pixelId: 'px_1',
        events: [
          {
            eventName: 'Purchase',
            occurredAt: '2026-10-18T10:04:00Z',
            eventId: 'ord_9',
            actionSource: 'website',
            externalId: 'user_42',
          },
        ],
      },
      'order-9',
    );
    expect(batch).toEqual(result);
    const req = last(calls);
    expect(req).toMatchObject({ method: 'POST', path: '/v1/ads/conversions/events' });
    expect(req.headers['Idempotency-Key']).toBe('order-9');
    expect(req.headers['X-API-Key']).toBe('test-key');
  });

  it('keeps uploadConversions on its route, with the key only when given', async () => {
    const { calls, client } = recordingClient({ data: { accepted: 1 } });
    const input = {
      ...scope,
      pixelId: 'px_1',
      events: [{ eventName: 'Lead', occurredAt: '2026-10-18T10:04:00Z' }],
    };
    await client.ads.uploadConversions(input);
    expect(last(calls)).toMatchObject({ method: 'POST', path: '/v1/ads/conversions' });
    expect(last(calls).headers['Idempotency-Key']).toBeUndefined();

    await client.ads.uploadConversions(input, 'lead-1');
    expect(last(calls).headers['Idempotency-Key']).toBe('lead-1');
  });

  it('lists stored batches', async () => {
    const { calls, client } = recordingClient({ data: [] });
    await client.ads.conversionEvents({ workspaceId: 'ws', connectionId: 'c1', limit: 5 });
    expect(last(calls)).toMatchObject({
      path: '/v1/ads/conversions/events',
      query: { workspace_id: 'ws', connection_id: 'c1', limit: '5' },
    });
  });
});

describe('ads: pixels', () => {
  it('reads one pixel with the ad account in the query', async () => {
    const pixel = {
      id: 'px_1',
      name: 'Site',
      code: '<script></script>',
      createdAt: null,
      lastFiredAt: null,
      isUnavailable: false,
      dataUseSetting: 'advertising_and_analytics',
    };
    const { calls, client } = recordingClient({ data: pixel });
    const result = await client.ads.getPixel('px_1', scope);
    expect(result.code).toBe('<script></script>');
    expect(last(calls)).toMatchObject({
      method: 'GET',
      path: '/v1/ads/pixels/px_1',
      query: { workspace_id: 'ws', connection_id: 'c1', ad_account_id: 'act_1' },
    });

    await client.ads.pixelStats('px_1', scope);
    expect(last(calls).path).toBe('/v1/ads/pixels/px_1/stats');
    await client.ads.eventMatchQuality('px_1', scope);
    expect(last(calls).path).toBe('/v1/ads/pixels/px_1/match-quality');
  });

  it('creates, updates and shares a pixel through the body', async () => {
    const { calls, client } = recordingClient({ data: {} });
    await client.ads.createPixel({ ...scope, name: 'Site' });
    expect(last(calls)).toMatchObject({ method: 'POST', path: '/v1/ads/pixels', body: scope });

    await client.ads.updatePixel('px_1', { ...scope, dataUseSetting: 'analytics_only' });
    expect(last(calls)).toMatchObject({
      method: 'PATCH',
      path: '/v1/ads/pixels/px_1',
      body: { dataUseSetting: 'analytics_only' },
    });

    await client.ads.sharePixel('px_1', { ...scope, targetAdAccountId: 'act_2' });
    expect(last(calls)).toMatchObject({
      path: '/v1/ads/pixels/px_1/share',
      body: { targetAdAccountId: 'act_2' },
    });
  });
});

describe('ads: custom conversions', () => {
  it('creates a custom conversion', async () => {
    const created = { id: 'cc_1', name: 'Checkout', eventType: 'PURCHASE' };
    const { calls, client } = recordingClient({ data: created });
    const result = await client.ads.createCustomConversion({
      ...scope,
      pixelId: 'px_1',
      name: 'Checkout',
      eventType: 'PURCHASE',
      rule: { urlContains: '/thank-you' },
      defaultValueMinor: 1999,
    });
    expect(result).toMatchObject(created);
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/ads/custom-conversions',
      body: { pixelId: 'px_1', eventType: 'PURCHASE', rule: { urlContains: '/thank-you' } },
    });
  });

  it('reads, updates and deletes one', async () => {
    const { calls, client } = recordingClient({ data: {} });
    await client.ads.customConversions(scope);
    expect(last(calls).query.ad_account_id).toBe('act_1');

    await client.ads.getCustomConversion('cc_1', scope);
    expect(last(calls).path).toBe('/v1/ads/custom-conversions/cc_1');

    await client.ads.updateCustomConversion('cc_1', { ...scope, name: 'Paid' });
    expect(last(calls)).toMatchObject({ method: 'PATCH', body: { name: 'Paid' } });

    await client.ads.deleteCustomConversion('cc_1', scope);
    // The ad account travels in the body, because the path already carries the conversion.
    expect(last(calls)).toMatchObject({
      method: 'DELETE',
      path: '/v1/ads/custom-conversions/cc_1',
      body: scope,
    });
  });
});
