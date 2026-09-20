# Changelog

All notable changes to `@fopost/sdk` are documented here.

## Unreleased

### Added

- `InboxItem.moderationStatus` carries the platform's own state for a comment
  (`published`, `held`, `spam`, `rejected`), and `InboxAccount.reconnectRequired`
  flags an account connected before the inbox asked for a permission it needs.
- `DiscordChannel.can_post` says whether the bot may actually post in a channel; a
  channel permission in Discord can shut it out even though the server allows it.
  `switchDiscordChannel` answers `409 channel_not_writable` for such a channel.
- `accounts.listDiscordChannels`, `switchDiscordChannel`, `getDiscordIdentity` and
  `updateDiscordIdentity` read and change where a Discord bot connection posts and the
  nickname and avatar it wears.
- `accounts.listDiscordPins`, `deleteDiscordMessage`, `pinDiscordMessage`,
  `unpinDiscordMessage`, `crosspostDiscordMessage`, `createDiscordThread` and
  `sendDiscordDm` act on messages in the connected channel; these also need the
  `publish` scope.
- `accounts.listDiscordEvents`, `getDiscordEvent`, `createDiscordEvent`,
  `updateDiscordEvent` and `deleteDiscordEvent` manage the server's scheduled events.
- `accounts.listDiscordMembers`, `getDiscordMember`, `listDiscordRoles`,
  `createDiscordRole`, `updateDiscordRole`, `deleteDiscordRole`, `addDiscordMemberRole`
  and `removeDiscordMemberRole` manage the server's roster and roles. A Discord
  connection made with a webhook answers `409 webhook_connection` on all of them.
- `knowledge` resource for the workspace knowledge base: `list`, `create`, `update`,
  `delete`, `sync` and `search`. A source is an FAQ, a note, a URL on your own site or
  a plain-text/CSV media item; `search` returns the passages closest to a question, and
  is what grounds a drafted inbox reply in your own answers. Needs the `inbox` scope.
- `broadcasts` namespace: one message into every conversation the workspace already has
  with a segment of its contacts. `list`, `get`, `create`, `update`, `delete`, `send`,
  `cancel`, and `recipients`. Reading needs the `inbox` scope; `send` and `cancel` also
  need `publish`.
- `sequences` namespace: a series of messages on a delay. `list`, `get`, `create`,
  `update`, `delete`, `enroll`, `unenroll`, and `enrollments`. `enroll` and `unenroll`
  need `publish` as well as `inbox`.
- Both honour each network's messaging window server-side. Messenger and Instagram take a
  business-initiated message only within 24 hours of the contact's last one, so recipients
  outside it come back `skipped` with `skip_reason: 'window_closed'` and nothing is
  attempted — the number sent is often lower than the audience.

- `contacts` namespace: the people behind the inbox. `list`, `get`, `create`, `update`,
  `delete`, `conversations` (the threads one person appears in), `import` (CSV), and
  `listFields`/`createField`/`updateField`/`deleteField` for the custom columns a
  workspace keeps. All need the `inbox` scope.
- `contacts.conversationAnalytics` reads `/v1/analytics/inbox/conversations`: volume and
  median reply time per thread. Needs the `analytics` scope.
- `@fopost/sdk/chat-adapter`, a send/receive interface over the inbox for chatbot
  frameworks. `createChatAdapter({ client })` gives `receive`, `receiveOne`, `send`,
  `typing` and `markRead`, plus `parseWebhook` and `verifyWebhook`, which verify an
  `inbox.message_received` delivery (timestamped signature preferred, compatibility
  signature accepted) and turn it into a `ChatMessage`. Sending needs `publish`.

- `ads.google` wraps the Google Ads surface: keywords and keyword ideas, search terms,
  bid strategies, ad schedule, negative keyword lists, assets, Performance Max asset
  groups, Local Services leads, conversions, and `query` for a raw GAQL read. Changes
  need the `publish` scope as well as `ads`.
- `ads.authorizeGoogle` starts a Google Ads connection.

- `accounts.listSlackChannels` and `listSlackMembers` list a Slack account's channels
  and workspace members; a member's `id` is the handle for `inbox.startConversation`.
- `accounts.getSlackIdentity` and `updateSlackIdentity` read and set the name and icon
  a Slack account posts under. All need the `accounts` scope.
- Meta messaging settings on `accounts`: `getIceBreakers`, `setIceBreakers` and
  `deleteIceBreakers` (Facebook Pages and Instagram), plus `getPersistentMenu`,
  `setPersistentMenu`, `deletePersistentMenu`, `getGreeting`, `setGreeting` and
  `deleteGreeting` (Facebook Pages). Networks without a field answer 400.
- `accounts.getWebhookSubscription` reports whether the network is still delivering
  events for an account, and `resubscribeWebhook` puts a lapsed subscription back.
- `inbox.handover` passes a Messenger thread to another Meta app, or takes it back
  when no `appId` is given. Needs `inbox` and `publish`.
