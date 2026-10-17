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

describe('broadcasts', () => {
  it('lists with snake_case filters and keeps the pagination block', async () => {
    const { calls, client } = recordingClient({
      data: [{ id: 'b1' }],
      pagination: { page: 2, per_page: 10, total: 11 },
    });
    const page = await client.broadcasts.list({
      workspaceId: 'ws',
      status: 'sent',
      page: 2,
      perPage: 10,
    });
    expect(page.data).toHaveLength(1);
    expect(page.pagination.total).toBe(11);
    const req = last(calls);
    expect(req.path).toBe('/v1/broadcasts');
    expect(req.query).toMatchObject({ workspace_id: 'ws', status: 'sent', per_page: '10' });
  });

  it('sends camelCase input as the snake_case body the API takes', async () => {
    const { calls, client } = recordingClient({ id: 'b1' });
    await client.broadcasts.create({
      workspaceId: 'ws',
      accountId: 'acct',
      name: 'September check-in',
      text: 'Hello',
      audience: { platforms: ['instagram'], labelIds: ['lbl'] },
      scheduledAt: '2026-10-01T09:00:00.000Z',
    });
    const req = last(calls);
    expect(req.method).toBe('POST');
    expect(req.body).toMatchObject({
      workspace_id: 'ws',
      account_id: 'acct',
      scheduled_at: '2026-10-01T09:00:00.000Z',
    });
  });

  it('keeps the skip reason on a recipient, so a closed window is readable', async () => {
    const { calls, client } = recordingClient({
      data: [{ contact_id: 'c1', status: 'skipped', skip_reason: 'window_closed' }],
      pagination: { page: 1, per_page: 50, total: 1 },
    });
    const page = await client.broadcasts.recipients('b1', { status: 'skipped' });
    expect(page.data[0].skip_reason).toBe('window_closed');
    const req = last(calls);
    expect(req.path).toBe('/v1/broadcasts/b1/recipients');
    expect(req.query).toMatchObject({ status: 'skipped' });
  });

  it('posts send and cancel with no body of their own', async () => {
    const { calls, client } = recordingClient({ id: 'b1', status: 'sending', recipients: 3 });
    const result = await client.broadcasts.send('b1');
    expect(result.recipients).toBe(3);
    expect(last(calls).path).toBe('/v1/broadcasts/b1/send');

    await client.broadcasts.cancel('b1');
    expect(last(calls).path).toBe('/v1/broadcasts/b1/cancel');
    expect(last(calls).method).toBe('POST');
  });
});

describe('sequences', () => {
  it('sends steps through as given, since the step shape is already snake_case', async () => {
    const { calls, client } = recordingClient({ id: 's1' });
    await client.sequences.create({
      workspaceId: 'ws',
      accountId: 'acct',
      name: 'Welcome',
      steps: [{ delay_hours: 0, text: 'Hi' }],
    });
    const req = last(calls);
    expect(req.body).toMatchObject({
      workspace_id: 'ws',
      account_id: 'acct',
      steps: [{ delay_hours: 0, text: 'Hi' }],
    });
  });

  it('enrolls by contact ids or by audience', async () => {
    const { calls, client } = recordingClient({ id: 's1', enrolled: 2 });
    await client.sequences.enroll('s1', { contactIds: ['c1', 'c2'] });
    expect(last(calls).body).toMatchObject({ contact_ids: ['c1', 'c2'] });

    await client.sequences.enroll('s1', { audience: { platforms: ['telegram'] } });
    expect(last(calls).body).toMatchObject({ audience: { platforms: ['telegram'] } });
  });

  it('unenrolls a named list', async () => {
    const { calls, client } = recordingClient({ id: 's1', stopped: 1 });
    const result = await client.sequences.unenroll('s1', ['c1']);
    expect(result.stopped).toBe(1);
    const req = last(calls);
    expect(req.path).toBe('/v1/sequences/s1/unenroll');
    expect(req.body).toMatchObject({ contact_ids: ['c1'] });
  });
});
