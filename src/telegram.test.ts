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

describe('accounts telegram', () => {
  it('maps every method onto its route and body', async () => {
    const { calls, client } = recordingClient();
    const commands = [{ command: 'start', description: 'Start the bot' }];
    await client.accounts.createTelegramConnectCode({ workspaceId: 'ws' });
    await client.accounts.createTelegramConnectCode();
    await client.accounts.getTelegramConnectStatus('abc 123');
    await client.accounts.getTelegramBotCommands('a1');
    await client.accounts.setTelegramBotCommands('a1', commands);
    await client.accounts.deleteTelegramBotCommands('a1');

    expect(calls).toEqual([
      {
        method: 'POST',
        path: '/v1/accounts/telegram/connect-code',
        query: '',
        body: { workspaceId: 'ws' },
      },
      { method: 'POST', path: '/v1/accounts/telegram/connect-code', query: '', body: {} },
      {
        method: 'GET',
        path: '/v1/accounts/telegram/connect-code/status',
        query: '?code=abc+123',
        body: undefined,
      },
      { method: 'GET', path: '/v1/accounts/a1/telegram/commands', query: '', body: undefined },
      { method: 'PUT', path: '/v1/accounts/a1/telegram/commands', query: '', body: { commands } },
      { method: 'DELETE', path: '/v1/accounts/a1/telegram/commands', query: '', body: undefined },
    ]);
  });

  it('unwraps the connect status', async () => {
    const status = { status: 'connected', account_id: 'a1', reason: null };
    const { client } = recordingClient({ data: status });
    await expect(client.accounts.getTelegramConnectStatus('c1')).resolves.toEqual(status);
  });
});
