/**
 * Public DTOs returned by the FoPost API. These mirror the server's
 * response shapes for the most common endpoints. Inlined (not imported
 * from the server's shared package) so the SDK is standalone for npm consumers.
 */

export type Platform =
  | 'twitter'
  | 'instagram'
  | 'instagram-business'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'youtube'
  | 'bluesky'
  | 'threads'
  | 'mastodon'
  | 'lemmy'
  | 'pinterest'
  | 'telegram'
  | 'twitch'
  | 'discord'
  | 'slack'
  | 'reddit'
  | 'tumblr'
  | 'dribbble'
  | 'mewe'
  | 'devto'
  | 'hashnode'
  | 'medium'
  | 'substack'
  | 'google-business'
  | 'kick'
  | 'listmonk'
  | 'wordpress'
  | 'nostr'
  | 'whop'
  | 'skool';

export type PostStatus =
  'draft' | 'pending_approval' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'cancelled';

export type Workspace = {
  /** Public workspace id (uuid). */
  id: string;
  name: string;
  slug: string;
  type: string;
  timezone: string;
  language: string;
  createdAt: string;
};

export type Account = {
  /** Public account id (uuid). */
  id: string;
  workspaceId: string;
  platform: Platform;
  username: string;
  name: string;
  active: boolean;
  isPrimary: boolean;
};

export type Label = {
  /** Public label id (uuid). */
  id: string;
  workspaceId: string;
  name: string;
  color: string | null;
};

export type MediaItem = {
  type: 'image' | 'video' | 'gif';
  name: string;
  url: string;
  size?: number;
};

export type ContentBlock = {
  text?: string | null;
  media?: MediaItem[] | null;
  position?: number;
};

