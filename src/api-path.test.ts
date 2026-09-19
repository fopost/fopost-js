import { describe, expect, it } from 'vitest';
import { FoPost, type FoPostOptions } from './index.js';
import { DEFAULT_BASE_URL } from './client.js';

/**
 * The API serves every route under /v1 on the bare host. A /api/v1 prefix
 * 404s, which is exactly how v0.2.2 shipped broken.
 */
function recordingClient(opts: Partial<FoPostOptions> = {}) {
  const urls: string[] = [];
  const fetchImpl = (async (input: string | URL | Request) => {
    urls.push(String(input));
    return new Response(JSON.stringify({ data: {} }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { urls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl, ...opts }) };
}

async function callEveryEndpoint(fopost: FoPost) {
  await fopost.posts.list({ workspaceId: 'ws' });
  await fopost.posts.get('p1');
  await fopost.posts.create({ workspaceId: 'ws', content: [{ text: 'hi' }], accounts: ['a1'] });
  await fopost.posts.update('p1', { title: 'x' });
  await fopost.posts.delete('p1');
  await fopost.posts.publish('p1');
  await fopost.posts.cancel('p1');
  await fopost.posts.retry('p1');
  await fopost.posts.preflight('p1');
  await fopost.posts.deliveries('p1');
  await fopost.accounts.list({ workspaceId: 'ws' });
  await fopost.accounts.get('a1');
  await fopost.accounts.health('a1');
  await fopost.workspaces.list();
  await fopost.workspaces.get('ws');
  await fopost.labels.list({ workspaceId: 'ws' });
  await fopost.ai.credits();
  await fopost.ai.generateCaption({ workspaceId: 'ws' });
  await fopost.ai.rewrite({ workspaceId: 'ws', content: 'hi', platforms: ['twitter'] });
  await fopost.ai.repurposeUrl({
    workspaceId: 'ws',
    url: 'https://example.com',
    platforms: ['twitter'],
  });
  await fopost.inbox.list();
  await fopost.inbox.reply('i1', 'hi');
  await fopost.ads.list();
  await fopost.ads.setStatus('ad1', 'ws', 'paused');
}

describe('request paths', () => {
  it('sends every request to /v1, never /api/v1', async () => {
    const { urls, client } = recordingClient();
    await callEveryEndpoint(client);

    expect(urls.length).toBe(24);
    for (const url of urls) {
      const path = new URL(url).pathname;
      expect(path).not.toContain('/api/v1');
      expect(path.startsWith('/v1/')).toBe(true);
    }
  });

  it('keeps the default base URL host-only', async () => {
    expect(DEFAULT_BASE_URL).toBe('https://api.fopost.com');

    const { urls, client } = recordingClient();
    await client.workspaces.list();
    expect(urls[0]).toBe('https://api.fopost.com/v1/workspaces');
  });

  it('appends /v1 to a custom base URL without doubling the prefix', async () => {
    const { urls, client } = recordingClient({ baseUrl: 'https://self.hosted.example/' });
    await client.accounts.get('a1');
    expect(urls[0]).toBe('https://self.hosted.example/v1/accounts/a1');
  });
});
