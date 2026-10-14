/**
 * @fopost/sdk/chat-adapter: the FoPost social inbox as a send/receive interface
 * for chatbot frameworks.
 *
 *   import { FoPost } from '@fopost/sdk';
 *   import { createChatAdapter } from '@fopost/sdk/chat-adapter';
 *
 *   const chat = createChatAdapter({
 *     client: new FoPost({ apiKey: process.env.FOPOST_API_KEY! }),
 *     webhookSecret: process.env.FOPOST_WEBHOOK_SECRET,
 *   });
 *
 *   // inbound: your webhook route
 *   const event = await chat.parseWebhook(rawBody, request.headers);
 *   const message = await chat.receiveOne(event);
 *
 *   // outbound
 *   if (message) await chat.send({ replyTo: message.id, text: 'On it.' });
 */

import type { FoPost } from './index.js';
import {
  EVENT_HEADER,
  WebhookError,
  verifyWebhookSignature,
  webhookHeader as header,
  type WebhookHeaders,
} from './webhooks.js';
import type {
  InboxAttachment,
  InboxItem,
  InboxItemType,
  ListInboxParams,
  Platform,
} from './types.js';

/** The webhook event a new direct message raises. */
export const INBOUND_EVENT = 'inbox.message_received';

export { SIGNATURE_TOLERANCE_SECONDS } from './webhooks.js';

export type ChatAdapterErrorCode =
  | 'invalid_body'
  | 'unexpected_event'
  | 'missing_secret'
  | 'invalid_signature'
  | 'stale_delivery'
  | 'unsupported_target';

export class ChatAdapterError extends Error {
  readonly code: ChatAdapterErrorCode;
  constructor(code: ChatAdapterErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = 'ChatAdapterError';
  }
}

export type ChatAuthor = {
  name: string | null;
  handle: string | null;
  avatarUrl: string | null;
};

/** One inbound or outbound message, flattened out of an inbox item. */
export type ChatMessage = {
  id: string;
  conversationId: string | null;
  accountId: string | null;
  platform: Platform;
  type: InboxItemType;
  direction: 'inbound' | 'outbound';
  text: string;
  author: ChatAuthor;
  attachments: InboxAttachment[];
  receivedAt: string | null;
  canReply: boolean;
  /** The untouched inbox item, for anything this shape drops. */
  raw: InboxItem;
};

/** A verified webhook delivery. Ids only: the text lives behind the API. */
export type ChatEvent = {
  event: string;
  itemId: string;
  type: InboxItemType;
  platform: string;
  accountId: string;
  receivedAt: string | null;
  /** When the API built the envelope, not when it was signed. */
  timestamp: string | null;
};

export type ChatAdapterOptions = {
  client: FoPost;
  /** Scopes every read. Required when the key reaches more than one workspace. */
  workspaceId?: string;
  /** Enables parseWebhook and verifyWebhook. Read it off the webhook in FoPost. */
  webhookSecret?: string;
  /** Items per page when reading. Default 25. */
  pageSize?: number;
  /** How many pages receiveOne scans for an id. Default 4. */
  lookbackPages?: number;
};

export type ReceiveParams = {
  accountId?: string;
  conversationId?: string;
  platform?: Platform;
  /** Default `unread`. Pass null to read every state. */
  state?: 'unread' | 'read' | 'resolved' | 'snoozed' | null;
  /** Default the adapter's page size. */
  limit?: number;
};

/** Reply to a message, reply into a thread, or open one by handle. */
export type OutboundMessage =
  | { replyTo: string; text?: string; mediaIds?: string[]; quickReplies?: string[] }
  | { conversationId: string; text?: string; mediaIds?: string[]; quickReplies?: string[] }
  | { accountId: string; handle: string; text: string; mediaIds?: string[] };

/** Anything a framework hands us as headers. */
export type HeaderSource = WebhookHeaders;

// ─── Mapping ───────────────────────────────────────────────────────

export function toChatMessage(item: InboxItem): ChatMessage {
  return {
    id: item.id,
    conversationId: item.conversationId,
    accountId: item.account?.id ?? null,
    platform: item.platform,
    type: item.type,
    direction: item.direction,
    text: item.text ?? '',
    author: {
      name: item.authorName,
      handle: item.authorHandle,
      avatarUrl: item.authorAvatarUrl,
    },
    attachments: item.attachments,
    receivedAt: item.platformCreatedAt ?? item.createdAt,
    canReply: item.canReply,
    raw: item,
  };
}

// ─── Adapter ───────────────────────────────────────────────────────

export class ChatAdapter {
  private readonly client: FoPost;
  private readonly workspaceId?: string;
  private readonly webhookSecret?: string;
  private readonly pageSize: number;
  private readonly lookbackPages: number;

  constructor(options: ChatAdapterOptions) {
    this.client = options.client;
    this.workspaceId = options.workspaceId;
    this.webhookSecret = options.webhookSecret;
    this.pageSize = options.pageSize ?? 25;
    this.lookbackPages = options.lookbackPages ?? 4;
  }

  // ── Inbound ──

