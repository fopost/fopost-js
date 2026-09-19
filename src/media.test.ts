import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';

type Call = { method: string; url: string; headers: Record<string, string>; body: unknown };

const presigned = {
  uploadId: 'up1',
  uploadUrl: 'https://storage.example.com/bucket/up1?sig=abc',
  method: 'PUT',
  headers: { 'Content-Type': 'image/png' },
  expiresAt: '2026-09-19T12:00:00.000Z',
};
const media = {
  id: 'm1',
  type: 'image',
  name: 'logo.png',
  url: 'https://api.fopost.com/v1/media/m1/file',
  previewUrl: 'https://api.fopost.com/v1/media/m1/file',
  size: 4,
};

function recordingClient(putStatus = 200) {
  const calls: Call[] = [];
  const fetchImpl = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    calls.push({
      method: init?.method ?? 'GET',
      url,
      headers: (init?.headers as Record<string, string>) ?? {},
      body: init?.body,
    });
    if (url.startsWith('https://storage.example.com/')) {
      return new Response(putStatus === 200 ? null : 'denied', { status: putStatus });
    }
    const data = url.endsWith('/complete') ? media : presigned;
    return new Response(JSON.stringify({ data }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  }) as unknown as typeof fetch;
  return { calls, client: new FoPost({ apiKey: 'test-key', fetch: fetchImpl }) };
}

describe('media.uploadDirect', () => {
  it('presigns, PUTs the bytes without the API key, then completes', async () => {
    const { calls, client } = recordingClient();
    const bytes = new Uint8Array([1, 2, 3, 4]);
    const result = await client.media.uploadDirect({
      workspaceId: 'ws',
      filename: 'logo.png',
      mimeType: 'image/png',
      data: bytes,
    });

    expect(result).toEqual(media);
    expect(calls).toHaveLength(3);

    expect(calls[0]).toMatchObject({
      method: 'POST',
      url: 'https://api.fopost.com/v1/media/presign',
    });
    expect(JSON.parse(String(calls[0].body))).toEqual({
      workspaceId: 'ws',
      filename: 'logo.png',
      mimeType: 'image/png',
      size: 4,
    });

    expect(calls[1]).toMatchObject({ method: 'PUT', url: presigned.uploadUrl });
    expect(calls[1].headers).toEqual({ 'Content-Type': 'image/png', 'Content-Length': '4' });
    expect(calls[1].body).toBe(bytes);

    expect(calls[2]).toMatchObject({
      method: 'POST',
      url: 'https://api.fopost.com/v1/media/presign/up1/complete',
      body: undefined,
    });
    expect(calls[2].headers['X-API-Key']).toBe('test-key');
  });

  it('throws FoPostError on a failed PUT and never completes', async () => {
    const { calls, client } = recordingClient(403);
    await expect(
      client.media.uploadDirect({
        workspaceId: 'ws',
        filename: 'logo.png',
        mimeType: 'image/png',
        data: new Blob(['abcd']),
      }),
    ).rejects.toMatchObject({ name: 'FoPostError', status: 403, message: 'denied' });
    expect(calls).toHaveLength(2);
    expect(calls[0].body).toContain('"size":4');
  });

  it('sizes an ArrayBuffer', async () => {
    const { calls, client } = recordingClient();
    await client.media.uploadDirect({
      workspaceId: 'ws',
      filename: 'a.bin',
      mimeType: 'application/octet-stream',
      data: new ArrayBuffer(8),
    });
    expect(JSON.parse(String(calls[0].body)).size).toBe(8);
    expect(calls[1].headers['Content-Length']).toBe('8');
  });
});