export type Post = {
  /** Public post id (uuid). */
  id: string;
  workspaceId: string;
  status: PostStatus;
  contentType: string;
  scheduleAt: string | null;
  title: string | null;
  summary: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreatePostInput = {
  workspaceId: string;
  /** To publish immediately, create the post then call posts.publish(id). */
  status?: 'draft' | 'scheduled';
  content: ContentBlock[];
  /** Required when status is 'scheduled'. ISO 8601. */
  scheduleAt?: string;
  /** Account ids. Objects of the form { id } are accepted too. */
  accounts: Array<string | { id: string }>;
  labels?: string[];
  /** Article title / email subject on platforms that take one (Hashnode, WordPress, ...) */
  title?: string;
};

export type UpdatePostInput = Partial<Omit<CreatePostInput, 'workspaceId'>>;

export type ListPostsParams = {
  workspaceId: string;
  status?: PostStatus;
  limit?: number;
  offset?: number;
};

export type Paginated<T> = {
  data: T[];
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
};

export type AiCreditBalance = {
  creditsRemaining: number;
  creditsUsed: number;
  creditsTotal: number;
  periodStart: string;
  periodEnd: string;
};

export type GenerateCaptionInput = {
  currentCaption?: string;
  imageUrls?: string[];
  platforms?: Platform[];
  charLimit?: number;
  workspaceId?: string;
  /**
   * What to do with the draft, in your own words: a language to write in, a
   * tone to take. Bounded at 500 characters by the API.
   */
  instructions?: string;
};

export type RewriteInput = {
  content: string;
  platforms: Platform[];
  tone?: string;
  workspaceId?: string;
};

export type RepurposeUrlInput = {
  url: string;
  platforms: Platform[];
  workspaceId?: string;
};

// ─── Inbox ─────────────────────────────────────────────────────────

export type InboxItemType = 'comment' | 'mention' | 'dm';
export type InboxItemState = 'unread' | 'read' | 'resolved' | 'snoozed';

export type InboxAccountRef = {
  id: string;
  platform: Platform;
  username: string;
  name: string;
  avatar: string | null;
};

export type InboxAttachment = {
  kind: string;
  name: string | null;
  width: number | null;
  height: number | null;
  link: string | null;
  /** Served by the API, never a platform URL. */
  url: string | null;
  previewUrl: string | null;
};

export type InboxPostContext = {
  externalId: string | null;
  isOwn: boolean;
  text: string | null;
  authorName: string | null;
  authorHandle: string | null;
  authorAvatarUrl: string | null;
  thumbnailUrl: string | null;
  permalink: string | null;
  publishedAt: string | null;
  /** The FoPost post this was published from, when it was. */
  published: { id: string; title: string | null } | null;
};

export type InboxItem = {
  /** Public inbox item id (uuid). */
  id: string;
  workspaceId: string | null;
  platform: Platform;
  type: InboxItemType;
  state: InboxItemState;
  direction: 'inbound' | 'outbound';
  conversationId: string | null;
  authorName: string | null;
  authorHandle: string | null;
  authorAvatarUrl: string | null;
  text: string | null;
  attachments: InboxAttachment[];
  permalink: string | null;
  postExternalId: string | null;
  parentExternalId: string | null;
  platformCreatedAt: string | null;
  snoozedUntil: string | null;
  repliedAt: string | null;
  createdAt: string;
  canReply: boolean;
  hidden: boolean;
  canHide: boolean;
  canDelete: boolean;
  post: { id: string; title: string | null } | null;
  postContext: InboxPostContext | null;
  account: InboxAccountRef | null;
};

export type InboxThread = {
  workspaceId: string | null;
  accountId: string;
  postExternalId: string | null;
  commentCount: number;
  unreadCount: number;
  lastCommentAt: string | null;
  lastCommentText: string | null;
  lastCommentAuthor: string | null;
  post: InboxPostContext | null;
  account: InboxAccountRef | null;
};

export type InboxConversation = {
  workspaceId: string | null;
  accountId: string;
  conversationId: string;
  messageCount: number;
  unreadCount: number;
  lastMessageAt: string | null;
  lastMessageText: string | null;
  lastMessageOutbound: boolean;
  participant: { name: string | null; handle: string | null; avatarUrl: string | null };
  account: InboxAccountRef | null;
};

export type InboxAccount = {
  id: string;
  workspaceId: string | null;
  platform: Platform;
  username: string;
  name: string;
  avatar: string | null;
  inboxSupported: boolean;
  pendingReason: string | null;
  dmSupported: boolean;
  dmPendingReason: string | null;
};

export type InboxPlatform = {
  platform: Platform;
  comments: 'live' | 'soon' | 'none';
  dms: 'live' | 'soon' | 'none';
};

export type InboxApproval = {
  /** Approval id, used by approveReply and rejectReply. */
  id: number;
  workspaceId: string | null;
  source: string;
  reply: string;
  createdAt: string;
  item: {
    id: string;
    platform: Platform;
    type: string;
    state: string;
    authorName: string | null;
    authorHandle: string | null;
    authorAvatarUrl: string | null;
    text: string | null;
    permalink: string | null;
    platformCreatedAt: string | null;
  } | null;
};

export type InboxPage<T> = {
  data: T[];
  meta: { page: number; perPage: number; total: number };
};

export type ListInboxParams = {
  workspaceId?: string;
  type?: InboxItemType;
  state?: InboxItemState;
  platform?: Platform;
  accountId?: string;
  /** Comments under one FoPost post. */
  postId?: string;
  /** Comments under one platform post, including posts not published through FoPost. */
  postExternalId?: string;
  /** One DM thread. */
  conversationId?: string;
  direction?: 'inbound' | 'outbound';
  q?: string;
  sort?: 'newest' | 'oldest' | 'unanswered';
  page?: number;
  perPage?: number;
};

export type ListInboxThreadsParams = {
  workspaceId?: string;
  /** `comments` (default) for threads under our posts, `mentions` for posts we were tagged in. */
  kind?: 'comments' | 'mentions';
  platform?: Platform;
  accountId?: string;
  state?: InboxItemState;
  q?: string;
  sort?: 'newest' | 'oldest' | 'unanswered';
  page?: number;
  perPage?: number;
};

export type ListInboxConversationsParams = Omit<ListInboxThreadsParams, 'kind'>;

export type MarkInboxThreadReadInput = {
  workspaceId: string;
  accountId: string;
  postExternalId?: string;
  conversationId?: string;
};

export type UpdateInboxItemInput = {
  state: InboxItemState;
  /** Required when state is 'snoozed'. ISO 8601, in the future. */
  snoozedUntil?: string;
};

export type InboxReplyResult = {
  item: InboxItem;
  reply: { externalId: string | null; externalUrl: string | null };
};

export type InboxRefreshResult = {
  accountsPolled: number;
  newItems: number;
  rateLimited: number;
  dmReconnect: Array<{ platform: Platform; account: string }>;
};

// ─── Ads ───────────────────────────────────────────────────────────

export type AdGoal = 'engagement' | 'traffic' | 'awareness' | 'video_views';
export type AdBudgetType = 'daily' | 'lifetime';

export type AdTargetingItem = { id: string; name: string };

export type AdTargetingLocation = {
  key: string;
  name: string;
  type: 'region' | 'city' | 'zip' | 'geo_market';
};

export type AdTargeting = {
  /** ISO 3166-1 alpha-2. At least one country or one location is required. */
  countries: string[];
  ageMin: number;
  ageMax: number;
  gender: 'all' | 'male' | 'female';
  audienceIds?: string[];
  locations?: AdTargetingLocation[];
  interests?: AdTargetingItem[];
  behaviors?: AdTargetingItem[];
  income?: AdTargetingItem[];
};

export type AdBudget = {
  /** Ad account currency, minor units. */
  minor: number;
  type: AdBudgetType;
  endAt?: string;
};

export type AdInsights = {
  impressions: number;
  reach: number;
  clicks: number;
  /** Ad account currency, minor units. */
  spendMinor: number;
};

export type Ad = {
  /** Public ad id (uuid). */
  id: string;
  workspaceId: string;
  kind: 'boost' | 'ad';
  name: string;
  goal: AdGoal;
  status: string;
  effectiveStatus: string | null;
  connectionId: string | null;
  accountId: string | null;
  platform: Platform | null;
  adAccountId: string;
  sourcePostId: string | null;
  budgetMinor: number;
  budgetType: AdBudgetType;
  currency: string | null;
  endAt: string | null;
  targeting: AdTargeting;
  creative: {
    text?: string;
    headline?: string;
    destinationUrl?: string;
    mediaUrl?: string;
  } | null;
  insights: AdInsights | null;
  insightsAt: string | null;
  lastError: string | null;
  createdAt: string;
};

export type ExternalAd = {
  id: string;
  name: string;
  effectiveStatus: string | null;
  campaignId: string | null;
  campaignName: string | null;
  objective: string | null;
  budgetMinor: number | null;
  budgetType: AdBudgetType | null;
  endAt: string | null;
  createdAt: string | null;
  connectionId: string;
  adAccountId: string;
  currency: string | null;
  workspaceId: string;
};

export type AdConnection = {
  id: string;
  provider: string;
  authType: string;
  name: string;
  businessId: string | null;
  createdAt: string;
  workspaceId: string;
};

export type AdSource = {
  connectionId: string;
  name: string;
  workspaceId: string;
  adAccounts: Array<{ id: string; name: string; currency: string; status: number }>;
  pages: Array<{ id: string; name: string; instagramUserId: string | null }>;
  error: string | null;
};

export type BoostablePost = {
  id: string;
  workspaceId: string;
  text: string;
  thumbnailUrl: string | null;
  deliveries: Array<{
    accountId: string;
    platform: Platform;
    username: string;
    externalUrl: string | null;
    postedAt: string | null;
  }>;
};

export type Audience = {
  id: string;
  name: string;
  subtype: string;
  description: string | null;
  sizeLower: number | null;
  sizeUpper: number | null;
  deliveryStatus: string | null;
  createdAt: string | null;
};

export type AudiencesResult = {
  audiences: Audience[];
  pixels: Array<{ id: string; name: string }>;
  workspaceId: string;
};

export type TargetingSearchType =
  'country' | 'region' | 'city' | 'zip' | 'metro' | 'interest' | 'behavior' | 'income';

export type TargetingOption = { id: string; name: string; detail: string | null };

export type LeadForm = {
  id: string;
  name: string;
  status: string;
  leadsCount: number;
  createdAt: string | null;
  questions: string[];
};

export type LeadFormSource = {
  connectionId: string;
  connectionName: string;
  pageId: string | null;
  pageName: string | null;
  forms: LeadForm[];
  error: string | null;
  workspaceId: string;
};

export type Lead = {
  id: string;
  createdAt: string | null;
  fields: Array<{ name: string; values: string[] }>;
  adName: string | null;
  campaignName: string | null;
  platform: string | null;
  isOrganic: boolean;
};

export type LeadsPage = { leads: Lead[]; nextCursor: string | null };

type AdBaseInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
  name: string;
  goal: AdGoal;
  budget: AdBudget;
  targeting: AdTargeting;
  /** Default true: the ad is created paused and spends nothing until resumed. */
  paused?: boolean;
};

