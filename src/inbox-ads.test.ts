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

describe('inbox', () => {
  it('lists with snake_case filters and keeps the page meta', async () => {
    const { calls, client } = recordingClient({
      data: [{ id: 'i1' }],
      meta: { page: 2, perPage: 10, total: 11 },
    });
    const page = await client.inbox.list({
      workspaceId: 'ws',
      state: 'unread',
      postExternalId: '17895',
      perPage: 10,
      page: 2,
    });
    expect(page.data).toHaveLength(1);
    expect(page.meta.total).toBe(11);
    const req = last(calls);
    expect(req.path).toBe('/v1/inbox');
    expect(req.query).toEqual({
      workspace_id: 'ws',
      state: 'unread',
      post_external_id: '17895',
      per_page: '10',
      page: '2',
    });
  });

  it('replies, patches state, moderates and decides approvals on the right paths', async () => {
    const { calls, client } = recordingClient();
    await client.inbox.reply('i1', 'Thanks!');
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/inbox/i1/reply',
      body: { text: 'Thanks!' },
    });

    await client.inbox.update('i1', { state: 'snoozed', snoozedUntil: '2030-01-01T00:00:00Z' });
    expect(last(calls)).toMatchObject({ method: 'PATCH', path: '/v1/inbox/i1' });

    await client.inbox.hide('i1');
    expect(last(calls)).toMatchObject({ method: 'POST', path: '/v1/inbox/i1/hide' });
    await client.inbox.delete('i1');
    expect(last(calls)).toMatchObject({ method: 'DELETE', path: '/v1/inbox/i1' });

    await client.inbox.markThreadRead({ workspaceId: 'ws', accountId: 'a1', conversationId: 'c1' });
    expect(last(calls).body).toEqual({
      workspace_id: 'ws',
      account_id: 'a1',
      conversation_id: 'c1',
    });

    await client.inbox.refresh('ws');
    expect(last(calls)).toMatchObject({ path: '/v1/inbox/refresh', body: { workspace_id: 'ws' } });

    await client.inbox.approveReply(7, 'Edited');
    expect(last(calls)).toMatchObject({
      path: '/v1/inbox/approvals/7/approve',
      body: { text: 'Edited' },
    });
    await client.inbox.rejectReply(7);
    expect(last(calls)).toMatchObject({ method: 'POST', path: '/v1/inbox/approvals/7/reject' });

    await client.inbox.threads({ kind: 'mentions' });
    expect(last(calls)).toMatchObject({ path: '/v1/inbox/posts', query: { kind: 'mentions' } });
    await client.inbox.conversations();
    expect(last(calls).path).toBe('/v1/inbox/conversations');
    await client.inbox.unreadCount();
    expect(last(calls).path).toBe('/v1/inbox/unread-count');
    await client.inbox.accounts();
    expect(last(calls).path).toBe('/v1/inbox/accounts');
    await client.inbox.platforms();
    expect(last(calls).path).toBe('/v1/inbox/platforms');
    await client.inbox.listApprovals({ workspaceId: 'ws' });
    expect(last(calls)).toMatchObject({
      path: '/v1/inbox/approvals',
      query: { workspace_id: 'ws' },
    });
  });

  it('sends the comment and DM actions on the right paths with snake_case bodies', async () => {
    const { calls, client } = recordingClient();
    await client.inbox.reply('i1', 'Thanks!', { mediaIds: ['m1'], quickReplies: ['Yes', 'No'] });
    expect(last(calls).body).toEqual({
      text: 'Thanks!',
      media_ids: ['m1'],
      quick_replies: ['Yes', 'No'],
    });
    await client.inbox.reply('i1', undefined, { mediaIds: ['m1'] });
    expect(last(calls).body).toEqual({ media_ids: ['m1'] });

    await client.inbox.editComment('i1', 'Fixed typo');
    expect(last(calls)).toMatchObject({
      method: 'PATCH',
      path: '/v1/inbox/i1',
      body: { text: 'Fixed typo' },
    });

    for (const action of ['like', 'unlike', 'pin', 'unpin'] as const) {
      await client.inbox[action]('i1');
      expect(last(calls)).toMatchObject({ method: 'POST', path: `/v1/inbox/i1/${action}` });
    }

    await client.inbox.react('i1', null);
    expect(last(calls)).toMatchObject({ path: '/v1/inbox/i1/react', body: { reaction: null } });

    await client.inbox.startConversation({ accountId: 'a1', handle: 'someone', text: 'Hi' });
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/inbox/conversations',
      body: { account_id: 'a1', handle: 'someone', text: 'Hi' },
    });
    await client.inbox.startConversation({ commentId: 'i2', text: 'Hi', mediaIds: ['m1'] });
    expect(last(calls).body).toEqual({ comment_id: 'i2', text: 'Hi', media_ids: ['m1'] });

    await client.inbox.setTyping('c1', 'a1', false);
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/inbox/conversations/c1/typing',
      body: { account_id: 'a1', on: false },
    });
    await client.inbox.setTyping('c1', 'a1');
    expect(last(calls).body).toEqual({ account_id: 'a1' });
  });
});

