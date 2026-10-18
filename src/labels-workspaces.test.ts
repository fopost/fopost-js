import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; path: string; body: unknown };

function recordingClient(response: unknown = { data: {} }, status = 200) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({
      method: init?.method ?? 'GET',
      path: new URL(String(input)).pathname,
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

describe('labels', () => {
  it('creates, reads and updates with snake_case bodies', async () => {
    const { calls, client } = recordingClient({ id: 'l1', name: 'Launch', color: '#ff0000' });
    const label = await client.labels.create({
      workspaceId: 'ws',
      name: 'Launch',
      color: '#ff0000',
    });
    expect(label.name).toBe('Launch');
    await client.labels.get('l1');
    await client.labels.update('l1', { name: 'Launch week', color: '#00ff00' });
    expect(calls).toEqual([
      {
        method: 'POST',
        path: '/v1/labels',
        body: { workspace_id: 'ws', name: 'Launch', color: '#ff0000' },
      },
      { method: 'GET', path: '/v1/labels/l1', body: undefined },
      { method: 'PUT', path: '/v1/labels/l1', body: { name: 'Launch week', color: '#00ff00' } },
    ]);
  });

  it('deletes with a 204 answer', async () => {
    const { calls, client } = recordingClient(undefined, 204);
    await expect(client.labels.delete('l1')).resolves.toBeUndefined();
    expect(calls[0]).toMatchObject({ method: 'DELETE', path: '/v1/labels/l1' });
  });
});

describe('workspaces', () => {
  it('creates and sends only the fields given on update', async () => {
    const { calls, client } = recordingClient({ id: 'ws', name: 'Your Brand' });
    await client.workspaces.create({ name: 'Your Brand', type: 'BRAND', timezone: 'UTC' });
    await client.workspaces.update('ws', { requireApproval: true, brandColor: '#123456' });
    await client.workspaces.analytics('ws');
    expect(calls[0]).toEqual({
      method: 'POST',
      path: '/v1/workspaces',
      body: { name: 'Your Brand', type: 'BRAND', timezone: 'UTC' },
    });
    expect(calls[1]).toEqual({
      method: 'PUT',
      path: '/v1/workspaces/ws',
      body: { requireApproval: true, brandColor: '#123456' },
    });
    expect(calls[2]).toMatchObject({ method: 'GET', path: '/v1/workspaces/ws/analytics' });
  });

  it('deletes with a 204 answer', async () => {
    const { calls, client } = recordingClient(undefined, 204);
    await client.workspaces.delete('ws');
    expect(calls[0]).toMatchObject({ method: 'DELETE', path: '/v1/workspaces/ws' });
  });
});
