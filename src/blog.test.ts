import { describe, expect, it } from 'vitest';
import { FoPost, FoPostError } from './index.js';

type Call = { method: string; url: string; body: unknown };

function recordingClient(response: unknown = { data: {} }, status = 200) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({
      method: init?.method ?? 'GET',
      url: String(input),
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    if (status === 204) return new Response(null, { status });
    return new Response(JSON.stringify(response), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

const last = (calls: Call[]) => {
  const call = calls[calls.length - 1];
  const url = new URL(call.url);
  return { ...call, path: url.pathname, query: Object.fromEntries(url.searchParams) };
};

describe('blog settings', () => {
  it('reads settings with the workspace in the query', async () => {
    const { calls, client } = recordingClient({
      language: 'en',
      cadence_per_week: 2,
      review_hold_days: 3,
      has_website_secret: false,
      goal: 'leads',
      focus_topics: 'scheduling',
      plan_run: { status: 'done', error: null, added: 12, finished_at: '2026-10-18T09:00:00Z' },
      keyword_data_available: true,
    });
    const settings = await client.blog.getSettings('ws');
    expect(settings.cadence_per_week).toBe(2);
    expect(settings.goal).toBe('leads');
    expect(settings.focus_topics).toBe('scheduling');
    expect(settings.plan_run?.added).toBe(12);
    expect(settings.keyword_data_available).toBe(true);
    const req = last(calls);
    expect(req.method).toBe('GET');
    expect(req.path).toBe('/v1/blog/settings');
    expect(req.query).toEqual({ workspace_id: 'ws' });
  });

  it('patches settings with the workspace in the body and keeps the one-time secret', async () => {
    const { calls, client } = recordingClient({
      language: 'en',
      cadence_per_week: 2,
      review_hold_days: 3,
      has_website_secret: true,
      website_secret: 'whsec_once',
    });
    const result = await client.blog.updateSettings('ws', {
      websiteUrl: 'https://yourbrand.com/fopost',
      targetKind: 'website',
      goal: 'signups',
      focusTopics: 'scheduling',
      avoidTopics: null,
    });
    expect(result.website_secret).toBe('whsec_once');
    expect(result.has_website_secret).toBe(true);
    const req = last(calls);
    expect(req.method).toBe('PATCH');
    expect(req.path).toBe('/v1/blog/settings');
    expect(req.body).toEqual({
      workspaceId: 'ws',
      websiteUrl: 'https://yourbrand.com/fopost',
      targetKind: 'website',
      goal: 'signups',
      focusTopics: 'scheduling',
      avoidTopics: null,
    });
  });

  it('rotates the secret and tests the website with a body-only workspace', async () => {
    const { calls, client } = recordingClient({ website_secret: 'whsec_new' });
    const rotated = await client.blog.rotateWebsiteSecret('ws');
    expect(rotated.website_secret).toBe('whsec_new');
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/blog/settings/website-secret',
      body: { workspaceId: 'ws' },
    });

    const test = recordingClient({ http_status: 200 });
    const outcome = await test.client.blog.testWebsite('ws');
    expect(outcome.http_status).toBe(200);
    expect(last(test.calls)).toMatchObject({
      method: 'POST',
      path: '/v1/blog/settings/website-test',
      body: { workspaceId: 'ws' },
    });
  });
});

describe('blog keywords', () => {
  it('lists with a comma-joined status filter', async () => {
    const { calls, client } = recordingClient({
      data: [{ id: 'k1', keyword: 'social media', search_volume: 1200, status: 'suggested' }],
    });
    const keywords = await client.blog.listKeywords('ws', {
      status: ['suggested', 'planned'],
      limit: 50,
    });
    expect(keywords[0].keyword).toBe('social media');
    expect(keywords[0].search_volume).toBe(1200);
    const req = last(calls);
    expect(req.path).toBe('/v1/blog/keywords');
    expect(req.query).toEqual({ workspace_id: 'ws', status: 'suggested,planned', limit: '50' });
  });

  it('suggests seeds with the workspace, seeds and prompt in the body', async () => {
    const { calls, client } = recordingClient({
      seeds: ['social media calendar', 'post scheduler'],
    });
    const result = await client.blog.suggestSeeds('ws', {
      seeds: ['scheduling'],
      prompt: 'Lean towards agencies.',
    });
    expect(result.seeds).toEqual(['social media calendar', 'post scheduler']);
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/blog/keywords/suggest',
      body: { workspaceId: 'ws', seeds: ['scheduling'], prompt: 'Lean towards agencies.' },
    });
  });

  it('plans and adds with the workspace in the body', async () => {
    const { calls, client } = recordingClient({ status: 'queued' });
    const queued = await client.blog.planKeywords('ws', { seeds: ['scheduling'] });
    expect(queued.status).toBe('queued');
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/blog/keywords/plan',
      body: { workspaceId: 'ws', seeds: ['scheduling'] },
    });

    await client.blog.addKeyword('ws', { keyword: 'content calendar', plannedFor: '2026-11-02' });
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/blog/keywords',
      body: { workspaceId: 'ws', keyword: 'content calendar', plannedFor: '2026-11-02' },
    });
  });

  it('updates with the workspace in the query and the patch in the body', async () => {
    const { calls, client } = recordingClient({
      id: 'k1',
      keyword: 'content calendar',
      source: 'provider',
      status: 'planned',
      planned_for: '2026-11-02',
      fit_reason: 'Buyers search it before choosing a tool.',
      created_at: '2026-10-18T09:00:00Z',
    });
    const keyword = await client.blog.updateKeyword('ws', 'k1', { status: 'planned' });
    expect(keyword.status).toBe('planned');
    expect(keyword.planned_for).toBe('2026-11-02');
    expect(keyword.fit_reason).toBe('Buyers search it before choosing a tool.');
    const req = last(calls);
    expect(req.method).toBe('PATCH');
    expect(req.path).toBe('/v1/blog/keywords/k1');
    expect(req.query).toEqual({ workspace_id: 'ws' });
    expect(req.body).toEqual({ status: 'planned' });
  });

  it('deletes and accepts the empty 204', async () => {
    const { calls, client } = recordingClient(undefined, 204);
    await expect(client.blog.deleteKeyword('ws', 'k1')).resolves.toBeUndefined();
    const req = last(calls);
    expect(req.method).toBe('DELETE');
    expect(req.path).toBe('/v1/blog/keywords/k1');
    expect(req.query).toEqual({ workspace_id: 'ws' });
  });
});

