import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { FoPost } from './index.js';
import {
  ChatAdapterError,
  INBOUND_EVENT,
  createChatAdapter,
  type ChatMessage,
} from './chat-adapter.js';
import type { InboxItem } from './types.js';

const SECRET = 'whsec_test';

const item = (over: Partial<InboxItem> = {}): InboxItem =>
  ({
    id: 'itm_1',
    workspaceId: 'ws_1',
    platform: 'instagram',
    type: 'dm',
    state: 'unread',
    direction: 'inbound',
    conversationId: 'conv_1',
    authorName: 'Sam Rivera',
    authorHandle: 'samrivera',
    authorAvatarUrl: null,
    text: 'Do you ship to Portugal?',
    attachments: [],
    permalink: null,
    postExternalId: null,
    parentExternalId: null,
    platformCreatedAt: '2026-09-20T09:00:00.000Z',
    snoozedUntil: null,
    repliedAt: null,
    createdAt: '2026-09-20T09:00:01.000Z',
    canReply: true,
    hidden: false,
    liked: false,
    pinned: false,
    reaction: null,
    editedAt: null,
    canHide: false,
    canDelete: false,
    canLike: true,
    canPin: false,
    canEdit: false,
    canReact: true,
    canSendMedia: true,
    canQuickReply: false,
    post: null,
    postContext: null,
    account: {
      id: 'acc_1',
      platform: 'instagram',
      username: 'yourbrand',
      name: 'Your Brand',
      avatar: null,
    },
    ...over,
  }) as InboxItem;

type Call = { method: string; path: string; query: URLSearchParams; body: unknown };

