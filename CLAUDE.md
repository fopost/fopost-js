# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## What This Is

`@fopost/sdk` on npm — the official TypeScript/Node.js client for the FoPost REST API
(`fopost.com`). Current version `0.6.0`. It wraps the API's HTTP surface in a namespaced
client (`posts`, `accounts`, `accountGroups`, `workspaces`, `labels`, `ai`, `inbox`, `contacts`, `ads`) with hand-written DTOs.

Requires Node >= 18 (`globalThis.fetch`). Source is ESM TypeScript; `tsup` emits ESM +
CJS + `.d.ts`/`.d.cts` into `dist/`. Zero runtime dependencies.

## Downstream Packages

These repos wrap this SDK and must be updated in lockstep:

- `fopost-next` — Next.js integration for the FoPost API
- `fopost-github-action` — GitHub Action that publishes posts from a workflow

**Whenever you change this SDK's public surface — a renamed method, a changed parameter,
a new or removed resource, a new error type, a bumped minimum language version — you must
open a matching PR in every repo listed above in the same session.** They are separate
git repos, checked out as siblings at `../fopost-<child>`. A parent release that silently
breaks a child is only discovered by the user who upgrades first.

Also bump the child's dependency constraint on this package and note the change in its
CHANGELOG when this package is released.

## Brand Rules

- The product is **FoPost** (`fopost.com`). Never write "OwlStack" — retired Aug 2026.
- Never write an email address. Support is https://fopost.com/contact and GitHub issues.
- Never name AI providers/models, infrastructure vendors, or any person. `ai.generateCaption`
  and friends return captions and credit counts — never a model name.
- Never type a platform count. The README says "+30 social platforms"; keep it that way.

## Architecture

Three files, no build-time codegen:

| File                  | Contents                                                                           |
| :-------------------- | :--------------------------------------------------------------------------------- |
| `src/client.ts`       | `HttpClient` (fetch wrapper), `FoPostError`, `DEFAULT_BASE_URL`                    |
| `src/index.ts`        | `FoPost` class plus every resource class, all in one file                          |
| `src/types.ts`        | Public DTOs (`Post`, `Account`, `Workspace`, `Label`, inputs, `Platform`)          |
| `src/chat-adapter.ts` | `@fopost/sdk/chat-adapter` — the second entry point, built and exported separately |

Request flow: a resource method (e.g. `posts.create`) maps its camelCase input onto the
API's snake_case wire body, then calls `http.post('/v1/posts', body)` →
`HttpClient.request()` → `fetch` → JSON decode → envelope unwrap → typed return.

Resource classes are declared in `src/index.ts` below the `FoPost` class and are **not
exported** — only the `FoPost` instance's readonly namespaces reach consumers.

**There are two entry points.** `src/index.ts` is `@fopost/sdk`; `src/chat-adapter.ts` is
`@fopost/sdk/chat-adapter`, a send/receive interface over the inbox for chatbot frameworks.
The adapter is a **consumer of the client**, not a peer: it holds a `FoPost` instance and
calls `client.inbox.*`, imports only types from `./index.js`, and must never reach for
`HttpClient` or add an endpoint of its own. An endpoint it needs is added to `InboxResource`
first. `tsup` builds both entries; `package.json` carries the `./chat-adapter` condition in
`exports` and a `typesVersions` entry so a `node10` resolver finds its types, and
`release.yml` smoke-tests the subpath out of the packed tarball in both ESM and CJS.

**Webhook verification is Web Crypto, not `node:crypto`.** `crypto.subtle` keeps the package
dependency-free and works on Node, Deno and workers, which is why `parseWebhook` and
`verifyWebhook` are async. The adapter prefers `X-FoPost-Signature-256` (HMAC over
`${timestamp}.${body}`, refused past a 300s tolerance) and falls back to the body-only
`X-FoPost-Signature`. Digest comparison is constant-time.

**`inbox.message_received` carries ids only.** The payload is `itemId`, `type`, `platform`,
`accountId`, `receivedAt` — no text, no author. There is no `GET /v1/inbox/:id` and no `id`
filter on the list, so `receiveOne` scans `lookbackPages` of that account's items and
answers `null` when it does not find one. If the API ever grows a single-item read, that is
the thing to switch to.

**No public escape hatch.** `FoPost.http` is `private`, so an endpoint the SDK does not
wrap cannot be called without adding a method here. If you add one, `HttpClient.request`
is already public and is the right thing to expose.

## API Contract

- Base URL: `https://api.fopost.com` (`DEFAULT_BASE_URL`), host-only, overridable via
  `new FoPost({ baseUrl })`. **The version prefix lives in the paths**, which are written
  `/v1/...` — not in the base URL. No `FOPOST_BASE_URL` env read.
- **The path prefix is `/v1`, never `/api/v1`.** The API serves its routes at `/v1` on the
  bare host and nothing rewrites the path, so an `/api/v1` request 404s — that was the
  0.2.2 bug. `src/api-path.test.ts` pins every path and fails if the prefix drifts back.
