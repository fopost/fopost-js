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
  SlackChannel,
  SlackIdentity,
  RedditSubreddit,
  RedditSubredditRules,
  RedditFlairs,
  RedditDefaultSubreddit,
  RedditVoteDirection,
  SubredditCheck,
  SlackMember,
  TargetingOption,
  TelegramBotCommand,
  TelegramBotCommands,
  TelegramConnectCode,
  TelegramConnectStatus,
  TargetingSearchType,
  UpdateInboxItemInput,
  UpdatePostInput,
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
  readonly ads: AdsResource;
  readonly validate: ValidateResource;
  readonly media: MediaResource;

  constructor(opts: FoPostOptions) {
    this.http = new HttpClient(opts);
    this.posts = new PostsResource(this.http);
    this.accounts = new AccountsResource(this.http);
    this.accountGroups = new AccountGroupsResource(this.http);
    this.workspaces = new WorkspacesResource(this.http);
    this.labels = new LabelsResource(this.http);
    this.ai = new AiResource(this.http);
    this.inbox = new InboxResource(this.http);
    this.ads = new AdsResource(this.http);
    this.validate = new ValidateResource(this.http);
    this.media = new MediaResource(this.http);
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

  /** Subreddits the account is in, busiest first, plus its own profile page. */
  listRedditSubreddits(id: string): Promise<RedditSubreddit[]> {
    return this.http.get<RedditSubreddit[]>(`/v1/accounts/${id}/reddit/subreddits`);
  }

  /** The rules a subreddit publishes, in its own order. */
  listRedditSubredditRules(id: string, subreddit: string): Promise<RedditSubredditRules> {
    return this.http.get<RedditSubredditRules>(
      `/v1/accounts/${id}/reddit/subreddits/${encodeURIComponent(subreddit)}/rules`,
    );
  }

  /** Post flairs one subreddit offers; a flair id is valid only there. */
  listRedditFlairs(id: string, subreddit: string): Promise<RedditFlairs> {
    return this.http.get<RedditFlairs>(`/v1/accounts/${id}/reddit/flairs`, { subreddit });
  }

  /** Where posts go when a post names no subreddit; null falls back to the profile page. */
  setRedditDefaultSubreddit(id: string, subreddit: string | null): Promise<RedditDefaultSubreddit> {
    return this.http.put<RedditDefaultSubreddit>(`/v1/accounts/${id}/reddit/default-subreddit`, {
      subreddit,
    });
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

  /**
   * Votes the item up or down where the network ranks by votes (Reddit), or
   * takes an earlier vote back with `none`. An upvote is the same call a like
   * makes, so `liked` moves with it. Needs `publish`.
   */
  vote(id: string, direction: RedditVoteDirection): Promise<InboxItem> {
    return this.http.post<InboxItem>(`/v1/inbox/${id}/vote`, { direction });
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

  /**
   * Whether a subreddit exists and takes a post from this account. The check
   * runs with the account's own token, so `accountId` is required.
   */
  subreddit(input: { accountId: string; name: string }): Promise<SubredditCheck> {
    return this.http.get<SubredditCheck>('/v1/validate/subreddit', {
      account_id: input.accountId,
      name: input.name,
    });
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
