/**
 * @fopost/sdk — Official TypeScript/Node.js SDK for the FoPost API.
 *
 * Quick start:
 *
 *   import { FoPost } from '@fopost/sdk';
 *   const fopost = new FoPost({ apiKey: process.env.FOPOST_API_KEY! });
 *
 *   const accounts = await fopost.accounts.list({ workspaceId: '9b2f6c1e-…' });
 *   const post = await fopost.posts.create({
 *     workspaceId: '9b2f6c1e-…',
 *     content: [{ text: 'Hello from the SDK' }],
 *     accounts: accounts.map((a) => a.id),
 *   });
 *   await fopost.posts.publish(post.id);
 */

import { HttpClient, FoPostError, type HttpClientOptions } from './client.js';
import type {
  Account,
  AccountGroup,
  Ad,
  AdAccountTree,
  AdCampaign,
  AdConnection,
  AdCreative,
  AdCreativesResult,
  AdInsightsParams,
  AdInsightsReport,
  AdActivityResult,
  AdGoal,
  AdLabel,
  AdLabelInput,
  AdLibraryPage,
  AdLibraryParams,
  AdStudy,
  ApplyAdLabelInput,
  CatalogBatchResult,
  CatalogProductWrite,
  CatalogProductsPage,
  CreateAdStudyInput,
  CreateCatalogInput,
  CreateHighDemandPeriodInput,
  CreateProductFeedInput,
  CreateReachFrequencyInput,
  CreateValueRuleSetInput,
  HighDemandPeriod,
  IosCampaignLimits,
  PartnershipCreator,
  PartnershipInput,
  ProductCatalog,
  ProductCatalogsResult,
  ProductFeed,
  ProductFeedUpload,
  ProductSet,
  ProductSetInput,
  ReachFrequencyActionInput,
  ReachFrequencyPrediction,
  ReachFrequencyResult,
  ValueRuleSet,
  AdObjectMutationParams,
  AdObjectParams,
  AdSet,
  AdSource,
  BulkAdStatusInput,
  BulkAdStatusResult,
  CreateAdCampaignInput,
  CreateAdCreativeInput,
  CreateAdSetInput,
  CreateNetworkAdInput,
  FoPostAdInsightsParams,
  LeadFormDetail,
  LeadPage,
  LeadPageInput,
  LeadsFeedPage,
  LeadsFeedParams,
  NetworkAd,
  ReachEstimate,
  ReachEstimateInput,
  UpdateAdCampaignInput,
  UpdateAdSetInput,
  UpdateAudienceInput,
  UpdateNetworkAdInput,
  Audience,
  AiCreditBalance,
  AudiencesResult,
  AuthorizeMetaAdsInput,
  BoostPostInput,
  BoostablePost,
  CreateAccountGroupInput,
  CreateAdInput,
  CreateAudienceInput,
  CreateLeadFormInput,
  CreatePostInput,
  DirectUploadInput,
  ExternalAd,
  GenerateCaptionInput,
  InboxAccount,
  InboxApproval,
  InboxConversation,
  InboxItem,
  KnowledgeSource,
  KnowledgeSourceStatus,
  KnowledgeMatch,
  CreateKnowledgeSourceInput,
  UpdateKnowledgeSourceInput,
  SearchKnowledgeParams,
  InboxPage,
  InboxPlatform,
  InboxRefreshResult,
  InboxReplyOptions,
  InboxReplyResult,
  InboxThread,
  Label,
  Platform,
  LeadFormSource,
  LeadsPage,
  ListInboxConversationsParams,
  ListInboxParams,
  ListAccountsParams,
  ListInboxThreadsParams,
  ListPostsParams,
  MarkInboxThreadReadInput,
  StartInboxConversationInput,
  StartInboxConversationResult,
  MovedAccount,
  Post,
  PresignUploadInput,
  PresignedUpload,
  RenamedAccount,
  RepurposeUrlInput,
  RewriteInput,
  CreateDiscordEventInput,
  CreateDiscordRoleInput,
  CreateDiscordThreadInput,
  DiscordChannel,
  DiscordIdentity,
  DiscordMember,
  DiscordMessage,
  DiscordMessageRef,
  DiscordRole,
  DiscordScheduledEvent,
  SlackChannel,
  SlackIdentity,
  MetaIceBreaker,
  MetaIceBreakers,
  MetaPersistentMenuEntry,
  MetaPersistentMenu,
  MetaGreetingText,
  MetaGreeting,
  WebhookSubscription,
  InboxHandover,
  SlackMember,
  TargetingOption,
  TelegramBotCommand,
  TelegramBotCommands,
  TelegramConnectCode,
  TelegramConnectStatus,
  TargetingSearchType,
  Broadcast,
  BroadcastPage,
  BroadcastRecipientPage,
  Contact,
  ContactConversation,
  ContactField,
  ContactImportResult,
  ContactPage,
  ConversationAnalytics,
  CreateContactFieldInput,
  CreateContactInput,
  ListContactsParams,
  ListConversationAnalyticsParams,
  CreateBroadcastInput,
  CreateSequenceInput,
  EnrollInput,
  EnrollmentPage,
  ListBroadcastsParams,
  ListPageParams,
  ListRecipientsParams,
  Sequence,
  SequencePage,
  UpdateBroadcastInput,
  UpdateContactFieldInput,
  UpdateContactInput,
  UpdateSequenceInput,
  UpdateInboxItemInput,
  UpdatePostInput,
  UpdateDiscordEventInput,
  UpdateDiscordIdentityInput,
  UpdateDiscordRoleInput,
  UpdateSlackIdentityInput,
  ValidateLengthResult,
  ValidateMediaResult,
  ValidatePostInput,
  ValidatePostResult,
  UploadedMedia,
  Workspace,
} from './types.js';

export { FoPostError };
export * from './types.js';

export type FoPostOptions = HttpClientOptions;

export class FoPost {
  private readonly http: HttpClient;

  // Resource namespaces — bound below in constructor.
  readonly posts: PostsResource;
  readonly accounts: AccountsResource;
  readonly accountGroups: AccountGroupsResource;
  readonly workspaces: WorkspacesResource;
  readonly labels: LabelsResource;
  readonly ai: AiResource;
  readonly inbox: InboxResource;
  readonly contacts: ContactsResource;
  readonly broadcasts: BroadcastsResource;
  readonly sequences: SequencesResource;
  readonly ads: AdsResource;
  readonly validate: ValidateResource;
  readonly media: MediaResource;
  readonly knowledge: KnowledgeResource;

  constructor(opts: FoPostOptions) {
    this.http = new HttpClient(opts);
    this.posts = new PostsResource(this.http);
    this.accounts = new AccountsResource(this.http);
    this.accountGroups = new AccountGroupsResource(this.http);
    this.workspaces = new WorkspacesResource(this.http);
    this.labels = new LabelsResource(this.http);
    this.ai = new AiResource(this.http);
    this.inbox = new InboxResource(this.http);
    this.contacts = new ContactsResource(this.http);
    this.broadcasts = new BroadcastsResource(this.http);
    this.sequences = new SequencesResource(this.http);
    this.ads = new AdsResource(this.http);
    this.validate = new ValidateResource(this.http);
    this.media = new MediaResource(this.http);
    this.knowledge = new KnowledgeResource(this.http);
  }
}

// ─── Resources ─────────────────────────────────────────────────────

/** The API takes bare account ids; accept the { id } form too. */
function accountIds(accounts: Array<string | { id: string }>): string[] {
  return accounts.map((a) => (typeof a === 'string' ? a : a.id));
}

class PostsResource {
  constructor(private http: HttpClient) {}

  list(params: ListPostsParams): Promise<Post[]> {
    return this.http.get<Post[]>('/v1/posts', {
      workspace_id: params.workspaceId,
      status: params.status,
      limit: params.limit,
      offset: params.offset,
    });
  }

  get(id: string): Promise<Post> {
    return this.http.get<Post>(`/v1/posts/${id}`);
  }

  create(input: CreatePostInput): Promise<Post> {
    return this.http.post<Post>('/v1/posts', {
      workspace_id: input.workspaceId,
      status: input.status ?? 'draft',
      content: input.content,
      schedule_at: input.scheduleAt,
      accounts: input.accounts === undefined ? undefined : accountIds(input.accounts),
      account_group_id: input.accountGroupId,
      labels: input.labels,
      title: input.title,
    });
  }

  update(id: string, input: UpdatePostInput): Promise<Post> {
    const body: Record<string, unknown> = {};
    if (input.status !== undefined) body.status = input.status;
    if (input.content !== undefined) body.content = input.content;
    if (input.scheduleAt !== undefined) body.schedule_at = input.scheduleAt;
    if (input.accounts !== undefined) body.accounts = accountIds(input.accounts);
    if (input.labels !== undefined) body.labels = input.labels;
    if (input.title !== undefined) body.title = input.title;
    return this.http.put<Post>(`/v1/posts/${id}`, body);
  }

  delete(id: string): Promise<void> {
    return this.http.delete(`/v1/posts/${id}`);
  }

  publish(id: string): Promise<unknown> {
    return this.http.post(`/v1/posts/${id}/publish`);
  }

  cancel(id: string): Promise<unknown> {
    return this.http.post(`/v1/posts/${id}/cancel`);
  }

