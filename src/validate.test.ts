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

describe('validate', () => {
  it('posts content, snake_case media and platforms', async () => {
    const { calls, client } = recordingClient({ data: { ready: true, platforms: [] } });
    const result = await client.validate.post({
      content: 'hi',
      media: [{ url: 'https://cdn.example.com/a.png', mimeType: 'image/png', size: 10 }],
      platforms: ['twitter'],
    });
    expect(result.ready).toBe(true);
    expect(calls[0]).toEqual({
      method: 'POST',
      path: '/v1/validate/post',
      body: {
        content: 'hi',
        media: [{ url: 'https://cdn.example.com/a.png', mime_type: 'image/png', size: 10 }],
        platforms: ['twitter'],
      },
    });
  });

  it('checks length and media on their own paths', async () => {
    const { calls, client } = recordingClient();
    await client.validate.length({ text: 'hi', platforms: ['bluesky'] });
    await client.validate.media({ url: 'https://cdn.example.com/a.png' });
    expect(calls.map((c) => c.path)).toEqual(['/v1/validate/length', '/v1/validate/media']);
    expect(calls[0].body).toEqual({ text: 'hi', platforms: ['bluesky'] });
    expect(calls[1].body).toEqual({ url: 'https://cdn.example.com/a.png' });
  });
});
