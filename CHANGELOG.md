# Changelog

All notable changes to `@fopost/sdk` are documented here.

## Unreleased

### Added

- `accounts.listSlackChannels` and `listSlackMembers` list a Slack account's channels
  and workspace members; a member's `id` is the handle for `inbox.startConversation`.
- `accounts.getSlackIdentity` and `updateSlackIdentity` read and set the name and icon
  a Slack account posts under. All need the `accounts` scope.
- `accounts.listRedditSubreddits`, `listRedditSubredditRules`, `listRedditFlairs` and
  `setRedditDefaultSubreddit` cover a Reddit account's destinations: the subreddits it
  is in, a subreddit's rules and post flairs, and where posts go when one names no
  subreddit. They need the `accounts` scope, and an account connected before those
  permissions were asked for answers `409 reconnect_required`.
- `validate.subreddit` asks whether a subreddit exists and takes a post from an
  account, before a post exists. Needs the `posts` scope.
- `inbox.vote` votes an item up or down where the network ranks by votes (Reddit), or
  takes an earlier vote back with `none`. Needs `inbox` and `publish`.
- `Account.reconnectRequired` and the inbox item's `vote` and `canVote` are new on the
  existing shapes.

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
