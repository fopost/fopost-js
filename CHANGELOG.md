# Changelog

All notable changes to `@fopost/sdk` are documented here.

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