  retry(id: string): Promise<unknown> {
    return this.http.post(`/v1/posts/${id}/retry`);
  }

  preflight(id: string): Promise<unknown> {
    return this.http.post(`/v1/posts/${id}/preflight`);
  }

  deliveries(id: string): Promise<unknown[]> {
    return this.http.get<unknown[]>(`/v1/posts/${id}/deliveries`);
  }
}

class AccountsResource {
  constructor(private http: HttpClient) {}

  list(params: ListAccountsParams): Promise<Account[]> {
    return this.http.get<Account[]>('/v1/accounts', {
      workspace_id: params.workspaceId,
      group_id: params.groupId,
    });
  }

  get(id: string): Promise<Account> {
    return this.http.get<Account>(`/v1/accounts/${id}`);
  }

  health(id: string): Promise<unknown> {
    return this.http.get(`/v1/accounts/${id}/health`);
  }

  /** Sets a display name; null or an empty string restores the platform name. */
  update(id: string, input: { displayName: string | null }): Promise<RenamedAccount> {
    return this.http.patch<RenamedAccount>(`/v1/accounts/${id}`, {
      display_name: input.displayName,
    });
  }

  /** Needs ownership of both workspaces; a 409 move_blocked lists blocking_tables on err.body. */
  move(id: string, input: { workspaceId: string }): Promise<MovedAccount> {
    return this.http.post<MovedAccount>(`/v1/accounts/${id}/move`, {
      workspace_id: input.workspaceId,
    });
  }

  /** Mints a one-time code; send `/connect <code>` to the bot in a chat to connect it. */
  createTelegramConnectCode(input: { workspaceId?: string } = {}): Promise<TelegramConnectCode> {
    return this.http.post<TelegramConnectCode>('/v1/accounts/telegram/connect-code', {
      workspaceId: input.workspaceId,
    });
  }

  getTelegramConnectStatus(code: string): Promise<TelegramConnectStatus> {
    return this.http.get<TelegramConnectStatus>('/v1/accounts/telegram/connect-code/status', {
      code,
    });
  }

  getTelegramBotCommands(id: string): Promise<TelegramBotCommands> {
    return this.http.get<TelegramBotCommands>(`/v1/accounts/${id}/telegram/commands`);
  }

  /** Replaces the bot's command menu for this chat. */
  setTelegramBotCommands(id: string, commands: TelegramBotCommand[]): Promise<TelegramBotCommands> {
    return this.http.put<TelegramBotCommands>(`/v1/accounts/${id}/telegram/commands`, {
      commands,
    });
  }

  deleteTelegramBotCommands(id: string): Promise<TelegramBotCommands> {
    return this.http.delete<TelegramBotCommands>(`/v1/accounts/${id}/telegram/commands`);
  }

  /** Public channels, plus private ones the app was invited to. */
  listSlackChannels(id: string): Promise<SlackChannel[]> {
    return this.http.get<SlackChannel[]>(`/v1/accounts/${id}/slack/channels`);
  }

  /** People in the Slack workspace; a member's id is the handle for `inbox.startConversation`. */
  listSlackMembers(id: string): Promise<SlackMember[]> {
    return this.http.get<SlackMember[]>(`/v1/accounts/${id}/slack/members`);
  }

  getSlackIdentity(id: string): Promise<SlackIdentity> {
    return this.http.get<SlackIdentity>(`/v1/accounts/${id}/slack/identity`);
  }

  /** Omitted fields keep their value and null clears one; setting one icon clears the other. */
  updateSlackIdentity(id: string, input: UpdateSlackIdentityInput): Promise<SlackIdentity> {
    const body: Record<string, unknown> = {};
    if (input.username !== undefined) body.username = input.username;
    if (input.iconUrl !== undefined) body.icon_url = input.iconUrl;
    if (input.iconEmoji !== undefined) body.icon_emoji = input.iconEmoji;
    return this.http.patch<SlackIdentity>(`/v1/accounts/${id}/slack/identity`, body);
  }

  // ─── Meta messaging settings (Facebook Pages, Instagram) ────────

  /** The prompts shown before the first message. Networks without them answer 400. */
  getIceBreakers(id: string): Promise<MetaIceBreakers> {
    return this.http.get<MetaIceBreakers>(`/v1/accounts/${id}/messaging/ice-breakers`);
  }

  /** Replaces the ice breakers. Up to four. */
  setIceBreakers(id: string, iceBreakers: MetaIceBreaker[]): Promise<MetaIceBreakers> {
    return this.http.put<MetaIceBreakers>(`/v1/accounts/${id}/messaging/ice-breakers`, {
      ice_breakers: iceBreakers,
    });
  }

  deleteIceBreakers(id: string): Promise<MetaIceBreakers> {
    return this.http.delete<MetaIceBreakers>(`/v1/accounts/${id}/messaging/ice-breakers`);
  }

  /** The always-visible Messenger menu. Facebook Pages only. */
  getPersistentMenu(id: string): Promise<MetaPersistentMenu> {
    return this.http.get<MetaPersistentMenu>(`/v1/accounts/${id}/messaging/persistent-menu`);
  }

  /** Replaces the menu, one entry per locale, up to three items each. */
  setPersistentMenu(id: string, menu: MetaPersistentMenuEntry[]): Promise<MetaPersistentMenu> {
    return this.http.put<MetaPersistentMenu>(`/v1/accounts/${id}/messaging/persistent-menu`, {
      persistent_menu: menu,
    });
  }

  deletePersistentMenu(id: string): Promise<MetaPersistentMenu> {
    return this.http.delete<MetaPersistentMenu>(`/v1/accounts/${id}/messaging/persistent-menu`);
  }

  /** The text shown before a Messenger conversation starts. Facebook Pages only. */
  getGreeting(id: string): Promise<MetaGreeting> {
    return this.http.get<MetaGreeting>(`/v1/accounts/${id}/messaging/greeting`);
  }

  /** Replaces the greeting, one entry per locale, each up to 160 characters. */
  setGreeting(id: string, greeting: MetaGreetingText[]): Promise<MetaGreeting> {
    return this.http.put<MetaGreeting>(`/v1/accounts/${id}/messaging/greeting`, { greeting });
  }

  deleteGreeting(id: string): Promise<MetaGreeting> {
    return this.http.delete<MetaGreeting>(`/v1/accounts/${id}/messaging/greeting`);
  }

  /** What the network is delivering to the FoPost webhook for this account. */
  getWebhookSubscription(id: string): Promise<WebhookSubscription> {
    return this.http.get<WebhookSubscription>(`/v1/accounts/${id}/webhook-subscription`);
  }

  /** Subscribes to every field this account needs, lapsed or not. */
  resubscribeWebhook(id: string): Promise<WebhookSubscription> {
    return this.http.post<WebhookSubscription>(`/v1/accounts/${id}/webhook-subscription`);
  }
  // ── Discord (bot connections; a webhook one answers 409 webhook_connection) ──

  /** Text channels the bot can post to, with `is_current` on this account's. */
  listDiscordChannels(id: string): Promise<DiscordChannel[]> {
    return this.http.get<DiscordChannel[]>(`/v1/accounts/${id}/discord/channels`);
  }

  /** Moves the account to another channel in the same server. */
  switchDiscordChannel(id: string, channelId: string): Promise<DiscordChannel> {
    return this.http.patch<DiscordChannel>(`/v1/accounts/${id}/discord/channels/current`, {
      channel_id: channelId,
    });
  }

  getDiscordIdentity(id: string): Promise<DiscordIdentity> {
    return this.http.get<DiscordIdentity>(`/v1/accounts/${id}/discord/identity`);
  }

  /** Omitted fields keep their value and null clears one. */
  updateDiscordIdentity(id: string, input: UpdateDiscordIdentityInput): Promise<DiscordIdentity> {
    const body: Record<string, unknown> = {};
    if (input.username !== undefined) body.username = input.username;
    if (input.avatarUrl !== undefined) body.avatar_url = input.avatarUrl;
    return this.http.patch<DiscordIdentity>(`/v1/accounts/${id}/discord/identity`, body);
  }

  listDiscordPins(id: string): Promise<DiscordMessage[]> {
    return this.http.get<DiscordMessage[]>(`/v1/accounts/${id}/discord/messages/pinned`);
  }

