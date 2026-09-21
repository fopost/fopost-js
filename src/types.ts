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

// ─── Meta messaging settings ───────────────────────────────────

/** A tappable prompt Messenger or Instagram shows before the first message. */
export type MetaIceBreaker = {
  /** Up to 80 characters. */
  question: string;
  /** What your webhook receives when it is tapped. */
  payload: string;
};

export type MetaIceBreakers = {
  ice_breakers: MetaIceBreaker[];
};

/** A persistent-menu item: a postback your webhook receives, or an http(s) link. */
export type MetaMenuItem =
  | { type: 'postback'; title: string; payload: string }
  | { type: 'web_url'; title: string; url: string };

/** One locale's menu; `default` is the fallback every language uses. */
export type MetaPersistentMenuEntry = {
  locale: string;
  call_to_actions: MetaMenuItem[];
  composer_input_disabled?: boolean;
};

export type MetaPersistentMenu = {
  persistent_menu: MetaPersistentMenuEntry[];
};

export type MetaGreetingText = {
  locale: string;
  /** Up to 160 characters. */
  text: string;
};

export type MetaGreeting = {
  greeting: MetaGreetingText[];
};

/** What the network is delivering to the FoPost webhook for one account. */
export type WebhookSubscription = {
  /** False when the subscription lapsed or a required field is missing. */
  subscribed: boolean;
  fields: string[];
  missing_fields: string[];
};

/** The outcome of a Messenger thread hand-over. */
export type InboxHandover = {
  /** The app control was passed to, or null when it was taken back. */
  app_id: string | null;
  control: 'passed' | 'taken';
};

// ─── Per-network extras ──────────────────────────────────────────

export type PinterestBoard = {
  /** Pinterest board id; pass it as the `board_id` platform setting to pin to it. */
  id: string;
  name: string;
  privacy: string | null;
  description: string | null;
  /** Board cover image. */
  image: string | null;
};

export type CreatePinterestBoardInput = {
  name: string;
  description?: string;
  privacy?: 'PUBLIC' | 'PROTECTED' | 'SECRET';
};

export type YouTubePlaylist = {
  id: string;
  title: string;
  description: string | null;
  privacy: string | null;
  item_count: number | null;
  thumbnail_url: string | null;
  /** The playlist a new video joins when the post picks none. */
  is_default: boolean;
};

export type CreateYouTubePlaylistInput = {
  title: string;
  description?: string;
  privacy?: 'public' | 'unlisted' | 'private';
};

export type YouTubeCaptionTrack = {
  id: string;
  /** BCP-47 tag. */
  language: string;
  name: string;
  track_kind: string | null;
  is_draft: boolean;
  is_auto_synced: boolean;
  last_updated: string | null;
};

export type UploadYouTubeCaptionsInput = {
  language: string;
  name?: string;
  /** The subtitle file itself; YouTube reads SRT and WebVTT and sniffs which. */
  body: string;
  isDraft?: boolean;
};

export type YouTubeTranscript = {
  caption_id: string;
  /** The track as SRT. */
  transcript: string;
};

export type BlueskyLanguages = {
  /** Up to three BCP-47 tags. */
  languages: string[];
};

export type TikTokCreatorInfo = {
  username: string | null;
  nickname: string | null;
  avatar_url: string | null;
  /** Privacy levels this creator may publish at right now. */
  privacy_level_options: string[];
  comment_disabled: boolean;
  duet_disabled: boolean;
  stitch_disabled: boolean;
  max_video_post_duration_sec: number | null;
};

/** A track from TikTok's Commercial Music Library. */
export type TikTokMusic = {
  /** Pass as the `music_id` platform setting on a post. */
  id: string;
  title: string;
  author: string | null;
  duration_sec: number | null;
  cover_url: string | null;
  preview_url: string | null;
};

/** A place a TikTok post can be tagged with. */
export type TikTokPlace = {
  /** Pass as the `location_id` platform setting on a post. */
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
};

export type TikTokSearchParams = {
  q: string;
  /** 1 to 50; the API defaults to 20. */
  limit?: number;
};

/** One of the connected account's own videos, resolved from a share link. */
export type TikTokVideoSource = {
  video_id: string;
  title: string | null;
  description: string | null;
  duration_sec: number | null;
  cover_image_url: string | null;
  share_url: string | null;
  embed_link: string | null;
  /** What a repurpose run reads. TikTok serves no raw media file, so this is the share URL. */
  download_url: string | null;
};

export type InstagramAudio = {
  /** Pass as the `audio_id` platform setting on a Reel. */
  id: string;
  title: string | null;
  artist: string | null;
  duration_ms: number | null;
  audio_type: string | null;
  cover_artwork_url: string | null;
  preview_url: string | null;
  username: string | null;
  is_ads_eligible: boolean | null;
};

