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

describe('reddit', () => {
  it('maps every method onto its route, query and body', async () => {
    const { calls, client } = recordingClient();
    await client.accounts.listRedditSubreddits('a1');
    await client.accounts.listRedditSubredditRules('a1', 'webdev');
    await client.accounts.listRedditFlairs('a1', 'webdev');
    await client.accounts.setRedditDefaultSubreddit('a1', 'webdev');
    await client.accounts.setRedditDefaultSubreddit('a1', null);
    await client.validate.subreddit({ accountId: 'a1', name: 'webdev' });
    await client.inbox.vote('i1', 'down');

    expect(calls).toEqual([
      { method: 'GET', path: '/v1/accounts/a1/reddit/subreddits', query: '', body: undefined },
      {
        method: 'GET',
        path: '/v1/accounts/a1/reddit/subreddits/webdev/rules',
        query: '',
        body: undefined,
      },
      {
        method: 'GET',
        path: '/v1/accounts/a1/reddit/flairs',
        query: '?subreddit=webdev',
        body: undefined,
      },
      {
        method: 'PUT',
        path: '/v1/accounts/a1/reddit/default-subreddit',
        query: '',
        body: { subreddit: 'webdev' },
      },
      {
        method: 'PUT',
        path: '/v1/accounts/a1/reddit/default-subreddit',
        query: '',
        body: { subreddit: null },
      },
      {
        method: 'GET',
        path: '/v1/validate/subreddit',
        query: '?account_id=a1&name=webdev',
        body: undefined,
      },
      { method: 'POST', path: '/v1/inbox/i1/vote', query: '', body: { direction: 'down' } },
    ]);
  });

  it('unwraps the subreddit list', async () => {
    const subreddits = [
      {
        name: 'webdev',
        title: 'Web Development',
        subscribers: 2_000_000,
        over18: false,
        canPost: true,
        flairEnabled: true,
        iconUrl: null,
        isDefault: true,
      },
    ];
    const { client } = recordingClient({ data: subreddits });
    await expect(client.accounts.listRedditSubreddits('a1')).resolves.toEqual(subreddits);
  });

  it('surfaces a stale grant as a 409 FoPostError', async () => {
    const { client } = recordingClient(
      { error: 'reconnect_required', message: 'Reconnect this Reddit account' },
      409,
    );
    const err = await client.accounts.listRedditSubreddits('a1').catch((e: unknown) => e);
    expect(err).toBeInstanceOf(FoPostError);
    expect(err).toMatchObject({ status: 409, code: 'reconnect_required' });
  });
});
