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

describe('contacts', () => {
  it('lists with snake_case filters and keeps the pagination block', async () => {
    const { calls, client } = recordingClient({
      data: [{ id: 'c1' }],
      pagination: { page: 2, per_page: 10, total: 11 },
    });
    const page = await client.contacts.list({
      workspaceId: 'ws',
      search: 'ada',
      platform: 'x',
      source: 'inbox',
      page: 2,
      perPage: 10,
    });
    expect(page.data).toHaveLength(1);
    expect(page.pagination.total).toBe(11);
    const req = last(calls);
    expect(req.path).toBe('/v1/contacts');
    expect(req.query).toEqual({
      workspace_id: 'ws',
      search: 'ada',
      platform: 'x',
      source: 'inbox',
      page: '2',
      per_page: '10',
    });
  });

  it('creates with the wire field names, not the camelCase input ones', async () => {
    const { calls, client } = recordingClient({ data: { id: 'c1' } });
    await client.contacts.create({
      workspaceId: 'ws',
      displayName: 'Ada Okafor',
      channels: [{ platform: 'x', handle: 'ada_writes' }],
      fields: { plan_tier: 'Pro' },
    });
    const req = last(calls);
    expect(req.method).toBe('POST');
    expect(req.path).toBe('/v1/contacts');
    expect(req.body).toEqual({
      workspace_id: 'ws',
      display_name: 'Ada Okafor',
      channels: [{ platform: 'x', handle: 'ada_writes' }],
      fields: { plan_tier: 'Pro' },
    });
  });

  it('clears a field by sending null rather than dropping it', async () => {
    const { calls, client } = recordingClient({ data: { id: 'c1' } });
    await client.contacts.update('c1', { fields: { region: null } });
    const req = last(calls);
    expect(req.method).toBe('PATCH');
    expect(req.path).toBe('/v1/contacts/c1');
    expect(req.body).toEqual({ fields: { region: null } });
  });

  it('reads the threads one contact appears in', async () => {
    const { calls, client } = recordingClient({ data: [{ key: 't_1' }] });
    const rows = await client.contacts.conversations('c1', { limit: 10 });
    expect(rows).toHaveLength(1);
    const req = last(calls);
    expect(req.path).toBe('/v1/contacts/c1/conversations');
    expect(req.query).toEqual({ limit: '10' });
  });

  it('imports CSV text as-is', async () => {
    const { calls, client } = recordingClient({
      data: { created: 1, merged: 0, skipped: [], unknownColumns: [] },
    });
    const result = await client.contacts.import('ws', 'platform,handle\nx,ada_writes');
    expect(result.created).toBe(1);
    const req = last(calls);
    expect(req.path).toBe('/v1/contacts/import');
    expect(req.body).toEqual({ workspace_id: 'ws', csv: 'platform,handle\nx,ada_writes' });
  });

  it('puts the workspace on the query when creating a field', async () => {
    const { calls, client } = recordingClient({ data: { id: 'f1' } });
    await client.contacts.createField('ws', {
      key: 'plan_tier',
      name: 'Plan Tier',
      type: 'select',
      options: ['Free', 'Pro'],
    });
    const req = last(calls);
    expect(req.path).toBe('/v1/contacts/fields');
    expect(req.query).toEqual({ workspace_id: 'ws' });
    expect(req.body).toEqual({
      key: 'plan_tier',
      name: 'Plan Tier',
      type: 'select',
      options: ['Free', 'Pro'],
    });
  });

  it('reads per-conversation analytics from the analytics route', async () => {
    const { calls, client } = recordingClient({
      data: { conversations: [], total: 0, page: 1, perPage: 25 },
    });
    await client.contacts.conversationAnalytics({ days: 30, sort: 'slowest' });
    const req = last(calls);
    expect(req.path).toBe('/v1/analytics/inbox/conversations');
    expect(req.query).toEqual({ days: '30', sort: 'slowest' });
  });
});
