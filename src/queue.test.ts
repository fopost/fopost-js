import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; path: string; query: string; body: unknown };

function recordingClient(response: unknown = { data: {} }) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    calls.push({
      method: init?.method ?? 'GET',
      path: url.pathname,
      query: url.search,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

describe('queue', () => {
  it('lists slots for a workspace and unwraps the envelope', async () => {
    const slot = {
      id: 's1',
      workspace_id: 'ws',
      account_id: null,
      weekday: 1,
      time: '09:00',
      timezone: 'Europe/Zagreb',
      created_at: '2026-10-01T00:00:00.000Z',
    };
    const { calls, client } = recordingClient({ data: [slot] });
    const slots = await client.queue.listSlots({ workspaceId: 'ws' });
    expect(slots).toEqual([slot]);
    expect(calls[0]).toMatchObject({
      method: 'GET',
      path: '/v1/queue/slots',
      query: '?workspace_id=ws',
    });
  });

  it('creates and updates a slot with a snake_case body', async () => {
    const { calls, client } = recordingClient({ data: { id: 's1', moved: [] } });
    await client.queue.createSlot({
      workspaceId: 'ws',
      accountId: 'a1',
      weekday: 3,
      time: '18:30',
      timezone: 'UTC',
    });
    const updated = await client.queue.updateSlot('s1', { time: '19:00' });
    expect(updated.moved).toEqual([]);
    expect(calls[0]).toMatchObject({
      method: 'POST',
      path: '/v1/queue/slots',
      body: { workspace_id: 'ws', account_id: 'a1', weekday: 3, time: '18:30', timezone: 'UTC' },
    });
    expect(calls[1]).toMatchObject({
      method: 'PUT',
      path: '/v1/queue/slots/s1',
      body: { time: '19:00' },
    });
  });

  it('deletes a slot, reads the next slot and previews upcoming ones', async () => {
    const { calls, client } = recordingClient({ data: ['2026-10-20T09:00:00.000Z'] });
    await client.queue.deleteSlot('s1');
    await client.queue.next({ workspaceId: 'ws', accountId: 'a1' });
    const preview = await client.queue.preview({ workspaceId: 'ws', count: 3 });
    expect(preview).toEqual(['2026-10-20T09:00:00.000Z']);
    expect(calls.map((c) => [c.method, c.path, c.query])).toEqual([
      ['DELETE', '/v1/queue/slots/s1', ''],
      ['GET', '/v1/queue/next', '?workspace_id=ws&account_id=a1'],
      ['GET', '/v1/queue/preview', '?workspace_id=ws&count=3'],
    ]);
  });

  it("sends schedule: 'queue' on post create and update", async () => {
    const { calls, client } = recordingClient();
    await client.posts.create({
      workspaceId: 'ws',
      content: [{ text: 'hi' }],
      accounts: ['a1'],
      status: 'scheduled',
      schedule: 'queue',
    });
    await client.posts.update('p1', { schedule: 'queue' });
    expect(calls[0].body).toMatchObject({ status: 'scheduled', schedule: 'queue' });
    expect(calls[1].body).toEqual({ schedule: 'queue' });
  });
});
