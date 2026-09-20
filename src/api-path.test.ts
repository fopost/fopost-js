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

    expect(urls.length).toBe(87);
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