- `googleBusiness` namespace: manage a connected Google Business Profile location —
  the profile (`getLocation`, `updateLocation`), attributes, food menus, services,
  photos (from the media library, JPEG or PNG), place action links, verification,
  performance and search keywords, plus `assign` to hand the location to another
  workspace. Reads need the `accounts` scope, writes `publish` as well. Every method
  raises a 503 `configuration_error` until Google grants the deployment Business
  Profile API access.
- Array query values now repeat the parameter, which is how `getPerformance` sends
  `daily_metrics`.

## 0.6.0

### Added

- Campaign tree on `ads`, by Meta id and `connectionId`: `accountTree`, and create,
  get, update, delete and duplicate for campaigns (`createCampaign`…), ad sets
  (`createAdSet`…) and ads inside an ad set (`createNetworkAd`…), plus
  `bulkSetStatus`. Changes need the `publish` scope as well as `ads`.
- Creatives: `creatives`, `createCreative` (image, video or carousel, with a call to
  action and URL tags), `getCreative`, `deleteCreative`.
- Audiences: `getAudience`, `updateAudience`, `deleteAudience`, `addAudienceUsers`.
- `estimateReach`, `insights` for any Meta object and `adInsights` for a FoPost ad,
  with a date range, an optional breakdown and a daily timeline.
- Lead forms and the leads feed: `getLeadForm`, `archiveLeadForm`, `leadsFeed`
  (pass `nextCursor` back as `cursor`), `leadPages`, `subscribeLeadPage`,
  `unsubscribeLeadPage`.
- `ads.create` takes `urlTags`; `Ad.creative` carries it.
- `accounts.createTelegramConnectCode` mints a one-time code; sending
  `/connect <code>` to the bot in a chat connects that chat.
  `accounts.getTelegramConnectStatus` reports the outcome.
- `accounts.getTelegramBotCommands`, `setTelegramBotCommands` and
  `deleteTelegramBotCommands` manage the bot's command menu in a connected chat.
  All need the `accounts` scope.

## 0.5.0

### Added

- `inbox.like`, `unlike`, `pin`, `unpin` and `react` act on an item on the platform,
  `inbox.editComment` edits our own comment, `inbox.startConversation` opens a DM by
  handle or answers a comment privately, and `inbox.setTyping` shows or clears the
  typing indicator. All need the `publish` scope.
- `inbox.reply` takes `mediaIds` and `quickReplies`; `text` may be omitted when
  `mediaIds` is given.
- Inbox items carry `liked`, `pinned`, `reaction`, `editedAt` and the `canLike`,
  `canPin`, `canEdit`, `canReact`, `canSendMedia`, `canQuickReply` and
  `canPrivateReply` flags. Inbox accounts carry `canStartConversation`.

### Changed

- `inbox.delete` also deletes our own replies, which needs the `publish` scope.

## 0.4.0

### Added

- `fopost.media`: direct uploads. `presign` signs a PUT for one file, `complete`
  turns the staged object into a library item, and `uploadDirect` does all
  three steps. Needs the `posts` scope.
- `fopost.validate`: the preflight checks for content that is not a post yet.
  `post` (issues and signals per platform), `length` (counted length against
  each platform limit) and `media` (the upload checks on a file by URL, without
  storing it). Needs the `posts` scope.
- `fopost.accountGroups`: named sets of accounts. `list`, `get`, `create`,
  `update` (rename), `delete` and `setMembers`. Needs the `accounts` scope.
- `accounts.update` renames an account (`displayName: null` restores the
  platform name) and `accounts.move` moves one to another workspace you own.
  `accounts.list` takes a `groupId` filter, and accounts carry `platformName`.
- `posts.create` takes `accountGroupId`, merged with `accounts`; `accounts` may
  be omitted when a group is given.

## 0.3.0

### Added

- `fopost.inbox`: comments, mentions and DMs across connected accounts. List,
  thread and conversation views, reply, state changes, hide, unhide, delete, a
  manual refresh, and the replies awaiting approval. Needs the `inbox` scope.
- `fopost.ads`: Meta Ads. Connections and sources, boost a published post,
  create an ad, pause, resume, refresh and delete, plus audiences, targeting
  search and Instant Form leads. Needs the `ads` scope; boost, create,
  setStatus and delete also need `publish`.

## 0.2.3

### Fixed

- **Every request 404'd.** The SDK sent requests to `/api/v1/...`, but the FoPost
  API serves its routes at `/v1/...` on `https://api.fopost.com`, so every call
  made by 0.2.x hit a path that does not exist. All 20 request paths now target
  `/v1`. Upgrade from any earlier 0.2.x release — no code change is needed on
  your side, and a custom `baseUrl` still stays host-only.

### Added

- A regression test asserting every request path starts with `/v1/` and never
  contains `/api/v1/`, plus a CI workflow running typecheck, tests, and build.
