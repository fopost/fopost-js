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
  /** The display name override when set, else the platform name. */
  name: string;
  /** The name the platform reports, regardless of any override. */
  platformName?: string;
  active: boolean;
  isPrimary: boolean;
};

export type ListAccountsParams = {
  workspaceId: string;
  /** Only accounts in this account group. */
  groupId?: string;
};

export type RenamedAccount = {
  id: string;
  name: string;
  platform_name: string;
};

export type MovedAccount = {
  id: string;
  workspace_id: string;
};

/** Telegram connect codes come back in the API's snake_case shape. */
export type TelegramConnectCode = {
  /** One-time code, valid for 15 minutes. */
  code: string;
  /** What to send in the chat: `/connect <code>`. */
  command: string;
  /** The publishing bot, without the @. */
  bot_username: string | null;
  /** Opens a private chat with the bot, code included. */
  deep_link: string | null;
  /** Adds the bot to a group, code included. */
  group_link: string | null;
  expires_at: string;
};

export type TelegramConnectStatus = {
  status: 'pending' | 'connected' | 'failed' | 'expired';
  /** The connected account, once `connected`. */
  account_id: string | null;
  /** Why the connection failed, when `failed`. */
  reason: 'card_required' | 'slot_taken' | 'workspace_unavailable' | null;
};

export type TelegramBotCommand = {
  /** 1-32 lowercase letters, digits or underscores. */
  command: string;
  /** 1-256 characters. */
  description: string;
};

export type TelegramBotCommands = {
  commands: TelegramBotCommand[];
};

export type SlackChannel = {
  /** Slack channel id. */
  id: string;
  name: string;
  is_private: boolean;
  /** Whether the bot is in the channel. */
  is_member: boolean;
  /** The channel this account posts to. */
  is_current: boolean;
};

export type SlackMember = {
  /** Slack user id; pass it as the handle to `inbox.startConversation` to open a DM. */
  id: string;
  name: string;
  real_name: string | null;
  display_name: string | null;
  avatar: string | null;
  is_bot: boolean;
};

/** The name and icon a Slack account posts under; null means the app default. */
export type SlackIdentity = {
  username: string | null;
  icon_url: string | null;
  /** Emoji code, e.g. `:rocket:`. */
  icon_emoji: string | null;
};

/** Omitted fields keep their value, null clears one. Set iconUrl or iconEmoji, not both. */
export type UpdateSlackIdentityInput = {
  /** 1-80 characters. */
  username?: string | null;
  /** An http(s) URL. */
  iconUrl?: string | null;
  /** An emoji code, e.g. `:rocket:`. */
  iconEmoji?: string | null;
};

/** Account groups come back in the API's snake_case shape. */
export type AccountGroup = {
  /** Public account group id (uuid). */
  id: string;
  name: string;
  account_ids: string[];
  created_at: string;
  updated_at: string;
};

export type CreateAccountGroupInput = {
  workspaceId: string;
  name: string;
  /** Account ids. Objects of the form { id } are accepted too. */
  accountIds?: Array<string | { id: string }>;
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
  /** Account ids. Objects of the form { id } are accepted too. Optional when accountGroupId is set. */
  accounts?: Array<string | { id: string }>;
  /** Posts to every account in the group, merged with accounts; each account once. */
  accountGroupId?: string;
  labels?: string[];
  /** Article title / email subject on platforms that take one (Hashnode, WordPress, ...) */
  title?: string;
};

export type UpdatePostInput = Partial<Omit<CreatePostInput, 'workspaceId' | 'accountGroupId'>>;

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
  liked: boolean;
  pinned: boolean;
  /** Our reaction on a DM. */
  reaction: string | null;
  editedAt: string | null;
  canHide: boolean;
  /** Also true for our own replies. */
  canDelete: boolean;
  canLike: boolean;
  canPin: boolean;
  canEdit: boolean;
  canReact: boolean;
  canSendMedia: boolean;
  canQuickReply: boolean;
  canPrivateReply: boolean;
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
  canStartConversation: boolean;
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

