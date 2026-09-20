import { describe, expect, it } from 'vitest';
import { FoPost, FoPostError } from './index.js';

type Call = { method: string; path: string; search: string; body: unknown };

function recordingClient(response: unknown = { data: {} }, status = 200) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    calls.push({
      method: init?.method ?? 'GET',
      path: url.pathname,
      search: url.search,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    return new Response(JSON.stringify(response), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

describe('accounts discord', () => {
  it('maps the channel and identity methods onto their routes', async () => {
    const { calls, client } = recordingClient();
    await client.accounts.listDiscordChannels('a1');
    await client.accounts.switchDiscordChannel('a1', 'c2');
    await client.accounts.getDiscordIdentity('a1');
    await client.accounts.updateDiscordIdentity('a1', {
      username: 'Release Bot',
      avatarUrl: null,
    });
    await client.accounts.updateDiscordIdentity('a1', {});

    expect(calls).toEqual([
      { method: 'GET', path: '/v1/accounts/a1/discord/channels', search: '', body: undefined },
      {
        method: 'PATCH',
        path: '/v1/accounts/a1/discord/channels/current',
        search: '',
        body: { channel_id: 'c2' },
      },
      { method: 'GET', path: '/v1/accounts/a1/discord/identity', search: '', body: undefined },
      {
        method: 'PATCH',
        path: '/v1/accounts/a1/discord/identity',
        search: '',
        body: { username: 'Release Bot', avatar_url: null },
      },
      { method: 'PATCH', path: '/v1/accounts/a1/discord/identity', search: '', body: {} },
    ]);
  });

  it('maps every message method onto its route and body', async () => {
    const { calls, client } = recordingClient();
    await client.accounts.listDiscordPins('a1');
    await client.accounts.deleteDiscordMessage('a1', 'm1');
    await client.accounts.pinDiscordMessage('a1', 'm1');
    await client.accounts.unpinDiscordMessage('a1', 'm1');
    await client.accounts.crosspostDiscordMessage('a1', 'm1');
    await client.accounts.createDiscordThread('a1', 'm1', {
      name: 'Launch chat',
      autoArchiveDuration: 1440,
    });
    await client.accounts.sendDiscordDm('a1', 'u7', 'hi');

    expect(calls.map((c) => `${c.method} ${c.path}`)).toEqual([
      'GET /v1/accounts/a1/discord/messages/pinned',
      'DELETE /v1/accounts/a1/discord/messages/m1',
      'POST /v1/accounts/a1/discord/messages/m1/pin',
      'DELETE /v1/accounts/a1/discord/messages/m1/pin',
      'POST /v1/accounts/a1/discord/messages/m1/crosspost',
      'POST /v1/accounts/a1/discord/messages/m1/thread',
      'POST /v1/accounts/a1/discord/dm',
    ]);
    expect(calls[5].body).toEqual({ name: 'Launch chat', auto_archive_duration: 1440 });
    expect(calls[6].body).toEqual({ member_id: 'u7', content: 'hi' });
  });

  it('sends the event body in the API snake_case shape', async () => {
    const { calls, client } = recordingClient();
    await client.accounts.createDiscordEvent('a1', {
      name: 'Launch stream',
      startTime: '2026-10-01T18:00:00.000Z',
      endTime: '2026-10-01T19:00:00.000Z',
      location: 'https://example.com/live',
    });
    await client.accounts.updateDiscordEvent('a1', 'e1', { status: 'canceled' });
    await client.accounts.deleteDiscordEvent('a1', 'e1');

    expect(calls[0]).toEqual({
      method: 'POST',
      path: '/v1/accounts/a1/discord/events',
      search: '',
      body: {
        name: 'Launch stream',
        start_time: '2026-10-01T18:00:00.000Z',
        end_time: '2026-10-01T19:00:00.000Z',
        location: 'https://example.com/live',
      },
    });
    expect(calls[1]).toMatchObject({
      method: 'PATCH',
      path: '/v1/accounts/a1/discord/events/e1',
      body: { status: 'canceled' },
    });
    expect(calls[2].method).toBe('DELETE');
  });

  it('passes a member search through as q', async () => {
    const { calls, client } = recordingClient();
    await client.accounts.listDiscordMembers('a1', { query: 'ada', limit: 25 });
    await client.accounts.listDiscordMembers('a1');
    expect(calls[0].search).toBe('?q=ada&limit=25');
    expect(calls[1].search).toBe('');
  });

  it('maps every role method onto its route', async () => {
    const { calls, client } = recordingClient();
    await client.accounts.listDiscordRoles('a1');
    await client.accounts.createDiscordRole('a1', { name: 'Beta' });
    await client.accounts.updateDiscordRole('a1', 'r1', { mentionable: true });
    await client.accounts.deleteDiscordRole('a1', 'r1');
    await client.accounts.addDiscordMemberRole('a1', 'r1', 'u7');
    await client.accounts.removeDiscordMemberRole('a1', 'r1', 'u7');

    expect(calls.map((c) => `${c.method} ${c.path}`)).toEqual([
      'GET /v1/accounts/a1/discord/roles',
      'POST /v1/accounts/a1/discord/roles',
      'PATCH /v1/accounts/a1/discord/roles/r1',
      'DELETE /v1/accounts/a1/discord/roles/r1',
      'PUT /v1/accounts/a1/discord/roles/r1/members/u7',
      'DELETE /v1/accounts/a1/discord/roles/r1/members/u7',
    ]);
  });

  it('unwraps the channel list', async () => {
    const channels = [
      {
        id: 'c2',
        name: 'launches',
        type: 0,
        parent_id: null,
        nsfw: false,
        is_current: true,
      },
    ];
    const { client } = recordingClient({ data: channels });
    await expect(client.accounts.listDiscordChannels('a1')).resolves.toEqual(channels);
  });

  it('surfaces a webhook connection as a 409 FoPostError', async () => {
    const { client } = recordingClient(
      { error: 'webhook_connection', message: 'Upgrade it to the bot first' },
      409,
    );
    const err = await client.accounts.listDiscordChannels('a1').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(FoPostError);
    expect(err).toMatchObject({ status: 409, code: 'webhook_connection' });
  });
});
