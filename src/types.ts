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
  | 'snapchat'
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
  /** True when the account was connected before a permission it now needs was asked for. */
  reconnectRequired?: boolean;
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

// ─── Blogs, articles and products on a connected site ──────────────
//
// Content the connected site already owns, addressed by the platform's own id
// rather than a FoPost id. WordPress and Shopify answer these; products are
// Shopify only.

export type RemoteArticleStatus = 'published' | 'draft' | 'pending' | 'scheduled';

export type RemoteProductStatus = 'active' | 'draft' | 'archived';

export type RemoteBlog = {
  /** The blog id on the platform. WordPress reports its one blog as `default`. */
  id: string;
  title: string;
  handle: string | null;
  url: string | null;
};

export type RemoteArticle = {
  /** The article id on the platform. */
  id: string;
  blog_id: string | null;
  title: string;
  body_html: string | null;
  excerpt: string | null;
  status: RemoteArticleStatus;
  author_name: string | null;
  tags: string[];
  image_url: string | null;
  url: string | null;
  published_at: string | null;
  updated_at: string | null;
};

export type RemoteProduct = {
  /** The product id on the platform. */
  id: string;
  title: string;
  handle: string | null;
  status: RemoteProductStatus;
  description: string | null;
  vendor: string | null;
  product_type: string | null;
  tags: string[];
  image_url: string | null;
  url: string | null;
  /** Lowest variant price, as a decimal string. */
  price: string | null;
  currency: string | null;
  updated_at: string | null;
};

export type ListRemoteArticlesParams = {
  /** 1 to 50; defaults to 20. */
  limit?: number;
  status?: RemoteArticleStatus;
  /** Match the article title. */
  q?: string;
};

export type CreateRemoteArticleInput = {
  title: string;
  /** FoPost body markup; the platform's own format is rendered from it. */
  body: string;
  excerpt?: string;
  status?: RemoteArticleStatus;
  tags?: string[];
  authorName?: string;
  imageUrl?: string;
};

/** Every field optional, at least one required. Omitted fields keep their value. */
export type UpdateRemoteArticleInput = Partial<CreateRemoteArticleInput>;

export type ListRemoteProductsParams = {
  limit?: number;
  status?: RemoteProductStatus;
  q?: string;
};