  deleteDiscordMessage(id: string, messageId: string): Promise<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(
      `/v1/accounts/${id}/discord/messages/${messageId}`,
    );
  }

  pinDiscordMessage(id: string, messageId: string): Promise<{ pinned: boolean }> {
    return this.http.post<{ pinned: boolean }>(
      `/v1/accounts/${id}/discord/messages/${messageId}/pin`,
    );
  }

  unpinDiscordMessage(id: string, messageId: string): Promise<{ pinned: boolean }> {
    return this.http.delete<{ pinned: boolean }>(
      `/v1/accounts/${id}/discord/messages/${messageId}/pin`,
    );
  }

  /** Publishes an announcement-channel message to every server following it. */
  crosspostDiscordMessage(id: string, messageId: string): Promise<DiscordMessageRef> {
    return this.http.post<DiscordMessageRef>(
      `/v1/accounts/${id}/discord/messages/${messageId}/crosspost`,
    );
  }

  createDiscordThread(
    id: string,
    messageId: string,
    input: CreateDiscordThreadInput,
  ): Promise<{ id: string; name: string; parent_id: string | null }> {
    return this.http.post(`/v1/accounts/${id}/discord/messages/${messageId}/thread`, {
      name: input.name,
      ...(input.autoArchiveDuration !== undefined
        ? { auto_archive_duration: input.autoArchiveDuration }
        : {}),
    });
  }

  /** Sends one message to a member; `memberId` is a `DiscordMember.id`. */
  sendDiscordDm(id: string, memberId: string, content: string): Promise<DiscordMessageRef> {
    return this.http.post<DiscordMessageRef>(`/v1/accounts/${id}/discord/dm`, {
      member_id: memberId,
      content,
    });
  }

  listDiscordEvents(id: string): Promise<DiscordScheduledEvent[]> {
    return this.http.get<DiscordScheduledEvent[]>(`/v1/accounts/${id}/discord/events`);
  }

  getDiscordEvent(id: string, eventId: string): Promise<DiscordScheduledEvent> {
    return this.http.get<DiscordScheduledEvent>(`/v1/accounts/${id}/discord/events/${eventId}`);
  }

  createDiscordEvent(id: string, input: CreateDiscordEventInput): Promise<DiscordScheduledEvent> {
    return this.http.post<DiscordScheduledEvent>(
      `/v1/accounts/${id}/discord/events`,
      discordEventBody(input),
    );
  }

  updateDiscordEvent(
    id: string,
    eventId: string,
    input: UpdateDiscordEventInput,
  ): Promise<DiscordScheduledEvent> {
    return this.http.patch<DiscordScheduledEvent>(
      `/v1/accounts/${id}/discord/events/${eventId}`,
      discordEventBody(input),
    );
  }

  deleteDiscordEvent(id: string, eventId: string): Promise<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`/v1/accounts/${id}/discord/events/${eventId}`);
  }

  /** `query` searches by username or nickname prefix. */
  listDiscordMembers(
    id: string,
    options: { query?: string; limit?: number } = {},
  ): Promise<DiscordMember[]> {
    return this.http.get<DiscordMember[]>(`/v1/accounts/${id}/discord/members`, {
      q: options.query,
      limit: options.limit,
    });
  }

  getDiscordMember(id: string, memberId: string): Promise<DiscordMember> {
    return this.http.get<DiscordMember>(`/v1/accounts/${id}/discord/members/${memberId}`);
  }

  listDiscordRoles(id: string): Promise<DiscordRole[]> {
    return this.http.get<DiscordRole[]>(`/v1/accounts/${id}/discord/roles`);
  }

  createDiscordRole(id: string, input: CreateDiscordRoleInput): Promise<DiscordRole> {
    return this.http.post<DiscordRole>(`/v1/accounts/${id}/discord/roles`, input);
  }

  updateDiscordRole(
    id: string,
    roleId: string,
    input: UpdateDiscordRoleInput,
  ): Promise<DiscordRole> {
    return this.http.patch<DiscordRole>(`/v1/accounts/${id}/discord/roles/${roleId}`, input);
  }

  deleteDiscordRole(id: string, roleId: string): Promise<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`/v1/accounts/${id}/discord/roles/${roleId}`);
  }

  addDiscordMemberRole(
    id: string,
    roleId: string,
    memberId: string,
  ): Promise<{ assigned: boolean }> {
    return this.http.put<{ assigned: boolean }>(
      `/v1/accounts/${id}/discord/roles/${roleId}/members/${memberId}`,
    );
  }

  removeDiscordMemberRole(
    id: string,
    roleId: string,
    memberId: string,
  ): Promise<{ assigned: boolean }> {
    return this.http.delete<{ assigned: boolean }>(
      `/v1/accounts/${id}/discord/roles/${roleId}/members/${memberId}`,
    );
  }
}

/** Camel-cased event input as the API's snake_case body. */
function discordEventBody(input: UpdateDiscordEventInput): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (input.name !== undefined) body.name = input.name;
  if (input.description !== undefined) body.description = input.description;
  if (input.startTime !== undefined) body.start_time = input.startTime;
  if (input.endTime !== undefined) body.end_time = input.endTime;
  if (input.channelId !== undefined) body.channel_id = input.channelId;
  if (input.location !== undefined) body.location = input.location;
  if (input.status !== undefined) body.status = input.status;
  return body;
}

class AccountGroupsResource {
  constructor(private http: HttpClient) {}

  list(params: { workspaceId?: string } = {}): Promise<AccountGroup[]> {
    return this.http.get<AccountGroup[]>('/v1/account-groups', {
      workspace_id: params.workspaceId,
    });
  }

  get(id: string): Promise<AccountGroup> {
    return this.http.get<AccountGroup>(`/v1/account-groups/${id}`);
  }

  create(input: CreateAccountGroupInput): Promise<AccountGroup> {
    return this.http.post<AccountGroup>('/v1/account-groups', {
      workspace_id: input.workspaceId,
      name: input.name,
      account_ids: input.accountIds === undefined ? undefined : accountIds(input.accountIds),
    });
  }

  update(id: string, input: { name: string }): Promise<AccountGroup> {
    return this.http.patch<AccountGroup>(`/v1/account-groups/${id}`, { name: input.name });
  }

  /** Deletes the group only; its accounts stay connected. */
  delete(id: string): Promise<{ message: string }> {
    return this.http.delete<{ message: string }>(`/v1/account-groups/${id}`);
  }

  /** Replaces the group's members with exactly these accounts. */
  setMembers(id: string, accounts: Array<string | { id: string }>): Promise<AccountGroup> {
    return this.http.put<AccountGroup>(`/v1/account-groups/${id}/members`, {
      account_ids: accountIds(accounts),
    });
  }
}

class WorkspacesResource {
  constructor(private http: HttpClient) {}

  list(): Promise<Workspace[]> {
    return this.http.get<Workspace[]>('/v1/workspaces');
  }

  get(id: string): Promise<Workspace> {
    return this.http.get<Workspace>(`/v1/workspaces/${id}`);
  }
}

class LabelsResource {
  constructor(private http: HttpClient) {}

  list(params: { workspaceId: string }): Promise<Label[]> {
    return this.http.get<Label[]>('/v1/labels', { workspace_id: params.workspaceId });
  }
}

class AiResource {
  constructor(private http: HttpClient) {}

  credits(): Promise<AiCreditBalance> {
    return this.http.get<AiCreditBalance>('/v1/ai/credits');
  }

  generateCaption(input: GenerateCaptionInput): Promise<{
    caption: string;
    credits?: { charged: number; remaining: number };
  }> {
    return this.http.post('/v1/ai/generate-caption', {
      current_caption: input.currentCaption,
      image_urls: input.imageUrls,
      platforms: input.platforms,
      char_limit: input.charLimit,
      workspace_id: input.workspaceId,
      instructions: input.instructions,
    });
  }

  rewrite(input: RewriteInput): Promise<{
    results: Array<{ platform: string; content: string; credits: number }>;
    credits: { charged: number; remaining: number };
  }> {
    return this.http.post('/v1/ai/rewrite', input);
  }

  repurposeUrl(input: RepurposeUrlInput): Promise<{
    url: string;
    title: string | null;
    posts: Record<string, string>;
    credits: { charged: number; remaining: number };
  }> {
    return this.http.post('/v1/ai/repurpose-url', input);
  }
}

class InboxResource {
  constructor(private http: HttpClient) {}

  /** Comments, mentions and DMs, newest first. Paginated: the result carries `meta`. */
  list(params: ListInboxParams = {}): Promise<InboxPage<InboxItem>> {
    return this.http.get<InboxPage<InboxItem>>('/v1/inbox', {
      workspace_id: params.workspaceId,
      type: params.type,
      state: params.state,
      platform: params.platform,
      account_id: params.accountId,
      post_id: params.postId,
      post_external_id: params.postExternalId,
      conversation_id: params.conversationId,
      direction: params.direction,
      q: params.q,
      sort: params.sort,
      page: params.page,
      per_page: params.perPage,
    });
  }

  /** One row per platform post with comments, or per post we were mentioned in. */
  threads(params: ListInboxThreadsParams = {}): Promise<InboxPage<InboxThread>> {
    return this.http.get<InboxPage<InboxThread>>('/v1/inbox/posts', {
      workspace_id: params.workspaceId,
      kind: params.kind,
      platform: params.platform,
      account_id: params.accountId,
      state: params.state,
      q: params.q,
      sort: params.sort,
      page: params.page,
      per_page: params.perPage,
    });
  }

  /** One row per DM thread, latest first. */
  conversations(params: ListInboxConversationsParams = {}): Promise<InboxPage<InboxConversation>> {
    return this.http.get<InboxPage<InboxConversation>>('/v1/inbox/conversations', {
      workspace_id: params.workspaceId,
      platform: params.platform,
      account_id: params.accountId,
      state: params.state,
      q: params.q,
      sort: params.sort,
      page: params.page,
      per_page: params.perPage,
    });
  }

  unreadCount(params: { workspaceId?: string } = {}): Promise<{ count: number }> {
    return this.http.get<{ count: number }>('/v1/inbox/unread-count', {
      workspace_id: params.workspaceId,
    });
  }