export type InstagramAudioSearchParams = {
  /** Keyword; omit for what is trending. */
  q?: string;
  audioType?: 'music' | 'original_sound';
};

export type InstagramPublishingLimit = {
  quota_usage: number;
  quota_total: number | null;
  quota_duration_sec: number | null;
  remaining: number | null;
};

export type InstagramStory = {
  id: string;
  media_type: string | null;
  media_product_type: string | null;
  permalink: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  caption: string | null;
  timestamp: string | null;
  /** Present when asked for; absent for a story too young to report. */
  insights: Record<string, number> | null;
};

export type InstagramStoryInsights = {
  story_id: string;
  insights: Record<string, number>;
};

export type LinkedInMention = {
  urn: string;
  name: string;
  vanity_name: string | null;
  logo_url: string | null;
  type: string;
  /** Paste into the post text for LinkedIn to render a link. */
  annotation: string;
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

export type DiscordChannel = {
  /** Discord channel id. */
  id: string;
  name: string;
  /** Discord channel type: 0 text, 5 announcement, 15 forum. */
  type: number;
  parent_id: string | null;
  nsfw: boolean;
  /** False when a channel permission in Discord shuts the bot out of this channel. */
  can_post: boolean;
  /** The channel this account posts to. */
  is_current: boolean;
};

/** The nickname and avatar the bot wears in this server; null means its own. */
export type DiscordIdentity = {
  username: string | null;
  avatar_url: string | null;
};

/** Omitted fields keep their value, null clears one. */
export type UpdateDiscordIdentityInput = {
  /** 1-32 characters. */
  username?: string | null;
  /** An http(s) URL. */
  avatarUrl?: string | null;
};

export type DiscordMessage = {
  id: string;
  channel_id: string;
  content: string;
  author_id: string;
  author_name: string;
  pinned: boolean;
  created_at: string;
};

export type DiscordScheduledEvent = {
  id: string;
  name: string;
  description: string | null;
  /** Voice or stage channel, or null for an event somewhere else. */
  channel_id: string | null;
  location: string | null;
  start_time: string;
  end_time: string | null;
  /** `scheduled`, `active`, `completed` or `canceled`. */
  status: string;
  user_count: number | null;
};

/** Name a channelId, or a location with an endTime. */
export type CreateDiscordEventInput = {
  name: string;
  description?: string;
  /** ISO 8601. */
  startTime: string;
  /** ISO 8601; required for an event at a location. */
  endTime?: string;
  channelId?: string;
  location?: string;
};

export type UpdateDiscordEventInput = Partial<CreateDiscordEventInput> & {
  status?: 'scheduled' | 'active' | 'completed' | 'canceled';
};

export type DiscordMember = {
  /** Discord user id; pass it as the member id to send a DM or assign a role. */
  id: string;
  username: string;
  display_name: string | null;
  /** Nickname in this server. */
  nick: string | null;
  avatar: string | null;
  is_bot: boolean;
  roles: string[];
  joined_at: string | null;
};

export type DiscordRole = {
  id: string;
  name: string;
  /** RGB integer; 0 is the default colour. */
  color: number;
  /** Shown separately in the member list. */
  hoist: boolean;
  mentionable: boolean;
  /** Owned by an integration; not editable. */
  managed: boolean;
  position: number;
  /** Permission bitfield as a decimal string. */
  permissions: string;
};

export type CreateDiscordRoleInput = {
  name: string;
  color?: number;
  hoist?: boolean;
  mentionable?: boolean;
  /** Permission bitfield as a decimal string. */
  permissions?: string;
};

export type UpdateDiscordRoleInput = Partial<CreateDiscordRoleInput>;

/** A message the bot put somewhere. */
export type DiscordMessageRef = { id: string; channel_id: string };

export type CreateDiscordThreadInput = {
  name: string;
  /** Minutes of inactivity before it archives: 60, 1440, 4320 or 10080. */
  autoArchiveDuration?: 60 | 1440 | 4320 | 10080;
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

export type InboxItemType = 'comment' | 'mention' | 'dm' | 'review';
/** What the platform did with a comment, where it reports one. */
export type InboxModerationStatus = 'published' | 'held' | 'spam' | 'rejected';
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
  /** Stars on a review, 1-5. Null on every other type. */
  rating: number | null;
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
  /** The platform's own moderation state; null where it does not report one. */
  moderationStatus: InboxModerationStatus | null;
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
  /** Stars, on a review thread. Null on comments and mentions. */
  rating: number | null;
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
  /** The grant predates a permission the inbox needs; reconnect the account once. */
  reconnectRequired: boolean;
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
  /**
   * `comments` (default) for threads under our posts, `mentions` for posts we
   * were tagged in, `reviews` for ratings left on the business.
   */
  kind?: 'comments' | 'mentions' | 'reviews';
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

export type AdGoal =
  | 'engagement'
  | 'traffic'
  | 'awareness'
  | 'video_views'
  /** Opens a Messenger or Instagram Direct thread; needs `messagingDestination`. */
  | 'messages'
  /** Dials the advertiser from the ad; needs `phoneNumber`. */
  | 'calls'
  /** Opens a WhatsApp thread. Absent from `goals()` unless the deployment has a number. */
  | 'whatsapp'
  /** A catalog ad built from a product set; needs `productSetId`. */
  | 'sales';

export type MessagingDestination = 'messenger' | 'instagram_direct' | 'whatsapp';

/** What a goal needs beyond a budget and an audience. */
export type AdGoalExtras = {
  /** Required by the `messages` goal. */
  messagingDestination?: MessagingDestination;
  /** Required by the `calls` goal, in E.164, e.g. `+14155550123`. */
  phoneNumber?: string;
  /** Required by the `sales` goal: the product set the catalog ad runs from. */
  productSetId?: string;
};
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
} & AdGoalExtras;

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
} & AdGoalExtras;

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
  format: 'image' | 'video' | 'carousel' | 'catalog' | 'partnership';
  /** Primary text. Required except on `partnership`, which runs the creator's own post. */
  text?: string;
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
  /** Required for `catalog`: the network fills the cards from this product set. */
  productSetId?: string;
  /** `catalog` only: the per-product line under the headline. */
  description?: string;
  /** Required for `partnership`: the creator's media id, or their Page post as `{page}_{post}`. */
  creatorPostId?: string;
  /** `partnership` only: the creator's Instagram account. */
  creatorInstagramUserId?: string;
};

