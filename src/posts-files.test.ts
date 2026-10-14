import { describe, expect, it } from 'vitest';
import { FoPost, FoPostError } from './index.js';

type Call = { method: string; url: string; headers: Record<string, string>; body: unknown };

const MB = 1024 * 1024;
const limits = {
  maxFileBytes: 400 * MB,
  source: 'accounts',
  connectedAccounts: 3,
  largeUploadsEnabled: false,
  nextTier: { upToAccounts: 15, maxFileBytes: 2048 * MB },
  multipartMaxFileBytes: 100 * MB,
  maxFilesPerUpload: 5,
  directUploadAvailable: true,
  allowedTypes: ['image/png', 'video/mp4'],
};
const presigned = {
  uploadId: 'up1',
  uploadUrl: 'https://storage.example.com/bucket/up1?sig=abc',
  method: 'PUT',
  headers: { 'Content-Type': 'video/mp4' },
  expiresAt: '2026-10-13T12:00:00.000Z',
  maxFileBytes: 400 * MB,
};
const uploaded = {
  id: 'm1',
  type: 'video',
  name: 'clip.mp4',
  url: 'https://api.fopost.com/v1/media/m1/file',
  previewUrl: 'https://api.fopost.com/v1/media/m1/file',
  size: 150 * MB,
};
const post = {
  id: 'p1',
  workspaceId: 'ws',
  status: 'draft',
  content: [{ text: 'stored', media: [], position: 0 }],
};

function recordingClient(respond?: (url: string, method: string) => Response | undefined) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    calls.push({
      method,
      url,
      headers: (init?.headers as Record<string, string>) ?? {},
      body: init?.body,
    });
    const custom = respond?.(url, method);
    if (custom) return custom;
    if (url.startsWith('https://storage.example.com/')) return new Response(null, { status: 200 });
    let data: unknown = post;
    if (url.includes('/v1/media/limits')) data = limits;
    else if (url.endsWith('/v1/media/presign')) data = presigned;
    else if (url.endsWith('/complete')) data = uploaded;
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

// A Blob that reports a large size without allocating it.
function fakeBlob(size: number, type: string, name: string): Blob {
  const blob = new Blob(['x'], { type });
  Object.defineProperty(blob, 'size', { value: size });
  Object.defineProperty(blob, 'name', { value: name });
  return blob;
}

describe('media.limits', () => {
  it('reads /v1/media/limits with the workspace as a query', async () => {
    const { calls, client } = recordingClient();
    const result = await client.media.limits('ws');
    expect(result).toEqual(limits);
    expect(calls[0]).toMatchObject({
      method: 'GET',
      url: 'https://api.fopost.com/v1/media/limits?workspaceId=ws',
    });
    expect(calls[0].headers['X-API-Key']).toBe('test-key');
  });
});

describe('posts.create with files', () => {
  it('sends one multipart request when every file fits the multipart ceiling', async () => {
    const { calls, client } = recordingClient();
    await client.posts.create({
      workspaceId: 'ws',
      content: [{ text: 'hi' }],
      files: [{ data: new Uint8Array([1, 2, 3]), filename: 'a.png', mimeType: 'image/png' }],
    });

    expect(calls.map((c) => c.url)).toEqual([
      'https://api.fopost.com/v1/media/limits?workspaceId=ws',
      'https://api.fopost.com/v1/posts',
    ]);
    const req = calls[1];
    expect(req.method).toBe('POST');
    expect(req.headers['Content-Type']).toBeUndefined();
    expect(req.headers['X-API-Key']).toBe('test-key');
    const form = req.body as FormData;
    expect(form).toBeInstanceOf(FormData);
    expect(JSON.parse(String(form.get('post')))).toMatchObject({
      workspace_id: 'ws',
      status: 'draft',
      content: [{ text: 'hi' }],
    });
    const files = form.getAll('files') as File[];
    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('a.png');
    expect(files[0].type).toBe('image/png');
    expect(files[0].size).toBe(3);
  });

  it('uploads a large file directly and attaches it to the first block as JSON', async () => {
    const { calls, client } = recordingClient();
    await client.posts.create({
      workspaceId: 'ws',
      content: [{ text: 'hi' }],
      files: [fakeBlob(150 * MB, 'video/mp4', 'clip.mp4')],
    });

    expect(calls.map((c) => `${c.method} ${c.url}`)).toEqual([
      'GET https://api.fopost.com/v1/media/limits?workspaceId=ws',
      'POST https://api.fopost.com/v1/media/presign',
      'PUT https://storage.example.com/bucket/up1?sig=abc',
      'POST https://api.fopost.com/v1/media/presign/up1/complete',
      'POST https://api.fopost.com/v1/posts',
    ]);
    expect(JSON.parse(String(calls[1].body))).toEqual({
      workspaceId: 'ws',
      filename: 'clip.mp4',
      mimeType: 'video/mp4',
      size: 150 * MB,
    });
    const final = calls[4];
    expect(final.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(String(final.body)).content).toEqual([
      {
        text: 'hi',
        media: [{ type: 'video', name: 'clip.mp4', url: uploaded.url, size: 150 * MB }],
      },
    ]);
  });

  it('surfaces a 413 file_too_large with its max_file_bytes', async () => {
    const tooLarge = {
      error: 'file_too_large',
      message: 'clip.mp4 is larger than this account allows',
      max_file_bytes: 100 * MB,
      file_bytes: 150 * MB,
      upgrade_url: 'https://fopost.com/app/settings/billing',
    };
    const { client } = recordingClient((url, method) =>
      method === 'POST' && url.endsWith('/v1/posts')
        ? new Response(JSON.stringify(tooLarge), {
            status: 413,
            headers: { 'content-type': 'application/json' },
          })
        : undefined,
    );
    const err = await client.posts
      .create({
        workspaceId: 'ws',
        content: [{ text: 'hi' }],
        files: [{ data: new Uint8Array([1]), filename: 'a.png', mimeType: 'image/png' }],
      })
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(FoPostError);
    const e = err as FoPostError;
    expect(e.status).toBe(413);
    expect(e.code).toBe('file_too_large');
    expect(e.message).toBe(tooLarge.message);
    expect((e.body as { max_file_bytes: number }).max_file_bytes).toBe(100 * MB);
  });
});

describe('posts.update with files', () => {
  it('reads the post and appends to its first block on the direct path', async () => {
    const { calls, client } = recordingClient();
    await client.posts.update('p1', { files: [fakeBlob(150 * MB, 'video/mp4', 'clip.mp4')] });

    expect(calls.map((c) => `${c.method} ${c.url}`)).toEqual([
      'GET https://api.fopost.com/v1/media/limits',
      'GET https://api.fopost.com/v1/posts/p1',
      'POST https://api.fopost.com/v1/media/presign',
      'PUT https://storage.example.com/bucket/up1?sig=abc',
      'POST https://api.fopost.com/v1/media/presign/up1/complete',
      'PUT https://api.fopost.com/v1/posts/p1',
    ]);
    expect(JSON.parse(String(calls[5].body))).toEqual({
      content: [
        {
          text: 'stored',
          position: 0,
          media: [{ type: 'video', name: 'clip.mp4', url: uploaded.url, size: 150 * MB }],
        },
      ],
    });
  });
});