  /**
   * Verifies the delivery and returns the event. Prefers the replay-safe
   * `X-FoPost-Signature-256`, falling back to `X-FoPost-Signature` when the
   * endpoint predates it. Pass the raw body, never a re-serialized object.
   */
  async parseWebhook(body: string, headers: HeaderSource): Promise<ChatEvent> {
    await this.verifyWebhook(body, headers);

    let envelope: { event?: unknown; data?: unknown; timestamp?: unknown };
    try {
      envelope = JSON.parse(body) as typeof envelope;
    } catch {
      throw new ChatAdapterError('invalid_body', 'Webhook body is not JSON');
    }

    const event =
      typeof envelope.event === 'string' ? envelope.event : header(headers, EVENT_HEADER);
    if (event !== INBOUND_EVENT) {
      throw new ChatAdapterError(
        'unexpected_event',
        `Expected ${INBOUND_EVENT}, got ${event ?? 'nothing'}`,
      );
    }

    const data = (envelope.data ?? {}) as Record<string, unknown>;
    if (typeof data.itemId !== 'string' || typeof data.accountId !== 'string') {
      throw new ChatAdapterError('invalid_body', 'Webhook payload carries no item id');
    }

    return {
      event,
      itemId: data.itemId,
      type: (data.type as InboxItemType | undefined) ?? 'dm',
      platform: typeof data.platform === 'string' ? data.platform : '',
      accountId: data.accountId,
      receivedAt: typeof data.receivedAt === 'string' ? data.receivedAt : null,
      timestamp: typeof envelope.timestamp === 'string' ? envelope.timestamp : null,
    };
  }

  /** Throws `ChatAdapterError` when the delivery is unsigned, forged or stale. */
  async verifyWebhook(body: string, headers: HeaderSource): Promise<void> {
    if (!this.webhookSecret) {
      throw new ChatAdapterError('missing_secret', 'Pass webhookSecret to verify a delivery');
    }
    try {
      await verifyWebhookSignature(body, headers, this.webhookSecret);
    } catch (err) {
      if (err instanceof WebhookError && err.code !== 'invalid_body') {
        throw new ChatAdapterError(err.code, err.message);
      }
      throw err;
    }
  }

  /** Inbound direct messages, newest first. Unread by default. */
  async receive(params: ReceiveParams = {}): Promise<ChatMessage[]> {
    const state = params.state === undefined ? 'unread' : params.state;
    const page = await this.client.inbox.list({
      ...this.scope(),
      type: 'dm',
      direction: 'inbound',
      ...(state === null ? {} : { state }),
      accountId: params.accountId,
      conversationId: params.conversationId,
      platform: params.platform,
      perPage: params.limit ?? this.pageSize,
    });
    return page.data.map(toChatMessage);
  }

  /**
   * The message behind a webhook event, or an item id. The event carries ids
   * only, so this reads the text back through the inbox; it scans
   * `lookbackPages` of that account's items and answers `null` when the item
   * has aged past them or was deleted.
   */
  async receiveOne(ref: string | ChatEvent): Promise<ChatMessage | null> {
    const id = typeof ref === 'string' ? ref : ref.itemId;
    const narrow: Partial<ListInboxParams> =
      typeof ref === 'string' ? {} : { accountId: ref.accountId, type: ref.type };

    for (let page = 1; page <= this.lookbackPages; page += 1) {
      const result = await this.client.inbox.list({
        ...this.scope(),
        ...narrow,
        page,
        perPage: this.pageSize,
      });
      const found = result.data.find((item) => item.id === id);
      if (found) return toChatMessage(found);
      if (result.data.length < this.pageSize) return null;
    }
    return null;
  }

  // ── Outbound ──

  /** Sends on the platform as the connected account. Needs the `publish` scope. */
  async send(message: OutboundMessage): Promise<ChatMessage> {
    if ('replyTo' in message) {
      const result = await this.client.inbox.reply(message.replyTo, message.text, {
        mediaIds: message.mediaIds,
        quickReplies: message.quickReplies,
      });
      return toChatMessage(result.item);
    }

    if ('conversationId' in message) {
      const latest = await this.latestIn(message.conversationId);
      if (!latest) {
        throw new ChatAdapterError(
          'unsupported_target',
          `Conversation ${message.conversationId} has no message to reply to`,
        );
      }
      const result = await this.client.inbox.reply(latest.id, message.text, {
        mediaIds: message.mediaIds,
        quickReplies: message.quickReplies,
      });
      return toChatMessage(result.item);
    }

    const started = await this.client.inbox.startConversation({
      accountId: message.accountId,
      handle: message.handle,
      text: message.text,
      mediaIds: message.mediaIds,
    });
    if (!started.item) {
      throw new ChatAdapterError(
        'unsupported_target',
        `${message.handle} accepted the message but returned no item`,
      );
    }
    return toChatMessage(started.item);
  }

  /** Shows (default) or clears the typing indicator. Needs the `publish` scope. */
  async typing(conversationId: string, accountId: string, on = true): Promise<void> {
    await this.client.inbox.setTyping(conversationId, accountId, on);
  }

  /** Marks one message read, so `receive()` stops returning it. */
  async markRead(message: ChatMessage | string): Promise<void> {
    await this.client.inbox.update(typeof message === 'string' ? message : message.id, {
      state: 'read',
    });
  }

  // ── Internals ──

  private scope(): { workspaceId?: string } {
    return this.workspaceId === undefined ? {} : { workspaceId: this.workspaceId };
  }

  private async latestIn(conversationId: string): Promise<InboxItem | null> {
    const page = await this.client.inbox.list({
      ...this.scope(),
      conversationId,
      sort: 'newest',
      perPage: 1,
    });
    return page.data[0] ?? null;
  }
}

export function createChatAdapter(options: ChatAdapterOptions): ChatAdapter {
  return new ChatAdapter(options);
}