export type UpdateAudienceInput = { name?: string; description?: string };

// ─── Product catalogs ──────────────────────────────────────────────

export type ProductCatalog = {
  id: string;
  name: string;
  vertical: string | null;
  productCount: number | null;
};

export type ProductCatalogsResult = { catalogs: ProductCatalog[]; workspaceId: string };

export type CatalogProduct = {
  id: string;
  /** Your own key for the product. */
  retailerId: string;
  name: string;
  description: string | null;
  availability: string | null;
  condition: string | null;
  /** Minor units of `currency`. */
  priceMinor: number | null;
  currency: string | null;
  imageUrl: string | null;
  url: string | null;
};

export type CatalogProductsPage = { products: CatalogProduct[]; nextCursor: string | null };

export type CatalogProductWrite =
  | {
      op: 'upsert';
      retailerId: string;
      name: string;
      description?: string;
      url: string;
      imageUrl: string;
      /** Minor units of `currency`. */
      priceMinor: number;
      currency: string;
      availability?:
        'in stock' | 'out of stock' | 'preorder' | 'available for order' | 'discontinued';
      condition?: 'new' | 'refurbished' | 'used';
      brand?: string;
    }
  | { op: 'delete'; retailerId: string };

export type CatalogBatchResult = { handles: string[]; accepted: number };

export type CreateCatalogInput = {
  workspaceId: string;
  connectionId: string;
  name: string;
  /** The network's catalog vertical; `commerce` when omitted. */
  vertical?: string;
};

export type ProductFeed = {
  id: string;
  name: string;
  url: string | null;
  schedule: string | null;
  createdAt: string | null;
};

export type CreateProductFeedInput = {
  workspaceId: string;
  connectionId: string;
  name: string;
  /** Where the network fetches the file; omit for manual uploads. */
  url?: string;
  schedule?: 'HOURLY' | 'DAILY' | 'WEEKLY';
};

export type ProductFeedUpload = {
  id: string;
  startedAt: string | null;
  endedAt: string | null;
  status: string | null;
  errorCount: number | null;
  warningCount: number | null;
};

export type ProductSet = {
  id: string;
  name: string;
  productCount: number | null;
  /** The network's own product-set filter. */
  filter: Record<string, unknown> | null;
};

export type ProductSetInput = {
  workspaceId: string;
  connectionId: string;
  name: string;
  filter?: Record<string, unknown>;
};

// ─── Reach and frequency ───────────────────────────────────────────

export type ReachFrequencyPrediction = {
  id: string;
  name: string | null;
  status: string | null;
  reach: number | null;
  impressions: number | null;
  frequencyCap: number | null;
  /** Account currency, minor units. */
  budgetMinor: number | null;
  startAt: string | null;
  endAt: string | null;
  /** True once the prediction holds inventory. */
  reserved: boolean;
};

export type ReachFrequencyResult = {
  predictions: ReachFrequencyPrediction[];
  workspaceId: string;
};