  accounts(params: { workspaceId?: string } = {}): Promise<InboxAccount[]> {
    return this.http.get<InboxAccount[]>('/v1/inbox/accounts', {
      workspace_id: params.workspaceId,
    });
  }

  platforms(): Promise<InboxPlatform[]> {
    return this.http.get<InboxPlatform[]>('/v1/inbox/platforms');
  }

  markThreadRead(input: MarkInboxThreadReadInput): Promise<{ updated: number }> {
    return this.http.post<{ updated: number }>('/v1/inbox/read', {
      workspace_id: input.workspaceId,
      account_id: input.accountId,
      post_external_id: input.postExternalId,
      conversation_id: input.conversationId,
    });
  }

  /** Poll every inbox-capable account in the workspace now. */
  refresh(workspaceId: string): Promise<InboxRefreshResult> {
    return this.http.post<InboxRefreshResult>('/v1/inbox/refresh', { workspace_id: workspaceId });
  }

  update(id: string, input: UpdateInboxItemInput): Promise<InboxItem> {
    return this.http.request<InboxItem>('PATCH', `/v1/inbox/${id}`, input);
  }

  /** Edits our own comment on the platform. Needs `publish`. */
  editComment(id: string, text: string): Promise<InboxItem> {
    return this.http.request<InboxItem>('PATCH', `/v1/inbox/${id}`, { text });
  }

  /**
   * Sends the reply on the platform as the connected account. `text` may be omitted when
   * `mediaIds` is given; `mediaIds` and `quickReplies` need `publish`.
   */
  reply(id: string, text?: string, options: InboxReplyOptions = {}): Promise<InboxReplyResult> {
    const body: Record<string, unknown> = {};
    if (text !== undefined) body.text = text;
    if (options.mediaIds !== undefined) body.media_ids = options.mediaIds;
    if (options.quickReplies !== undefined) body.quick_replies = options.quickReplies;
    return this.http.post<InboxReplyResult>(`/v1/inbox/${id}/reply`, body);
  }

  hide(id: string): Promise<InboxItem> {
    return this.http.post<InboxItem>(`/v1/inbox/${id}/hide`);
  }

  unhide(id: string): Promise<InboxItem> {
    return this.http.post<InboxItem>(`/v1/inbox/${id}/unhide`);
  }

  /** Deletes the comment on the platform, or our own reply (which needs `publish`). */
  delete(id: string): Promise<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`/v1/inbox/${id}`);
  }

  /** Likes, upvotes or favourites the item on the platform. Needs `publish`. */
  like(id: string): Promise<InboxItem> {
    return this.http.post<InboxItem>(`/v1/inbox/${id}/like`);
  }

  unlike(id: string): Promise<InboxItem> {
    return this.http.post<InboxItem>(`/v1/inbox/${id}/unlike`);
  }

  /** Pins our own comment. Needs `publish`. */
  pin(id: string): Promise<InboxItem> {
    return this.http.post<InboxItem>(`/v1/inbox/${id}/pin`);
  }

  unpin(id: string): Promise<InboxItem> {
    return this.http.post<InboxItem>(`/v1/inbox/${id}/unpin`);
  }

  /** Reacts to a DM with an emoji; `null` removes ours. Needs `publish`. */
  react(id: string, reaction: string | null): Promise<InboxItem> {
    return this.http.post<InboxItem>(`/v1/inbox/${id}/react`, { reaction });
  }

  /** Opens a DM by handle, or answers a comment privately. Needs `publish`. */
  startConversation(input: StartInboxConversationInput): Promise<StartInboxConversationResult> {
    const body: Record<string, unknown> = { text: input.text };
    if (input.accountId !== undefined) body.account_id = input.accountId;
    if (input.handle !== undefined) body.handle = input.handle;
    if (input.commentId !== undefined) body.comment_id = input.commentId;
    if (input.mediaIds !== undefined) body.media_ids = input.mediaIds;
    return this.http.post<StartInboxConversationResult>('/v1/inbox/conversations', body);
  }

  /** Shows (`on`, the default) or clears the typing indicator in a DM thread. Needs `publish`. */
  setTyping(conversationId: string, accountId: string, on?: boolean): Promise<{ typing: boolean }> {
    return this.http.post<{ typing: boolean }>(`/v1/inbox/conversations/${conversationId}/typing`, {
      account_id: accountId,
      ...(on === undefined ? {} : { on }),
    });
  }

  /**
   * Passes a Messenger thread to another Meta app, or takes it back when
   * `appId` is omitted. Needs `publish`.
   */
  handover(
    conversationId: string,
    accountId: string,
    options: { appId?: string; metadata?: string } = {},
  ): Promise<InboxHandover> {
    return this.http.post<InboxHandover>(`/v1/inbox/conversations/${conversationId}/handover`, {
      account_id: accountId,
      ...(options.appId === undefined ? {} : { app_id: options.appId }),
      ...(options.metadata === undefined ? {} : { metadata: options.metadata }),
    });
  }

  /** Replies an automation or the agent drafted that a person still has to send. */
  listApprovals(params: { workspaceId?: string } = {}): Promise<InboxApproval[]> {
    return this.http.get<InboxApproval[]>('/v1/inbox/approvals', {
      workspace_id: params.workspaceId,
    });
  }

  /** Sends the draft, or `text` in its place. */
  approveReply(id: number, text?: string): Promise<{ id: number; outcome: string }> {
    return this.http.post(`/v1/inbox/approvals/${id}/approve`, text === undefined ? {} : { text });
  }

  rejectReply(id: number): Promise<{ id: number; outcome: string }> {
    return this.http.post(`/v1/inbox/approvals/${id}/reject`);
  }
}

/**
 * The workspace's own answers, pages and files. Adding a source queues it for
 * indexing, so it comes back `pending` and turns `ready` once searchable.
 */
class KnowledgeResource {
  constructor(private http: HttpClient) {}

  list(params: { workspaceId?: string } = {}): Promise<KnowledgeSource[]> {
    return this.http.get<KnowledgeSource[]>('/v1/knowledge/sources', {
      workspace_id: params.workspaceId,
    });
  }

  create(input: CreateKnowledgeSourceInput): Promise<KnowledgeSource> {
    return this.http.post<KnowledgeSource>('/v1/knowledge/sources', {
      kind: input.kind,
      title: input.title,
      content: input.content,
      url: input.url,
      media_id: input.mediaId,
      brand_voice_id: input.brandVoiceId,
      workspace_id: input.workspaceId,
    });
  }

  update(id: string, input: UpdateKnowledgeSourceInput): Promise<KnowledgeSource> {
    return this.http.patch<KnowledgeSource>(`/v1/knowledge/sources/${id}`, {
      title: input.title,
      content: input.content,
      url: input.url,
      brand_voice_id: input.brandVoiceId,
    });
  }

  delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.delete<{ id: string; deleted: boolean }>(`/v1/knowledge/sources/${id}`);
  }

  /** Read the source again — a `url` source is re-fetched. Returns once queued. */
  sync(id: string): Promise<{ id: string; status: KnowledgeSourceStatus }> {
    return this.http.post<{ id: string; status: KnowledgeSourceStatus }>(
      `/v1/knowledge/sources/${id}/sync`,
      {},
    );
  }

  /** The passages closest to a question. Empty when nothing stored answers it. */
  search(params: SearchKnowledgeParams): Promise<KnowledgeMatch[]> {
    return this.http.get<KnowledgeMatch[]>('/v1/knowledge/search', {
      q: params.q,
      top_k: params.topK,
      brand_voice_id: params.brandVoiceId,
      workspace_id: params.workspaceId,
    });
  }
}

class AdsResource {
  constructor(private http: HttpClient) {}

  /** Boosts and ads created through FoPost, with insights from their last refresh. */
  list(params: { workspaceId?: string } = {}): Promise<Ad[]> {
    return this.http.get<Ad[]>('/v1/ads', { workspace_id: params.workspaceId });
  }

  /** Ads on the connected ad accounts that were made elsewhere. Read live, never stored. */
  external(params: { workspaceId?: string } = {}): Promise<ExternalAd[]> {
    return this.http.get<ExternalAd[]>('/v1/ads/external', { workspace_id: params.workspaceId });
  }

  boostable(params: { workspaceId?: string } = {}): Promise<BoostablePost[]> {
    return this.http.get<BoostablePost[]>('/v1/ads/boostable', {
      workspace_id: params.workspaceId,
    });
  }

  connections(params: { workspaceId?: string } = {}): Promise<AdConnection[]> {
    return this.http.get<AdConnection[]>('/v1/ads/connections', {
      workspace_id: params.workspaceId,
    });
  }

  /** Each connection with the ad accounts and Pages its grant reaches. */
  sources(params: { workspaceId?: string } = {}): Promise<AdSource[]> {
    return this.http.get<AdSource[]>('/v1/ads/sources', { workspace_id: params.workspaceId });
  }

  /** Returns the Meta login URL; the caller finishes it in their own browser. */
  authorizeMeta(input: AuthorizeMetaAdsInput): Promise<{ url: string }> {
    return this.http.post<{ url: string }>('/v1/ads/connections/meta/authorize', input);
  }

  /** Also deletes every ad record created through the connection. */
  deleteConnection(id: string, workspaceId: string): Promise<unknown> {
    return this.http.request('DELETE', `/v1/ads/connections/${id}`, undefined, {
      workspace_id: workspaceId,
    });
  }