export type InboxReplyOptions = {
  /** Media library ids to attach to a DM, max 10. Only where `canSendMedia` is true. */
  mediaIds?: string[];
  /** Answer buttons under a DM, max 13 of 20 characters. Only where `canQuickReply` is true. */
  quickReplies?: string[];
};

/** Either a DM to `handle` from `accountId`, or a private reply to the inbox comment `commentId`. */
export type StartInboxConversationInput = (
  | { accountId: string; handle: string; commentId?: never }
  | { commentId: string; accountId?: never; handle?: never }
) & {
  text: string;
  mediaIds?: string[];
};

export type StartInboxConversationResult = {
  conversationId: string | null;
  item: InboxItem | null;
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
    urlTags?: string;
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
  /** Query string appended to every link in the ad, e.g. `utm_source=meta&utm_medium=paid`. */
  urlTags?: string;
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

// ─── Ads: campaign tree, creatives, insights, leads ────────────────

/** A Meta object read inside a workspace. */
export type AdObjectParams = { workspaceId?: string; connectionId: string };
/** A Meta object changed inside a workspace; the API requires the workspace here. */
export type AdObjectMutationParams = { workspaceId: string; connectionId: string };

export type AdObjectStatus = 'active' | 'paused';
export type AdObjectLevel = 'campaign' | 'ad_set' | 'ad';

export type AdCampaign = {
  /** Meta's campaign id. */
  id: string;
  name: string;
  /** `ACTIVE`, `PAUSED`, `DELETED` or `ARCHIVED`. */
  status: string;
  effectiveStatus: string | null;
  objective: string | null;
  /** Null when the budget lives on the ad sets. */
  budgetMinor: number | null;
  budgetType: AdBudgetType | null;
  createdAt: string | null;
};

export type AdSet = {
  /** Meta's ad set id. */
  id: string;
  name: string;
  campaignId: string | null;
  status: string;
  effectiveStatus: string | null;
  budgetMinor: number | null;
  budgetType: AdBudgetType | null;
  endAt: string | null;
  optimizationGoal: string | null;
  createdAt: string | null;
};

/** An ad inside an ad set, by Meta id. */
export type NetworkAd = {
  id: string;
  name: string;
  campaignId: string | null;
  adSetId: string | null;
  creativeId: string | null;
  status: string;
  effectiveStatus: string | null;
  createdAt: string | null;
};

export type AdAccountTree = {
  adAccountId: string;
  currency: string;
  workspaceId: string;
  campaigns: Array<AdCampaign & { adSets: Array<AdSet & { ads: NetworkAd[] }> }>;
};

export type CreateAdCampaignInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
  name: string;
  goal: AdGoal;
  /** Default true. */
  paused?: boolean;
};

export type UpdateAdCampaignInput = { name?: string; status?: AdObjectStatus };

export type CreateAdSetInput = {
  workspaceId: string;
  connectionId: string;
  campaignId: string;
  /** The Page the ads in this set run as. */
  pageId: string;
  name: string;
  goal: AdGoal;
  budget: AdBudget;
  targeting: AdTargeting;
  /** Default true. */
  paused?: boolean;
};

export type UpdateAdSetInput = {
  name?: string;
  status?: AdObjectStatus;
  /** The budget type set at creation stays. */
  budgetMinor?: number;
  endAt?: string;
  targeting?: AdTargeting;
};

export type CreateNetworkAdInput = {
  workspaceId: string;
  connectionId: string;
  adSetId: string;
  creativeId: string;
  name: string;
  /** Default true. */
  paused?: boolean;
};

export type UpdateNetworkAdInput = { name?: string; status?: AdObjectStatus; creativeId?: string };

export type BulkAdStatusInput = {
  workspaceId: string;
  connectionId: string;
  status: AdObjectStatus;
  /** 1 to 50 objects. */
  objects: Array<{ id: string; level: AdObjectLevel }>;
};

export type BulkAdStatusResult = {
  id: string;
  level: AdObjectLevel;
  ok: boolean;
  error: string | null;
};

