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

describe('x engagement', () => {
  it('maps every method onto its route, query and body', async () => {
    const { calls, client } = recordingClient();
    await client.inbox.repost('i1');
    await client.inbox.unrepost('i1');
    await client.inbox.bookmark('i1');
    await client.inbox.unbookmark('i1');
    await client.accounts.followXUser('a1', '12345');
    await client.accounts.unfollowXUser('a1', '12345');
    await client.x.getPost('98765', 'a1');
    await client.x.search({ accountId: 'a1', q: 'fopost', maxResults: 50, nextToken: 'n2' });
    await client.x.search({ accountId: 'a1', q: 'fopost' });

    expect(calls).toEqual([
      { method: 'POST', path: '/v1/inbox/i1/repost', query: '', body: undefined },
      { method: 'POST', path: '/v1/inbox/i1/unrepost', query: '', body: undefined },
      { method: 'POST', path: '/v1/inbox/i1/bookmark', query: '', body: undefined },
      { method: 'POST', path: '/v1/inbox/i1/unbookmark', query: '', body: undefined },
      { method: 'POST', path: '/v1/accounts/a1/x/follow', query: '', body: { user_id: '12345' } },
      {
        method: 'POST',
        path: '/v1/accounts/a1/x/unfollow',
        query: '',
        body: { user_id: '12345' },
      },
      { method: 'GET', path: '/v1/x/posts/98765', query: '?account_id=a1', body: undefined },
      {
        method: 'GET',
        path: '/v1/x/search',
        query: '?account_id=a1&q=fopost&max_results=50&next_token=n2',
        body: undefined,
      },
      { method: 'GET', path: '/v1/x/search', query: '?account_id=a1&q=fopost', body: undefined },
    ]);
  });

  it('unwraps a repost into the inbox item and a follow into its result', async () => {
    const item = { id: 'i1', platform: 'twitter', reposted: true, bookmarked: false };
    const reposted = recordingClient({ data: item });
    await expect(reposted.client.inbox.repost('i1')).resolves.toEqual(item);

    const follow = { accountId: 'a1', userId: '12345', following: true };
    const followed = recordingClient({ data: follow });
    await expect(followed.client.accounts.followXUser('a1', '12345')).resolves.toEqual(follow);
  });

  it('keeps the search page whole so meta.nextToken is reachable', async () => {
    const page = { data: [{ id: '98765', text: 'hello' }], meta: { nextToken: 'n2' } };
    const { client } = recordingClient(page);
    await expect(client.x.search({ accountId: 'a1', q: 'hello' })).resolves.toEqual(page);
  });

  it('surfaces a spent X balance as a 402 FoPostError', async () => {
    const { client } = recordingClient(
      { error: 'platform_balance_spent', message: 'The X balance is spent' },
      402,
    );
    const err = await client.inbox.bookmark('i1').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(FoPostError);
    expect(err).toMatchObject({ status: 402, code: 'platform_balance_spent' });
  });

  it('surfaces an older X grant as a 409 FoPostError', async () => {
    const { client } = recordingClient(
      { error: 'reconnect_required', message: 'Reconnect this X account' },
      409,
    );
    const err = await client.accounts.followXUser('a1', '12345').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(FoPostError);
    expect(err).toMatchObject({ status: 409, code: 'reconnect_required' });
  });
});
