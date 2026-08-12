# @owlstackapp/sdk

Official TypeScript / Node.js SDK for the [OwlStack](https://owlstack.app) API. Publish to 17+ social platforms from your code.

```bash
npm install @owlstackapp/sdk
```

Requires Node 18 or newer. Ships ESM and CommonJS builds with TypeScript types.

> **0.x release.** The public API is still settling and minor versions may
> contain breaking changes. Pin an exact version if that matters to you.

## Quick start

```ts
import { OwlStack } from '@owlstackapp/sdk';

const owl = new OwlStack({ apiKey: process.env.OWLSTACK_API_KEY! });

// List your accounts
const accounts = await owl.accounts.list({ workspaceId: '9b2f6c1e-…' });

// Publish a post immediately
await owl.posts.create({
  workspaceId: '9b2f6c1e-…',
  status: 'publish',
  content: [{ text: 'Hello from the SDK', position: 0 }],
  accounts: accounts.map((a) => ({ id: a.id })),
});

// Schedule for later
await owl.posts.create({
  workspaceId: '9b2f6c1e-…',
  status: 'scheduled',
  scheduleAt: '2026-06-01T10:00:00Z',
  content: [{ text: 'Scheduled with the SDK 🦉', position: 0 }],
  accounts: [{ id: accounts[0].id }],
});
```

## AI features

```ts
// Caption assist
const { caption, credits } = await owl.ai.generateCaption({
  currentCaption: 'shipping a new feature',
  platforms: ['twitter', 'linkedin'],
});

// Rewrite for each platform
const rewrites = await owl.ai.rewrite({
  content: 'Long article-style draft...',
  platforms: ['twitter', 'linkedin', 'bluesky'],
});

// Blog → social fan-out
const repurposed = await owl.ai.repurposeUrl({
  url: 'https://example.com/blog/post',
  platforms: ['twitter', 'linkedin', 'bluesky', 'threads'],
});

// Check your balance
const balance = await owl.ai.credits();
console.log(`${balance.creditsRemaining} of ${balance.creditsTotal} credits left`);
```

## Configuration

```ts
new OwlStack({
  apiKey: process.env.OWLSTACK_API_KEY!, // required
  baseUrl: 'https://api.owlstack.app', // optional, override for self-hosted
  fetch: customFetch, // optional, inject your fetch impl
});
```

| Env var            | Used for                                           |
| ------------------ | -------------------------------------------------- |
| `OWLSTACK_API_KEY` | API key (you pass it explicitly to `new OwlStack`) |

## Error handling

```ts
import { OwlStack, OwlStackError } from '@owlstackapp/sdk';

try {
  await owl.posts.publish('9b2f6c1e-…');
} catch (err) {
  if (err instanceof OwlStackError) {
    console.error(`API ${err.status}${err.code ? ` (${err.code})` : ''}: ${err.message}`);
  } else {
    throw err;
  }
}
```

## Resources

| Namespace    | Methods                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| `posts`      | `list`, `get`, `create`, `update`, `delete`, `publish`, `cancel`, `retry`, `preflight`, `deliveries` |
| `accounts`   | `list`, `get`, `health`                                                                              |
| `workspaces` | `list`, `get`                                                                                        |
| `labels`     | `list`                                                                                               |
| `ai`         | `credits`, `generateCaption`, `rewrite`, `repurposeUrl`                                              |

## Contributing

Issues and pull requests are welcome at
[owlstacks/owlstack-js](https://github.com/owlstacks/owlstack-js).

```bash
npm install
npm run lint     # tsc --noEmit
npm run build    # tsup -> dist/
```

## License

MIT
