import { describe, expect, it } from 'vitest';
import { FoPost, FoPostError } from './index.js';

type Call = { method: string; path: string; body: unknown };

function recordingClient(response: unknown = { data: {} }, status = 200) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({
      method: init?.method ?? 'GET',
      path: new URL(String(input)).pathname,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    return new Response(JSON.stringify(response), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

describe('accounts slack', () => {
  it('maps every method onto its route and body', async () => {
    const { calls, client } = recordingClient();
    await client.accounts.listSlackChannels('a1');
    await client.accounts.listSlackMembers('a1');
    await client.accounts.getSlackIdentity('a1');
    await client.accounts.updateSlackIdentity('a1', {
      username: 'Launch Bot',
      iconUrl: null,
      iconEmoji: ':rocket:',
    });
    await client.accounts.updateSlackIdentity('a1', {});

    expect(calls).toEqual([
      { method: 'GET', path: '/v1/accounts/a1/slack/channels', body: undefined },
      { method: 'GET', path: '/v1/accounts/a1/slack/members', body: undefined },
      { method: 'GET', path: '/v1/accounts/a1/slack/identity', body: undefined },
      {
        method: 'PATCH',
        path: '/v1/accounts/a1/slack/identity',
        body: { username: 'Launch Bot', icon_url: null, icon_emoji: ':rocket:' },
      },
      { method: 'PATCH', path: '/v1/accounts/a1/slack/identity', body: {} },
    ]);
  });

  it('unwraps the channel list', async () => {
    const channels = [
      { id: 'C1', name: 'general', is_private: false, is_member: true, is_current: true },
    ];
    const { client } = recordingClient({ data: channels });
    await expect(client.accounts.listSlackChannels('a1')).resolves.toEqual(channels);
  });

  it('surfaces a webhook connection as a 409 FoPostError', async () => {
    const { client } = recordingClient(
      { error: 'webhook_connection', message: 'Reconnect with the Slack app' },
      409,
    );
    const err = await client.accounts.getSlackIdentity('a1').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(FoPostError);
    expect(err).toMatchObject({ status: 409, code: 'webhook_connection' });
  });
});