  /** Needs the `publish` scope as well as `ads`. Starts paused unless `paused` is false. */
  boost(input: BoostPostInput): Promise<Ad> {
    return this.http.post<Ad>('/v1/ads/boost', input);
  }

  /** Needs the `publish` scope as well as `ads`. Starts paused unless `paused` is false. */
  create(input: CreateAdInput): Promise<Ad> {
    return this.http.post<Ad>('/v1/ads', input);
  }

  /** Reads the delivery status and lifetime insights from Meta. */
  refresh(id: string, workspaceId: string): Promise<Ad> {
    return this.http.request<Ad>('POST', `/v1/ads/${id}/refresh`, undefined, {
      workspace_id: workspaceId,
    });
  }

  /** Needs the `publish` scope as well as `ads`. */
  setStatus(id: string, workspaceId: string, status: 'active' | 'paused'): Promise<Ad> {
    return this.http.request<Ad>(
      'PATCH',
      `/v1/ads/${id}`,
      { status },
      { workspace_id: workspaceId },
    );
  }

  /** Ends delivery and deletes the ad on Meta. Needs the `publish` scope as well as `ads`. */
  delete(id: string, workspaceId: string): Promise<unknown> {
    return this.http.request('DELETE', `/v1/ads/${id}`, undefined, { workspace_id: workspaceId });
  }

  audiences(params: {
    workspaceId?: string;
    connectionId: string;
    adAccountId: string;
  }): Promise<AudiencesResult> {
    return this.http.get<AudiencesResult>('/v1/ads/audiences', {
      workspace_id: params.workspaceId,
      connection_id: params.connectionId,
      ad_account_id: params.adAccountId,
    });
  }

  createAudience(input: CreateAudienceInput): Promise<{ id: string; added: number }> {
    return this.http.post('/v1/ads/audiences', input);
  }

  /** Locations, interests, behaviours and income brackets as Meta names them. */
  searchTargeting(params: {
    workspaceId?: string;
    connectionId: string;
    type: TargetingSearchType;
    q?: string;
  }): Promise<TargetingOption[]> {
    return this.http.get<TargetingOption[]>('/v1/ads/targeting/search', {
      workspace_id: params.workspaceId,
      connection_id: params.connectionId,
      type: params.type,
      q: params.q,
    });
  }

  leadForms(params: { workspaceId?: string } = {}): Promise<LeadFormSource[]> {
    return this.http.get<LeadFormSource[]>('/v1/ads/lead-forms', {
      workspace_id: params.workspaceId,
    });
  }

  createLeadForm(input: CreateLeadFormInput): Promise<{ id: string }> {
    return this.http.post('/v1/ads/lead-forms', input);
  }

  /** One page of leads; pass `nextCursor` back as `after` for the next. */
  leads(
    formId: string,
    params: { workspaceId?: string; connectionId: string; pageId: string; after?: string },
  ): Promise<LeadsPage> {
    return this.http.get<LeadsPage>(`/v1/ads/lead-forms/${formId}/leads`, {
      workspace_id: params.workspaceId,
      connection_id: params.connectionId,
      page_id: params.pageId,
      after: params.after,
    });
  }

  /** Campaigns, ad sets and ads on one ad account, read live from Meta. */
  accountTree(adAccountId: string, params: AdObjectParams): Promise<AdAccountTree> {
    return this.http.get<AdAccountTree>(`/v1/ads/accounts/${adAccountId}/tree`, metaQuery(params));
  }

  /** Needs the `publish` scope as well as `ads`. Starts paused unless `paused` is false. */
  createCampaign(input: CreateAdCampaignInput): Promise<AdCampaign> {
    return this.http.post<AdCampaign>('/v1/ads/campaigns', input);
  }

  getCampaign(id: string, params: AdObjectParams): Promise<AdCampaign> {
    return this.http.get<AdCampaign>(`/v1/ads/campaigns/${id}`, metaQuery(params));
  }

  /** Needs the `publish` scope as well as `ads`. */
  updateCampaign(
    id: string,
    params: AdObjectMutationParams,
    input: UpdateAdCampaignInput,
  ): Promise<AdCampaign> {
    return this.http.request<AdCampaign>(
      'PATCH',
      `/v1/ads/campaigns/${id}`,
      input,
      metaQuery(params),
    );
  }

  /** Deletes it and everything beneath it on Meta. Needs the `publish` scope as well as `ads`. */
  deleteCampaign(id: string, params: AdObjectMutationParams): Promise<unknown> {
    return this.http.request('DELETE', `/v1/ads/campaigns/${id}`, undefined, metaQuery(params));
  }

  /** Copies it with everything beneath it, paused unless `paused` is false. Needs `publish`. */
  duplicateCampaign(
    id: string,
    params: AdObjectMutationParams,
    options: { paused?: boolean } = {},
  ): Promise<{ id: string }> {
    return this.http.request(
      'POST',
      `/v1/ads/campaigns/${id}/duplicate`,
      options,
      metaQuery(params),
    );
  }

  /** Needs the `publish` scope as well as `ads`. Starts paused unless `paused` is false. */
  createAdSet(input: CreateAdSetInput): Promise<AdSet> {
    return this.http.post<AdSet>('/v1/ads/ad-sets', input);
  }

  getAdSet(id: string, params: AdObjectParams): Promise<AdSet> {
    return this.http.get<AdSet>(`/v1/ads/ad-sets/${id}`, metaQuery(params));
  }

  /** Needs the `publish` scope as well as `ads`. */
  updateAdSet(id: string, params: AdObjectMutationParams, input: UpdateAdSetInput): Promise<AdSet> {
    return this.http.request<AdSet>('PATCH', `/v1/ads/ad-sets/${id}`, input, metaQuery(params));
  }

  /** Needs the `publish` scope as well as `ads`. */
  deleteAdSet(id: string, params: AdObjectMutationParams): Promise<unknown> {
    return this.http.request('DELETE', `/v1/ads/ad-sets/${id}`, undefined, metaQuery(params));
  }

  /** Copies it with its ads, paused unless `paused` is false. Needs `publish`. */
  duplicateAdSet(
    id: string,
    params: AdObjectMutationParams,
    options: { paused?: boolean } = {},
  ): Promise<{ id: string }> {
    return this.http.request('POST', `/v1/ads/ad-sets/${id}/duplicate`, options, metaQuery(params));
  }

  /** An ad inside an ad set. Needs `publish` as well as `ads`. Starts paused unless `paused` is false. */
  createNetworkAd(input: CreateNetworkAdInput): Promise<NetworkAd> {
    return this.http.post<NetworkAd>('/v1/ads/ads', input);
  }

  getNetworkAd(id: string, params: AdObjectParams): Promise<NetworkAd> {
    return this.http.get<NetworkAd>(`/v1/ads/ads/${id}`, metaQuery(params));
  }

  /** Needs the `publish` scope as well as `ads`. */
  updateNetworkAd(
    id: string,
    params: AdObjectMutationParams,
    input: UpdateNetworkAdInput,
  ): Promise<NetworkAd> {
    return this.http.request<NetworkAd>('PATCH', `/v1/ads/ads/${id}`, input, metaQuery(params));
  }

  /** Needs the `publish` scope as well as `ads`. */
  deleteNetworkAd(id: string, params: AdObjectMutationParams): Promise<unknown> {
    return this.http.request('DELETE', `/v1/ads/ads/${id}`, undefined, metaQuery(params));
  }

  /** Paused unless `paused` is false. Needs the `publish` scope as well as `ads`. */
  duplicateNetworkAd(
    id: string,
    params: AdObjectMutationParams,
    options: { paused?: boolean } = {},
  ): Promise<{ id: string }> {
    return this.http.request('POST', `/v1/ads/ads/${id}/duplicate`, options, metaQuery(params));
  }

  /** Pauses or resumes up to 50 objects; each reports its own outcome. Needs `publish`. */
  bulkSetStatus(input: BulkAdStatusInput): Promise<BulkAdStatusResult[]> {
    return this.http.post<BulkAdStatusResult[]>('/v1/ads/status', input);
  }

  creatives(params: AdObjectParams & { adAccountId: string }): Promise<AdCreativesResult> {
    return this.http.get<AdCreativesResult>('/v1/ads/creatives', {
      ...metaQuery(params),
      ad_account_id: params.adAccountId,
    });
  }

  /** Nothing runs until an ad uses it. */
  createCreative(input: CreateAdCreativeInput): Promise<AdCreative> {
    return this.http.post<AdCreative>('/v1/ads/creatives', input);
  }

  getCreative(id: string, params: AdObjectParams): Promise<AdCreative> {
    return this.http.get<AdCreative>(`/v1/ads/creatives/${id}`, metaQuery(params));
  }

  deleteCreative(id: string, params: AdObjectMutationParams): Promise<unknown> {
    return this.http.request('DELETE', `/v1/ads/creatives/${id}`, undefined, metaQuery(params));
  }

  getAudience(id: string, params: AdObjectParams): Promise<Audience> {
    return this.http.get<Audience>(`/v1/ads/audiences/${id}`, metaQuery(params));
  }

