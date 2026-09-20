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

const SCOPE = { workspaceId: 'ws', connectionId: 'conn', customerId: '1234567890' };

describe('ads.google', () => {
  it('names the connection and the customer on every read', async () => {
    const { calls, client } = recordingClient({ data: [] });
    await client.ads.google.keywords(SCOPE, { adGroupId: '1234567890~adGroup~77' });
    const req = last(calls);
    expect(req.path).toBe('/v1/ads/google/keywords');
    expect(req.query).toEqual({
      workspace_id: 'ws',
      connection_id: 'conn',
      customer_id: '1234567890',
      ad_group_id: '1234567890~adGroup~77',
    });
  });

  it('sends a keyword as the API takes it', async () => {
    const { calls, client } = recordingClient({ data: { id: '1234567890~keyword~77~99' } });
    const created = await client.ads.google.createKeyword({
      ...SCOPE,
      adGroupId: '1234567890~adGroup~77',
      text: 'running shoes',
      matchType: 'EXACT',
      cpcBidMinor: 180,
    });
    expect(created.id).toBe('1234567890~keyword~77~99');
    const req = last(calls);
    expect(req.method).toBe('POST');
    expect(req.path).toBe('/v1/ads/google/keywords');
    expect(req.body).toMatchObject({ text: 'running shoes', matchType: 'EXACT', cpcBidMinor: 180 });
  });

  it('carries the scope in the body of a delete, which has no query', async () => {
    const { calls, client } = recordingClient();
    await client.ads.google.deleteAsset('1234567890~asset~4321', SCOPE);
    const req = last(calls);
    expect(req.method).toBe('DELETE');
    expect(req.path).toBe('/v1/ads/google/assets/1234567890~asset~4321');
    expect(req.body).toEqual(SCOPE);
  });

  it('replaces an ad schedule with PUT', async () => {
    const { calls, client } = recordingClient({ data: { slots: 2 } });
    const res = await client.ads.google.setAdSchedule({
      ...SCOPE,
      campaignId: '1234567890~campaign~55',
      slots: [{ dayOfWeek: 'MONDAY', startHour: 9, endHour: 18 }],
    });
    expect(res.slots).toBe(2);
    expect(last(calls).method).toBe('PUT');
  });

  it('runs a GAQL query through the shared insights path', async () => {
    const { calls, client } = recordingClient({ data: { rows: [{ campaign: { id: '55' } }] } });
    const res = await client.ads.google.query({
      connectionId: 'conn',
      customerId: '1234567890',
      query: 'SELECT campaign.id FROM campaign',
    });
    expect(res.rows).toHaveLength(1);
    const req = last(calls);
    expect(req.path).toBe('/v1/ads/insights/query');
    expect(req.body).toMatchObject({ customerId: '1234567890' });
  });

  it('starts a Google connection on its own authorize route', async () => {
    const { calls, client } = recordingClient({ data: { url: 'https://accounts.google.com/o/…' } });
    await client.ads.authorizeGoogle({ workspaceId: 'ws' });
    expect(last(calls).path).toBe('/v1/ads/connections/google/authorize');
  });
});