- Auth: header `X-API-Key: <key>`. `apiKey` is required in the constructor and throws when
  empty. **No `FOPOST_API_KEY` env fallback** — the caller passes `process.env.FOPOST_API_KEY`.
- Headers sent: `Content-Type: application/json`, `X-API-Key`, `User-Agent: @fopost/sdk`
  (no version suffix). No `Accept` header.
- **No retries.** `HttpClient.request` makes exactly one `fetch` call. No backoff, no
  `Retry-After` handling, no 429/5xx replay. This diverges from the other FoPost SDKs
  (Go, Python, Rust all retry) — do not claim retries in docs or the README.
- **No timeout.** No `AbortSignal`, so a request hangs as long as the runtime's fetch does.
- Success envelope: `{"data": ...}` is unwrapped **only when `data` is the sole key**. A
  paginated `{data, meta}` body is returned whole, so callers see `meta`.
- Error envelope: `{"error": "<code>", "message": "<text>"}`. Every non-2xx throws a single
  `FoPostError` with `status`, `code` (from `error`), `body` (the parsed JSON), and a
  `message` taken from `message`, then `error`, then `HTTP <status>`. There is **no error
  subclass hierarchy** — branch on `err.status` or `err.code`. 402's `upgrade_url` is read
  off `err.body`.
- Non-JSON responses throw `FoPostError` too (body text as the message when not ok).
- Rate-limit headers (`X-RateLimit-*`) are **not surfaced**. Only the Go SDK reads them.

Resource coverage is a subset of the API: posts (list/get/create/update/delete/publish/
cancel/retry/preflight/deliveries), accounts (list/get/health/update/move, Telegram connect code and bot commands), accountGroups
(list/get/create/update/delete/setMembers), workspaces (list/get),
labels (list), ai (credits/generateCaption/rewrite/repurposeUrl), inbox (the `/v1/inbox`
family except the X Chat routes), ads (the `/v1/ads` family), validate (post/length/media). `communities`, `webhooks`,
`analytics`, `automations`, and `media` are **not wrapped here** — the Go and Rust SDKs have
them. Adding one is a public-surface change: see the Downstream Packages rule.

## Commands

```bash
npm install
npm run build          # tsup src/index.ts --format esm,cjs --dts --clean
npm run dev            # same, watch mode
npm run lint           # tsc --noEmit (there is no ESLint in this repo)
npm test               # vitest run
npm run test:watch     # vitest
npm run format         # prettier --write .
npm run format:check   # prettier --check .
```

`.github/workflows/ci.yml` runs `lint`, `test`, and `build` on every push to `main` and
every pull request. `release.yml` runs the same checks on a tag before publishing. Run
`npm run format:check` by hand before committing — CI does not check formatting.

## Conventions

- Prettier (`.prettierrc`): single quotes, semicolons, trailing commas `all`, print width
  100, 2-space indent.
- TypeScript strict, `noUnusedLocals`, `noUnusedParameters`, `isolatedModules`, target
  ES2022, `moduleResolution: bundler`.
- **Relative imports carry a `.js` suffix** on `.ts` source (`./client.js`, `./types.js`) —
  Node ESM requires it.
- Public inputs are camelCase; the wire body is snake_case. Do the mapping explicitly in
  the resource method, as `posts.create` does — no generic case converter.
- Optional-field updates use `if (input.x !== undefined)` so a `PUT` stays a partial update.
- Doc comments on exported types and non-obvious options only. No narrated docblocks.

## Testing

Vitest, one suite so far: `src/api-path.test.ts`, which drives every resource method and
asserts the request path starts with `/v1/` and never contains `/api/v1/`.

Any test added here **must stub the transport and must never reach the live API.**
`HttpClientOptions.fetch` exists for exactly this: pass a fake `fetch` to
`new FoPost({ apiKey: 'test', fetch: stub })` and assert on the request it receives. Worth
covering next: the `X-API-Key` header is sent, the `{data}` unwrap only fires on a sole-key
body, and a non-2xx becomes a `FoPostError` with the right `status`/`code`.

## Releasing

Tag `v<version>` matching `package.json`; `.github/workflows/release.yml` publishes to npm.
The workflow verifies the tag equals `package.json` version, runs `lint`, `test`, and
`build`, then packs the tarball and smoke-tests both the ESM and CJS entry points out of a
scratch project (this catches an `exports` map that builds but is unreachable). It skips
publishing if the version is already on npm, and publishes with `--provenance`
(`id-token: write`).

Requires repo secret `NPM_TOKEN`. The workflow fails loudly if it is unset.

## Git

Conventional Commits (`<type>(<scope>): <description>`), atomic — one logical change per
commit. Branch `feature/<description>` off a fresh `main`, merge via PR.
Never `gh pr create` — push the branch and hand over the compare link
(`https://github.com/fopost/fopost-js/compare/main...<branch>`).
