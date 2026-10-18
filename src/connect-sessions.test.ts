import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; path: string; body: unknown };

function recordingClient(response: unknown = { data: {} }) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({
      method: init?.method ?? 'GET',
      path: new URL(String(input)).pathname,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

const session = {
  id: 'cs_1',
  status: 'pending',
  external_user_id: 'user-42',
  platforms: ['twitter', 'linkedin'],
  redirect_url: 'https://yourbrand.com/connected',
  branding: { name: 'Your Brand', logo_url: null },
  account_id: null,
  url: 'https://app.fopost.com/connect/cs_1',
  expires_at: '2026-10-19T09:00:00.000Z',
  used_at: null,
  created_at: '2026-10-18T09:00:00.000Z',
};

describe('connectSessions', () => {
  it('creates a session with the camelCase wire body', async () => {
    const { calls, client } = recordingClient(session);
    const created = await client.connectSessions.create({
      workspaceId: 'ws',
      externalUserId: 'user-42',
      platforms: ['twitter', 'linkedin'],
      redirectUrl: 'https://yourbrand.com/connected',
      branding: { name: 'Your Brand' },
    });
    expect(created.url).toBe(session.url);
    expect(calls[0]).toEqual({
      method: 'POST',
      path: '/v1/connect-sessions',
      body: {
        workspaceId: 'ws',
        externalUserId: 'user-42',
        platforms: ['twitter', 'linkedin'],
        redirectUrl: 'https://yourbrand.com/connected',
        branding: { name: 'Your Brand' },
      },
    });
  });

  it('reads a session by id', async () => {
    const { calls, client } = recordingClient({ ...session, status: 'used', account_id: 'a1' });
    const found = await client.connectSessions.get('cs_1');
    expect(found.status).toBe('used');
    expect(found.account_id).toBe('a1');
    expect(calls[0]).toMatchObject({ method: 'GET', path: '/v1/connect-sessions/cs_1' });
  });
});