  updateAudience(
    id: string,
    params: AdObjectMutationParams,
    input: UpdateAudienceInput,
  ): Promise<Audience> {
    return this.http.request<Audience>(
      'PATCH',
      `/v1/ads/audiences/${id}`,
      input,
      metaQuery(params),
    );
  }

  deleteAudience(id: string, params: AdObjectMutationParams): Promise<unknown> {
    return this.http.request('DELETE', `/v1/ads/audiences/${id}`, undefined, metaQuery(params));
  }

  /** Emails are hashed before they leave the API. */
  addAudienceUsers(
    id: string,
    params: AdObjectMutationParams,
    emails: string[],
  ): Promise<{ added: number }> {
    return this.http.request(
      'POST',
      `/v1/ads/audiences/${id}/users`,
      { emails },
      metaQuery(params),
    );
  }

  estimateReach(input: ReachEstimateInput): Promise<ReachEstimate> {
    return this.http.post<ReachEstimate>('/v1/ads/reach-estimate', input);
  }

  /** Insights for any Meta campaign, ad set or ad on a connection. */
  insights(params: AdInsightsParams): Promise<AdInsightsReport> {
    return this.http.get<AdInsightsReport>('/v1/ads/insights', {
      ...metaQuery(params),
      object_id: params.objectId,
      ...insightsRange(params),
    });
  }

  /** Insights for an ad created through FoPost, by its uuid. */
  adInsights(id: string, params: FoPostAdInsightsParams): Promise<AdInsightsReport> {
    return this.http.get<AdInsightsReport>(`/v1/ads/${id}/insights`, {
      workspace_id: params.workspaceId,
      ...insightsRange(params),
    });
  }

  getLeadForm(
    formId: string,
    params: AdObjectParams & { pageId: string },
  ): Promise<LeadFormDetail> {
    return this.http.get<LeadFormDetail>(`/v1/ads/lead-forms/${formId}`, {
      ...metaQuery(params),
      page_id: params.pageId,
    });
  }

  archiveLeadForm(formId: string, input: LeadPageInput): Promise<LeadFormDetail> {
    return this.http.post<LeadFormDetail>(`/v1/ads/lead-forms/${formId}/archive`, input);
  }

  /** Leads stored from subscribed Pages; pass `nextCursor` back as `cursor` for the next page. */
  leadsFeed(params: LeadsFeedParams = {}): Promise<LeadsFeedPage> {
    return this.http.get<LeadsFeedPage>('/v1/ads/leads', {
      workspace_id: params.workspaceId,
      form_id: params.formId,
      page_id: params.pageId,
      cursor: params.cursor,
      limit: params.limit,
    });
  }

  leadPages(params: { workspaceId?: string } = {}): Promise<LeadPage[]> {
    return this.http.get<LeadPage[]>('/v1/ads/lead-pages', { workspace_id: params.workspaceId });
  }

  /** Turns on new-lead notifications for the Page and backfills its recent leads. */
  subscribeLeadPage(input: LeadPageInput): Promise<{ pageId: string; backfilled: number }> {
    return this.http.post('/v1/ads/lead-pages', input);
  }

  unsubscribeLeadPage(pageId: string, params: AdObjectMutationParams): Promise<unknown> {
    return this.http.request(
      'DELETE',
      `/v1/ads/lead-pages/${pageId}`,
      undefined,
      metaQuery(params),
    );
  }

  // ─── Goals ──────────────────────────────────────────────────────

  /**
   * The goals this connection's network can run right now. Ask rather than
   * assume: a goal the deployment is not set up for is absent here and is
   * refused if you send it anyway.
   */
  goals(params: AdObjectParams): Promise<AdGoal[]> {
    return this.http.get<AdGoal[]>('/v1/ads/goals', metaQuery(params));
  }

  // ─── Product catalogs ───────────────────────────────────────────

  /** Catalogs the connection's business portfolios reach. Read live, never stored. */
  catalogs(params: AdObjectParams): Promise<ProductCatalogsResult> {
    return this.http.get<ProductCatalogsResult>('/v1/ads/catalogs', metaQuery(params));
  }

  /** Needs the `publish` scope as well as `ads`. */
  createCatalog(input: CreateCatalogInput): Promise<ProductCatalog> {
    return this.http.post<ProductCatalog>('/v1/ads/catalogs', input);
  }

  getCatalog(id: string, params: AdObjectParams): Promise<ProductCatalog> {
    return this.http.get<ProductCatalog>(`/v1/ads/catalogs/${id}`, metaQuery(params));
  }

  /** Needs the `publish` scope as well as `ads`. */
  updateCatalog(
    id: string,
    params: AdObjectMutationParams,
    input: { name: string },
  ): Promise<ProductCatalog> {
    return this.http.request<ProductCatalog>(
      'PATCH',
      `/v1/ads/catalogs/${id}`,
      { ...input, ...params },
      metaQuery(params),
    );
  }

  /** Deletes every product, feed and set in it. Needs `publish` as well as `ads`. */
  deleteCatalog(id: string, params: AdObjectMutationParams): Promise<unknown> {
    return this.http.request('DELETE', `/v1/ads/catalogs/${id}`, undefined, metaQuery(params));
  }

  /** One page of products; pass `nextCursor` back as `after`. */
  catalogProducts(
    id: string,
    params: AdObjectParams & { after?: string },
  ): Promise<CatalogProductsPage> {
    return this.http.get<CatalogProductsPage>(`/v1/ads/catalogs/${id}/products`, {
      ...metaQuery(params),
      after: params.after,
    });
  }

  /** Up to 500 upserts and deletes in one batch. Needs `publish` as well as `ads`. */
  writeCatalogProducts(
    id: string,
    params: AdObjectMutationParams,
    products: CatalogProductWrite[],
  ): Promise<CatalogBatchResult> {
    return this.http.post<CatalogBatchResult>(`/v1/ads/catalogs/${id}/products`, {
      ...params,
      products,
    });
  }

  productFeeds(id: string, params: AdObjectParams): Promise<ProductFeed[]> {
    return this.http.get<ProductFeed[]>(`/v1/ads/catalogs/${id}/feeds`, metaQuery(params));
  }

  /** Needs the `publish` scope as well as `ads`. */
  createProductFeed(id: string, input: CreateProductFeedInput): Promise<ProductFeed> {
    return this.http.post<ProductFeed>(`/v1/ads/catalogs/${id}/feeds`, input);
  }

  /** Needs the `publish` scope as well as `ads`. */
  deleteProductFeed(id: string, feedId: string, params: AdObjectMutationParams): Promise<unknown> {
    return this.http.request(
      'DELETE',
      `/v1/ads/catalogs/${id}/feeds/${feedId}`,
      undefined,
      metaQuery(params),
    );
  }

  /** Each run the network made of the feed. */
  feedUploads(id: string, feedId: string, params: AdObjectParams): Promise<ProductFeedUpload[]> {
    return this.http.get<ProductFeedUpload[]>(
      `/v1/ads/catalogs/${id}/feeds/${feedId}/uploads`,
      metaQuery(params),
    );
  }

  /** Fetches the feed now. Needs the `publish` scope as well as `ads`. */
  startFeedUpload(
    id: string,
    feedId: string,
    params: AdObjectMutationParams & { url?: string },
  ): Promise<{ id: string }> {
    return this.http.post(`/v1/ads/catalogs/${id}/feeds/${feedId}/uploads`, params);
  }

  /** A catalog ad runs from a product set, not the whole catalog. */
  productSets(id: string, params: AdObjectParams): Promise<ProductSet[]> {
    return this.http.get<ProductSet[]>(`/v1/ads/catalogs/${id}/product-sets`, metaQuery(params));
  }

  /** Needs the `publish` scope as well as `ads`. */
  createProductSet(id: string, input: ProductSetInput): Promise<ProductSet> {
    return this.http.post<ProductSet>(`/v1/ads/catalogs/${id}/product-sets`, input);
  }

  /** Needs the `publish` scope as well as `ads`. */
  updateProductSet(id: string, setId: string, input: ProductSetInput): Promise<ProductSet> {
    return this.http.request<ProductSet>(
      'PATCH',
      `/v1/ads/catalogs/${id}/product-sets/${setId}`,
      input,
      metaQuery(input),
    );
  }

  /** Needs the `publish` scope as well as `ads`. */
  deleteProductSet(id: string, setId: string, params: AdObjectMutationParams): Promise<unknown> {
    return this.http.request(
      'DELETE',
      `/v1/ads/catalogs/${id}/product-sets/${setId}`,
      undefined,
      metaQuery(params),
    );
  }

  // ─── Reach and frequency ────────────────────────────────────────

  reachFrequency(params: AdObjectParams & { adAccountId: string }): Promise<ReachFrequencyResult> {
    return this.http.get<ReachFrequencyResult>('/v1/ads/reach-frequency', {
      ...metaQuery(params),
      ad_account_id: params.adAccountId,
    });
  }

  /** Prices a flight. Nothing is bought until you reserve it. */
  createReachFrequency(input: CreateReachFrequencyInput): Promise<ReachFrequencyPrediction> {
    return this.http.post<ReachFrequencyPrediction>('/v1/ads/reach-frequency', input);
  }

  getReachFrequency(
    id: string,
    params: AdObjectParams & { adAccountId: string },
  ): Promise<ReachFrequencyPrediction> {
    return this.http.get<ReachFrequencyPrediction>(`/v1/ads/reach-frequency/${id}`, {
      ...metaQuery(params),
      ad_account_id: params.adAccountId,
    });
  }

