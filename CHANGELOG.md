# Changelog

All notable changes to `@fopost/sdk` are documented here.

## Unreleased

### Added

- `fopost.validate`: the preflight checks for content that is not a post yet.
  `post` (issues and signals per platform), `length` (counted length against
  each platform limit) and `media` (the upload checks on a file by URL, without
  storing it). Needs the `posts` scope.

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