describe('blog articles', () => {
  it('lists with filters in the query', async () => {
    const { calls, client } = recordingClient({
      data: [{ id: 'a1', status: 'draft', word_count: 1200, review_until: null }],
    });
    const articles = await client.blog.listArticles('ws', { status: 'draft', limit: 10 });
    expect(articles[0].status).toBe('draft');
    expect(articles[0].word_count).toBe(1200);
    const req = last(calls);
    expect(req.path).toBe('/v1/blog/articles');
    expect(req.query).toEqual({ workspace_id: 'ws', status: 'draft', limit: '10' });
  });

  it('requests an article with the workspace in the body', async () => {
    const { calls, client } = recordingClient({ id: 'a1', status: 'queued' });
    const article = await client.blog.requestArticle('ws', {
      keywordId: 'k1',
      instructions: 'Keep it practical.',
    });
    expect(article.status).toBe('queued');
    expect(last(calls)).toMatchObject({
      method: 'POST',
      path: '/v1/blog/articles',
      body: { workspaceId: 'ws', keywordId: 'k1', instructions: 'Keep it practical.' },
    });
  });

  it('reads and patches one article with the workspace in the query', async () => {
    const { calls, client } = recordingClient({
      id: 'a1',
      body_markdown: '# Hi',
      featured_image: { media_id: 'm0', url: 'u0', alt: 'f' },
      images: [{ media_id: 'm1', url: 'u', alt: 'a', position: 0 }],
    });
    const full = await client.blog.getArticle('ws', 'a1');
    expect(full.body_markdown).toBe('# Hi');
    expect(full.featured_image?.media_id).toBe('m0');
    expect(full.images?.[0].media_id).toBe('m1');
    expect(last(calls)).toMatchObject({ method: 'GET', path: '/v1/blog/articles/a1' });
    expect(last(calls).query).toEqual({ workspace_id: 'ws' });

    await client.blog.updateArticle('ws', 'a1', { slug: 'new-slug', publishAt: null });
    const req = last(calls);
    expect(req.method).toBe('PATCH');
    expect(req.path).toBe('/v1/blog/articles/a1');
    expect(req.query).toEqual({ workspace_id: 'ws' });
    expect(req.body).toEqual({ slug: 'new-slug', publishAt: null });
  });

  it('posts regenerate, publish and reject with no body of their own', async () => {
    const { calls, client } = recordingClient({ id: 'a1', status: 'publishing' });
    await client.blog.regenerateArticle('ws', 'a1');
    expect(last(calls)).toMatchObject({ method: 'POST', path: '/v1/blog/articles/a1/regenerate' });
    await client.blog.publishArticle('ws', 'a1');
    expect(last(calls)).toMatchObject({ method: 'POST', path: '/v1/blog/articles/a1/publish' });
    await client.blog.rejectArticle('ws', 'a1');
    expect(last(calls)).toMatchObject({ method: 'POST', path: '/v1/blog/articles/a1/reject' });
    for (const call of calls) {
      expect(call.body).toBeUndefined();
      expect(Object.fromEntries(new URL(call.url).searchParams)).toEqual({ workspace_id: 'ws' });
    }
  });

  it('submits an article for approval with no body of its own', async () => {
    const { calls, client } = recordingClient({ id: 'a1', status: 'in_review' });
    const article = await client.blog.submitArticle('ws', 'a1');
    expect(article.status).toBe('in_review');
    const req = last(calls);
    expect(req).toMatchObject({ method: 'POST', path: '/v1/blog/articles/a1/submit' });
    expect(req.query).toEqual({ workspace_id: 'ws' });
    expect(req.body).toBeUndefined();
  });

  it('deletes and accepts the empty 204', async () => {
    const { calls, client } = recordingClient(undefined, 204);
    await expect(client.blog.deleteArticle('ws', 'a1')).resolves.toBeUndefined();
    expect(last(calls)).toMatchObject({ method: 'DELETE', path: '/v1/blog/articles/a1' });
    expect(last(calls).query).toEqual({ workspace_id: 'ws' });
  });

  it('surfaces 402 and 409 as FoPostError with the code and upgrade_url', async () => {
    const credits = recordingClient(
      { error: 'insufficient_credits', message: 'Balance ran out', upgrade_url: 'https://x/up' },
      402,
    );
    const err = await credits.client.blog.requestArticle('ws', { title: 'T' }).catch((e) => e);
    expect(err).toBeInstanceOf(FoPostError);
    expect(err).toMatchObject({ status: 402, code: 'insufficient_credits' });
    expect((err as FoPostError).body).toMatchObject({ upgrade_url: 'https://x/up' });

    const target = recordingClient({ error: 'no_target', message: 'Nowhere to publish' }, 409);
    await expect(target.client.blog.publishArticle('ws', 'a1')).rejects.toMatchObject({
      status: 409,
      code: 'no_target',
    });
  });
});