  /** Holds the inventory the prediction priced. Needs `publish` as well as `ads`. */
  reserveReachFrequency(
    id: string,
    input: ReachFrequencyActionInput,
  ): Promise<ReachFrequencyPrediction> {
    return this.http.post<ReachFrequencyPrediction>(`/v1/ads/reach-frequency/${id}/reserve`, input);
  }

  /** Needs the `publish` scope as well as `ads`. */
  cancelReachFrequency(
    id: string,
    input: ReachFrequencyActionInput,
  ): Promise<ReachFrequencyPrediction> {
    return this.http.post<ReachFrequencyPrediction>(`/v1/ads/reach-frequency/${id}/cancel`, input);
  }

  // ─── Ad Library ─────────────────────────────────────────────────

  /**
   * The public ad archive: ads anyone is running, by keyword or by Page.
   * Read live on every call and stored nowhere, so an ad that stops running
   * is simply absent from the next search.
   */
  adLibrary(params: AdLibraryParams): Promise<AdLibraryPage> {
    return this.http.get<AdLibraryPage>('/v1/ads/library', {
      ...metaQuery(params),
      countries: params.countries.join(','),
      q: params.q,
      page_ids: params.pageIds?.join(','),
      active_status: params.activeStatus,
      limit: params.limit,
      after: params.after,
    });
  }

  // ─── Partnership ads ────────────────────────────────────────────

  /** Creators who allowlisted this Page to run partnership ads on their posts. */
  partnershipCreators(params: AdObjectParams & { pageId: string }): Promise<PartnershipCreator[]> {
    return this.http.get<PartnershipCreator[]>('/v1/ads/partnership/creators', {
      ...metaQuery(params),
      page_id: params.pageId,
    });
  }

  requestPartnership(input: PartnershipInput): Promise<PartnershipCreator[]> {
    return this.http.post<PartnershipCreator[]>('/v1/ads/partnership/creators', input);
  }

  revokePartnership(
    creatorId: string,
    params: AdObjectMutationParams & { pageId: string },
  ): Promise<unknown> {
    return this.http.request('DELETE', `/v1/ads/partnership/creators/${creatorId}`, undefined, {
      ...metaQuery(params),
      page_id: params.pageId,
    });
  }

  // ─── Ad account settings ────────────────────────────────────────

  /** Who changed what on the ad account, and when. */
  accountActivity(
    params: AdObjectParams & { adAccountId: string; since?: string; until?: string },
  ): Promise<AdActivityResult> {
    return this.http.get<AdActivityResult>('/v1/ads/account/activity', {
      ...accountQuery(params),
      since: params.since,
      until: params.until,
    });
  }

  labels(params: AdObjectParams & { adAccountId: string }): Promise<AdLabel[]> {
    return this.http.get<AdLabel[]>('/v1/ads/account/labels', accountQuery(params));
  }

  createLabel(input: AdLabelInput): Promise<AdLabel> {
    return this.http.post<AdLabel>('/v1/ads/account/labels', input);
  }

  updateLabel(id: string, input: AdLabelInput): Promise<AdLabel> {
    return this.http.request<AdLabel>(
      'PATCH',
      `/v1/ads/account/labels/${id}`,
      input,
      metaQuery(input),
    );
  }

  deleteLabel(
    id: string,
    params: AdObjectMutationParams & { adAccountId: string },
  ): Promise<unknown> {
    return this.http.request(
      'DELETE',
      `/v1/ads/account/labels/${id}`,
      undefined,
      accountQuery(params),
    );
  }

  /** Keeps whatever labels the object already carries. */
  applyLabel(id: string, input: ApplyAdLabelInput): Promise<unknown> {
    return this.http.post(`/v1/ads/account/labels/${id}/apply`, input);
  }

  studies(params: AdObjectParams & { adAccountId: string }): Promise<AdStudy[]> {
    return this.http.get<AdStudy[]>('/v1/ads/account/studies', accountQuery(params));
  }

  /** Splits traffic evenly across the cells for the length of the flight. */
  createStudy(input: CreateAdStudyInput): Promise<AdStudy> {
    return this.http.post<AdStudy>('/v1/ads/account/studies', input);
  }

  getStudy(id: string, params: AdObjectParams & { adAccountId: string }): Promise<AdStudy> {
    return this.http.get<AdStudy>(`/v1/ads/account/studies/${id}`, accountQuery(params));
  }

  deleteStudy(
    id: string,
    params: AdObjectMutationParams & { adAccountId: string },
  ): Promise<unknown> {
    return this.http.request(
      'DELETE',
      `/v1/ads/account/studies/${id}`,
      undefined,
      accountQuery(params),
    );
  }

  /** How many iOS 14 campaigns the account may run at once, per app. */
  iosCampaignLimits(
    params: AdObjectParams & { adAccountId: string },
  ): Promise<IosCampaignLimits[]> {
    return this.http.get<IosCampaignLimits[]>('/v1/ads/account/ios-limits', accountQuery(params));
  }

  highDemandPeriods(params: AdObjectParams & { adAccountId: string }): Promise<HighDemandPeriod[]> {
    return this.http.get<HighDemandPeriod[]>(
      '/v1/ads/account/high-demand-periods',
      accountQuery(params),
    );
  }

  /** Tells the network to expect heavier spend over a window, so pacing allows for it. */
  createHighDemandPeriod(input: CreateHighDemandPeriodInput): Promise<HighDemandPeriod> {
    return this.http.post<HighDemandPeriod>('/v1/ads/account/high-demand-periods', input);
  }

  deleteHighDemandPeriod(
    id: string,
    params: AdObjectMutationParams & { adAccountId: string },
  ): Promise<unknown> {
    return this.http.request(
      'DELETE',
      `/v1/ads/account/high-demand-periods/${id}`,
      undefined,
      accountQuery(params),
    );
  }

  valueRuleSets(params: AdObjectParams & { adAccountId: string }): Promise<ValueRuleSet[]> {
    return this.http.get<ValueRuleSet[]>('/v1/ads/account/value-rule-sets', accountQuery(params));
  }

  /** Weights conversions so some audiences count for more than others. */
  createValueRuleSet(input: CreateValueRuleSetInput): Promise<ValueRuleSet> {
    return this.http.post<ValueRuleSet>('/v1/ads/account/value-rule-sets', input);
  }

  deleteValueRuleSet(
    id: string,
    params: AdObjectMutationParams & { adAccountId: string },
  ): Promise<unknown> {
    return this.http.request(
      'DELETE',
      `/v1/ads/account/value-rule-sets/${id}`,
      undefined,
      accountQuery(params),
    );
  }
}

function accountQuery(params: { workspaceId?: string; connectionId: string; adAccountId: string }) {
  return { ...metaQuery(params), ad_account_id: params.adAccountId };
}

function metaQuery(params: { workspaceId?: string; connectionId: string }) {
  return { workspace_id: params.workspaceId, connection_id: params.connectionId };
}

function insightsRange(params: {
  since: string;
  until: string;
  breakdown?: string;
  daily?: boolean;
}) {
  return {
    since: params.since,
    until: params.until,
    breakdown: params.breakdown,
    daily: params.daily,
  };
}

class ValidateResource {
  constructor(private http: HttpClient) {}

  /** The preflight checks, for content that has not been saved as a post. */
  post(input: ValidatePostInput): Promise<ValidatePostResult> {
    return this.http.post<ValidatePostResult>('/v1/validate/post', {
      content: input.content,
      media: input.media?.map((m) => ({ url: m.url, mime_type: m.mimeType, size: m.size })),
      platforms: input.platforms,
    });
  }

  length(input: { text: string; platforms: Platform[] }): Promise<ValidateLengthResult> {
    return this.http.post<ValidateLengthResult>('/v1/validate/length', input);
  }

  /** Fetches the file and runs the upload checks on it; nothing is stored. */
  media(input: { url: string }): Promise<ValidateMediaResult> {
    return this.http.post<ValidateMediaResult>('/v1/validate/media', input);
  }
}

class MediaResource {
  constructor(private http: HttpClient) {}

  presign(input: PresignUploadInput): Promise<PresignedUpload> {
    return this.http.post<PresignedUpload>('/v1/media/presign', input);
  }

  complete(uploadId: string): Promise<UploadedMedia> {
    return this.http.post<UploadedMedia>(`/v1/media/presign/${uploadId}/complete`);
  }

  /** Presign, PUT the bytes to storage, then complete. */
  async uploadDirect(input: DirectUploadInput): Promise<UploadedMedia> {
    const size = input.data instanceof Blob ? input.data.size : input.data.byteLength;
    const presigned = await this.presign({
      workspaceId: input.workspaceId,
      filename: input.filename,
      mimeType: input.mimeType,
      size,
    });
    const res = await this.http.fetchImpl(presigned.uploadUrl, {
      method: presigned.method,
      headers: { ...presigned.headers, 'Content-Length': String(size) },
      body: input.data,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new FoPostError(text || `Upload failed: HTTP ${res.status}`, res.status);
    }
    return this.complete(presigned.uploadId);
  }
}

/**
 * The people behind the inbox. A contact is one human however many handles
 * they write from: an inbound item files its author, a reply files whoever
 * you answered, and both fold into whatever is already on file.
 */
class ContactsResource {
  constructor(private http: HttpClient) {}

