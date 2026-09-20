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
  await fopost.accounts.update('a1', { displayName: 'x' });
  await fopost.accounts.move('a1', { workspaceId: 'ws2' });
  await fopost.accounts.createTelegramConnectCode({ workspaceId: 'ws' });
  await fopost.accounts.getTelegramConnectStatus('c1');
  await fopost.accounts.getTelegramBotCommands('a1');
  await fopost.accounts.setTelegramBotCommands('a1', [{ command: 'start', description: 'Start' }]);
  await fopost.accounts.deleteTelegramBotCommands('a1');
  await fopost.accounts.listSlackChannels('a1');
  await fopost.accounts.listSlackMembers('a1');
  await fopost.accounts.getSlackIdentity('a1');
  await fopost.accounts.updateSlackIdentity('a1', { username: 'x' });
  await fopost.accounts.listDiscordChannels('a1');
  await fopost.accounts.switchDiscordChannel('a1', 'c2');
  await fopost.accounts.getDiscordIdentity('a1');
  await fopost.accounts.updateDiscordIdentity('a1', { username: 'x' });
  await fopost.accounts.listDiscordPins('a1');
  await fopost.accounts.deleteDiscordMessage('a1', 'm1');
  await fopost.accounts.pinDiscordMessage('a1', 'm1');
  await fopost.accounts.unpinDiscordMessage('a1', 'm1');
  await fopost.accounts.crosspostDiscordMessage('a1', 'm1');
  await fopost.accounts.createDiscordThread('a1', 'm1', { name: 't' });
  await fopost.accounts.sendDiscordDm('a1', 'u7', 'hi');
  await fopost.accounts.listDiscordEvents('a1');
  await fopost.accounts.getDiscordEvent('a1', 'e1');
  await fopost.accounts.createDiscordEvent('a1', {
    name: 'e',
    startTime: '2026-10-01T18:00:00.000Z',
    endTime: '2026-10-01T19:00:00.000Z',
    location: 'https://example.com/live',
  });
  await fopost.accounts.updateDiscordEvent('a1', 'e1', { name: 'e' });
  await fopost.accounts.deleteDiscordEvent('a1', 'e1');
  await fopost.accounts.listDiscordMembers('a1', { query: 'ada' });
  await fopost.accounts.getDiscordMember('a1', 'u7');
  await fopost.accounts.listDiscordRoles('a1');
  await fopost.accounts.createDiscordRole('a1', { name: 'Beta' });
  await fopost.accounts.updateDiscordRole('a1', 'r1', { name: 'Beta' });
  await fopost.accounts.deleteDiscordRole('a1', 'r1');
  await fopost.accounts.addDiscordMemberRole('a1', 'r1', 'u7');
  await fopost.accounts.removeDiscordMemberRole('a1', 'r1', 'u7');
  await fopost.accountGroups.list({ workspaceId: 'ws' });
  await fopost.accountGroups.get('g1');
  await fopost.accountGroups.create({ workspaceId: 'ws', name: 'g' });
  await fopost.accountGroups.update('g1', { name: 'g' });
  await fopost.accountGroups.delete('g1');
  await fopost.accountGroups.setMembers('g1', ['a1']);
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
  await fopost.inbox.like('i1');
  await fopost.inbox.startConversation({ commentId: 'i1', text: 'hi' });
  await fopost.inbox.setTyping('c1', 'a1');
  await fopost.ads.list();
  await fopost.ads.setStatus('ad1', 'ws', 'paused');
  await fopost.ads.accountTree('act_1', { connectionId: 'c1' });
  await fopost.ads.leadsFeed();
  await fopost.media.presign({
    workspaceId: 'ws',
    filename: 'a.png',
    mimeType: 'image/png',
    size: 1,
  });
  await fopost.media.complete('up1');
}

describe('request paths', () => {
  it('sends every request to /v1, never /api/v1', async () => {
    const { urls, client } = recordingClient();
    await callEveryEndpoint(client);

    expect(urls.length).toBe(72);
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
