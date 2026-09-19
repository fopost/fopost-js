# Changelog

All notable changes to `@fopost/sdk` are documented here.

## Unreleased

### Added

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
