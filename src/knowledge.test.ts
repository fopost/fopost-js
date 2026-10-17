import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; url: string; body: unknown };

function recordingClient(response: unknown = { data: {} }) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({
      method: init?.method ?? 'GET',
      url: String(input),
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

const last = (calls: Call[]) => {
  const call = calls[calls.length - 1];
  const url = new URL(call.url);
  return { ...call, path: url.pathname, query: Object.fromEntries(url.searchParams) };
};

describe('knowledge', () => {
  it('lists sources for one workspace', async () => {
    const { calls, client } = recordingClient({ data: [{ id: 'k1', status: 'ready' }] });
    const sources = await client.knowledge.list({ workspaceId: 'ws' });
    expect(sources).toHaveLength(1);
    const req = last(calls);
    expect(req.path).toBe('/v1/knowledge/sources');
    expect(req.query).toEqual({ workspace_id: 'ws' });
  });

  it('maps a camelCase input onto the snake_case wire body', async () => {
    const { calls, client } = recordingClient({ data: { id: 'k1' } });
    await client.knowledge.create({
      kind: 'file',
      title: 'Price list',
      mediaId: 'media-1',
      brandVoiceId: 'brand-1',
      workspaceId: 'ws',
    });
    const req = last(calls);
    expect(req.method).toBe('POST');
    expect(req.path).toBe('/v1/knowledge/sources');
    expect(req.body).toEqual({
      kind: 'file',
      title: 'Price list',
      media_id: 'media-1',
      brand_voice_id: 'brand-1',
      workspace_id: 'ws',
    });
  });

  it('searches with top_k on the query string', async () => {
    const { calls, client } = recordingClient({ data: [{ sourceId: 'k1', score: 0.9 }] });
    const matches = await client.knowledge.search({ q: 'refund window', topK: 3 });
    expect(matches[0].sourceId).toBe('k1');
    const req = last(calls);
    expect(req.path).toBe('/v1/knowledge/search');
    expect(req.query).toEqual({ q: 'refund window', top_k: '3' });
  });

  it('queues a re-index without a body of its own', async () => {
    const { calls, client } = recordingClient({ data: { id: 'k1', status: 'pending' } });
    const queued = await client.knowledge.sync('k1');
    expect(queued.status).toBe('pending');
    const req = last(calls);
    expect(req.method).toBe('POST');
    expect(req.path).toBe('/v1/knowledge/sources/k1/sync');
  });
});
