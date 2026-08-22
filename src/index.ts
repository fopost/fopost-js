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
  AiCreditBalance,
  CreatePostInput,
  GenerateCaptionInput,
  Label,
  ListPostsParams,
  Post,
  RepurposeUrlInput,
  RewriteInput,
  UpdatePostInput,
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

  constructor(opts: FoPostOptions) {
    this.http = new HttpClient(opts);
    this.posts = new PostsResource(this.http);
    this.accounts = new AccountsResource(this.http);
    this.workspaces = new WorkspacesResource(this.http);
    this.labels = new LabelsResource(this.http);
    this.ai = new AiResource(this.http);
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
    return this.http.get<Post[]>('/api/v1/posts', {
      workspace_id: params.workspaceId,
      status: params.status,
      limit: params.limit,
      offset: params.offset,
    });
  }

  get(id: string): Promise<Post> {
    return this.http.get<Post>(`/api/v1/posts/${id}`);
  }

  create(input: CreatePostInput): Promise<Post> {
    return this.http.post<Post>('/api/v1/posts', {
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
    return this.http.put<Post>(`/api/v1/posts/${id}`, body);
  }

  delete(id: string): Promise<void> {
    return this.http.delete(`/api/v1/posts/${id}`);
  }

  publish(id: string): Promise<unknown> {
    return this.http.post(`/api/v1/posts/${id}/publish`);
  }

  cancel(id: string): Promise<unknown> {
    return this.http.post(`/api/v1/posts/${id}/cancel`);
  }

  retry(id: string): Promise<unknown> {
    return this.http.post(`/api/v1/posts/${id}/retry`);
  }

  preflight(id: string): Promise<unknown> {
    return this.http.post(`/api/v1/posts/${id}/preflight`);
  }

  deliveries(id: string): Promise<unknown[]> {
    return this.http.get<unknown[]>(`/api/v1/posts/${id}/deliveries`);
  }
}

class AccountsResource {
  constructor(private http: HttpClient) {}

  list(params: { workspaceId: string }): Promise<Account[]> {
    return this.http.get<Account[]>('/api/v1/accounts', {
      workspace_id: params.workspaceId,
    });
  }

  get(id: string): Promise<Account> {
    return this.http.get<Account>(`/api/v1/accounts/${id}`);
  }

  health(id: string): Promise<unknown> {
    return this.http.get(`/api/v1/accounts/${id}/health`);
  }
}

class WorkspacesResource {
  constructor(private http: HttpClient) {}

  list(): Promise<Workspace[]> {
    return this.http.get<Workspace[]>('/api/v1/workspaces');
  }

  get(id: string): Promise<Workspace> {
    return this.http.get<Workspace>(`/api/v1/workspaces/${id}`);
  }
}

class LabelsResource {
  constructor(private http: HttpClient) {}

  list(params: { workspaceId: string }): Promise<Label[]> {
    return this.http.get<Label[]>('/api/v1/labels', { workspace_id: params.workspaceId });
  }
}

class AiResource {
  constructor(private http: HttpClient) {}

  credits(): Promise<AiCreditBalance> {
    return this.http.get<AiCreditBalance>('/api/v1/ai/credits');
  }

  generateCaption(input: GenerateCaptionInput): Promise<{
    caption: string;
    credits?: { charged: number; remaining: number };
  }> {
    return this.http.post('/api/v1/ai/generate-caption', {
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
    return this.http.post('/api/v1/ai/rewrite', input);
  }

  repurposeUrl(input: RepurposeUrlInput): Promise<{
    url: string;
    title: string | null;
    posts: Record<string, string>;
    credits: { charged: number; remaining: number };
  }> {
    return this.http.post('/api/v1/ai/repurpose-url', input);
  }
}