  /** Most recently active first. Paginated: the result carries `pagination`. */
  list(params: ListContactsParams = {}): Promise<ContactPage> {
    return this.http.get<ContactPage>('/v1/contacts', {
      workspace_id: params.workspaceId,
      search: params.search,
      platform: params.platform,
      source: params.source,
      page: params.page,
      per_page: params.perPage,
    });
  }

  get(id: string): Promise<Contact> {
    return this.http.get<Contact>(`/v1/contacts/${id}`);
  }

  /**
   * Folds into the contact that already holds the first channel, so this
   * cannot duplicate someone the inbox has already met.
   */
  create(input: CreateContactInput): Promise<Contact> {
    return this.http.post<Contact>('/v1/contacts', {
      workspace_id: input.workspaceId,
      channels: input.channels,
      display_name: input.displayName,
      note: input.note,
      fields: input.fields,
    });
  }

  update(id: string, input: UpdateContactInput): Promise<Contact> {
    return this.http.request<Contact>('PATCH', `/v1/contacts/${id}`, {
      display_name: input.displayName,
      channels: input.channels,
      note: input.note,
      fields: input.fields,
    });
  }

  /** The messages stay in the inbox; a later one files them again. */
  delete(id: string): Promise<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`/v1/contacts/${id}`);
  }

  /** The threads this person appears in, newest first. */
  conversations(id: string, params: { limit?: number } = {}): Promise<ContactConversation[]> {
    return this.http.get<ContactConversation[]>(`/v1/contacts/${id}/conversations`, {
      limit: params.limit,
    });
  }

  /**
   * Import from CSV text. `platform` and `handle` are required columns; any
   * other column is read as a custom field key and reported when unknown.
   */
  import(workspaceId: string, csv: string): Promise<ContactImportResult> {
    return this.http.post<ContactImportResult>('/v1/contacts/import', {
      workspace_id: workspaceId,
      csv,
    });
  }

  /** The columns this workspace keeps about its contacts, in display order. */
  listFields(workspaceId: string): Promise<ContactField[]> {
    return this.http.get<ContactField[]>('/v1/contacts/fields', {
      workspace_id: workspaceId,
    });
  }

  createField(workspaceId: string, input: CreateContactFieldInput): Promise<ContactField> {
    return this.http.post<ContactField>(
      `/v1/contacts/fields?workspace_id=${encodeURIComponent(workspaceId)}`,
      input,
    );
  }

  /** The key and the type are fixed once created; the name and options are not. */
  updateField(id: string, input: UpdateContactFieldInput): Promise<ContactField> {
    return this.http.request<ContactField>('PATCH', `/v1/contacts/fields/${id}`, input);
  }

  /** Removes the field and every answer to it. */
  deleteField(id: string): Promise<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`/v1/contacts/fields/${id}`);
  }

  /**
   * Inbox analytics per thread: what each one carried and how long it waited
   * for a reply. Needs the `analytics` scope, not `inbox`.
   */
  conversationAnalytics(
    params: ListConversationAnalyticsParams = {},
  ): Promise<ConversationAnalytics> {
    return this.http.get<ConversationAnalytics>('/v1/analytics/inbox/conversations', {
      workspace_id: params.workspaceId,
      accountId: params.accountId,
      days: params.days,
      sort: params.sort,
      page: params.page,
      per_page: params.perPage,
    });
  }
}

/**
 * Broadcasts: one message into every conversation the workspace already has
 * with a segment of its contacts.
 *
 * Nothing is sent into a closed messaging window. Messenger and Instagram
 * take a business-initiated message only within 24 hours of the contact's
 * last one, so recipients outside it are skipped with `window_closed` rather
 * than attempted — which is why the number sent is often lower than the
 * audience.
 */
class BroadcastsResource {
  constructor(private http: HttpClient) {}

  /** Newest first. Paginated: the result carries `pagination`. */
  list(params: ListBroadcastsParams = {}): Promise<BroadcastPage> {
    return this.http.get<BroadcastPage>('/v1/broadcasts', {
      workspace_id: params.workspaceId,
      status: params.status,
      page: params.page,
      per_page: params.perPage,
    });
  }

  get(id: string): Promise<Broadcast> {
    return this.http.get<Broadcast>(`/v1/broadcasts/${id}`);
  }

  /** Creates it without sending. Give `scheduledAt` to have it go out on its own. */
  create(input: CreateBroadcastInput): Promise<Broadcast> {
    return this.http.post<Broadcast>('/v1/broadcasts', {
      workspace_id: input.workspaceId,
      account_id: input.accountId,
      name: input.name,
      text: input.text,
      media_id: input.mediaId,
      audience: input.audience,
      scheduled_at: input.scheduledAt,
    });
  }

  /** Only a draft or scheduled broadcast can be edited. */
  update(id: string, input: UpdateBroadcastInput): Promise<Broadcast> {
    return this.http.patch<Broadcast>(`/v1/broadcasts/${id}`, {
      name: input.name,
      text: input.text,
      media_id: input.mediaId,
      audience: input.audience,
      scheduled_at: input.scheduledAt,
    });
  }

  /**
   * Freeze the audience into a recipient list and start sending. `recipients`
   * is how many contacts matched, not how many will be messaged — the
   * messaging window decides that. Needs the `publish` scope as well as
   * `inbox`.
   */
  send(id: string): Promise<{ id: string; status: string; recipients: number }> {
    return this.http.post<{ id: string; status: string; recipients: number }>(
      `/v1/broadcasts/${id}/send`,
      {},
    );
  }

  /**
   * Stop it where it stands. Anyone not yet written to stays unsent; messages
   * already delivered are not recalled. Needs the `publish` scope.
   */
  cancel(id: string): Promise<{ id: string; status: string }> {
    return this.http.post<{ id: string; status: string }>(`/v1/broadcasts/${id}/cancel`, {});
  }

  /** One row per contact, with what became of their message. */
  recipients(id: string, params: ListRecipientsParams = {}): Promise<BroadcastRecipientPage> {
    return this.http.get<BroadcastRecipientPage>(`/v1/broadcasts/${id}/recipients`, {
      status: params.status,
      page: params.page,
      per_page: params.perPage,
    });
  }

  /**
   * Removes the broadcast and its recipient records. Messages already sent
   * stay in the conversations they went to.
   */
  delete(id: string): Promise<{ message: string }> {
    return this.http.delete<{ message: string }>(`/v1/broadcasts/${id}`);
  }
}

/**
 * Drip sequences: a series of messages, each a delay after the one before,
 * walked per enrolled contact.
 *
 * The messaging window applies to every step. A step that comes due outside
 * it is skipped rather than sent, and the enrollment carries on — so someone
 * can complete a sequence having received only some of its messages.
 */
class SequencesResource {
  constructor(private http: HttpClient) {}

  list(params: { workspaceId?: string; page?: number; perPage?: number } = {}): Promise<SequencePage> {
    return this.http.get<SequencePage>('/v1/sequences', {
      workspace_id: params.workspaceId,
      page: params.page,
      per_page: params.perPage,
    });
  }

  get(id: string): Promise<Sequence> {
    return this.http.get<Sequence>(`/v1/sequences/${id}`);
  }

  /** Creating a sequence enrolls nobody. */
  create(input: CreateSequenceInput): Promise<Sequence> {
    return this.http.post<Sequence>('/v1/sequences', {
      workspace_id: input.workspaceId,
      account_id: input.accountId,
      name: input.name,
      steps: input.steps,
      status: input.status,
    });
  }

  /**
   * Pausing stops every enrollment from firing without ending any of them;
   * resuming picks them up where they stood.
   */
  update(id: string, input: UpdateSequenceInput): Promise<Sequence> {
    return this.http.patch<Sequence>(`/v1/sequences/${id}`, {
      name: input.name,
      steps: input.steps,
      status: input.status,
    });
  }

  /**
   * Put contacts on the sequence. Re-enrolling someone restarts their walk
   * from the first step rather than running two in parallel. Needs the
   * `publish` scope as well as `inbox`.
   */
  enroll(id: string, input: EnrollInput): Promise<{ id: string; enrolled: number }> {
    return this.http.post<{ id: string; enrolled: number }>(`/v1/sequences/${id}/enroll`, {
      contact_ids: input.contactIds,
      audience: input.audience,
    });
  }

  /** Nothing further fires for them. Needs the `publish` scope. */
  unenroll(id: string, contactIds: string[]): Promise<{ id: string; stopped: number }> {
    return this.http.post<{ id: string; stopped: number }>(`/v1/sequences/${id}/unenroll`, {
      contact_ids: contactIds,
    });
  }

  /** Who is on it, what step they are at, and when the next one is due. */
  enrollments(id: string, params: ListPageParams = {}): Promise<EnrollmentPage> {
    return this.http.get<EnrollmentPage>(`/v1/sequences/${id}/enrollments`, {
      page: params.page,
      per_page: params.perPage,
    });
  }

  /** Removes the sequence and every enrollment on it. */
  delete(id: string): Promise<{ message: string }> {
    return this.http.delete<{ message: string }>(`/v1/sequences/${id}`);
  }
}
