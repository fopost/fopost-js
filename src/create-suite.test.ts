import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; path: string; query: string; body: unknown };

function recordingClient(response: unknown = { data: {} }, status = 200) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = new URL(String(input));
    const raw = init?.body;
    calls.push({
      method: init?.method ?? 'GET',
      path: url.pathname,
      query: url.search,
      body: raw instanceof FormData ? raw : raw ? JSON.parse(String(raw)) : undefined,
    });
    if (status === 204) return new Response(null, { status });
    return new Response(JSON.stringify(response), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

const design = {
  id: 'd1',
  name: 'Launch',
  kind: 'story',
  width: 1080,
  height: 1920,
  document: { version: 1, width: 1080, height: 1920, pages: [{ id: 'p1', layers: [] }] },
  thumbnail_media_id: null,
  thumbnail_url: null,
  created_at: '2026-11-20T10:00:00.000Z',
  updated_at: '2026-11-20T10:00:00.000Z',
};

const job = {
  id: 'v1',
  status: 'queued',
  progress: 0,
  source_media_id: 'm1',
  operations: [{ op: 'trim', params: { start: 1, end: 5 } }],
  result_media_id: null,
  result_media: null,
  extra_outputs: [],
  result: null,
  error: null,
  created_at: '2026-11-20T10:00:00.000Z',
  updated_at: '2026-11-20T10:00:00.000Z',
  completed_at: null,
};

describe('designs', () => {
  it('maps every method onto its route, query and body', async () => {
    const { calls, client } = recordingClient();
    const document = { width: 1080, height: 1080, pages: [{ id: 'p1', layers: [] }] };
    await client.designs.list({ workspaceId: 'ws', kind: 'carousel', limit: 10, offset: 20 });
    await client.designs.get('d1');
    await client.designs.create({
      workspaceId: 'ws',
      kind: 'post',
      name: 'Launch',
      document,
      brandVoiceId: 'bv1',
    });
    await client.designs.update('d1', { name: 'Renamed', document, createVersion: true });
    await client.designs.update('d1', { kind: 'card' });
    await client.designs.delete('d1');
    await client.designs.listVersions('d1');
    await client.designs.listVersions('d1', { includeDocument: true });
    await client.designs.restoreVersion('d1', 'ver1');
    await client.designs.duplicate('d1', { name: 'Copy' });
    await client.designs.export('d1', { format: 'mp4', pageIndexes: [0, 2], durationSec: 10 });
    await client.designs.bulk('d1', {
      rows: [{ title: 'A' }, { title: 'B' }],
      nameColumn: 'title',
    });
    await client.designs.posts('d1');
    await client.designs.textToSlides({
      workspaceId: 'ws',
      text: 'Five tips',
      maxSlides: 6,
      brandVoiceId: null,
    });
    await client.designs.fromPost({
      workspaceId: 'ws',
      postId: 'post1',
      style: 'quote',
      preset: 'instagram-portrait',
      accountId: 'a1',
      carousel: true,
      name: 'From post',
    });

    expect(calls).toEqual([
      {
        method: 'GET',
        path: '/v1/designs',
        query: '?workspace_id=ws&kind=carousel&limit=10&offset=20',
        body: undefined,
      },
      { method: 'GET', path: '/v1/designs/d1', query: '', body: undefined },
      {
        method: 'POST',
        path: '/v1/designs',
        query: '',
        body: {
          workspace_id: 'ws',
          kind: 'post',
          name: 'Launch',
          document,
          brand_voice_id: 'bv1',
        },
      },
      {
        method: 'PATCH',
        path: '/v1/designs/d1',
        query: '',
        body: { name: 'Renamed', document, create_version: true },
      },
      { method: 'PATCH', path: '/v1/designs/d1', query: '', body: { kind: 'card' } },
      { method: 'DELETE', path: '/v1/designs/d1', query: '', body: undefined },
      { method: 'GET', path: '/v1/designs/d1/versions', query: '', body: undefined },
      {
        method: 'GET',
        path: '/v1/designs/d1/versions',
        query: '?include=document',
        body: undefined,
      },
      {
        method: 'POST',
        path: '/v1/designs/d1/versions/ver1/restore',
        query: '',
        body: undefined,
      },
      { method: 'POST', path: '/v1/designs/d1/duplicate', query: '', body: { name: 'Copy' } },
      {
        method: 'POST',
        path: '/v1/designs/d1/export',
        query: '',
        body: { format: 'mp4', page_indexes: [0, 2], duration_sec: 10 },
      },
      {
        method: 'POST',
        path: '/v1/designs/d1/bulk',
        query: '',
        body: { rows: [{ title: 'A' }, { title: 'B' }], name_column: 'title' },
      },
      { method: 'GET', path: '/v1/designs/d1/posts', query: '', body: undefined },
      {
        method: 'POST',
        path: '/v1/designs/text-to-slides',
        query: '',
        body: { workspace_id: 'ws', text: 'Five tips', max_slides: 6, brand_voice_id: null },
      },
      {
        method: 'POST',
        path: '/v1/designs/from-post',
        query: '',
        body: {
          workspace_id: 'ws',
          post_id: 'post1',
          style: 'quote',
          preset: 'instagram-portrait',
          account_id: 'a1',
          carousel: true,
          name: 'From post',
        },
      },
    ]);
  });

  it('unwraps a design and keeps the version beside it on update', async () => {
    const one = recordingClient({ data: design });
    expect(await one.client.designs.get('d1')).toEqual(design);

    const version = { id: 'ver1', version: 3, created_at: '2026-11-20T10:00:00.000Z' };
    const updated = recordingClient({ data: design, version });
    expect(await updated.client.designs.update('d1', { createVersion: true })).toEqual({
      data: design,
      version,
    });
  });

  it('decodes an export', async () => {
    const exported = {
      format: 'png',
      files: [{ media_id: 'm1', page_index: 0, mime_type: 'image/png', preview_url: '/f' }],
    };
    const { client } = recordingClient({ data: exported });
    expect(await client.designs.export('d1', { format: 'png' })).toEqual(exported);
  });
});

describe('fonts', () => {
  it('lists the library with the workspace uploads', async () => {
    const list = { library: [], uploaded: [] };
    const { calls, client } = recordingClient(list);
    expect(await client.fonts.list({ workspaceId: 'ws' })).toEqual(list);
    await client.fonts.list();
    expect(calls.map((c) => [c.method, c.path, c.query])).toEqual([
      ['GET', '/v1/fonts', '?workspace_id=ws'],
      ['GET', '/v1/fonts', ''],
    ]);
  });

  it('uploads one file as multipart', async () => {
    const font = {
      id: 'f1',
      family: 'Brand Sans',
      style: 'italic',
      weight: 700,
      format: 'woff2',
      file_url: '/v1/fonts/f1/file',
      created_at: '2026-11-20T10:00:00.000Z',
    };
    const { calls, client } = recordingClient(font, 201);
    const result = await client.fonts.upload({
      workspaceId: 'ws',
      file: { data: new Uint8Array([1, 2, 3]), filename: 'brand.woff2', mimeType: 'font/woff2' },
      family: 'Brand Sans',
      weight: 700,
      style: 'italic',
    });

    expect(result).toEqual(font);
    expect(calls[0]).toMatchObject({ method: 'POST', path: '/v1/fonts' });
    const form = calls[0].body as FormData;
    expect(form.get('workspace_id')).toBe('ws');
    expect(form.get('family')).toBe('Brand Sans');
    expect(form.get('weight')).toBe('700');
    expect(form.get('style')).toBe('italic');
    const file = form.get('file') as File;
    expect(file.name).toBe('brand.woff2');
    expect(file.size).toBe(3);
  });

  it('sends only the fields given', async () => {
    const { calls, client } = recordingClient({}, 201);
    await client.fonts.upload({
      workspaceId: 'ws',
      file: new File([new Uint8Array([1])], 'plain.ttf', { type: 'font/ttf' }),
    });
    const form = calls[0].body as FormData;
    expect([...form.keys()]).toEqual(['workspace_id', 'file']);
    expect((form.get('file') as File).name).toBe('plain.ttf');
  });

  it('deletes a font', async () => {
    const { calls, client } = recordingClient(undefined, 204);
    expect(await client.fonts.delete('f1')).toBeUndefined();
    expect(calls[0]).toMatchObject({ method: 'DELETE', path: '/v1/fonts/f1' });
  });
});

describe('videoEdits', () => {
  it('maps every method onto its route, query and body', async () => {
    const { calls, client } = recordingClient();
    await client.videoEdits.ops();
    await client.videoEdits.list({ workspaceId: 'ws', mediaId: 'm1', limit: 5 });
    await client.videoEdits.list();
    await client.videoEdits.create({
      workspaceId: 'ws',
      mediaId: 'm1',
      operations: [{ op: 'trim', params: { start: 1, end: 5 } }, { op: 'denoise' }],
    });
    await client.videoEdits.get('v1', { workspaceId: 'ws' });
    await client.videoEdits.get('v1');

    expect(calls).toEqual([
      { method: 'GET', path: '/v1/video-edits/ops', query: '', body: undefined },
      {
        method: 'GET',
        path: '/v1/video-edits',
        query: '?workspace_id=ws&media_id=m1&limit=5',
        body: undefined,
      },
      { method: 'GET', path: '/v1/video-edits', query: '', body: undefined },
      {
        method: 'POST',
        path: '/v1/video-edits',
        query: '',
        body: {
          workspace_id: 'ws',
          media_id: 'm1',
          operations: [{ op: 'trim', params: { start: 1, end: 5 } }, { op: 'denoise' }],
        },
      },
      { method: 'GET', path: '/v1/video-edits/v1', query: '?workspace_id=ws', body: undefined },
      { method: 'GET', path: '/v1/video-edits/v1', query: '', body: undefined },
    ]);
  });

  it('decodes the bare job the API answers', async () => {
    const { client } = recordingClient(job, 201);
    expect(await client.videoEdits.create({ mediaId: 'm1', operations: [{ op: 'trim' }] })).toEqual(
      job,
    );
  });

  it('unwraps the ops list', async () => {
    const ops = [{ name: 'trim', available: true, uses_ai: false }];
    const { client } = recordingClient({ data: ops });
    expect(await client.videoEdits.ops()).toEqual(ops);
  });
});

describe('media.generateAltText', () => {
  it('posts to the media item and decodes the alt text', async () => {
    const answer = { alt_text: 'A red bicycle', alt_text_source: 'ai', tags: ['bicycle'] };
    const { calls, client } = recordingClient(answer);
    expect(await client.media.generateAltText('m1')).toEqual(answer);
    expect(calls).toEqual([
      { method: 'POST', path: '/v1/media/m1/alt-text', query: '', body: undefined },
    ]);
  });
});
