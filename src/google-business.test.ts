import { describe, expect, it } from 'vitest';
import { FoPost, FoPostError } from './index.js';

type Call = { method: string; path: string; query: string; body: unknown };

function recordingClient(response: unknown = { data: {} }, status = 200) {
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
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

describe('googleBusiness', () => {
  it('maps every method onto its route and body', async () => {
    const { calls, client } = recordingClient();
    const gb = client.googleBusiness;

    await gb.getLocation('a1');
    await gb.updateLocation('a1', { title: 'Corner Bakery', primaryPhone: '+15550100' });
    await gb.getAttributes('a1', { available: true, regionCode: 'US' });
    await gb.updateAttributes('a1', [{ name: 'attributes/has_wifi', values: [true] }]);
    await gb.getMenus('a1');
    await gb.replaceMenus('a1', []);
    await gb.getServices('a1');
    await gb.replaceServices('a1', []);
    await gb.listMedia('a1');
    await gb.addMedia('a1', { mediaId: 'm1', category: 'INTERIOR' });
    await gb.deleteMedia('a1', 'CAoSL');
    await gb.listPlaceActions('a1');
    await gb.createPlaceAction('a1', {
      uri: 'https://example.com/book',
      placeActionType: 'APPOINTMENT',
    });
    await gb.updatePlaceAction('a1', 'links-1', { isPreferred: true });
    await gb.deletePlaceAction('a1', 'links-1');
    await gb.getVerificationOptions('a1');
    await gb.startVerification('a1', { method: 'SMS', phoneNumber: '+15550100' });
    await gb.completeVerification('a1', { verificationName: 'v1', pin: '123456' });
    await gb.getPerformance('a1', {
      startDate: '2026-09-01',
      endDate: '2026-09-07',
      dailyMetrics: ['CALL_CLICKS', 'WEBSITE_CLICKS'],
    });
    await gb.getSearchKeywords('a1', { startDate: '2026-08-01', endDate: '2026-09-01' });
    await gb.assign('a1', { workspaceId: 'w2' });

    expect(calls.map((c) => `${c.method} ${c.path}${c.query}`)).toEqual([
      'GET /v1/accounts/a1/gbp/location',
      'PATCH /v1/accounts/a1/gbp/location',
      'GET /v1/accounts/a1/gbp/attributes?available=true&region_code=US',
      'PATCH /v1/accounts/a1/gbp/attributes',
      'GET /v1/accounts/a1/gbp/menus',
      'PUT /v1/accounts/a1/gbp/menus',
      'GET /v1/accounts/a1/gbp/services',
      'PUT /v1/accounts/a1/gbp/services',
      'GET /v1/accounts/a1/gbp/media',
      'POST /v1/accounts/a1/gbp/media',
      'DELETE /v1/accounts/a1/gbp/media/CAoSL',
      'GET /v1/accounts/a1/gbp/place-actions',
      'POST /v1/accounts/a1/gbp/place-actions',
      'PATCH /v1/accounts/a1/gbp/place-actions/links-1',
      'DELETE /v1/accounts/a1/gbp/place-actions/links-1',
      'GET /v1/accounts/a1/gbp/verification',
      'POST /v1/accounts/a1/gbp/verification/start',
      'POST /v1/accounts/a1/gbp/verification/complete',
      'GET /v1/accounts/a1/gbp/performance?start_date=2026-09-01&end_date=2026-09-07' +
        '&daily_metrics=CALL_CLICKS&daily_metrics=WEBSITE_CLICKS',
      'GET /v1/accounts/a1/gbp/performance?keywords=true&start_date=2026-08-01' +
        '&end_date=2026-09-01',
      'POST /v1/accounts/a1/gbp/assign',
    ]);
  });

  it('sends only the fields the caller set', async () => {
    const { calls, client } = recordingClient();
    await client.googleBusiness.updateLocation('a1', { description: null });
    await client.googleBusiness.updatePlaceAction('a1', 'links-1', { uri: 'https://x.test/b' });
    expect(calls[0].body).toEqual({ description: null });
    expect(calls[1].body).toEqual({ uri: 'https://x.test/b' });
  });

  it('maps the photo input onto the wire body', async () => {
    const { calls, client } = recordingClient();
    await client.googleBusiness.addMedia('a1', {
      mediaId: 'm1',
      category: 'MENU',
      description: 'Lunch board',
    });
    expect(calls[0].body).toEqual({
      media_id: 'm1',
      category: 'MENU',
      description: 'Lunch board',
    });
  });

  it('surfaces a pending API grant as a 503 FoPostError', async () => {
    const { client } = recordingClient(
      { error: 'configuration_error', message: 'Not available yet' },
      503,
    );
    const err = await client.googleBusiness.getLocation('a1').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(FoPostError);
    expect(err).toMatchObject({ status: 503, code: 'configuration_error' });
  });
});