/** A fetch stub that records every call and answers from a route table. */
function mockApi(routes: Record<string, (call: Call) => unknown>) {
  const calls: Call[] = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = new URL(String(input));
    const call: Call = {
      method: init?.method ?? 'GET',
      path: url.pathname,
      query: url.searchParams,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    };
    calls.push(call);
    const handler = routes[`${call.method} ${call.path}`];
    if (!handler) throw new Error(`unmocked ${call.method} ${call.path}`);
    return new Response(JSON.stringify(handler(call)), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
  return { calls, fetchImpl };
}

const adapterFor = (fetchImpl: typeof fetch) =>
  createChatAdapter({
    client: new FoPost({ apiKey: 'test', fetch: fetchImpl }),
    workspaceId: 'ws_1',
    webhookSecret: SECRET,
  });

const delivery = (payload: Record<string, unknown>) => {
  const body = JSON.stringify({
    event: INBOUND_EVENT,
    data: payload,
    timestamp: '2026-09-20T09:00:02.000Z',
  });
  const timestamp = Math.floor(Date.now() / 1000);
  return {
    body,
    headers: {
      'X-FoPost-Event': INBOUND_EVENT,
      'X-FoPost-Timestamp': String(timestamp),
      'X-FoPost-Signature': `sha256=${createHmac('sha256', SECRET).update(body).digest('hex')}`,
      'X-FoPost-Signature-256': `sha256=${createHmac('sha256', SECRET)
        .update(`${timestamp}.${body}`)
        .digest('hex')}`,
    },
  };
};

describe('chat adapter round trip', () => {
  it('turns a delivery into a message and a reply into a sent message', async () => {
    const inbound = item();
    const { calls, fetchImpl } = mockApi({
      'GET /v1/inbox': () => ({ data: [inbound], meta: { page: 1, perPage: 25, total: 1 } }),
      'POST /v1/inbox/itm_1/reply': () => ({
        data: {
          item: item({
            id: 'itm_2',
            direction: 'outbound',
            text: 'We do, in three to five days.',
            authorName: 'Your Brand',
            authorHandle: 'yourbrand',
            state: 'read',
          }),
          reply: { externalId: 'ig_9', externalUrl: null },
        },
      }),
      'PATCH /v1/inbox/itm_1': () => ({ data: item({ state: 'read' }) }),
    });
    const chat = adapterFor(fetchImpl);

    const { body, headers } = delivery({
      itemId: 'itm_1',
      type: 'dm',
      platform: 'instagram',
      accountId: 'acc_1',
      receivedAt: '2026-09-20T09:00:00.000Z',
    });

    const event = await chat.parseWebhook(body, headers);
    expect(event).toMatchObject({ event: INBOUND_EVENT, itemId: 'itm_1', accountId: 'acc_1' });

    const received = (await chat.receiveOne(event)) as ChatMessage;
    expect(received).toMatchObject({
      id: 'itm_1',
      conversationId: 'conv_1',
      accountId: 'acc_1',
      direction: 'inbound',
      text: 'Do you ship to Portugal?',
      author: { handle: 'samrivera', name: 'Sam Rivera' },
    });

    const sent = await chat.send({ replyTo: received.id, text: 'We do, in three to five days.' });
    expect(sent).toMatchObject({ id: 'itm_2', direction: 'outbound' });

    await chat.markRead(received);

    expect(calls.map((c) => `${c.method} ${c.path}`)).toEqual([
      'GET /v1/inbox',
      'POST /v1/inbox/itm_1/reply',
      'PATCH /v1/inbox/itm_1',
    ]);
    expect(calls[0].query.get('account_id')).toBe('acc_1');
    expect(calls[0].query.get('workspace_id')).toBe('ws_1');
    expect(calls[1].body).toEqual({ text: 'We do, in three to five days.' });
    expect(calls[2].body).toEqual({ state: 'read' });
  });

  it('receives unread inbound DMs and nothing else', async () => {
    const { calls, fetchImpl } = mockApi({
      'GET /v1/inbox': () => ({ data: [item()], meta: { page: 1, perPage: 25, total: 1 } }),
    });
    const messages = await adapterFor(fetchImpl).receive();
    expect(messages).toHaveLength(1);
    expect(calls[0].query.get('type')).toBe('dm');
    expect(calls[0].query.get('direction')).toBe('inbound');
    expect(calls[0].query.get('state')).toBe('unread');
  });

  it('replies into a conversation through its newest message', async () => {
    const { calls, fetchImpl } = mockApi({
      'GET /v1/inbox': () => ({ data: [item()], meta: { page: 1, perPage: 1, total: 1 } }),
      'POST /v1/inbox/itm_1/reply': () => ({
        data: {
          item: item({ id: 'itm_3', direction: 'outbound' }),
          reply: { externalId: null, externalUrl: null },
        },
      }),
    });
    const sent = await adapterFor(fetchImpl).send({
      conversationId: 'conv_1',
      text: 'Still here.',
    });
    expect(sent.id).toBe('itm_3');
    expect(calls[0].query.get('conversation_id')).toBe('conv_1');
    expect(calls[0].query.get('sort')).toBe('newest');
  });

  it('opens a conversation by handle', async () => {
    const { calls, fetchImpl } = mockApi({
      'POST /v1/inbox/conversations': () => ({
        data: { conversationId: 'conv_9', item: item({ id: 'itm_9', direction: 'outbound' }) },
      }),
    });
    const sent = await adapterFor(fetchImpl).send({
      accountId: 'acc_1',
      handle: 'samrivera',
      text: 'Following up.',
    });
    expect(sent.id).toBe('itm_9');
    expect(calls[0].body).toEqual({
      text: 'Following up.',
      account_id: 'acc_1',
      handle: 'samrivera',
    });
  });

  it('answers null when the item has aged past the lookback', async () => {
    const { fetchImpl } = mockApi({
      'GET /v1/inbox': () => ({
        data: [item({ id: 'other' })],
        meta: { page: 1, perPage: 25, total: 1 },
      }),
    });
    expect(await adapterFor(fetchImpl).receiveOne('itm_gone')).toBeNull();
  });
});

describe('chat adapter webhook verification', () => {
  const noApi = (async () => {
    throw new Error('the adapter must not call the API to verify');
  }) as unknown as typeof fetch;

  it('refuses a body that does not match its signature', async () => {
    const { headers } = delivery({ itemId: 'itm_1', accountId: 'acc_1', type: 'dm' });
    await expect(
      adapterFor(noApi).parseWebhook('{"event":"inbox.message_received","data":{}}', headers),
    ).rejects.toMatchObject({ code: 'invalid_signature' });
  });

  it('refuses a delivery signed outside the tolerance', async () => {
    const { body, headers } = delivery({ itemId: 'itm_1', accountId: 'acc_1', type: 'dm' });
    const stale = {
      ...headers,
      'X-FoPost-Timestamp': String(Math.floor(Date.now() / 1000) - 4000),
    };
    await expect(adapterFor(noApi).parseWebhook(body, stale)).rejects.toMatchObject({
      code: 'stale_delivery',
    });
  });

  it('verifies the compatibility signature when the timestamped one is absent', async () => {
    const { body, headers } = delivery({ itemId: 'itm_1', accountId: 'acc_1', type: 'dm' });
    const { 'X-FoPost-Signature-256': _dropped, ...legacy } = headers;
    await expect(adapterFor(noApi).parseWebhook(body, legacy)).resolves.toMatchObject({
      itemId: 'itm_1',
    });
  });

  it('refuses an event it is not the inbound side of', async () => {
    const body = JSON.stringify({ event: 'post.published', data: {}, timestamp: null });
    const timestamp = Math.floor(Date.now() / 1000);
    const headers = {
      'X-FoPost-Timestamp': String(timestamp),
      'X-FoPost-Signature-256': `sha256=${createHmac('sha256', SECRET)
        .update(`${timestamp}.${body}`)
        .digest('hex')}`,
    };
    await expect(adapterFor(noApi).parseWebhook(body, headers)).rejects.toMatchObject({
      code: 'unexpected_event',
    });
  });

  it('refuses to verify without a secret', async () => {
    const chat = createChatAdapter({ client: new FoPost({ apiKey: 'test', fetch: noApi }) });
    await expect(chat.parseWebhook('{}', {})).rejects.toBeInstanceOf(ChatAdapterError);
  });
});
