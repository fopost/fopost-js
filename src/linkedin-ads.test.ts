import { describe, it, expect, vi, afterEach } from 'vitest';
import { FoPost } from './index.js';

afterEach(() => vi.restoreAllMocks());

const reply = (body: unknown) =>
  new Response(JSON.stringify({ data: body }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

const client = () => new FoPost({ apiKey: 'k', baseUrl: 'https://api.test' });

function spy() {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(reply({}));
}

const lastCall = (s: ReturnType<typeof spy>) =>
  s.mock.calls.at(-1) as unknown as [string, RequestInit];

describe('ads on a second network', () => {
  it('authorizes whichever network the registry named', async () => {
    const s = spy();
    await client().ads.authorize('linkedin', { workspaceId: 'w1' });
    expect(lastCall(s)[0]).toBe('https://api.test/v1/ads/connections/linkedin/authorize');
  });

  it('sends a conversion with the identity the API will hash, and nothing else', async () => {
    const s = spy();
    await client().ads.sendConversionEvents(
      'urn:li:conversion:9',
      { workspaceId: 'w1', connectionId: 'c1' },
      [{ happenedAt: 1_758_326_400_000, email: 'buyer@example.test', valueMinor: 2500 }],
    );
    const [url, init] = lastCall(s);
    expect(url).toContain(
      '/v1/ads/linkedin/conversion-rules/urn:li:conversion:9/events?workspace_id=w1&connection_id=c1',
    );
    expect(JSON.parse(String(init.body))).toEqual({
      events: [{ happenedAt: 1_758_326_400_000, email: 'buyer@example.test', valueMinor: 2500 }],
    });
  });

  it('flattens ad-library countries onto the query', async () => {
    const s = spy();
    await client().ads.adLibrary({ connectionId: 'c1', keyword: 'crm', countries: ['US', 'DE'] });
    expect(lastCall(s)[0]).toContain('countries=US%2CDE');
  });
});
