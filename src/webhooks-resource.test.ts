import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; path: string; query: string; body: unknown };

function recordingClient(response: unknown = { data: {} }, status = 200) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    calls.push({
      method: init?.method ?? 'GET',
      path: url.pathname,
      query: url.search,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    if (status === 204) return new Response(null, { status });
    return new Response(JSON.stringify(response), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

describe('webhooks resource', () => {
  it('creates a webhook and returns the secret once', async () => {
    const { calls, client } = recordingClient({
      id: 'wh_1',
      workspace_id: 'ws',
      url: 'https://yourbrand.com/hooks',
      secret: 'whsec_1',
      events: ['post.published'],
      header_names: ['X-Env'],
      active: true,
    });
    const hook = await client.webhooks.create({
      workspaceId: 'ws',
      url: 'https://yourbrand.com/hooks',
      events: ['post.published'],
      headers: { 'X-Env': 'prod' },
    });
    expect(hook.secret).toBe('whsec_1');
    expect(hook.header_names).toEqual(['X-Env']);
    expect(calls[0]).toMatchObject({
      method: 'POST',
      path: '/v1/webhooks',
      body: {
        workspaceId: 'ws',
        url: 'https://yourbrand.com/hooks',
        events: ['post.published'],
        headers: { 'X-Env': 'prod' },
      },
    });
  });

  it('lists, updates partially and deletes', async () => {
    const { calls, client } = recordingClient({ data: [{ id: 'wh_1' }] });
    const hooks = await client.webhooks.list();
    expect(hooks).toEqual([{ id: 'wh_1' }]);
    await client.webhooks.update('wh_1', { active: false, headers: null });
    expect(calls[1]).toMatchObject({
      method: 'PUT',
      path: '/v1/webhooks/wh_1',
      body: { active: false, headers: null },
    });
  });

  it('tests, deletes and redelivers with a 204 answer', async () => {
    const { calls, client } = recordingClient(undefined, 204);
    await client.webhooks.test('wh_1');
    await client.webhooks.delete('wh_1');
    await client.webhooks.redeliver('wh_1', 'dlv_1');
    expect(calls.map((c) => [c.method, c.path])).toEqual([
      ['POST', '/v1/webhooks/wh_1/test'],
      ['DELETE', '/v1/webhooks/wh_1'],
      ['POST', '/v1/webhooks/wh_1/deliveries/dlv_1/redeliver'],
    ]);
  });

  it('reads deliveries with filters and one delivery with its payload', async () => {
    const { calls, client } = recordingClient({
      id: 'dlv_1',
      status: 'failed',
      payload: { event: 'post.failed' },
    });
    await client.webhooks.deliveries('wh_1', { status: 'failed', limit: 10 });
    const delivery = await client.webhooks.getDelivery('wh_1', 'dlv_1');
    expect(delivery.payload).toEqual({ event: 'post.failed' });
    expect(calls[0]).toMatchObject({
      method: 'GET',
      path: '/v1/webhooks/wh_1/deliveries',
      query: '?status=failed&limit=10',
    });
    expect(calls[1]).toMatchObject({ method: 'GET', path: '/v1/webhooks/wh_1/deliveries/dlv_1' });
  });
});