export type AdCallToAction =
  | 'LEARN_MORE'
  | 'SHOP_NOW'
  | 'SIGN_UP'
  | 'SUBSCRIBE'
  | 'CONTACT_US'
  | 'DOWNLOAD'
  | 'GET_OFFER'
  | 'BOOK_NOW'
  | 'APPLY_NOW'
  | 'WATCH_MORE';

export type AdCreative = {
  id: string;
  name: string;
  format: 'image' | 'video' | 'carousel' | 'post' | 'other';
  status: string | null;
  title: string | null;
  body: string | null;
  link: string | null;
  thumbnailUrl: string | null;
  callToAction: string | null;
  urlTags: string | null;
};

export type AdCreativesResult = { creatives: AdCreative[]; workspaceId: string };

export type CreateAdCreativeInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
  pageId: string;
  name: string;
  format: 'image' | 'video' | 'carousel';
  /** Primary text. */
  text: string;
  headline?: string;
  destinationUrl?: string;
  /** Defaults to `LEARN_MORE`. */
  callToAction?: AdCallToAction;
  /** Query string appended to every link in the ad. */
  urlTags?: string;
  /** A media library asset url: the image, or the video. Required for `video`. */
  mediaUrl?: string;
  /** A video's poster frame, as a library image. */
  thumbnailMediaUrl?: string;
  /** 2 to 10 cards; required for `carousel`. */
  cards?: Array<{
    mediaUrl: string;
    destinationUrl?: string;
    headline?: string;
    description?: string;
  }>;
};

export type UpdateAudienceInput = { name?: string; description?: string };

export type ReachEstimateInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
  pageId: string;
  targeting: AdTargeting;
};

export type ReachEstimate = { lower: number | null; upper: number | null; ready: boolean };

export type AdInsightsBreakdown = 'age' | 'gender' | 'placement' | 'country';

export type InsightsMetrics = {
  impressions: number;
  reach: number;
  clicks: number;
  /** Account currency, minor units. */
  spendMinor: number;
  /** Clicks per impression, as a percentage. */
  ctr: number;
  leads: number;
};

export type AdInsightsReport = {
  objectId: string;
  currency: string | null;
  since: string;
  until: string;
  breakdownBy: AdInsightsBreakdown | null;
  totals: InsightsMetrics | null;
  breakdown: Array<{ key: string; metrics: InsightsMetrics }>;
  timeline: Array<{ date: string; metrics: InsightsMetrics }>;
};

type InsightsRangeParams = {
  /** YYYY-MM-DD, inclusive. */
  since: string;
  /** YYYY-MM-DD, inclusive. */
  until: string;
  breakdown?: AdInsightsBreakdown;
  /** Add a day-by-day timeline. */
  daily?: boolean;
};

export type AdInsightsParams = InsightsRangeParams & {
  workspaceId?: string;
  connectionId: string;
  /** A Meta campaign, ad set or ad id. */
  objectId: string;
};

export type FoPostAdInsightsParams = InsightsRangeParams & { workspaceId: string };

export type LeadFormDetail = LeadForm & {
  pageId: string | null;
  privacyPolicyUrl: string | null;
  locale: string | null;
};

export type LeadPageInput = { workspaceId: string; connectionId: string; pageId: string };

export type FeedLead = {
  id: string;
  /** Meta's lead id. */
  leadId: string;
  connectionId: string;
  pageId: string;
  formId: string | null;
  adId: string | null;
  adName: string | null;
  campaignName: string | null;
  platform: string | null;
  isOrganic: boolean;
  fields: Array<{ name: string; values: string[] }>;
  submittedAt: string;
  workspaceId: string;
};

export type LeadsFeedParams = {
  workspaceId?: string;
  formId?: string;
  pageId?: string;
  /** The previous page's `nextCursor`. */
  cursor?: string;
  /** 1 to 100. */
  limit?: number;
};

export type LeadsFeedPage = { leads: FeedLead[]; nextCursor: string | null };

