/**
 * Public DTOs returned by the OwlStack API. These mirror the server's
 * response shapes for the most common endpoints. Inlined (not imported
 * from @owlstack/shared) so the SDK is standalone for npm consumers.
 */

export type Platform =
  | 'twitter'
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'telegram'
  | 'discord'
  | 'slack'
  | 'reddit'
  | 'pinterest'
  | 'tumblr'
  | 'dribbble'
  | 'mewe'
  | 'tiktok'
  | 'youtube'
  | 'bluesky'
  | 'threads'
  | 'mastodon'
  | 'devto'
  | 'hashnode'
  | 'medium'
  | 'kick';

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