export type CreateReachFrequencyInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
  name: string;
  targeting: AdTargeting;
  placements: string[];
  budgetMinor: number;
  startAt: string;
  endAt: string;
  /** How often one person should see the ad over the flight. */
  frequencyCap?: number;
};

export type ReachFrequencyActionInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
};

// ─── Ad Library ────────────────────────────────────────────────────

/** One public archive entry. Read live on every search and stored nowhere. */
export type AdLibraryEntry = {
  id: string;
  pageId: string | null;
  pageName: string | null;
  bodies: string[];
  titles: string[];
  linkUrls: string[];
  snapshotUrl: string | null;
  publisherPlatforms: string[];
  startedAt: string | null;
  endedAt: string | null;
  /** Only on the archive's disclosure entries. */
  currency: string | null;
  spendLower: number | null;
  spendUpper: number | null;
  impressionsLower: number | null;
  impressionsUpper: number | null;
};

export type AdLibraryPage = { entries: AdLibraryEntry[]; nextCursor: string | null };

export type AdLibraryParams = {
  workspaceId?: string;
  connectionId: string;
  /** ISO 3166-1 alpha-2 codes the ad reached; at least one is required. */
  countries: string[];
  /** Keyword or Page name; required unless `pageIds` is set. */
  q?: string;
  pageIds?: string[];
  activeStatus?: 'ACTIVE' | 'INACTIVE' | 'ALL';
  limit?: number;
  after?: string;
};

// ─── Partnership ads ───────────────────────────────────────────────

/** A creator who allowlisted this advertiser for partnership ads. */
export type PartnershipCreator = {
  id: string;
  username: string | null;
  name: string | null;
  status: string | null;
  permissions: string[];
};

export type PartnershipInput = {
  workspaceId: string;
  connectionId: string;
  pageId: string;
  /** The creator's account id. */
  creatorId: string;
};

// ─── Ad account settings ───────────────────────────────────────────

export type AdActivity = {
  id: string;
  eventType: string | null;
  actorName: string | null;
  objectName: string | null;
  objectType: string | null;
  extraData: string | null;
  createdAt: string | null;
};

export type AdActivityResult = { activity: AdActivity[]; workspaceId: string };

export type AdLabel = { id: string; name: string; createdAt: string | null };

export type AdLabelInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
  name: string;
};

export type ApplyAdLabelInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
  objectId: string;
  level: AdObjectLevel;
};

export type AdStudy = {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  status: string | null;
  startAt: string | null;
  endAt: string | null;
};

export type CreateAdStudyInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
  name: string;
  description?: string;
  startAt: string;
  endAt: string;
  /** Two to five cells; traffic splits evenly across them. */
  cells: Array<{ name: string; objectIds: string[] }>;
};

export type IosCampaignLimits = { limit: number | null; used: number | null; appId: string | null };

export type HighDemandPeriod = {
  id: string;
  startAt: string | null;
  endAt: string | null;
  budgetValue: number | null;
  budgetValueType: string | null;
};

export type CreateHighDemandPeriodInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
  startAt: string;
  endAt: string;
  budgetValue: number;
  budgetValueType: 'ABSOLUTE' | 'MULTIPLIER';
};

export type ValueRuleSet = {
  id: string;
  name: string;
  status: string | null;
  rules: Array<{ condition: string | null; multiplier: number | null }>;
};

export type CreateValueRuleSetInput = {
  workspaceId: string;
  connectionId: string;
  /** `act_…` */
  adAccountId: string;
  name: string;
  rules: Array<{ condition: string; multiplier: number }>;
};

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

// ─── Knowledge base ────────────────────────────────────────────────
//
// What a workspace has told FoPost about itself, used to ground a drafted
// reply in its own answers rather than an invented one.

export type KnowledgeSourceKind = 'faq' | 'text' | 'url' | 'file';
export type KnowledgeSourceStatus = 'pending' | 'syncing' | 'ready' | 'failed';