describe('ads', () => {
  it('boosts and creates with the body passed through, and unwraps the ad', async () => {
    const { calls, client } = recordingClient({ data: { id: 'ad1', kind: 'boost' } });
    const input = {
      workspaceId: 'ws',
      connectionId: 'c1',
      adAccountId: 'act_1',
      name: 'Boost',
      goal: 'engagement' as const,
      budget: { minor: 2000, type: 'daily' as const },
      targeting: { countries: ['US'], ageMin: 21, ageMax: 45, gender: 'all' as const },
      postId: 'p1',
      accountId: 'a1',
    };
    const ad = await client.ads.boost(input);
    expect(ad.id).toBe('ad1');
    expect(last(calls)).toMatchObject({ method: 'POST', path: '/v1/ads/boost', body: input });

    await client.ads.create({ ...input, pageId: '123', text: 'Hello' });
    expect(last(calls)).toMatchObject({ method: 'POST', path: '/v1/ads', body: { pageId: '123' } });
  });

  it('addresses one ad by id and workspace on status, refresh and delete', async () => {
    const { calls, client } = recordingClient();
    await client.ads.setStatus('ad1', 'ws', 'paused');
    expect(last(calls)).toMatchObject({
      method: 'PATCH',
      path: '/v1/ads/ad1',
      query: { workspace_id: 'ws' },
      body: { status: 'paused' },
    });
    await client.ads.refresh('ad1', 'ws');
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/ads/ad1/refresh',
      query: { workspace_id: 'ws' },
    });
    await client.ads.delete('ad1', 'ws');
    expect(last(calls)).toMatchObject({
      method: 'DELETE',
      path: '/v1/ads/ad1',
      query: { workspace_id: 'ws' },
    });
    await client.ads.deleteConnection('c1', 'ws');
    expect(last(calls)).toMatchObject({ method: 'DELETE', path: '/v1/ads/connections/c1' });
  });

  it('reads with snake_case query params', async () => {
    const { calls, client } = recordingClient({ data: [] });
    await client.ads.list({ workspaceId: 'ws' });
    expect(last(calls)).toMatchObject({ path: '/v1/ads', query: { workspace_id: 'ws' } });
    await client.ads.external();
    expect(last(calls).path).toBe('/v1/ads/external');
    await client.ads.boostable();
    expect(last(calls).path).toBe('/v1/ads/boostable');
    await client.ads.connections();
    expect(last(calls).path).toBe('/v1/ads/connections');
    await client.ads.sources();
    expect(last(calls).path).toBe('/v1/ads/sources');
    await client.ads.leadForms();
    expect(last(calls).path).toBe('/v1/ads/lead-forms');
    await client.ads.audiences({ connectionId: 'c1', adAccountId: 'act_1' });
    expect(last(calls)).toMatchObject({
      path: '/v1/ads/audiences',
      query: { connection_id: 'c1', ad_account_id: 'act_1' },
    });
    await client.ads.searchTargeting({ connectionId: 'c1', type: 'city', q: 'Berlin' });
    expect(last(calls)).toMatchObject({
      path: '/v1/ads/targeting/search',
      query: { connection_id: 'c1', type: 'city', q: 'Berlin' },
    });
    await client.ads.leads('f1', { connectionId: 'c1', pageId: '123', after: 'cur' });
    expect(last(calls)).toMatchObject({
      path: '/v1/ads/lead-forms/f1/leads',
      query: { connection_id: 'c1', page_id: '123', after: 'cur' },
    });
    await client.ads.authorizeMeta({ workspaceId: 'ws' });
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/ads/connections/meta/authorize',
    });
    await client.ads.createAudience({
      workspaceId: 'ws',
      connectionId: 'c1',
      adAccountId: 'act_1',
      name: 'List',
      spec: { subtype: 'CUSTOM', emails: ['a@yourbrand.com'] },
    });
    expect(last(calls).path).toBe('/v1/ads/audiences');
    await client.ads.createLeadForm({
      workspaceId: 'ws',
      connectionId: 'c1',
      pageId: '123',
      name: 'Form',
      questions: ['EMAIL'],
      privacyPolicyUrl: 'https://yourbrand.com/privacy',
      thankYouMessage: 'Thanks',
    });
    expect(last(calls).path).toBe('/v1/ads/lead-forms');
  });
});