export type BoostPostInput = AdBaseInput & {
  postId: string;
  accountId: string;
};

export type CreateAdInput = AdBaseInput & {
  pageId: string;
  /** Up to 125 characters. */
  text: string;
  headline?: string;
  destinationUrl?: string;
  /** A media library asset url. */
  mediaUrl?: string;
};

export type CreateAudienceInput = {
  workspaceId: string;
  connectionId: string;
  adAccountId: string;
  name: string;
  description?: string;
  spec:
    | { subtype: 'CUSTOM'; emails?: string[] }
    | { subtype: 'LOOKALIKE'; originAudienceId: string; country: string; ratio?: number }
    | { subtype: 'WEBSITE'; pixelId: string; retentionDays?: number; urlContains?: string };
};

export type CreateLeadFormInput = {
  workspaceId: string;
  connectionId: string;
  pageId: string;
  name: string;
  questions: Array<'EMAIL' | 'FULL_NAME' | 'PHONE'>;
  privacyPolicyUrl: string;
  thankYouMessage: string;
  followUpUrl?: string;
};

export type AuthorizeMetaAdsInput = {
  workspaceId: string;
  method?: 'business' | 'user';
  /** Dashboard path to land on after Meta redirects back. */
  returnTo?: string;
};

export type ContentSignal = {
  level: 'info' | 'warn';
  code: string;
  message: string;
};

export type ValidatePostInput = {
  content?: string;
  media?: Array<{ url: string; mimeType: string; size?: number }>;
  platforms: Platform[];
};

export type ValidatePostResult = {
  ready: boolean;
  platforms: Array<{
    platform: Platform;
    ready: boolean;
    /** Hard blockers that would prevent publishing. */
    issues: string[];
    score?: number;
    /** Advisory; never blocks publishing. */
    signals: ContentSignal[];
  }>;
};

export type ValidateLengthResult = {
  ok: boolean;
  platforms: Array<{
    platform: Platform;
    /** What the platform counts, in `unit`. */
    length: number;
    /** null when the platform has no text limit. */
    limit: number | null;
    unit: 'chars' | 'bytes';
    ok: boolean;
    signals: ContentSignal[];
  }>;
};

export type ValidateMediaResult = {
  ok: boolean;
  issues: string[];
  name: string;
  size: number;
  /** Present only when the file passed. */
  mime_type?: string;
  type?: string;
};
