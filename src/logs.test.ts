import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; path: string; query: string };

function recordingClient(response: unknown) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    calls.push({ method: init?.method ?? 'GET', path: url.pathname, query: url.search });
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

describe('logs', () => {
  it('maps filters to snake_case and keeps the page whole', async () => {
    const page = {
      data: [{ id: 9, method: 'POST', route: '/v1/posts', status_code: 402 }],
      meta: { next_cursor: '8', has_more: true },
      summary: { total: 1, errors: 1 },
    };
    const { calls, client } = recordingClient(page);
    const res = await client.logs.list({
      workspaceId: 'ws',
      days: 7,
      status: 'failed',
      statusCode: 402,
      limit: 50,
      before: 10,
    });
    expect(res).toEqual(page);
    expect(calls[0]).toEqual({
      method: 'GET',
      path: '/v1/logs',
      query: '?workspace_id=ws&days=7&status=failed&status_code=402&limit=50&before=10',
    });
  });
});
