import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; path: string; query: string; body: unknown };

function recordingClient(response: unknown = { data: {} }, status = 200) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    calls.push({
      method: init?.method ?? 'GET',
      path: url.pathname,
      query: url.search,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    });
    return new Response(JSON.stringify(response), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

describe('blogs', () => {
  it('maps every method onto its route and body', async () => {
    const { calls, client } = recordingClient();
    await client.blogs.listBlogs('a1');
    await client.blogs.listArticles('a1', '11', { limit: 5, status: 'draft', q: 'spring' });
    await client.blogs.getArticle('a1', '11', '99');
    await client.blogs.createArticle('a1', '11', {
      title: 'Spring drop',
      body: 'The new collection is live.',
      status: 'draft',
      tags: ['news'],
      authorName: 'Store Owner',
      imageUrl: 'https://cdn.example/img.png',
    });
    await client.blogs.deleteArticle('a1', '11', '99');
    await client.blogs.listProducts('a1', { status: 'active' });
    await client.blogs.updateProduct('a1', '7', { title: 'Mug XL', productType: 'Drinkware' });

    expect(calls).toEqual([
      { method: 'GET', path: '/v1/accounts/a1/blogs', query: '', body: undefined },
      {
        method: 'GET',
        path: '/v1/accounts/a1/blogs/11/articles',
        query: '?limit=5&status=draft&q=spring',
        body: undefined,
      },
      { method: 'GET', path: '/v1/accounts/a1/blogs/11/articles/99', query: '', body: undefined },
      {
        method: 'POST',
        path: '/v1/accounts/a1/blogs/11/articles',
        query: '',
        body: {
          title: 'Spring drop',
          body: 'The new collection is live.',
          status: 'draft',
          tags: ['news'],
          author_name: 'Store Owner',
          image_url: 'https://cdn.example/img.png',
        },
      },
      {
        method: 'DELETE',
        path: '/v1/accounts/a1/blogs/11/articles/99',
        query: '',
        body: undefined,
      },
      { method: 'GET', path: '/v1/accounts/a1/products', query: '?status=active', body: undefined },
      {
        method: 'PATCH',
        path: '/v1/accounts/a1/products/7',
        query: '',
        body: { title: 'Mug XL', product_type: 'Drinkware' },
      },
    ]);
  });

  it('updates an article in place, sending only what changed', async () => {
    const { calls, client } = recordingClient();
    await client.blogs.updateArticle('a1', '11', '99', { title: 'Spring drop, restocked' });

    // The article id is in the path, which is what stops an edit from
    // creating a second post on the site.
    expect(calls).toEqual([
      {
        method: 'PATCH',
        path: '/v1/accounts/a1/blogs/11/articles/99',
        query: '',
        body: { title: 'Spring drop, restocked' },
      },
    ]);
  });

  it('unwraps the article list', async () => {
    const articles = [
      {
        id: '99',
        blog_id: '11',
        title: 'Spring drop',
        body_html: '<p>Hello</p>',
        excerpt: 'A short summary',
        status: 'published',
        author_name: 'Store Owner',
        tags: ['news'],
        image_url: null,
        url: 'https://demo.myshopify.com/blogs/article/spring-drop',
        published_at: '2026-09-01T10:00:00.000Z',
        updated_at: null,
      },
    ];
    const { client } = recordingClient({ data: articles });
    await expect(client.blogs.listArticles('a1', '11')).resolves.toEqual(articles);
  });
});