export type KnowledgeSource = {
  /** Public knowledge source id (uuid). */
  id: string;
  kind: KnowledgeSourceKind;
  title: string;
  /** Only a `ready` source is searched. */
  status: KnowledgeSourceStatus;
  /** Why the last sync failed, in plain words. */
  statusMessage: string | null;
  /** Set for `url` sources. */
  url: string | null;
  /** Set for `file` sources: the media library item read. */
  mediaId: string | null;
  /** Null means the source serves the whole workspace. */
  brandVoiceId: string | null;
  /** Searchable passages the last sync produced. */
  chunkCount: number;
  /** The typed text, for `faq` and `text` sources only. */
  content: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/** One retrieved passage, with the source it came from so a reply can cite it. */
export type KnowledgeMatch = {
  sourceId: string;
  sourceTitle: string;
  sourceKind: KnowledgeSourceKind;
  sourceUrl: string | null;
  text: string;
  /** Similarity to the question, 0-1. */
  score: number;
};

export type CreateKnowledgeSourceInput = {
  kind: KnowledgeSourceKind;
  title: string;
  /** Required for `faq` and `text`. */
  content?: string;
  /** Required for `url`. */
  url?: string;
  /** Required for `file`: a plain-text or CSV media library item. */
  mediaId?: string;
  brandVoiceId?: string | null;
  workspaceId?: string;
};

export type UpdateKnowledgeSourceInput = {
  title?: string;
  content?: string;
  url?: string;
  brandVoiceId?: string | null;
};

export type SearchKnowledgeParams = {
  /** The question, in plain words. */
  q: string;
  /** How many passages, default 5, max 20. */
  topK?: number;
  brandVoiceId?: string;
  workspaceId?: string;
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
  /**
   * An opaque, stable handle for the thread, not the id or handle the inbox
   * groups on. It lines the same conversation up between two calls; to reach
   * the thread itself, read the person through `contacts.conversations()`,
   * which needs the `inbox` scope rather than `analytics`.
   */
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

// ─── Broadcasts and sequences ──────────────────────────────────────

/**
 * Who a broadcast or an enrollment resolves to, expressed over contacts.
 * Every clause narrows: a contact has to match all of them.
 */
export type AudienceFilter = {
  /** Contacts with a handle on at least one of these networks. */
  platforms?: string[];
  labelIds?: string[];
  source?: ContactSource;
  fields?: Array<{
    key: string;
    op?: 'is' | 'is_not' | 'contains' | 'is_set' | 'is_not_set';
    value?: string;
  }>;
};

export type BroadcastStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';

export type BroadcastCounts = {
  total: number;
  sent: number;
  skipped: number;
  failed: number;
  pending: number;
};

export type Broadcast = {
  id: string;
  name: string;
  text: string;
  account_id: string | null;
  audience: Record<string, unknown>;
  status: BroadcastStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  counts?: BroadcastCounts;
  /** Only on a listing that spans workspaces. */
  workspace_id?: string;
};

export type BroadcastPage = {
  data: Broadcast[];
  pagination: { page: number; per_page: number; total: number };
};

export type RecipientStatus = 'pending' | 'sent' | 'skipped' | 'failed';

/**
 * Why nothing was sent. `window_closed` means the network's messaging window
 * had shut — Messenger and Instagram take a business-initiated message only
 * within 24 hours of the contact's last one, so nothing was attempted.
 */
export type SkipReason = 'window_closed' | 'no_conversation' | 'unsupported_platform';

export type BroadcastRecipient = {
  contact_id: string;
  display_name: string | null;
  status: RecipientStatus;
  skip_reason: SkipReason | null;
  sent_at: string | null;
  error: string | null;
};

export type BroadcastRecipientPage = {
  data: BroadcastRecipient[];
  pagination: { page: number; per_page: number; total: number };
};

export type ListBroadcastsParams = {
  workspaceId?: string;
  status?: BroadcastStatus;
  page?: number;
  perPage?: number;
};

export type CreateBroadcastInput = {
  workspaceId: string;
  /** The connected account the messages go out from. */
  accountId: string;
  /** Internal only; never sent to anyone. */
  name: string;
  text: string;
  mediaId?: string | null;
  /** Omitted means every contact in the workspace. */
  audience?: AudienceFilter;
  /** Send it at this time instead of on demand. */
  scheduledAt?: string | null;
};

export type UpdateBroadcastInput = {
  name?: string;
  text?: string;
  mediaId?: string | null;
  audience?: AudienceFilter;
  scheduledAt?: string | null;
};

export type ListRecipientsParams = {
  status?: RecipientStatus;
  page?: number;
  perPage?: number;
};

export type SequenceStatus = 'active' | 'paused';

/** One message and how long after the previous step it goes out. */
export type SequenceStep = {
  delay_hours: number;
  text: string;
  media_id?: string | null;
};

export type Sequence = {
  id: string;
  name: string;
  account_id: string | null;
  steps: SequenceStep[];
  status: SequenceStatus;
  created_at: string;
  enrollments?: {
    total: number;
    active: number;
    completed: number;
    stopped: number;
    failed: number;
  };
  /** Only on a listing that spans workspaces. */
  workspace_id?: string;
};

export type SequencePage = {
  data: Sequence[];
  pagination: { page: number; per_page: number; total: number };
};

export type CreateSequenceInput = {
  workspaceId: string;
  accountId: string;
  name: string;
  steps: SequenceStep[];
  status?: SequenceStatus;
};

export type UpdateSequenceInput = {
  name?: string;
  steps?: SequenceStep[];
  status?: SequenceStatus;
};

/** Name contacts outright, or the audience they are drawn from. */
export type EnrollInput = {
  contactIds?: string[];
  audience?: AudienceFilter;
};

export type EnrollmentStatus = 'active' | 'completed' | 'stopped' | 'failed';

export type Enrollment = {
  id: string;
  contact_id: string;
  display_name: string | null;
  /** Steps already sent, so also the index of the next one. */
  step: number;
  next_at: string | null;
  status: EnrollmentStatus;
  last_sent_at: string | null;
  /** On a skipped step, the reason: `window_closed` or `no_conversation`. */
  error: string | null;
};

export type EnrollmentPage = {
  data: Enrollment[];
  pagination: { page: number; per_page: number; total: number };
};

export type ListPageParams = {
  page?: number;
  perPage?: number;
};

// ─── Activity ──────────────────────────────────────────────────────

/** `security` is the audit log: it is append-only and never expires. */
export type ActivityKind =
  'publish' | 'connection' | 'webhook' | 'inbox' | 'automation' | 'billing' | 'security';

export type ActivityEvent = {
  id: string;
  workspaceId: string | null;
  kind: ActivityKind;
  refType: string | null;
  refId: string | null;
  summary: string;
  actor: { type: 'user' | 'api_key' | 'agent' | 'system'; name: string | null };
  time: string;
};

export type ListActivityParams = {
  workspaceId?: string;
  kind?: ActivityKind;
  /** ISO 8601. Only events at or after this time. */
  from?: string;
  /** ISO 8601. Only events at or before this time. */
  to?: string;
  /** `meta.nextCursor` from the previous page. */
  cursor?: string;
  limit?: number;
};

export type ActivityPage = {
  data: ActivityEvent[];
  meta: { nextCursor: string | null };
};

// ─── Google Business Profile ───────────────────────────────────────

/**
 * Business Profile responses relay Google's own shape, field for field, so a
 * field you know from the Business Profile APIs is the field you get back.
 */
export type GoogleBusinessPayload = Record<string, unknown>;

export type GoogleBusinessHoursPeriod = {
  openDay: GoogleBusinessDay;
  openTime: string;
  closeDay: GoogleBusinessDay;
  closeTime: string;
};

export type GoogleBusinessDay =
  'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

/** Omitted fields are left alone; null clears one. */
export type UpdateGoogleBusinessLocationInput = {
  title?: string;
  description?: string | null;
  websiteUri?: string | null;
  primaryPhone?: string | null;
  additionalPhones?: string[];
  storeCode?: string | null;
  regularHours?: GoogleBusinessHoursPeriod[];
};

export type GoogleBusinessAttributeInput = {
  name: string;
  values?: Array<string | number | boolean>;
  uriValues?: string[];
};

export type GoogleBusinessAttributesParams = {
  /** List what Google offers for the location's category instead of what is set. */
  available?: boolean;
  categoryName?: string;
  regionCode?: string;
  languageCode?: string;
};

export type GoogleBusinessMediaCategory =
  | 'COVER'
  | 'PROFILE'
  | 'LOGO'
  | 'EXTERIOR'
  | 'INTERIOR'
  | 'PRODUCT'
  | 'AT_WORK'
  | 'FOOD_AND_DRINK'
  | 'MENU'
  | 'COMMON_AREA'
  | 'ROOMS'
  | 'TEAMS'
  | 'ADDITIONAL';

/** The photo comes from the media library; JPEG and PNG only. */
export type AddGoogleBusinessMediaInput = {
  mediaId: string;
  category?: GoogleBusinessMediaCategory;
  description?: string;
};

export type GoogleBusinessPlaceActionType =
  | 'APPOINTMENT'
  | 'ONLINE_APPOINTMENT'
  | 'DINING_RESERVATION'
  | 'FOOD_ORDERING'
  | 'FOOD_DELIVERY'
  | 'FOOD_TAKEOUT'
  | 'SHOP_ONLINE';

export type CreateGoogleBusinessPlaceActionInput = {
  uri: string;
  placeActionType: GoogleBusinessPlaceActionType;
  isPreferred?: boolean;
};

export type UpdateGoogleBusinessPlaceActionInput = {
  uri?: string;
  isPreferred?: boolean;
};

export type GoogleBusinessVerificationMethod =
  'ADDRESS' | 'EMAIL' | 'PHONE_CALL' | 'SMS' | 'AUTO' | 'VETTED_PARTNER';

export type StartGoogleBusinessVerificationInput = {
  method: GoogleBusinessVerificationMethod;
  languageCode?: string;
  phoneNumber?: string;
  emailAddress?: string;
  mailerContactName?: string;
};

export type GoogleBusinessDailyMetric =
  | 'BUSINESS_IMPRESSIONS_DESKTOP_MAPS'
  | 'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH'
  | 'BUSINESS_IMPRESSIONS_MOBILE_MAPS'
  | 'BUSINESS_IMPRESSIONS_MOBILE_SEARCH'
  | 'BUSINESS_CONVERSATIONS'
  | 'BUSINESS_DIRECTION_REQUESTS'
  | 'CALL_CLICKS'
  | 'WEBSITE_CLICKS'
  | 'BUSINESS_BOOKINGS'
  | 'BUSINESS_FOOD_ORDERS'
  | 'BUSINESS_FOOD_MENU_CLICKS';

export type GoogleBusinessPerformanceParams = {
  /** ISO dates, `2026-09-01`. */
  startDate: string;
  endDate: string;
  /** Defaults to the common set of impressions, calls, directions and clicks. */
  dailyMetrics?: GoogleBusinessDailyMetric[];
};

export type GoogleBusinessSearchKeywordsParams = {
  startDate: string;
  endDate: string;
  pageToken?: string;
};

// ─── Ads: Google only ──────────────────────────────────────────────

/**
 * Every Google Ads call names the connection and the Google Ads customer.
 * `customerId` is digits only, and has to be an account the connection's
 * grant reaches: any other answers 404.
 */
export type GoogleAdsScope = {
  workspaceId?: string;
  connectionId: string;
  customerId: string;
};

/** A write also names the workspace, which a read may leave out. */
export type GoogleAdsWriteScope = GoogleAdsScope & { workspaceId: string };

export type GoogleMatchType = 'EXACT' | 'PHRASE' | 'BROAD';

export type GoogleKeyword = {
  /** `<customerId>~keyword~<adGroupId>~<criterionId>` */
  id: string;
  adGroupId: string;
  text: string;
  matchType: string;
  status: string;
  /** Account currency, minor units. */
  cpcBidMinor: number | null;
  negative: boolean;
};

export type CreateGoogleKeywordInput = GoogleAdsWriteScope & {
  adGroupId: string;
  text: string;
  matchType: GoogleMatchType;
  cpcBidMinor?: number;
};

export type UpdateGoogleKeywordInput = GoogleAdsWriteScope & {
  status?: 'active' | 'paused';
  cpcBidMinor?: number;
};

export type GoogleKeywordIdea = {
  text: string;
  avgMonthlySearches: number;
  competition: string | null;
  lowTopOfPageBidMinor: number | null;
  highTopOfPageBidMinor: number | null;
};

export type GoogleKeywordIdeasInput = GoogleAdsWriteScope & {
  seeds?: string[];
  url?: string;
  languageId?: string;
  geoTargetIds?: string[];
};

export type GoogleKeywordMetricsInput = GoogleAdsWriteScope & { keywords: string[] };

export type GoogleSearchTerm = {
  term: string;
  adGroupId: string | null;
  status: string | null;
  metrics: InsightsMetrics;
};

export type GoogleBidStrategy = {
  id: string;
  name: string;
  type: string;
  status: string;
  campaignCount: number;
};

export type CreateGoogleBidStrategyInput = GoogleAdsWriteScope & {
  name: string;
  type:
    | 'TARGET_SPEND'
    | 'MAXIMIZE_CONVERSIONS'
    | 'MAXIMIZE_CONVERSION_VALUE'
    | 'TARGET_CPA'
    | 'TARGET_ROAS';
  /** Account currency, minor units, where the strategy takes a target. */
  targetMinor?: number;
};

export type GoogleDayOfWeek =
  'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type GoogleAdScheduleSlot = {
  id: string;
  dayOfWeek: string;
  startHour: number;
  endHour: number;
  bidModifier: number | null;
};

export type SetGoogleAdScheduleInput = GoogleAdsWriteScope & {
  campaignId: string;
  /** Replaces every slot on the campaign: Google has no partial edit for a schedule. */
  slots: Array<{
    dayOfWeek: GoogleDayOfWeek;
    startHour: number;
    endHour: number;
    bidModifier?: number;
  }>;
};

export type GoogleSharedSet = {
  id: string;
  name: string;
  type: string;
  memberCount: number;
};

export type CreateGoogleNegativeKeywordListInput = GoogleAdsWriteScope & { name: string };

export type AddGoogleNegativeKeywordsInput = GoogleAdsWriteScope & {
  sharedSetId: string;
  keywords: Array<{ text: string; matchType: GoogleMatchType }>;
};

export type AttachGoogleNegativeKeywordListInput = GoogleAdsWriteScope & {
  sharedSetId: string;
  campaignId: string;
};

export type GoogleAsset = {
  id: string;
  name: string | null;
  type: string;
  /** What a sitelink, callout or snippet renders. */
  text: string | null;
  finalUrl: string | null;
};

/** Where an asset is attached; an asset with no links is in the library only. */
export type GoogleAssetLink = {
  id: string;
  assetId: string;
  level: 'customer' | 'campaign';
  ownerId: string | null;
  fieldType: string;
  status: string;
};

export type GoogleAssetsResult = { assets: GoogleAsset[]; links: GoogleAssetLink[] };

export type GoogleAssetSpec =
  | {
      kind: 'sitelink';
      text: string;
      description1?: string;
      description2?: string;
      finalUrl: string;
    }
  | { kind: 'callout'; text: string }
  | { kind: 'snippet'; header: string; values: string[] };

export type CreateGoogleAssetInput = GoogleAdsWriteScope & { spec: GoogleAssetSpec };

export type AttachGoogleAssetInput = GoogleAdsWriteScope & {
  assetId: string;
  fieldType: 'SITELINK' | 'CALLOUT' | 'STRUCTURED_SNIPPET';
  /** Attaches to the account when left out. */
  campaignId?: string;
};

export type GoogleAssetGroup = {
  id: string;
  campaignId: string;
  name: string;
  status: string;
  finalUrls: string[];
};

export type CreateGoogleAssetGroupInput = GoogleAdsWriteScope & {
  campaignId: string;
  name: string;
  finalUrls: string[];
  status?: 'active' | 'paused';
};

export type UpdateGoogleAssetGroupInput = GoogleAdsWriteScope & {
  name?: string;
  status?: 'active' | 'paused';
};

export type GoogleLocalServicesLead = {
  id: string;
  category: string | null;
  service: string | null;
  contactName: string | null;
  phone: string | null;
  email: string | null;
  status: string | null;
  type: string | null;
  createdAt: string | null;
};

export type GoogleConversionAction = {
  id: string;
  name: string;
  category: string;
  status: string;
  type: string;
  countingType: string | null;
  valueMinor: number | null;
};

export type CreateGoogleConversionActionInput = GoogleAdsWriteScope & {
  name: string;
  category:
    | 'DEFAULT'
    | 'PURCHASE'
    | 'SIGNUP'
    | 'LEAD'
    | 'PAGE_VIEW'
    | 'SUBMIT_LEAD_FORM'
    | 'BOOK_APPOINTMENT'
    | 'REQUEST_QUOTE';
  valueMinor?: number;
  countingType?: 'ONE_PER_CLICK' | 'MANY_PER_CLICK';
};

export type GoogleClickConversion = {
  /** One of these three is required: they are what matches the click. */
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  conversionActionId: string;
  /** `yyyy-MM-dd HH:mm:ss+|-HH:mm`, the only shape Google accepts. */
  conversionDateTime: string;
  valueMinor?: number;
  currencyCode?: string;
  orderId?: string;
};

export type UploadGoogleConversionsInput = GoogleAdsWriteScope & {
  conversions: GoogleClickConversion[];
};

export type GoogleConversionAdjustment = {
  conversionActionId: string;
  adjustmentType: 'RESTATEMENT' | 'RETRACTION' | 'ENHANCEMENT';
  adjustmentDateTime: string;
  orderId?: string;
  gclid?: string;
  conversionDateTime?: string;
  restatementValueMinor?: number;
  currencyCode?: string;
};

export type UploadGoogleConversionAdjustmentsInput = GoogleAdsWriteScope & {
  adjustments: GoogleConversionAdjustment[];
};

export type GoogleQueryInput = GoogleAdsScope & {
  /** A read-only GAQL SELECT. The account read is `customerId`, never the query text. */
  query: string;
};

/** Rows exactly as Google returns them. */
export type GoogleQueryResult = { rows: Array<Record<string, unknown>> };

/** A date range in the account's time zone, `YYYY-MM-DD` and inclusive. */
export type GoogleDateRange = { since: string; until: string };
/** How to render a per-network metric value. */
export type PlatformMetricKind = 'count' | 'duration_ms' | 'currency_usd' | 'ratio' | 'series';

export type PlatformMetricRow = {
  /** The platform's own metric name. Stable — read this, not `label`. */
  key: string;
  /** Ours, and subject to rewording. */
  label: string;
  kind: PlatformMetricKind;
  /** A number for every kind but `series`, which is an array of points. */
  value: unknown;
};

/** What only this network reports, in its own vocabulary. */
export type AccountPlatformMetrics = {
  platform: Platform;
  account: {
    /** When the numbers were collected; null when the account has no snapshot yet. */
    fetchedAt: string | null;
    metrics: PlatformMetricRow[];
  };
  post: {
    externalPostId: string | null;
    fetchedAt: string | null;
    metrics: PlatformMetricRow[];
  };
};