export type LeadPage = {
  connectionId: string;
  pageId: string;
  pageName: string | null;
  createdAt: string;
  workspaceId: string;
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

// ─── Media ─────────────────────────────────────────────────────────

export type PresignUploadInput = {
  workspaceId: string;
  filename: string;
  mimeType: string;
  /** Bytes, 1 to 52428800. */
  size: number;
};

export type PresignedUpload = {
  uploadId: string;
  uploadUrl: string;
  method: 'PUT';
  headers: { 'Content-Type': string };
  expiresAt: string;
};

export type UploadedMedia = {
  id: string;
  type: 'image' | 'video' | 'gif' | 'document';
  name: string;
  url: string;
  previewUrl: string;
  size: number;
};

export type DirectUploadInput = {
  workspaceId: string;
  filename: string;
  mimeType: string;
  data: Blob | Uint8Array | ArrayBuffer;
};

// ─── Contacts ──────────────────────────────────────────────────────

/** One handle on one network. `handle` is lower-cased with no leading @. */
export type ContactChannel = {
  platform: string;
  handle: string;
  /** The platform's own id for this person, when the network gave us one. */
  externalId?: string | null;
};

export type ContactSource = 'inbox' | 'radar' | 'import';

export type Contact = {
  id: string;
  display_name: string | null;
  channels: ContactChannel[];
  source: ContactSource;
  note: string | null;
  first_seen_at: string;
  last_seen_at: string;
  /** Custom field values, keyed by field key. */
  fields: Record<string, string>;
  labels: Array<{ id: string; name: string; color: string }>;
  /** Only on a listing that spans workspaces. */
  workspace_id?: string;
};

export type ContactPage = {
  data: Contact[];
  pagination: { page: number; per_page: number; total: number };
};

export type ListContactsParams = {
  workspaceId?: string;
  /** Matches a display name or any of their handles. */
  search?: string;
  platform?: string;
  source?: ContactSource;
  page?: number;
  perPage?: number;
};

export type CreateContactInput = {
  workspaceId: string;
  channels: ContactChannel[];
  displayName?: string;
  note?: string;
  fields?: Record<string, string>;
};

export type UpdateContactInput = {
  displayName?: string | null;
  channels?: ContactChannel[];
  note?: string | null;
  /** A null or empty value clears that field. */
  fields?: Record<string, string | null>;
};

/** One thread a contact appears in. `key` is how the inbox groups it. */
export type ContactConversation = {
  key: string;
  account_id: string;
  account_username: string | null;
  platform: string;
  messages: number;
  received: number;
  sent: number;
  last_message_at: string | null;
  last_item_id: string | null;
};

export type ContactImportResult = {
  created: number;
  /** Rows that folded into a contact already on file. */
  merged: number;
  skipped: Array<{ row: number; reason: string }>;
  /** Columns that named neither a reserved field nor a custom field. */
  unknownColumns: string[];
};

export type CustomFieldType = 'text' | 'number' | 'date' | 'select' | 'boolean';

export type ContactField = {
  id: string;
  /** Lower-case key; also the CSV column header. Fixed once created. */
  key: string;
  name: string;
  type: CustomFieldType;
  /** Allowed values when `type` is `select`. */
  options: string[];
  position: number;
};

export type CreateContactFieldInput = {
  key: string;
  name: string;
  type?: CustomFieldType;
  options?: string[];
};

export type UpdateContactFieldInput = {
  name?: string;
  options?: string[];
  position?: number;
};

// ─── Conversation analytics ────────────────────────────────────────

export type ConversationAnalyticsRow = {
  key: string;
  accountId: string;
  platform: string;
  received: number;
  sent: number;
  answered: number;
  open: number;
  /** Median minutes to the first reply in this thread. */
  medianResponseMinutes: number | null;
  firstMessageAt: string | null;
  lastMessageAt: string | null;
};

export type ConversationAnalytics = {
  conversations: ConversationAnalyticsRow[];
  total: number;
  page: number;
  perPage: number;
};

export type ListConversationAnalyticsParams = {
  workspaceId?: string;
  accountId?: string;
  /** Reporting period, 1 to 365. Defaults to 7. */
  days?: number;
  sort?: 'volume' | 'slowest' | 'recent';
  page?: number;
  perPage?: number;
};
