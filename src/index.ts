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
  Ad,
  AdConnection,
  AdSource,
  AiCreditBalance,
  AudiencesResult,
  AuthorizeMetaAdsInput,
  BoostPostInput,
  BoostablePost,
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
  InboxReplyResult,
  InboxThread,
  Label,
  Platform,
  LeadFormSource,
  LeadsPage,
  ListInboxConversationsParams,
  ListInboxParams,
  ListInboxThreadsParams,
  ListPostsParams,
  MarkInboxThreadReadInput,
  Post,
  PresignUploadInput,
  PresignedUpload,
  RepurposeUrlInput,
  RewriteInput,
  TargetingOption,
  TargetingSearchType,
  UpdateInboxItemInput,
  UpdatePostInput,
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
      accounts: accountIds(input.accounts),
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

  list(params: { workspaceId: string }): Promise<Account[]> {
    return this.http.get<Account[]>('/v1/accounts', {
      workspace_id: params.workspaceId,
    });
  }

  get(id: string): Promise<Account> {
    return this.http.get<Account>(`/v1/accounts/${id}`);
  }

  health(id: string): Promise<unknown> {
    return this.http.get(`/v1/accounts/${id}/health`);
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

  /** Sends the reply on the platform as the connected account. */
  reply(id: string, text: string): Promise<InboxReplyResult> {
    return this.http.post<InboxReplyResult>(`/v1/inbox/${id}/reply`, { text });
  }

  hide(id: string): Promise<InboxItem> {
    return this.http.post<InboxItem>(`/v1/inbox/${id}/hide`);
  }

  unhide(id: string): Promise<InboxItem> {
    return this.http.post<InboxItem>(`/v1/inbox/${id}/unhide`);
  }

  /** Deletes the comment on the platform. */
  delete(id: string): Promise<{ deleted: boolean }> {
    return this.http.delete<{ deleted: boolean }>(`/v1/inbox/${id}`);
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
