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
  const csv = { data: new Uint8Array([1]), filename: 'posts.csv', mimeType: 'text/csv' };
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
  await fopost.posts.unpublish('p1');
  await fopost.posts.publishRuns('p1');
  await fopost.posts.analytics('p1');
  await fopost.posts.bulkImportValidate({ workspaceId: 'ws', file: csv });
  await fopost.posts.bulkImportCommit({ workspaceId: 'ws', file: csv });
  await fopost.accounts.togglePrimary('a1');
  await fopost.accounts.validateCredentials('a1');
  await fopost.accounts.refreshToken('a1');
  await fopost.accounts.analyticsHistory('a1', { limit: 5 });
  await fopost.accounts.listCommunities('a1');
  await fopost.accounts.syncCommunities('a1');
  await fopost.accounts.searchCommunities('a1', 'design');
  await fopost.accounts.addCommunity('a1', { communityId: 'c1' });
  await fopost.accounts.removeCommunity('a1', 1);
  await fopost.workspaces.create({ name: 'ws' });
  await fopost.workspaces.update('ws', { name: 'ws2' });
  await fopost.workspaces.delete('ws');
  await fopost.workspaces.analytics('ws');
  await fopost.labels.get('l1');
  await fopost.labels.create({ workspaceId: 'ws', name: 'l', color: '#000000' });
  await fopost.labels.update('l1', { name: 'l', color: '#000000' });
  await fopost.labels.delete('l1');
  await fopost.analytics.overview({ workspaceId: 'ws' });
  await fopost.analytics.timeSeries({ workspaceId: 'ws' });
  await fopost.analytics.topPosts({ workspaceId: 'ws' });
  await fopost.analytics.labels({ workspaceId: 'ws' });
  await fopost.analytics.postsTable({ workspaceId: 'ws' });
  await fopost.analytics.postingStreak({ workspaceId: 'ws' });
  await fopost.analytics.demographics({ workspaceId: 'ws' });
  await fopost.analytics.inbox({ workspaceId: 'ws' });
  await fopost.analytics.collect({ workspaceId: 'ws' });
  await fopost.media.upload({ workspaceId: 'ws', files: [csv] });
  await fopost.media.list({ workspaceId: 'ws' });
  await fopost.queue.listSlots({ workspaceId: 'ws' });
  await fopost.queue.createSlot({ workspaceId: 'ws', weekday: 1, time: '09:00', timezone: 'UTC' });
  await fopost.queue.updateSlot('s1', { time: '10:00' });
  await fopost.queue.deleteSlot('s1');
  await fopost.queue.next({ workspaceId: 'ws' });
  await fopost.queue.preview({ workspaceId: 'ws' });
  await fopost.connectSessions.create({ externalUserId: 'u1', platforms: ['twitter'] });
  await fopost.connectSessions.get('cs1');
  await fopost.logs.list();
  await fopost.webhooks.list();
  await fopost.webhooks.create({ workspaceId: 'ws', url: 'https://example.com', events: [] });
  await fopost.webhooks.update('wh1', { active: false });
  await fopost.webhooks.delete('wh1');
  await fopost.webhooks.test('wh1');
  await fopost.webhooks.deliveries('wh1');
  await fopost.webhooks.getDelivery('wh1', 'd1');
  await fopost.webhooks.redeliver('wh1', 'd1');
  await fopost.automations.list();
  await fopost.automations.get('au1');
  await fopost.automations.create({ workspaceId: 'ws', name: 'a', triggerType: 'schedule' });
  await fopost.automations.update('au1', { name: 'b' });
  await fopost.automations.delete('au1');
  await fopost.automations.toggle('au1');
  await fopost.automations.stats();
  await fopost.automations.trigger('au1');
  await fopost.automations.listVersions('au1');
  await fopost.automations.getVersion('au1', 1);
  await fopost.automations.restoreVersion('au1', 1);
  await fopost.automations.listRuns('au1');
  await fopost.automations.getRun('au1', 1);
  await fopost.accounts.list({ workspaceId: 'ws' });
  await fopost.accounts.get('a1');
  await fopost.accounts.health('a1');
  await fopost.accounts.platformMetrics('a1');
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
  await fopost.accounts.listPinterestBoards('a1');
  await fopost.accounts.createPinterestBoard('a1', { name: 'Recipes' });
  await fopost.accounts.listYouTubePlaylists('a1');
  await fopost.accounts.createYouTubePlaylist('a1', { title: 'Tutorials' });
  await fopost.accounts.setDefaultYouTubePlaylist('a1', 'PL1');
  await fopost.accounts.listYouTubeCaptions('a1', 'v1');
  await fopost.accounts.uploadYouTubeCaptions('a1', 'v1', { language: 'en', body: 'sub' });
  await fopost.accounts.readYouTubeTranscript('a1', 'cap1');
  await fopost.accounts.getBlueskyLanguages('a1');
  await fopost.accounts.setBlueskyLanguages('a1', ['en']);
  await fopost.accounts.getTikTokCreatorInfo('a1');
  await fopost.accounts.searchTikTokMusic('a1', { q: 'sunrise' });
  await fopost.accounts.searchTikTokLocations('a1', { q: 'cafe' });
  await fopost.accounts.lookupTikTokVideo(
    'a1',
    'https://www.tiktok.com/@a/video/7300000000000000000',
  );
  await fopost.accounts.searchInstagramAudio('a1', { q: 'birthday' });
  await fopost.accounts.getInstagramPublishingLimit('a1');
  await fopost.accounts.listInstagramStories('a1', { insights: true });
  await fopost.accounts.getInstagramStoryInsights('a1', 's1');
  await fopost.accounts.searchLinkedInMentions('a1', 'devtestco');
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
  await fopost.ads.authorizeGoogle({ workspaceId: 'ws' });
  await fopost.ads.google.keywords({ connectionId: 'c1', customerId: '1234567890' });
  await fopost.ads.google.createKeyword({
    workspaceId: 'ws',
    connectionId: 'c1',
    customerId: '1234567890',
    adGroupId: '1234567890~adGroup~77',
    text: 'shoes',
    matchType: 'EXACT',
  });
  await fopost.ads.google.assets({ connectionId: 'c1', customerId: '1234567890' });
  await fopost.ads.google.query({
    connectionId: 'c1',
    customerId: '1234567890',
    query: 'SELECT campaign.id FROM campaign',
  });
  await fopost.media.presign({
    workspaceId: 'ws',
    filename: 'a.png',
    mimeType: 'image/png',
    size: 1,
  });
  await fopost.media.complete('up1');
  await fopost.analytics.decay({ days: 30 });
  await fopost.analytics.frequency({ days: 90 });
  await fopost.analytics.timeline('p1');
  await fopost.analytics.changes({ since: '2026-03-02T00:00:00Z' });
  await fopost.analytics.collectPost('p1');
  await fopost.analytics.nativePosts('a1', { page: 1, perPage: 20 });
  await fopost.whatsapp.getProfile('a1');
  await fopost.whatsapp.updateProfile('a1', { about: 'We ship on Fridays' });
  await fopost.whatsapp.requestDisplayName('a1', 'Yourbrand');
  await fopost.whatsapp.setUsername('a1', 'yourbrand');
  await fopost.whatsapp.listTemplates('a1');
  await fopost.whatsapp.listTemplateLibrary('a1');
  await fopost.whatsapp.getTemplate('a1', 't1');
  await fopost.whatsapp.createTemplate('a1', {
    name: 'order_shipped',
    language: 'en_US',
    category: 'UTILITY',
    components: [{ type: 'BODY', text: 'On its way.' }],
  });
  await fopost.whatsapp.importTemplate('a1', {
    libraryTemplateName: 'order_confirmation',
    name: 'order_confirmed',
    language: 'en_US',
    category: 'UTILITY',
  });
  await fopost.whatsapp.updateTemplate('a1', 't1', { category: 'MARKETING' });
  await fopost.whatsapp.deleteTemplate('a1', 't1', { name: 'order_shipped' });
  await fopost.whatsapp.listGroups('a1');
  await fopost.whatsapp.createGroup('a1', { subject: 'Launch crew' });
  await fopost.whatsapp.getGroup('a1', 'g1');
  await fopost.whatsapp.updateGroup('a1', 'g1', { subject: 'Crew' });
  await fopost.whatsapp.deleteGroup('a1', 'g1');
  await fopost.whatsapp.getGroupInviteLink('a1', 'g1');
  await fopost.whatsapp.resetGroupInviteLink('a1', 'g1');
  await fopost.whatsapp.removeGroupParticipants('a1', 'g1', ['+15551234567']);
  await fopost.whatsapp.listBlocked('a1');
  await fopost.whatsapp.blockUsers('a1', ['+15551234567']);
  await fopost.whatsapp.unblockUsers('a1', ['+15551234567']);
  await fopost.whatsapp.getCommerceSettings('a1');
  await fopost.whatsapp.updateCommerceSettings('a1', { cartEnabled: true });
  await fopost.whatsapp.linkCatalog('a1', 'cat1');
  await fopost.whatsapp.listFlows('a1');
  await fopost.whatsapp.getFlow('a1', 'f1');
  await fopost.whatsapp.createFlow('a1', {
    name: 'Book a fitting',
    categories: ['LEAD_GENERATION'],
  });
  await fopost.whatsapp.updateFlow('a1', 'f1', { name: 'Fitting' });
  await fopost.whatsapp.deleteFlow('a1', 'f1');
  await fopost.whatsapp.uploadFlowJson('a1', 'f1', { version: '7.0', screens: [] });
  await fopost.whatsapp.publishFlow('a1', 'f1');
  await fopost.whatsapp.deprecateFlow('a1', 'f1');
  await fopost.whatsapp.listFlowResponses('a1');
  await fopost.whatsapp.getEncryptionKeyStatus('a1');
  await fopost.whatsapp.setEncryptionKey('a1', '-----BEGIN PUBLIC KEY-----');
  await fopost.whatsapp.getAccountEvents('a1');
  await fopost.whatsapp.listSandboxSessions({ workspaceId: 'ws' });
  await fopost.whatsapp.createSandboxSession({ workspaceId: 'ws', phoneNumber: '+15551234567' });
}

describe('request paths', () => {
  it('sends every request to /v1, never /api/v1', async () => {
    const { urls, client } = recordingClient();
    await callEveryEndpoint(client);

    expect(urls.length).toBe(205);
    for (const url of urls) {
      const path = new URL(url).pathname;
      expect(path).not.toContain('/api/v1');
      expect(path.startsWith('/v1/')).toBe(true);
    }
  });

  it('escapes a permalink addressed as a post id', async () => {
    const { urls, client } = recordingClient();
    await client.analytics.timeline('https://x.com/acme/status/1');
    expect(new URL(urls[0]).pathname).toBe(
      '/v1/analytics/posts/https%3A%2F%2Fx.com%2Facme%2Fstatus%2F1/timeline',
    );
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
