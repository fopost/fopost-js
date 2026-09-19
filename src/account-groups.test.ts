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

describe('accountGroups', () => {
  it('maps every method onto its route and snake_case body', async () => {
    const { calls, client } = recordingClient();
    await client.accountGroups.list({ workspaceId: 'ws' });
    await client.accountGroups.create({
      workspaceId: 'ws',
      name: 'EU',
      accountIds: [{ id: 'a1' }],
    });
    await client.accountGroups.get('g1');
    await client.accountGroups.update('g1', { name: 'US' });
    await client.accountGroups.setMembers('g1', ['a1', { id: 'a2' }]);
    await client.accountGroups.delete('g1');

    expect(calls).toEqual([
      { method: 'GET', path: '/v1/account-groups', query: '?workspace_id=ws', body: undefined },
      {
        method: 'POST',
        path: '/v1/account-groups',
        query: '',
        body: { workspace_id: 'ws', name: 'EU', account_ids: ['a1'] },
      },
      { method: 'GET', path: '/v1/account-groups/g1', query: '', body: undefined },
      { method: 'PATCH', path: '/v1/account-groups/g1', query: '', body: { name: 'US' } },
      {
        method: 'PUT',
        path: '/v1/account-groups/g1/members',
        query: '',
        body: { account_ids: ['a1', 'a2'] },
      },
      { method: 'DELETE', path: '/v1/account-groups/g1', query: '', body: undefined },
    ]);
  });
});

describe('accounts', () => {
  it('filters by group, renames, and moves', async () => {
    const { calls, client } = recordingClient();
    await client.accounts.list({ workspaceId: 'ws', groupId: 'g1' });
    await client.accounts.update('a1', { displayName: null });
    await client.accounts.move('a1', { workspaceId: 'ws2' });

    expect(calls[0].query).toBe('?workspace_id=ws&group_id=g1');
    expect(calls[1]).toMatchObject({
      method: 'PATCH',
      path: '/v1/accounts/a1',
      body: { display_name: null },
    });
    expect(calls[2]).toMatchObject({
      method: 'POST',
      path: '/v1/accounts/a1/move',
      body: { workspace_id: 'ws2' },
    });
  });
});

describe('posts.create', () => {
  it('sends account_group_id and omits accounts when not given', async () => {
    const { calls, client } = recordingClient();
    await client.posts.create({
      workspaceId: 'ws',
      content: [{ text: 'hi' }],
      accountGroupId: 'g1',
    });

    const body = calls[0].body as Record<string, unknown>;
    expect(body.account_group_id).toBe('g1');
    expect('accounts' in body).toBe(false);
  });
});
