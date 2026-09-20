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
  const call = calls[calls.length - 1]!;
  const url = new URL(call.url);
  return { ...call, path: url.pathname, query: Object.fromEntries(url.searchParams) };
};

describe('ads: identities, Spark posts and Smart+', () => {
  it('reads Business Centers and identities on the TikTok-named paths', async () => {
    const { calls, client } = recordingClient({ data: [] });
    await client.ads.tiktokBusinessCenters({ workspaceId: 'ws', connectionId: 'c1' });
    expect(last(calls)).toMatchObject({ path: '/v1/ads/tiktok/business-centers' });

    await client.ads.tiktokIdentities({
      workspaceId: 'ws',
      connectionId: 'c1',
      adAccountId: '7011',
    });
    expect(last(calls).query).toEqual({
      workspace_id: 'ws',
      connection_id: 'c1',
      ad_account_id: '7011',
    });
  });

  it('lists Spark posts for one identity', async () => {
    const { calls, client } = recordingClient({ data: [] });
    await client.ads.sparkPosts({
      workspaceId: 'ws',
      connectionId: 'c1',
      adAccountId: '7011',
      identityId: 'idt_1',
    });
    const req = last(calls);
    expect(req.path).toBe('/v1/ads/spark-posts');
    expect(req.query.identity_id).toBe('idt_1');
  });

  it('sends sparkPostId and smartPlus through unchanged', async () => {
    const { calls, client } = recordingClient({ data: {} });
    await client.ads.createCampaign({
      workspaceId: 'ws',
      connectionId: 'c1',
      adAccountId: '7011',
      name: 'Smart',
      goal: 'traffic',
      smartPlus: true,
    });
    expect(last(calls).body).toMatchObject({ smartPlus: true });

    await client.ads.create({
      workspaceId: 'ws',
      connectionId: 'c1',
      adAccountId: '7011',
      pageId: 'idt_1',
      name: 'Spark',
      goal: 'traffic',
      text: '',
      sparkPostId: 'item_99',
      budget: { minor: 2000, type: 'daily' },
      targeting: { countries: ['US'], ageMin: 18, ageMax: 44, gender: 'all' },
    });
    expect(last(calls).body).toMatchObject({ sparkPostId: 'item_99' });
  });
});

describe('ads: conversions and comments', () => {
  it('posts conversions to the shared route', async () => {
    const { calls, client } = recordingClient({ data: { accepted: 1 } });
    const result = await client.ads.uploadConversions({
      workspaceId: 'ws',
      connectionId: 'c1',
      adAccountId: '7011',
      pixelId: 'px_1',
      events: [{ eventName: 'CompletePayment', occurredAt: '2026-09-18T10:04:00Z' }],
    });
    expect(result.accepted).toBe(1);
    expect(last(calls)).toMatchObject({ method: 'POST', path: '/v1/ads/conversions' });
  });

  it('reads, answers, hides and deletes a comment', async () => {
    const { calls, client } = recordingClient({ data: { comments: [], nextCursor: null } });
    await client.ads.comments({ workspaceId: 'ws', connectionId: 'c1', adId: 'ad_1', after: '2' });
    expect(last(calls).query).toMatchObject({ ad_id: 'ad_1', after: '2' });

    const scope = { workspaceId: 'ws', connectionId: 'c1', adId: 'ad_1' };
    await client.ads.replyToComment('cm_1', { ...scope, text: 'Friday!' });
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/ads/comments/cm_1/reply',
      body: { text: 'Friday!' },
    });

    await client.ads.setCommentHidden('cm_1', { ...scope, hidden: true });
    expect(last(calls)).toMatchObject({ path: '/v1/ads/comments/cm_1/hide', body: { hidden: true } });

    await client.ads.deleteComment('cm_1', scope);
    // The ad travels in the body, because the path already carries the comment.
    expect(last(calls)).toMatchObject({
      method: 'DELETE',
      path: '/v1/ads/comments/cm_1',
      body: { adId: 'ad_1' },
    });
  });
});