export type UpdateRemoteProductInput = {
  title?: string;
  description?: string;
  status?: RemoteProductStatus;
  tags?: string[];
  productType?: string;
  vendor?: string;
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

// ─── Reddit ────────────────────────────────────────────────────────

/** A subreddit the account is in, or its own profile page. */
export type RedditSubreddit = {
  /** Subreddit name, without the `r/` prefix. */
  name: string;
  title: string | null;
  subscribers: number | null;
  over18: boolean;
  /** False where the account may read but not submit. */
  canPost: boolean;
  /** Whether the subreddit offers post flairs at all. */
  flairEnabled: boolean;
  iconUrl: string | null;
  /** Where posts go when a post names no subreddit. */
  isDefault: boolean;
};

export type RedditSubredditRule = {
  name: string;
  description: string | null;
  /** What the rule covers: `link`, `comment` or `all`. */
  appliesTo: string;
};

export type RedditSubredditRules = {
  subreddit: string;
  rules: RedditSubredditRule[];
};

/** A post flair, valid only in the subreddit it came from. */
export type RedditFlair = {
  id: string;
  text: string;
  /** Whether `flair_text` may replace the label. */
  editable: boolean;
};

export type RedditFlairs = {
  subreddit: string;
  flairs: RedditFlair[];
};

export type RedditDefaultSubreddit = {
  /** Null means the account's own profile page. */
  subreddit: string | null;
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
  content?: ContentBlock[];
  createdAt: string;
  updatedAt: string;
};

/** A file to attach to a post: a Blob/File, or raw bytes with a name and MIME type. */
export type PostFileInput = Blob | { data: Blob | Uint8Array; filename: string; mimeType: string };

export type CreatePostInput = {
  workspaceId: string;
  /** To publish immediately, create the post then call posts.publish(id). */
  status?: 'draft' | 'scheduled';
  content: ContentBlock[];
  /** Required when status is 'scheduled'. ISO 8601. */
  scheduleAt?: string;
  /** `'queue'` takes the next free posting-queue slot instead of `scheduleAt`. */
  schedule?: 'queue';
  /** Account ids. Objects of the form { id } are accepted too. Optional when accountGroupId is set. */
  accounts?: Array<string | { id: string }>;
  /** Posts to every account in the group, merged with accounts; each account once. */
  accountGroupId?: string;
  labels?: string[];
  /** Article title / email subject on platforms that take one (Hashnode, WordPress, ...) */
  title?: string;
  /**
   * Up to 5 files, stored in the workspace library and attached to the first content
   * block. Small files travel with the request; larger ones go through direct upload.
   */
  files?: PostFileInput[];
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
  /** Reposted to the account's own timeline (X). */
  reposted: boolean;
  /** Bookmarked on the account (X). */
  bookmarked: boolean;
  /** How the account voted where the network ranks by votes. */
  vote: RedditVoteDirection | null;
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
  /** The network has a repost (X). */
  canRepost: boolean;
  /** The network has bookmarks (X). */
  canBookmark: boolean;
  /** The network ranks by votes, so a down vote exists. */
  canVote: boolean;
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

// ─── Analytics ─────────────────────────────────────────────────────

export type DecayBucket =
  'under_1h' | '1h_3h' | '3h_6h' | '6h_12h' | '12h_24h' | '1d_3d' | '3d_7d' | 'over_7d';

export type DecayBand = {
  bucket: DecayBucket;
  label: string;
  /** Posts with at least one reading in this band. */
  posts: number;
  avgEngagements: number;
  avgImpressions: number;
  /** Mean share of the post's final engagement reached by this age, 0-1. */
  shareOfFinal: number | null;
};

export type ContentDecay = {
  days: number;
  postsMeasured: number;
  /** First band where the average post had passed half its final engagement. */
  halfLifeBucket: DecayBucket | null;
  bands: DecayBand[];
};

export type FrequencyBandKey = 'under_3' | '3_5' | '6_10' | 'over_10';

export type FrequencyWeek = {
  /** Monday of the week, UTC, as YYYY-MM-DD. */
  weekStart: string;
  posts: number;
  engagements: number;
  avgEngagementsPerPost: number;
};

export type FrequencyBand = {
  band: FrequencyBandKey;
  label: string;
  weeks: number;
  posts: number;
  avgPostsPerWeek: number;
  avgEngagementsPerPost: number;
  /** Engagements over reach, impressions as the stand-in; null with neither. */
  engagementRate: number | null;
};

export type PostingFrequency = {
  days: number;
  weeks: FrequencyWeek[];
  bands: FrequencyBand[];
  best: { band: FrequencyBandKey; label: string; avgEngagementsPerPost: number } | null;
};

export type PostTimelinePoint = {
  at: string;
  /** Minutes since publication; null when the network never said when. */
  ageMinutes: number | null;
  impressions: number | null;
  reach: number | null;
  engagements: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  videoViews: number | null;
  /** Movement since the previous point. */
  delta: {
    impressions: number;
    reach: number;
    engagements: number;
    likes: number;
    comments: number;
    shares: number;
  };
};

export type PostTimeline = {
  /** Null when the post was made natively on the network. */
  postId: string | null;
  deliveries: Array<{
    accountId: string;
    platform: string;
    username: string;
    externalPostId: string;
    postedAt: string | null;
    points: PostTimelinePoint[];
  }>;
};

export type MetricChange = {
  accountId: string;
  platform: string;
  externalPostId: string;
  /** Null for a post made natively on the network. */
  postId: string | null;
  postedAt: string | null;
  fetchedAt: string;
  impressions: number | null;
  reach: number | null;
  engagements: number | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
};

export type MetricChangePage = {
  since: string;
  /** Feed back as `since` to continue; null when nothing changed. */
  cursor: string | null;
  hasMore: boolean;
  changes: MetricChange[];
};

export type CollectPostResult = {
  collected: number;
  deliveries: Array<{
    accountId: string;
    platform: string;
    externalPostId: string;
    collected: boolean;
    fetchedAt: string | null;
    /** Why the refresh did not happen. */
    message: string | null;
  }>;
};

export type NativePost = {
  externalPostId: string;
  text: string | null;
  permalink: string | null;
  thumbnailUrl: string | null;
  mediaType: string | null;
  postedAt: string | null;
  fetchedAt: string;
  metrics: {
    impressions: number | null;
    reach: number | null;
    engagements: number | null;
    likes: number | null;
    comments: number | null;
    shares: number | null;
    videoViews: number | null;
  };
};

export type AnalyticsScopeParams = {
  workspaceId?: string;
  accountId?: string;
};

export type ContentDecayParams = AnalyticsScopeParams & {
  /** Only posts published in the last this many days. Default 30, max 365. */
  days?: number;
};

export type PostingFrequencyParams = AnalyticsScopeParams & {
  /** Default 90, minimum 7, max 365. */
  days?: number;
};

export type MetricChangesParams = AnalyticsScopeParams & {
  /** ISO 8601. Omit for the last seven days. */
  since?: string;
  limit?: number;
};

export type NativePostsParams = {
  page?: number;
  perPage?: number;
  /** Only posts published in the last this many days. */
  days?: number;
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
  /**
   * Facets the network defines for itself, keyed by the `TargetingSearchType`
   * they were found with. `ads.providers()` says which a network accepts.
   */
  facets?: Record<string, AdTargetingItem[]>;
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
  | 'country'
  | 'region'
  | 'city'
  | 'zip'
  | 'metro'
  | 'interest'
  | 'behavior'
  | 'income'
  // B2B facets: a network that sells to companies rather than households.
  | 'company'
  | 'company_size'
  | 'company_category'
  | 'industry'
  | 'job_title'
  | 'job_function'
  | 'seniority'
  | 'years_of_experience'
  | 'skill'
  | 'degree'
  | 'field_of_study'
  | 'member_group';

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
  /** Up to 125 characters. Ignored when `sparkPostId` is set. */
  text: string;
  /**
   * A post already live on the network, from `ads.sparkPosts()`. Runs it as a
   * Spark ad, so `text`, `headline` and `mediaUrl` are ignored. Needs the
   * network's `sparkAds` capability.
   */
  sparkPostId?: string;
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
    | { subtype: 'WEBSITE'; pixelId: string; retentionDays?: number; urlContains?: string }
    | { subtype: 'COMPANY_LIST'; companies?: AdCompany[] }
    | {
        subtype: 'ENGAGEMENT';
        source: 'page' | 'ad' | 'lead_form' | 'video';
        sourceId: string;
        retentionDays?: number;
      };
};

/** One row of a company-list upload. It travels with the request and is never stored. */
export type AdCompany = {
  name?: string;
  domain?: string;
  /** The company's page on the network. */
  pageUrl?: string;
  /** Stock ticker, where the network matches on one. */
  ticker?: string;
  country?: string;
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

export type AuthorizeAdsInput = {
  workspaceId: string;
  /** A login route from the network's `connectMethods`; the first one by default. */
  method?: string;
  /** Dashboard path to land on after the network redirects back. */
  returnTo?: string;
};

/** @deprecated Use `AuthorizeAdsInput`. */
export type AuthorizeMetaAdsInput = AuthorizeAdsInput;

/** An ad network from the API's registry. `configured: false` cannot be connected yet. */
export type AdProvider = {
  id: string;
  name: string;
  /** Logo slug. */
  logo: string;
  configured: boolean;
  connectMethods: string[];
  /** What the network supports: campaigns, audiences, conversions, forecasts, and so on. */
  capabilities: Record<string, boolean>;
  /** What `ads.searchTargeting` accepts on this network, in picker order. */
  targetingFacets: TargetingSearchType[];
  /** Macros the network expands inside a creative's tracking parameters. */
  trackingMacros: Array<{ token: string; description: string }>;
};

// ─── Ads: forecasts, conversions and the public ad library ─────────

export type AdForecastInput = {
  workspaceId: string;
  connectionId: string;
  adAccountId: string;
  goal: AdGoal;
  targeting: AdTargeting;
  placements?: string[];
};

export type BidPricingInput = AdForecastInput & { bidType?: 'CPC' | 'CPM' | 'CPV' };

/** What the auction costs, in minor units of the ad account currency. */
export type BidPricing = {
  currency: string;
  suggestedBidMinor: number | null;
  minBidMinor: number | null;
  maxBidMinor: number | null;
  dailyBudgetFloorMinor: number | null;
};

export type SupplyForecastInput = AdForecastInput & {
  /** Budget for the forecast window, minor units. */
  budgetMinor?: number;
};

export type SupplyForecast = {
  currency: string;
  impressions: number | null;
  clicks: number | null;
  spendMinor: number | null;
  /** Days the numbers cover. */
  windowDays: number | null;
  ready: boolean;
};

export type ConversionType =
  | 'purchase'
  | 'lead'
  | 'sign_up'
  | 'add_to_cart'
  | 'download'
  | 'install'
  | 'key_page_view'
  | 'other';

export type ConversionAttribution = 'last_touch' | 'each_campaign';

export type CreateConversionRuleInput = {
  workspaceId: string;
  connectionId: string;
  adAccountId: string;
  name: string;
  type: ConversionType;
  attribution: ConversionAttribution;
  postClickWindowDays?: number;
  viewThroughWindowDays?: number;
  /** Default value of one conversion, minor units. */
  valueMinor?: number;
  currency?: string;
};

export type UpdateConversionRuleInput = Partial<
  Omit<CreateConversionRuleInput, 'workspaceId' | 'connectionId' | 'adAccountId'>
> & { enabled?: boolean };

export type ConversionRule = {
  id: string;
  name: string;
  type: ConversionType;
  attribution: ConversionAttribution;
  postClickWindowDays: number;
  viewThroughWindowDays: number;
  valueMinor?: number;
  currency?: string;
  enabled: boolean;
  createdAt: string | null;
  /** Ad sets this rule is attached to. */
  campaignIds: string[];
};

export type ConversionMetrics = {
  conversions: number;
  postClickConversions: number;
  viewThroughConversions: number;
  valueMinor: number;
  costPerConversionMinor: number | null;
};

/** One conversion sent back to the network. The address is hashed inside the API. */
export type ConversionApiEvent = {
  /** Epoch milliseconds. */
  happenedAt: number;
  valueMinor?: number;
  currency?: string;
  /** Your own id for the event, so a replay is counted once. */
  eventId?: string;
  email?: string;
  /** The network's click id, as the landing page received it. */
  clickId?: string;
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
  /**
   * Hands targeting and creative rotation to the network. Needs the network's
   * `smartPlus` capability.
   */
  smartPlus?: boolean;
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

/** `none` takes an earlier vote back. */
export type RedditVoteDirection = 'up' | 'down' | 'none';

export type SubredditCheck = {
  subreddit: string;
  exists: boolean;
  can_post: boolean;
  over_18: boolean;
  flair_enabled: boolean;
  /** True when the subreddit exists and takes a post from this account. */
  ok: boolean;
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

export type UploadLimits = {
  /** The largest file this account may upload by any route. */
  maxFileBytes: number;
  source: 'accounts' | 'add_on' | 'bypass';
  connectedAccounts: number;
  largeUploadsEnabled: boolean;
  nextTier: { upToAccounts: number | null; maxFileBytes: number } | null;
  /** What a multipart request carries per file; larger files use direct upload. */
  multipartMaxFileBytes: number;
  maxFilesPerUpload: number;
  directUploadAvailable: boolean;
  allowedTypes: string[];
};

export type BrandRole = 'logo' | 'product' | 'person' | 'background';

export type PersonConsent = { subject: string; statement: string };

export type UploadLibraryFields = {
  folderId?: string;
  origin?: 'chat';
  brandRole?: BrandRole;
  brandVoiceId?: string;
  /** Required when brandRole is 'person'. */
  personConsent?: PersonConsent;
};

export type PresignUploadInput = UploadLibraryFields & {
  workspaceId: string;
  filename: string;
  mimeType: string;
  /** Bytes, up to the account's maxFileBytes (see media.limits). */
  size: number;
};

export type PresignedUpload = {
  uploadId: string;
  uploadUrl: string;
  method: 'PUT';
  headers: { 'Content-Type': string };
  expiresAt: string;
  maxFileBytes: number;
};

export type UploadedMedia = {
  id: string;
  type: 'image' | 'video' | 'gif' | 'document';
  name: string;
  url: string;
  previewUrl: string;
  size: number;
};

export type DirectUploadInput = UploadLibraryFields & {
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

// ─── X ─────────────────────────────────────────────────────────────

/** A post read live from X with the account's own token. */
export type XPost = {
  /** The X post id. */
  id: string;
  text: string | null;
  permalink: string | null;
  authorName: string | null;
  authorHandle: string | null;
  authorAvatarUrl: string | null;
  authorFollowers: number | null;
  /** Thread root id. */
  conversationId: string | null;
  /** The post this one replied to. */
  parentExternalId: string | null;
  likes: number | null;
  replies: number | null;
  reposts: number | null;
  quotes: number | null;
  platformCreatedAt: string | null;
};

export type XFollowResult = {
  accountId: string;
  /** The X user id that was followed or unfollowed. */
  userId: string;
  following: boolean;
};

export type XSearchParams = {
  /** The X account whose token does the read. */
  accountId: string;
  /** X search query, up to 512 characters. */
  q: string;
  /** 10 to 100, default 10. */
  maxResults?: number;
  /** Cursor from the previous page. */
  nextToken?: string;
};

export type XSearchPage = {
  data: XPost[];
  meta: { nextToken: string | null };
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

/**
 * One of Google's own recommendations for the account. `id` is the Google
 * resource name rather than the `~` form other objects use, because a
 * recommendation is not an object you address again: it is what apply and
 * dismiss take.
 */
export type GoogleRecommendation = {
  id: string;
  type: string;
  campaignId: string | null;
  adGroupId: string | null;
  dismissed: boolean;
  /** What Google projects applying it would change; null where it does not estimate. */
  impact: {
    baseClicks: number | null;
    potentialClicks: number | null;
    /** The account's currency, in minor units. */
    baseCostMinor: number | null;
    potentialCostMinor: number | null;
    baseConversions: number | null;
    potentialConversions: number | null;
  } | null;
};

export type GoogleOptimizationScore = {
  /** 0 to 1, Google's estimate of how well the account is set up. */
  score: number | null;
  /** How much this account's score counts against others under the same manager. */
  weight: number | null;
  campaigns: Array<{ id: string; name: string; score: number | null }>;
};

export type GoogleRecommendationsInput = GoogleAdsWriteScope & { ids: string[] };

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
/** A Business Center, or the network's equivalent grouping of ad accounts. */
export type AdBusinessCenter = { id: string; name: string; role: string | null };

/** The account an ad runs as. Meta calls it a Page, TikTok an identity. */
export type AdIdentity = {
  id: string;
  /** The network's own identity kind, e.g. `CUSTOMIZED_USER`. */
  type: string;
  name: string;
  avatarUrl: string | null;
};

/** A post already live on the network, offered as the source of a Spark ad. */
export type SparkPost = {
  id: string;
  identityId: string;
  caption: string | null;
  thumbnailUrl: string | null;
  createdAt: string | null;
  views: number | null;
};

export type ConversionActionSource =
  | 'website'
  | 'app'
  | 'email'
  | 'phone_call'
  | 'chat'
  | 'physical_store'
  | 'system_generated'
  | 'business_messaging'
  | 'other';

/** One conversion. Identifiers are hashed before they leave FoPost and never stored. */
export type ConversionEvent = {
  /** A standard event such as `Purchase`, or a custom one. */
  eventName: string;
  /** ISO 8601. */
  occurredAt: string;
  /** Your own id for the event, so the network deduplicates a browser and server pair. */
  eventId?: string;
  /** `website` when omitted. */
  actionSource?: ConversionActionSource;
  /** The page the event fired on. */
  sourceUrl?: string;
  email?: string;
  phone?: string;
  /** Your own user id. */
  externalId?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  /** The network's click id (`fbc`). */
  clickId?: string;
  /** The network's browser id (`fbp`). */
  browserId?: string;
  /** Account currency, minor units. */
  valueMinor?: number;
  currency?: string;
  orderId?: string;
  contentIds?: string[];
};

export type UploadConversionsInput = {
  workspaceId: string;
  connectionId: string;
  adAccountId: string;
  /** A pixel the ad account owns, from `ads.pixels()`. */
  pixelId: string;
  /** Up to 1000 per call. */
  events: ConversionEvent[];
};

export type ConversionUploadResult = {
  /** The stored batch. */
  id: string;
  /** How many events the network received. */
  accepted: number;
  eventCount: number;
  /** True when the `Idempotency-Key` had been used before and nothing was sent. */
  replayed: boolean;
};

/** A stored conversion as the API keeps it: hashes only, never the raw identifier. */
export type HashedConversionEvent = {
  eventName: string;
  occurredAt: string;
  eventId: string | null;
  actionSource: string;
  emailHash: string | null;
  phoneHash: string | null;
  externalIdHash: string | null;
  valueMinor: number | null;
  currency: string | null;
  orderId: string | null;
};

export type ConversionBatch = {
  id: string;
  workspaceId: string;
  connectionId: string;
  adAccountId: string;
  pixelId: string;
  idempotencyKey: string | null;
  eventCount: number;
  accepted: number;
  events: HashedConversionEvent[];
  createdAt: string;
};

export type ListConversionEventsParams = {
  workspaceId?: string;
  connectionId?: string;
  limit?: number;
};

/** An ad account read inside a workspace. */
export type AdAccountParams = AdObjectParams & { adAccountId: string };
/** An ad account changed inside a workspace; the API requires the workspace here. */
export type AdAccountMutationParams = AdObjectMutationParams & { adAccountId: string };

export type AdPixel = { id: string; name: string };

export type PixelDataUseSetting = 'advertising_and_analytics' | 'analytics_only';

export type AdPixelDetail = AdPixel & {
  /** The script to place on the site. */
  code: string | null;
  createdAt: string | null;
  lastFiredAt: string | null;
  isUnavailable: boolean;
  dataUseSetting: PixelDataUseSetting | null;
};

export type CreatePixelInput = AdAccountMutationParams & { name: string };

export type UpdatePixelInput = AdAccountMutationParams & {
  name?: string;
  dataUseSetting?: PixelDataUseSetting;
};

export type SharePixelInput = AdAccountMutationParams & {
  /** Another ad account under the same business portfolio. */
  targetAdAccountId: string;
};

/** Event counts over the last 28 days. */
export type AdPixelStats = {
  since: string;
  until: string;
  events: Array<{ eventName: string; count: number }>;
};

export type EventMatchQuality = {
  eventName: string;
  /** The network's match score out of 10. */
  score: number | null;
  matchKeys: Array<{ identifier: string; coveragePercent: number }>;
};

export type CustomConversionEventType =
  | 'ADD_PAYMENT_INFO'
  | 'ADD_TO_CART'
  | 'ADD_TO_WISHLIST'
  | 'COMPLETE_REGISTRATION'
  | 'CONTENT_VIEW'
  | 'INITIATED_CHECKOUT'
  | 'LEAD'
  | 'PURCHASE'
  | 'SEARCH'
  | 'CONTACT'
  | 'CUSTOMIZE_PRODUCT'
  | 'DONATE'
  | 'FIND_LOCATION'
  | 'SCHEDULE'
  | 'START_TRIAL'
  | 'SUBMIT_APPLICATION'
  | 'SUBSCRIBE'
  | 'OTHER';

/** Pick one of `urlContains` and `urlEquals`. */
export type CustomConversionRule = {
  /** The pixel event the rule reads; `PageView` when omitted on create. */
  eventName?: string;
  urlContains?: string;
  urlEquals?: string;
};

export type CustomConversion = {
  id: string;
  name: string;
  pixelId: string | null;
  eventType: string;
  rule: CustomConversionRule | null;
  description: string | null;
  defaultValueMinor: number | null;
  isArchived: boolean;
  isUnavailable: boolean;
  createdAt: string | null;
  lastFiredAt: string | null;
};

export type CreateCustomConversionInput = AdAccountMutationParams & {
  pixelId: string;
  name: string;
  eventType: CustomConversionEventType;
  rule: CustomConversionRule;
  description?: string;
  /** Default value of one conversion, account currency, minor units. */
  defaultValueMinor?: number;
};

export type UpdateCustomConversionInput = AdAccountMutationParams & {
  name?: string;
  description?: string;
  defaultValueMinor?: number;
};

/** A comment on an ad, read live from the network and never stored. */
export type AdComment = {
  id: string;
  adId: string | null;
  text: string;
  authorName: string | null;
  authorAvatarUrl: string | null;
  createdAt: string | null;
  likes: number;
  replyCount: number;
  hidden: boolean;
  /** The comment this one answers, when it is not on the ad itself. */
  parentId: string | null;
};

export type AdCommentsPage = { comments: AdComment[]; nextCursor: string | null };

// ─── Blog ──────────────────────────────────────────────────────────
// Responses are snake_case and request bodies camelCase, as the API defines them.

export type BlogArticleStatus =
  | 'queued'
  | 'writing'
  | 'draft'
  | 'in_review'
  | 'scheduled'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'rejected';

export type BlogKeywordStatus = 'suggested' | 'planned' | 'written' | 'dismissed';

export type BlogKeywordSource = 'provider' | 'user' | 'agent';

export type BlogArticleOrigin = 'plan' | 'user' | 'agent';

/** Where published articles go: your FoPost-hosted blog, a connected account, or your own site. */
export type BlogTargetKind = 'product_blog' | 'account' | 'website';

export type BlogImageTier = 'draft' | 'standard' | 'best';

/** What the blog is for; steers suggested terms and keyword ranking. */
export type BlogGoal = 'traffic' | 'leads' | 'sales' | 'signups' | 'authority';

/** The last keyword research run. */
export type BlogPlanRun = {
  status: 'queued' | 'running' | 'done' | 'failed';
  error: string | null;
  /** New keywords the run found. */
  added: number | null;
  finished_at: string | null;
};

export type BlogSettings = {
  site_url?: string | null;
  topic?: string | null;
  audience?: string | null;
  goal?: BlogGoal | null;
  /** What the blog wants to write about. */
  focus_topics?: string | null;
  /** What the blog never writes about. */
  avoid_topics?: string | null;
  language: string;
  location_code?: number;
  /** Articles planned per week; 0 turns planning off. */
  cadence_per_week: number;
  /** Days before its planned date that a picked keyword starts being written. */
  review_hold_days: number;
  image_tier?: BlogImageTier;
  in_body_images?: number;
  min_words?: number;
  max_words?: number;
  brand_voice_id?: string | null;
  target_kind?: BlogTargetKind | null;
  target_account_id?: string | null;
  target_platform?: string | null;
  website_url?: string | null;
  has_website_secret: boolean;
  /** The last keyword research run; null before the first. */
  plan_run?: BlogPlanRun | null;
  /** Whether search volume and difficulty can be fetched on this deployment; on GET only. */
  keyword_data_available?: boolean;
  updated_at?: string;
};

export type UpdateBlogSettingsInput = {
  siteUrl?: string | null;
  topic?: string | null;
  audience?: string | null;
  goal?: BlogGoal | null;
  focusTopics?: string | null;
  avoidTopics?: string | null;
  language?: string;
  locationCode?: number;
  /** 0 to 7. */
  cadencePerWeek?: number;
  /** 0 to 14. */
  reviewHoldDays?: number;
  imageTier?: BlogImageTier;
  /** 0 to 3. */
  inBodyImages?: number;
  minWords?: number;
  maxWords?: number;
  brandVoiceId?: string | null;
  targetKind?: BlogTargetKind | null;
  targetAccountId?: string | null;
  /** Where published articles are POSTed as a signed webhook; setting it issues a secret, returned once. */
  websiteUrl?: string | null;
};

/** `website_secret` is set only on the update that issued it. Store it then. */
export type BlogSettingsUpdate = BlogSettings & { website_secret?: string | null };

/** What the website answered a test delivery. A refusal throws a 502 `website_test_failed`. */
export type BlogWebsiteTest = { http_status: number };

export type BlogKeyword = {
  id: string;
  keyword: string;
  search_volume?: number | null;
  /** 0 to 100. */
  difficulty?: number | null;
  cpc?: number | null;
  intent?: string | null;
  source: BlogKeywordSource;
  status: BlogKeywordStatus;
  /** YYYY-MM-DD. */
  planned_for?: string | null;
  /** Why the keyword serves the blog goal. */
  fit_reason?: string | null;
  created_at: string;
};

export type ListBlogKeywordsParams = {
  status?: BlogKeywordStatus | BlogKeywordStatus[];
  /** Up to 500. */
  limit?: number;
};

export type PlanBlogKeywordsInput = { seeds?: string[] };

export type SuggestBlogSeedsInput = {
  /** Current terms to refine; up to 20. */
  seeds?: string[];
  /** Steers the suggestions; up to 500 characters. */
  prompt?: string;
};

export type AddBlogKeywordInput = {
  keyword: string;
  /** YYYY-MM-DD. */
  plannedFor?: string;
};

export type UpdateBlogKeywordInput = {
  status?: BlogKeywordStatus;
  plannedFor?: string | null;
};

export type BlogArticleImage = {
  media_id: string;
  url: string;
  alt: string;
  /** Index of the outline heading the image sits under; absent on the featured image. */
  position?: number;
};

export type BlogArticle = {
  id: string;
  title: string;
  slug: string;
  keyword?: string | null;
  excerpt?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  featured_image?: BlogArticleImage | null;
  tags: string[];
  word_count: number;
  status: BlogArticleStatus;
  origin: BlogArticleOrigin;
  review_until?: string | null;
  publish_at?: string | null;
  published_at?: string | null;
  published_url?: string | null;
  error?: string | null;
  created_at: string;
  updated_at: string;
};

/** The research the writer worked from. */
export type BlogArticleBrief = {
  competitors?: Array<{ title?: string; url?: string; description?: string }>;
  questions?: string[];
  search_volume?: number | null;
  difficulty?: number | null;
};

export type BlogArticleFull = BlogArticle & {
  instructions?: string | null;
  outline?: string[];
  brief?: BlogArticleBrief | null;
  body_markdown?: string;
  body_html?: string;
  images?: BlogArticleImage[];
};

export type ListBlogArticlesParams = {
  status?: BlogArticleStatus | BlogArticleStatus[];
  /** Up to 200. */
  limit?: number;
};

/** One of `title`, `keyword` or `keywordId` is required. */
export type RequestBlogArticleInput = {
  title?: string;
  keyword?: string;
  /** A keyword from the plan; its term becomes the target. */
  keywordId?: string;
  /** Up to 4000 characters. */
  instructions?: string;
};

export type UpdateBlogArticleInput = {
  title?: string;
  /** Lowercase letters, digits and hyphens. */
  slug?: string;
  excerpt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  bodyMarkdown?: string;
  tags?: string[];
  /** Puts an `in_review` article on the calendar; null returns it to review. A draft answers 409. */
  publishAt?: string | null;
};

/** An image in a webhook delivery; webhook payloads keep camelCase keys. */
export type BlogArticleWebhookImage = {
  mediaId: string;
  url: string;
  alt: string;
  position?: number;
};

/** `data` of an `article.published` or `article.test` delivery. Image URLs are fetchable for 6 hours. */
export type BlogArticleWebhookPayload = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  bodyMarkdown: string;
  bodyHtml: string;
  featuredImage: BlogArticleWebhookImage | null;
  images: BlogArticleWebhookImage[];
  tags: string[];
  keyword: string | null;
  wordCount: number;
  publishedAt: string;
};

// ─── WhatsApp Business ─────────────────────────────────────────────
//
// The platform owns these resources, so every read is live and nothing here is
// a cached copy. A template's status is whatever the platform assigned it.

export type WhatsappTemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';

export type WhatsappTemplate = {
  id: string;
  name: string;
  language: string;
  category: string;
  /** The review status the platform assigned: APPROVED, PENDING, REJECTED, … */
  status: string;
  rejectedReason: string | null;
  components: unknown[];
  qualityScore: string | null;
};

export type CreateWhatsappTemplateInput = {
  /** Lowercase letters, digits and underscores. */
  name: string;
  language: string;
  category: WhatsappTemplateCategory;
  components: Array<Record<string, unknown>>;
  allowCategoryChange?: boolean;
};

export type UpdateWhatsappTemplateInput = {
  category?: WhatsappTemplateCategory;
  components?: Array<Record<string, unknown>>;
};

export type ImportWhatsappTemplateInput = {
  libraryTemplateName: string;
  name: string;
  language: string;
  category: WhatsappTemplateCategory;
  libraryTemplateButtonInputs?: Array<Record<string, unknown>>;
};

export type WhatsappProfile = {
  about: string | null;
  address: string | null;
  description: string | null;
  email: string | null;
  vertical: string | null;
  websites: string[];
  profilePictureUrl: string | null;
  displayName: string | null;
  /** The platform's review state for the display name. */
  displayNameStatus: string | null;
  username: string | null;
  qualityRating: string | null;
  messagingLimitTier: string | null;
};

export type UpdateWhatsappProfileInput = {
  about?: string;
  address?: string;
  description?: string;
  vertical?: string;
  websites?: string[];
  /** A library media id, uploaded first. */
  profilePictureMediaId?: string;
};

export type WhatsappGroup = {
  id: string;
  subject: string;
  description: string | null;
  participantCount: number | null;
  inviteLink: string | null;
  createdAt: string | null;
};

export type WhatsappBlockResult = {
  blocked?: string[];
  unblocked?: string[];
  failed: string[];
};

export type WhatsappCommerceSettings = {
  cartEnabled: boolean | null;
  catalogVisible: boolean | null;
  catalogId: string | null;
};

export type WhatsappFlowCategory =
  | 'SIGN_UP'
  | 'SIGN_IN'
  | 'APPOINTMENT_BOOKING'
  | 'LEAD_GENERATION'
  | 'CONTACT_US'
  | 'CUSTOMER_SUPPORT'
  | 'SURVEY'
  | 'OTHER';

export type WhatsappFlow = {
  id: string;
  name: string;
  status: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED' | 'BLOCKED' | string;
  categories: string[];
  validationErrors: Array<{ error: string; message: string }>;
  endpointUri: string | null;
  jsonVersion: string | null;
  previewUrl: string | null;
  previewExpiresAt: string | null;
};

export type CreateWhatsappFlowInput = {
  name: string;
  categories: WhatsappFlowCategory[];
  /** Where the platform calls back for a flow that reads live data. */
  endpointUri?: string;
  cloneFlowId?: string;
};

export type UpdateWhatsappFlowInput = {
  name?: string;
  categories?: WhatsappFlowCategory[];
  endpointUri?: string;
};

export type WhatsappFlowJsonResult = {
  success: boolean;
  validationErrors: Array<{ error: string; message: string }>;
};

export type WhatsappFlowResponse = {
  messageId: string;
  waId: string | null;
  flowToken: string | null;
  answers: Record<string, unknown>;
  respondedAt: string | null;
};

/** Only whether a key is registered travels; the key itself never comes back. */
export type WhatsappEncryptionKeyStatus = {
  hasKey: boolean;
  signatureStatus: string | null;
};

export type WhatsappSandboxSession = {
  id: string;
  status: 'invited' | 'active' | 'expired';
  /** The last four digits only; the number itself is never stored. */
  phoneNumberLast4: string;
  invitedAt: string;
  activatedAt: string | null;
  expiresAt: string;
};

// ─── Posting queue ───────────────────────────────────────────────

export type QueueSlot = {
  id: string;
  workspace_id: string;
  /** null when the slot applies to every account. */
  account_id: string | null;
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  /** HH:MM, 24-hour, in `timezone`. */
  time: string;
  /** IANA zone name. */
  timezone: string;
  created_at: string;
};

export type CreateQueueSlotInput = {
  workspaceId: string;
  accountId?: string | null;
  weekday: number;
  time: string;
  timezone: string;
};

export type UpdateQueueSlotInput = Partial<Omit<CreateQueueSlotInput, 'workspaceId'>>;

/** A queued post moved to a new slot because of a slot change. */
export type QueueMovedPost = { id: string; from: string; to: string };

export type QueueSlotUpdate = Omit<QueueSlot, 'created_at'> & {
  created_at?: string;
  moved: QueueMovedPost[];
};

export type QueueSlotDeleted = { deleted: boolean; moved: QueueMovedPost[] };

export type QueueNextParams = { workspaceId: string; accountId?: string };

export type QueuePreviewParams = QueueNextParams & {
  /** How many upcoming slots to return. Default 5, max 20. */
  count?: number;
};

// ─── Posts: unpublish, runs, analytics, bulk import ──────────────

export type UnpublishResult = {
  post_status:
    | 'draft'
    | 'scheduled'
    | 'publishing'
    | 'published'
    | 'partially_failed'
    | 'failed'
    | 'cancelled'
    | 'unpublished';
  /** One entry per network the post was live on. */
  deliveries: Array<{
    account_id: string;
    platform: string;
    /** False when the network refused to take the post down. */
    removed: boolean;
  }>;
};

export type PublishRunDelivery = {
  account_id?: string;
  account_name?: string;
  username?: string;
  platform?: string;
  status?: string;
  attempt_number?: number;
  error_code?: string | null;
  error_message?: string | null;
  platform_post_id?: string | null;
  external_url?: string | null;
  started_at?: string;
  completed_at?: string | null;
  duration_ms?: number | null;
};

export type PublishRun = {
  id?: string;
  run_number?: number;
  status?: 'running' | 'published' | 'partially_failed' | 'failed' | 'cancelled';
  started_at?: string;
  completed_at?: string | null;
  deliveries?: PublishRunDelivery[];
};

export type PostMetricTotals = {
  impressions?: number;
  reach?: number;
  engagements?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  reposts?: number;
  clicks?: number;
  saves?: number;
  video_views?: number;
  follows?: number;
};

export type PostPlatformMetrics = {
  impressions?: number | null;
  reach?: number | null;
  engagements?: number | null;
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  reposts?: number | null;
  clicks?: number | null;
  saves?: number | null;
  video_views?: number | null;
  watch_time_ms?: number | null;
  avg_watch_time_ms?: number | null;
  reactions_breakdown?: Record<string, number> | null;
  follows?: number | null;
  fetched_at?: string;
};

export type PostAnalytics = {
  post_id: string;
  totals: PostMetricTotals;
  platforms: Array<{
    platform?: string;
    username?: string;
    external_post_id?: string | null;
    permalink?: string | null;
    thumbnail_url?: string | null;
    media_type?: string | null;
    posted_at?: string | null;
    metrics?: PostPlatformMetrics | null;
  }>;
  last_fetched_at: string | null;
};

export type BulkImportInput = {
  workspaceId: string;
  /** The CSV file. */
  file: PostFileInput;
};

export type BulkImportRow = {
  row?: number;
  content_preview?: string;
  content_type?: 'post' | 'thread';
  thread_parts?: number | null;
  schedule_at?: string | null;
  repeat?: { times: number; gap: number; unit: string } | null;
  accounts?: string[];
  labels?: number;
  has_media?: boolean;
  media_count?: number;
  captions?: number;
  errors?: string[];
};

export type BulkImportValidation = {
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  max_rows: number;
  rows: BulkImportRow[];
};

export type BulkImportResult = {
  batch_id: string;
  created: number;
  held_for_approval: boolean;
  posts: Array<{ id?: string; schedule_at?: string | null }>;
};

// ─── Workspaces ──────────────────────────────────────────────────

export type WorkspaceType =
  | 'PERSONAL'
  | 'TEAM'
  | 'ORGANIZATION'
  | 'CLIENT'
  | 'PROJECT'
  | 'DEPARTMENT'
  | 'EVENT'
  | 'TEMPORARY'
  | 'COMMUNITY'
  | 'BRAND'
  | 'AGENCY';

/** The full workspace record, as create and update answer it. */
export type WorkspaceDetail = {
  id: string;
  name: string;
  slug: string;
  type: string;
  logo?: string | null;
  website?: string | null;
  timezone: string;
  country?: string | null;
  description?: string | null;
  language: string;
  require_approval: boolean;
  ai_alt_text_enabled: boolean;
  brand_color?: string | null;
  connect_redirect_domains: string[];
  created_at: string;
  updated_at?: string;
};

export type CreateWorkspaceInput = {
  name: string;
  type?: WorkspaceType;
  logo?: string | null;
  website?: string | null;
  timezone?: string;
  country?: string | null;
  description?: string | null;
  language?: string;
};

export type UpdateWorkspaceInput = Partial<CreateWorkspaceInput> & {
  requireApproval?: boolean;
  aiAltTextEnabled?: boolean;
  brandColor?: string | null;
  connectRedirectDomains?: string[];
};

export type WorkspaceAnalytics = {
  workspace_id: string;
  accounts: Array<{
    account_id?: string;
    platform?: string;
    username?: string;
    followers?: number | null;
    following?: number | null;
    total_posts?: number | null;
    fetched_at?: string | null;
  }>;
  totals: { followers?: number; total_posts?: number };
};

// ─── Labels ──────────────────────────────────────────────────────

/** A label with its workspace, as get, create and update answer it. */
export type LabelDetail = {
  id: string;
  name: string;
  color: string;
  workspace: {
    id?: string;
    name?: string;
    slug?: string;
    type?: string;
    logo?: string | null;
    timezone?: string;
    language?: string;
  } | null;
  created_at?: string;
  updated_at?: string;
};

export type CreateLabelInput = { workspaceId: string; name: string; color: string };

export type UpdateLabelInput = { name: string; color: string };

// ─── Connect sessions ────────────────────────────────────────────

export type ConnectSessionPlatform =
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'threads'
  | 'tiktok'
  | 'youtube'
  | 'reddit'
  | 'tumblr'
  | 'dribbble';

export type CreateConnectSessionInput = {
  workspaceId?: string;
  /** Your own id for the person connecting; echoed back on the session. */
  externalUserId: string;
  platforms: ConnectSessionPlatform[];
  redirectUrl?: string;
  branding?: { name?: string; logoUrl?: string };
};

export type ConnectSession = {
  id: string;
  status: 'pending' | 'used' | 'expired';
  external_user_id: string;
  platforms: ConnectSessionPlatform[];
  redirect_url?: string | null;
  branding?: { name?: string | null; logo_url?: string | null };
  /** The account that was connected, once the session is used. */
  account_id?: string | null;
  /** The hosted page to send the person to. */
  url?: string;
  expires_at: string;
  used_at?: string | null;
  created_at: string;
};

// ─── Accounts: primary, validation, token, history, communities ──

export type AccountPrimary = { id: string; is_primary: boolean };

export type AccountCredentialCheck = {
  account_id: string;
  platform: string;
  valid: boolean;
  health_status: 'healthy' | 'expired';
  username?: string;
  name?: string;
  avatar?: string | null;
  delivery?: 'extension';
  message?: string;
};

export type AccountTokenRefresh = { expires_at: string | null };

export type AccountAnalyticsHistory = {
  account_id: string;
  platform: string;
  username: string;
  history: Array<{
    followers?: number | null;
    following?: number | null;
    total_posts?: number | null;
    reach?: number | null;
    profile_views?: number | null;
    fetched_at?: string;
  }>;
};

export type Community = {
  id?: number;
  account_id?: string;
  community_id?: string;
  name?: string;
  member_count?: number | null;
  description?: string | null;
  image_url?: string | null;
  last_synced_at?: string;
  created_at?: string;
};

export type CommunitySearchResult = {
  id?: string;
  name?: string;
  description?: string;
  member_count?: number;
};

export type AddCommunityInput = { communityId: string; name?: string };

// ─── Request logs ────────────────────────────────────────────────

export type ListLogsParams = {
  workspaceId?: string;
  days?: number;
  status?: 'success' | 'failed';
  method?: string;
  statusCode?: number;
  platform?: string;
  route?: string;
  /** Free-text search over route, path and message. */
  q?: string;
  limit?: number;
  /** Cursor from `meta.next_cursor`. */
  before?: number;
};

export type RequestLog = {
  id?: number;
  workspace_id?: string | null;
  time?: string;
  auth_method?: 'jwt' | 'api_key';
  method?: string;
  route?: string;
  path?: string;
  status_code?: number;
  duration_ms?: number;
  platform?: string | null;
  message?: string | null;
};

export type RequestLogPage = {
  data: RequestLog[];
  meta: { next_cursor: string | null; has_more: boolean };
  summary: {
    since?: string;
    total?: number;
    errors?: number;
    buckets?: Array<{ at?: string; total?: number; errors?: number }>;
  };
};

// ─── Webhooks (REST) ─────────────────────────────────────────────

export type WebhookEventName =
  | 'post.scheduled'
  | 'post.published'
  | 'post.partially_failed'
  | 'post.failed'
  | 'post.deleted'
  | 'delivery.published'
  | 'delivery.failed'
  | 'delivery.delayed'
  | 'account.connected'
  | 'account.disconnected'
  | 'account.health_changed'
  | 'article.published'
  | 'inbox.comment_received'
  | 'inbox.mention_received'
  | 'inbox.message_received'
  | 'inbox.review_received'
  | 'automation.triggered'
  | 'automation.completed'
  | 'automation.failed';

export type Webhook = {
  id: string;
  workspace_id: string | null;
  name?: string | null;
  url: string;
  events: WebhookEventName[];
  /** Names only; header values are never read back. */
  header_names: string[];
  active: boolean;
  last_triggered_at?: string | null;
  failure_count?: number;
  created_at?: string;
  /** Only on create, and on an update that rotated it. */
  secret?: string;
};

export type CreateWebhookInput = {
  workspaceId: string;
  name?: string;
  url: string;
  events: WebhookEventName[];
  /** Omit to have one generated; it is returned once on the created webhook. */
  secret?: string;
  headers?: Record<string, string>;
};

export type UpdateWebhookInput = {
  name?: string | null;
  url?: string;
  events?: WebhookEventName[];
  active?: boolean;
  secret?: string;
  /** null clears every custom header. */
  headers?: Record<string, string> | null;
};

export type WebhookDelivery = {
  id?: string;
  webhook_id?: string;
  event?: WebhookEventName;
  delivery_key?: string;
  attempt?: number;
  status?: 'success' | 'failed';
  response_status?: number | null;
  response_snippet?: string | null;
  duration_ms?: number;
  payload_hash?: string;
  next_retry_at?: string | null;
  created_at?: string;
};

export type WebhookDeliveryDetail = WebhookDelivery & { payload?: Record<string, unknown> };

export type ListWebhookDeliveriesParams = { status?: 'success' | 'failed'; limit?: number };

// ─── Analytics overview ──────────────────────────────────────────

export type AnalyticsRangeParams = AnalyticsScopeParams & {
  days?: number;
  /** ISO date; with `to`, replaces `days`. */
  from?: string;
  to?: string;
};

export type AnalyticsOverview = {
  total_accounts?: number;
  total_followers?: number;
  total_posts?: number;
  total_engagement?: number;
  total_impressions?: number;
  total_reach?: number;
  total_likes?: number;
  total_comments?: number;
  total_shares?: number;
  total_reposts?: number;
  total_saves?: number;
  total_clicks?: number;
  total_video_views?: number;
  total_profile_views?: number;
  engagement_rate?: number | null;
  deltas?: {
    followers?: number | null;
    posts?: number | null;
    engagement?: number | null;
    impressions?: number | null;
    likes?: number | null;
    comments?: number | null;
    shares?: number | null;
    profile_views?: number | null;
  };
  today_stats?: { posts?: number; follower_change?: number; engagement?: number };
  platforms?: Array<{ platform?: string; accounts?: number; followers?: number }>;
  accounts?: Array<{
    account_id?: string;
    platform?: string;
    username?: string;
    name?: string;
    avatar?: string | null;
    followers?: number | null;
    total_posts?: number | null;
    fetched_at?: string | null;
    history?: Array<{ date?: string; followers?: number | null }>;
  }>;
};

export type AnalyticsTimeSeries = {
  days: number;
  series: Array<{
    date?: string;
    engagements?: number;
    impressions?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    followers?: number;
    posts?: number;
  }>;
};

export type TopPostsParams = AnalyticsRangeParams & {
  limit?: number;
  /** `recent` orders by date instead of engagement. */
  sort?: 'recent';
  /** Label id. */
  label?: string;
};

export type TopPost = {
  rank?: number;
  post_id?: string | null;
  external_post_id?: string | null;
  source?: 'fopost' | 'platform';
  preview?: string | null;
  permalink?: string | null;
  thumbnail_url?: string | null;
  status?: string | null;
  created_at?: string | null;
  platforms?: Array<{
    platform?: string;
    username?: string;
    url?: string | null;
    removed?: boolean;
  }>;
  labels?: Array<{ id?: string; name?: string; color?: string }>;
  metrics?: {
    engagements?: number;
    impressions?: number;
    reach?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    reposts?: number;
    clicks?: number;
    saves?: number;
    video_views?: number;
  };
};

export type LabelAnalytics = {
  label_id?: string;
  name?: string;
  color?: string;
  post_count?: number;
  impressions?: number;
  reach?: number;
  engagements?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  engagement_rate?: number | null;
  follower_delta?: number | null;
};

export type PostsTableParams = AnalyticsRangeParams & { page?: number; perPage?: number };

export type PostsTableRow = {
  post_id?: string;
  preview?: string | null;
  status?: string | null;
  created_at?: string | null;
  scheduled_at?: string | null;
  platforms?: Array<{
    platform?: string;
    username?: string;
    url?: string | null;
    delivery_status?:
      | 'pending'
      | 'queued'
      | 'delayed'
      | 'publishing'
      | 'published'
      | 'failed'
      | 'cancelled'
      | 'unpublished';
  }>;
  delivery_summary?: { total?: number; published?: number; failed?: number; pending?: number };
};

export type PostsTable = {
  data: PostsTableRow[];
  meta: { page: number; per_page: number; total: number; total_pages: number };
  summary: {
    draft?: number;
    scheduled?: number;
    published?: number;
    failed?: number;
    pending?: number;
    total?: number;
  };
};

export type PostingStreak = {
  streak: Array<{
    date?: string;
    count?: number;
    published_count?: number;
    failed_count?: number;
    scheduled_count?: number;
  }>;
};

export type DemographicsAudience = 'followers' | 'engaged' | 'reached';

export type DemographicsParams = AnalyticsScopeParams & { audience?: DemographicsAudience };

export type DemographicBucket = { key: string; value: number; share: number };

export type AudienceDemographics = {
  audience: DemographicsAudience;
  dimensions: {
    age?: DemographicBucket[];
    gender?: DemographicBucket[];
    country?: DemographicBucket[];
    city?: DemographicBucket[];
  };
  contributing_accounts: Array<{ account_id?: string; platform?: string; username?: string }>;
  unsupported_accounts: Array<{ account_id?: string; platform?: string; username?: string }>;
};

export type InboxAnalyticsParams = AnalyticsScopeParams & {
  days?: number;
  /** IANA zone the heatmap and series are bucketed in. */
  tz?: string;
};

export type InboxAnalytics = {
  totals?: {
    received?: number;
    sent?: number;
    answered?: number;
    open?: number;
    conversations?: number;
    median_response_minutes?: number | null;
  };
  deltas?: { received?: number | null; sent?: number | null; answered?: number | null };
  series?: Array<{ date?: string; received?: number; sent?: number; answered?: number }>;
  by_platform?: Array<{ platform?: string; received?: number; sent?: number }>;
  by_type?: Array<{ type?: 'comment' | 'mention' | 'reply' | 'dm' | 'review'; count?: number }>;
  by_account?: Array<{
    account_id?: string;
    platform?: string;
    username?: string;
    name?: string;
    avatar?: string | null;
    received?: number;
    sent?: number;
  }>;
  response_time?: Array<{
    bucket?: 'under_1h' | '1h_6h' | '6h_24h' | '1d_3d' | 'over_3d';
    count?: number;
  }>;
  heatmap?: Array<{ weekday?: number; hour?: number; count?: number }>;
  time_zone?: string;
};

export type AnalyticsCollectResult = {
  accounts: number;
  posts: number;
  demographics: number;
  errors: number;
  error_details: Array<{
    account_id?: string;
    platform?: string;
    username?: string;
    stage?: 'account' | 'demographics' | 'timeline' | 'post';
    message?: string;
    action?: 'reconnect' | 'grant' | 'fund';
  }>;
};

// ─── Automations ─────────────────────────────────────────────────

export type AutomationTriggerType =
  | 'content_created'
  | 'cross_post'
  | 'rss_feed'
  | 'api_webhook'
  | 'schedule'
  | 'competitor_post'
  | 'post_outperformed'
  | 'inbox_topic'
  | 'inbox_message'
  | 'radar_mention';

export type AutomationActionType =
  | 'generate'
  | 'transform'
  | 'delay'
  | 'publish'
  | 'condition'
  | 'set_variable'
  | 'webhook'
  | 'ab_split'
  | 'ai'
  | 'send_message'
  | 'wait_for_reply'
  | 'handoff'
  | 'add_label'
  | 'remove_label'
  | 'end';

export type AutomationNodeKind = 'trigger' | AutomationActionType;

export type AutomationNode = {
  id?: string;
  kind?: AutomationNodeKind;
  label?: string | null;
  config?: Record<string, unknown>;
  position?: number;
  layout?: { x?: number; y?: number };
};

export type AutomationEdge = {
  id?: string;
  source?: string;
  source_handle?: string | null;
  target?: string;
};

export type AutomationGraph = { nodes?: AutomationNode[]; edges?: AutomationEdge[] };

export type AutomationStep = {
  position?: number;
  node_id?: string;
  action_type?: AutomationActionType;
  action_config?: Record<string, unknown>;
};

export type Automation = {
  id?: string;
  workspace_id?: string | null;
  name?: string;
  description?: string | null;
  trigger_type?: AutomationTriggerType;
  trigger_config?: Record<string, unknown>;
  active?: boolean;
  schedule_window?: { days?: number[]; start?: string; end?: string };
  max_per_day?: Record<string, unknown> | null;
  credit_ceiling?: number | null;
  approval_mode?: boolean;
  last_triggered_at?: string | null;
  run_count?: number;
  graph?: AutomationGraph;
  steps?: AutomationStep[];
  /** Only on create: the token an `api_webhook` trigger is called with. */
  secret?: string;
  created_at?: string;
  updated_at?: string;
};

export type AutomationNodeInput = {
  id: string;
  kind: AutomationNodeKind;
  label?: string | null;
  config?: Record<string, unknown>;
  layout?: { x: number; y: number };
};

export type AutomationEdgeInput = {
  id: string;
  source: string;
  sourceHandle?: string | null;
  target: string;
};

export type AutomationGraphInput = { nodes: AutomationNodeInput[]; edges: AutomationEdgeInput[] };

export type AutomationStepInput = {
  actionType: AutomationActionType;
  actionConfig?: Record<string, unknown>;
};

export type CreateAutomationInput = {
  workspaceId: string;
  name: string;
  description?: string | null;
  triggerType: AutomationTriggerType;
  triggerConfig?: Record<string, unknown>;
  /** A linear pipeline; `graph` takes precedence when both are sent. */
  steps?: AutomationStepInput[];
  graph?: AutomationGraphInput;
  active?: boolean;
};

export type UpdateAutomationInput = Partial<Omit<CreateAutomationInput, 'workspaceId'>>;

export type AutomationToggle = { id: string; active: boolean };

export type AutomationStats = {
  total_automations: number;
  active_automations: number;
  total_runs_24h: number;
  runs_by_status: Record<string, number>;
  recent_runs: Array<{
    id?: number;
    automation_id?: string | null;
    status?: string;
    started_at?: string;
    completed_at?: string | null;
  }>;
};

export type PageParams = { page?: number; perPage?: number };

export type PagedMeta = { page: number; per_page: number; total: number; total_pages: number };

export type AutomationVersion = {
  version?: number;
  note?: string | null;
  created_by?: { name: string };
  created_at?: string;
  node_count?: number;
  nodes_added?: Array<{ id: string; kind: string; label?: string | null }>;
  nodes_removed?: Array<{ id: string; kind: string; label?: string | null }>;
};

export type AutomationVersionPage = { data: AutomationVersion[]; meta: PagedMeta };

export type AutomationVersionDetail = {
  version?: number;
  note?: string | null;
  created_by?: { name: string };
  created_at?: string;
  graph?: AutomationGraph;
};

export type AutomationRestore = {
  version: number;
  graph: AutomationGraph;
  steps: AutomationStep[];
};

export type AutomationRun = {
  id?: number;
  status?: string;
  current_step?: number | null;
  trigger_event?: Record<string, unknown> | null;
  started_at?: string;
  completed_at?: string | null;
  error_message?: string | null;
  deferred_until?: string | null;
  defer_reason?: string | null;
  defer_detail?: string | null;
  defer_count?: number;
  replay_of_run_id?: number | null;
};

export type AutomationRunPage = { data: AutomationRun[]; meta: PagedMeta };

export type AutomationRunLog = {
  id?: number;
  step_position?: number;
  node_id?: string | null;
  handle?: string | null;
  status?: string;
  input_snapshot?: Record<string, unknown> | null;
  output_snapshot?: Record<string, unknown> | null;
  started_at?: string;
  completed_at?: string | null;
  duration_ms?: number | null;
  error_message?: string | null;
};

export type AutomationRunDetail = AutomationRun & {
  automation_id?: string;
  current_node_id?: string | null;
  waiting_until?: string | null;
  context?: Record<string, unknown> | null;
  initial_context?: Record<string, unknown> | null;
  logs?: AutomationRunLog[];
};

export type AutomationTriggerResult = { run_id: number; triggered: boolean };

// ─── Media upload ────────────────────────────────────────────────

export type UploadMediaInput = {
  workspaceId?: string;
  files: PostFileInput[];
};

export type UploadedMediaFile = {
  id?: string;
  type: 'image' | 'video' | 'gif' | 'document';
  name: string;
  url: string;
  preview_url?: string;
  size: number;
};

// ─── Media library ───────────────────────────────────────────────

export type MediaBrandRole = 'logo' | 'product' | 'person' | 'background';

export type ListMediaParams = {
  workspaceId?: string;
  folderId?: string;
  search?: string;
  tag?: string;
  type?: 'image' | 'video' | 'gif' | 'document';
  /** Exact stored url. */
  url?: string;
  brandRole?: MediaBrandRole;
  brandVoiceId?: string;
  generationRunId?: string;
  origin?: string;
  shared?: boolean;
  page?: number;
  perPage?: number;
};

export type MediaLibraryItem = {
  id: string;
  workspace_id: string;
  name: string;
  url: string;
  visibility?: 'private' | 'public';
  type: 'image' | 'video' | 'gif' | 'document';
  mime_type?: string;
  size: number;
  alt_text?: string | null;
  alt_text_source?: string | null;
  tags?: string[];
  folder_id?: string | null;
  origin?: string | null;
  source_url?: string | null;
  synced_at?: string | null;
  brand_role?: MediaBrandRole | '';
  brand_voice_id?: string | null;
  generation_run_id?: string | null;
  has_person_consent?: boolean;
  created_at: string;
  preview_url: string;
  share?: { url?: string; created_at?: string; created_by_name?: string | null; source?: string };
};

export type MediaLibraryPage = { data: MediaLibraryItem[]; meta: PagedMeta };
