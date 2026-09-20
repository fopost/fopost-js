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

describe('meta messaging settings', () => {
  it('maps every messaging-profile method onto its route and body', async () => {
    const { calls, client } = recordingClient();
    const iceBreakers = [{ question: 'What are your hours?', payload: 'HOURS' }];
    const menu = [
      {
        locale: 'default',
        call_to_actions: [{ type: 'postback' as const, title: 'Talk to Us', payload: 'HUMAN' }],
      },
    ];
    const greeting = [{ locale: 'default', text: 'Hi! Ask us anything.' }];

    await client.accounts.getIceBreakers('a1');
    await client.accounts.setIceBreakers('a1', iceBreakers);
    await client.accounts.deleteIceBreakers('a1');
    await client.accounts.getPersistentMenu('a1');
    await client.accounts.setPersistentMenu('a1', menu);
    await client.accounts.deletePersistentMenu('a1');
    await client.accounts.getGreeting('a1');
    await client.accounts.setGreeting('a1', greeting);
    await client.accounts.deleteGreeting('a1');

    expect(calls).toEqual([
      { method: 'GET', path: '/v1/accounts/a1/messaging/ice-breakers', query: '', body: undefined },
      {
        method: 'PUT',
        path: '/v1/accounts/a1/messaging/ice-breakers',
        query: '',
        body: { ice_breakers: iceBreakers },
      },
      {
        method: 'DELETE',
        path: '/v1/accounts/a1/messaging/ice-breakers',
        query: '',
        body: undefined,
      },
      {
        method: 'GET',
        path: '/v1/accounts/a1/messaging/persistent-menu',
        query: '',
        body: undefined,
      },
      {
        method: 'PUT',
        path: '/v1/accounts/a1/messaging/persistent-menu',
        query: '',
        body: { persistent_menu: menu },
      },
      {
        method: 'DELETE',
        path: '/v1/accounts/a1/messaging/persistent-menu',
        query: '',
        body: undefined,
      },
      { method: 'GET', path: '/v1/accounts/a1/messaging/greeting', query: '', body: undefined },
      {
        method: 'PUT',
        path: '/v1/accounts/a1/messaging/greeting',
        query: '',
        body: { greeting },
      },
      { method: 'DELETE', path: '/v1/accounts/a1/messaging/greeting', query: '', body: undefined },
    ]);
  });

  it('reads and re-subscribes the webhook', async () => {
    const { calls, client } = recordingClient({
      data: { subscribed: false, fields: ['feed'], missing_fields: ['messages'] },
    });
    const before = await client.accounts.getWebhookSubscription('a1');
    expect(before.missing_fields).toEqual(['messages']);
    await client.accounts.resubscribeWebhook('a1');

    expect(calls).toEqual([
      { method: 'GET', path: '/v1/accounts/a1/webhook-subscription', query: '', body: undefined },
      { method: 'POST', path: '/v1/accounts/a1/webhook-subscription', query: '', body: undefined },
    ]);
  });

  it('passes a thread to an app, and takes it back without one', async () => {
    const { calls, client } = recordingClient();
    await client.inbox.handover('t_1', 'acct_1', { appId: '263902037430900' });
    await client.inbox.handover('t_1', 'acct_1');

    expect(calls).toEqual([
      {
        method: 'POST',
        path: '/v1/inbox/conversations/t_1/handover',
        query: '',
        body: { account_id: 'acct_1', app_id: '263902037430900' },
      },
      {
        method: 'POST',
        path: '/v1/inbox/conversations/t_1/handover',
        query: '',
        body: { account_id: 'acct_1' },
      },
    ]);
  });
});
