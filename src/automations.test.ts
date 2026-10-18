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

describe('automations', () => {
  it('creates with a camelCase body and maps the graph', async () => {
    const { calls, client } = recordingClient({ id: 'au_1', secret: 'tok' });
    const created = await client.automations.create({
      workspaceId: 'ws',
      name: 'Cross-post',
      triggerType: 'api_webhook',
      graph: {
        nodes: [
          { id: 'n1', kind: 'trigger', layout: { x: 0, y: 0 } },
          { id: 'n2', kind: 'publish', config: { accounts: ['a1'] }, layout: { x: 1, y: 0 } },
        ],
        edges: [{ id: 'e1', source: 'n1', sourceHandle: 'out', target: 'n2' }],
      },
      active: true,
    });
    expect(created.secret).toBe('tok');
    expect(calls[0]).toMatchObject({
      method: 'POST',
      path: '/v1/automations',
      body: {
        workspaceId: 'ws',
        name: 'Cross-post',
        triggerType: 'api_webhook',
        active: true,
        graph: {
          nodes: [
            { id: 'n1', kind: 'trigger', layout: { x: 0, y: 0 } },
            { id: 'n2', kind: 'publish', config: { accounts: ['a1'] }, layout: { x: 1, y: 0 } },
          ],
          edges: [{ id: 'e1', source: 'n1', sourceHandle: 'out', target: 'n2' }],
        },
      },
    });
  });

  it('lists, reads, updates steps, toggles and reads stats', async () => {
    const { calls, client } = recordingClient({ data: [{ id: 'au_1' }] });
    expect(await client.automations.list()).toEqual([{ id: 'au_1' }]);
    await client.automations.get('au_1');
    await client.automations.update('au_1', {
      steps: [{ actionType: 'publish', actionConfig: { accounts: ['a1'] } }],
    });
    await client.automations.toggle('au_1');
    await client.automations.stats();
    await client.automations.trigger('au_1', { url: 'https://yourbrand.com/post' });
    expect(calls.map((c) => [c.method, c.path])).toEqual([
      ['GET', '/v1/automations'],
      ['GET', '/v1/automations/au_1'],
      ['PUT', '/v1/automations/au_1'],
      ['POST', '/v1/automations/au_1/toggle'],
      ['GET', '/v1/automations/stats'],
      ['POST', '/v1/automations/au_1/trigger'],
    ]);
    expect(calls[2].body).toEqual({
      steps: [{ actionType: 'publish', actionConfig: { accounts: ['a1'] } }],
    });
    expect(calls[5].body).toEqual({ url: 'https://yourbrand.com/post' });
  });

  it('pages versions and runs, reads one of each, and restores a version', async () => {
    const page = {
      data: [{ version: 2 }],
      meta: { page: 1, per_page: 20, total: 1, total_pages: 1 },
    };
    const { calls, client } = recordingClient(page);
    const versions = await client.automations.listVersions('au_1', { page: 1, perPage: 20 });
    expect(versions.meta.total_pages).toBe(1);
    await client.automations.getVersion('au_1', 2);
    await client.automations.restoreVersion('au_1', 2);
    await client.automations.listRuns('au_1', { page: 2 });
    await client.automations.getRun('au_1', 17);
    expect(calls.map((c) => [c.method, c.path, c.query])).toEqual([
      ['GET', '/v1/automations/au_1/versions', '?page=1&per_page=20'],
      ['GET', '/v1/automations/au_1/versions/2', ''],
      ['POST', '/v1/automations/au_1/versions/2/restore', ''],
      ['GET', '/v1/automations/au_1/runs', '?page=2'],
      ['GET', '/v1/automations/au_1/runs/17', ''],
    ]);
  });

  it('deletes with a 204 answer', async () => {
    const { calls, client } = recordingClient(undefined, 204);
    await expect(client.automations.delete('au_1')).resolves.toBeUndefined();
    expect(calls[0]).toMatchObject({ method: 'DELETE', path: '/v1/automations/au_1' });
  });
});
