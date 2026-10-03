import { describe, it, expect } from 'vitest';
import { FoPost } from './index.js';

function stub(body: unknown) {
  const calls: string[] = [];
  const fetchImpl = (async (url: string) => {
    calls.push(url.toString());
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'k', fetch: fetchImpl }) };
}

describe('activity', () => {
  it('reads the audit log and keeps the cursor', async () => {
    const { calls, client } = stub({
      data: [
        {
          id: 'e1',
          workspace_id: 'w1',
          kind: 'security',
          ref_type: 'member_removed',
          ref_id: 'u1',
          summary: 'Removed sam@example.com',
          actor: { type: 'user', name: 'Ada' },
          time: '2026-09-20T10:00:00.000Z',
        },
      ],
      meta: { next_cursor: '42' },
    });
    const page = await client.activity.list({ workspaceId: 'w1', kind: 'security', limit: 1 });
    expect(calls[0]).toContain('kind=security');
    expect(calls[0]).toContain('workspace_id=w1');
    expect(page.data[0].refType).toBe('member_removed');
    expect(page.data[0].actor.name).toBe('Ada');
    expect(page.meta.nextCursor).toBe('42');
  });

  it('reports the end of the list as a null cursor', async () => {
    const { client } = stub({ data: [], meta: { next_cursor: null } });
    const page = await client.activity.list();
    expect(page.data).toEqual([]);
    expect(page.meta.nextCursor).toBeNull();
  });
});
