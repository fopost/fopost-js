# @fopost/sdk

[![npm](https://img.shields.io/npm/v/%40fopost%2Fsdk.svg)](https://www.npmjs.com/package/@fopost/sdk)
[![license](https://img.shields.io/npm/l/%40fopost%2Fsdk.svg)](https://github.com/fopost/fopost-js/blob/main/LICENSE)
[![release](https://img.shields.io/github/actions/workflow/status/fopost/fopost-js/release.yml?label=release)](https://github.com/fopost/fopost-js/actions/workflows/release.yml)

Official TypeScript / Node.js SDK for the [FoPost](https://fopost.com) API. Schedule and publish to +30 social platforms from your code.

```bash
npm install @fopost/sdk
```

Requires Node 18 or newer. Ships ESM and CommonJS builds with TypeScript types.

> **0.x release.** The public API is still settling and minor versions may
> contain breaking changes. Pin an exact version if that matters to you.

## Quick start

```ts
import { FoPost } from '@fopost/sdk';

const fopost = new FoPost({ apiKey: process.env.FOPOST_API_KEY! });

// List your accounts
const accounts = await fopost.accounts.list({ workspaceId: '9b2f6c1e-…' });

// Create a post, then publish it immediately
const post = await fopost.posts.create({
  workspaceId: '9b2f6c1e-…',
  content: [{ text: 'Hello from the SDK' }],
  accounts: accounts.map((a) => a.id),
});
await fopost.posts.publish(post.id);

// Schedule for later
await fopost.posts.create({
  workspaceId: '9b2f6c1e-…',
  status: 'scheduled',
  scheduleAt: '2026-06-01T10:00:00Z',
  content: [{ text: 'Scheduled with the SDK' }],
  accounts: [accounts[0].id],
});
```

## AI features

```ts
// Caption assist
const { caption, credits } = await fopost.ai.generateCaption({
  currentCaption: 'shipping a new feature',
  platforms: ['twitter', 'linkedin'],
});

// Rewrite for each platform
const rewrites = await fopost.ai.rewrite({
  content: 'Long article-style draft...',
  platforms: ['twitter', 'linkedin', 'bluesky'],
});

// Blog → social fan-out
const repurposed = await fopost.ai.repurposeUrl({
  url: 'https://example.com/blog/post',
  platforms: ['twitter', 'linkedin', 'bluesky', 'threads'],
});

// Check your balance
const balance = await fopost.ai.credits();
console.log(`${balance.creditsRemaining} of ${balance.creditsTotal} credits left`);
```

## Configuration

```ts
new FoPost({
  apiKey: process.env.FOPOST_API_KEY!, // required
  baseUrl: 'https://api.fopost.com', // optional, override for self-hosted
  fetch: customFetch, // optional, inject your fetch impl
});
```

| Env var          | Used for                                         |
| ---------------- | ------------------------------------------------ |
| `FOPOST_API_KEY` | API key (you pass it explicitly to `new FoPost`) |

## Error handling

```ts
import { FoPost, FoPostError } from '@fopost/sdk';

try {
  await fopost.posts.publish('9b2f6c1e-…');
} catch (err) {
  if (err instanceof FoPostError) {
    console.error(`API ${err.status}${err.code ? ` (${err.code})` : ''}: ${err.message}`);
  } else {
    throw err;
  }
}
```

## Resources

| Namespace       | Methods                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `posts`         | `list`, `get`, `create`, `update`, `delete`, `publish`, `cancel`, `retry`, `preflight`, `deliveries`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `accounts`      | `list`, `get`, `health`, `update`, `move`, `createTelegramConnectCode`, `getTelegramConnectStatus`, `getTelegramBotCommands`, `setTelegramBotCommands`, `deleteTelegramBotCommands`, `listSlackChannels`, `listSlackMembers`, `getSlackIdentity`, `updateSlackIdentity`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `accountGroups` | `list`, `get`, `create`, `update`, `delete`, `setMembers`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `workspaces`    | `list`, `get`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `labels`        | `list`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `ai`            | `credits`, `generateCaption`, `rewrite`, `repurposeUrl`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `inbox`         | `list`, `threads`, `conversations`, `unreadCount`, `accounts`, `platforms`, `markThreadRead`, `refresh`, `update`, `editComment`, `reply`, `hide`, `unhide`, `delete`, `like`, `unlike`, `pin`, `unpin`, `react`, `startConversation`, `setTyping`, `listApprovals`, `approveReply`, `rejectReply`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `media`         | `presign`, `complete`, `uploadDirect`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `ads`           | `list`, `external`, `boostable`, `connections`, `sources`, `authorizeMeta`, `deleteConnection`, `boost`, `create`, `refresh`, `setStatus`, `delete`, `audiences`, `createAudience`, `searchTargeting`, `leadForms`, `createLeadForm`, `leads`, `accountTree`, `createCampaign`, `getCampaign`, `updateCampaign`, `deleteCampaign`, `duplicateCampaign`, `createAdSet`, `getAdSet`, `updateAdSet`, `deleteAdSet`, `duplicateAdSet`, `createNetworkAd`, `getNetworkAd`, `updateNetworkAd`, `deleteNetworkAd`, `duplicateNetworkAd`, `bulkSetStatus`, `creatives`, `createCreative`, `getCreative`, `deleteCreative`, `getAudience`, `updateAudience`, `deleteAudience`, `addAudienceUsers`, `estimateReach`, `insights`, `adInsights`, `getLeadForm`, `archiveLeadForm`, `leadsFeed`, `leadPages`, `subscribeLeadPage`, `unsubscribeLeadPage`, `authorizeGoogle`, and `google.*` for the Google-only surface |
| `validate`      | `post`, `length`, `media`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

## Contributing

Issues and pull requests are welcome at
[fopost/fopost-js](https://github.com/fopost/fopost-js).

```bash
npm install
npm run lint     # tsc --noEmit
npm run build    # tsup -> dist/
```

## License

MIT

### Google Ads

Campaigns, ad groups, ads, audiences and insights are on `ads` itself and dispatch by
connection. What only Google has is under `ads.google`: `keywords`, `createKeyword`,
`updateKeyword`, `deleteKeyword`, `keywordIdeas`, `keywordMetrics`, `searchTerms`,
`bidStrategies`, `createBidStrategy`, `adSchedule`, `setAdSchedule`,
`negativeKeywordLists`, `createNegativeKeywordList`, `addNegativeKeywords`,
`attachNegativeKeywordList`, `assets`, `createAsset`, `attachAsset`, `deleteAsset`,
`assetGroups`, `createAssetGroup`, `updateAssetGroup`, `deleteAssetGroup`,
`localServicesLeads`, `conversionActions`, `createConversionAction`, `uploadConversions`,
`uploadConversionAdjustments`, and `query` for a raw GAQL read.

```ts
const keywords = await fopost.ads.google.keywords({
  connectionId: 'c4d5e6f7-…',
  customerId: '1234567890',
});
```

Every call names a `customerId` the connection's grant reaches; any other answers 404.
Amounts are in the account's currency, in minor units.
