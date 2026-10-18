import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; path: string; body: unknown };

function recordingClient(response: unknown = { data: {} }) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({
      method: init?.method ?? 'GET',
      path: new URL(String(input)).pathname,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

describe('posts.unpublish', () => {
  it('posts to /unpublish with no body and returns the per-network outcome', async () => {
    const result = {
      post_status: 'unpublished',
      deliveries: [{ account_id: 'a1', platform: 'bluesky', removed: true }],
    };
    const { calls, client } = recordingClient(result);
    const res = await client.posts.unpublish('p1');
    expect(res).toEqual(result);
    expect(calls[0]).toEqual({ method: 'POST', path: '/v1/posts/p1/unpublish', body: undefined });
  });

  it('reads publish runs and post analytics', async () => {
    const { calls, client } = recordingClient({ data: [{ id: 'r1', run_number: 1 }] });
    const runs = await client.posts.publishRuns('p1');
    await client.posts.analytics('p1');
    expect(runs).toEqual([{ id: 'r1', run_number: 1 }]);
    expect(calls.map((c) => c.path)).toEqual([
      '/v1/posts/p1/publish-runs',
      '/v1/posts/p1/analytics',
    ]);
  });

  it('duplicates into a new draft with no body', async () => {
    const { calls, client } = recordingClient({ id: 'p2', status: 'draft' });
    const copy = await client.posts.duplicate('p1');
    expect(copy).toEqual({ id: 'p2', status: 'draft' });
    expect(calls[0]).toEqual({ method: 'POST', path: '/v1/posts/p1/duplicate', body: undefined });
  });
});
