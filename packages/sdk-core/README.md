# `@getobservo/core`

Isomorphic Observo client: bounded queue, batching, retries, and POST to `/logs/send`.

## Install

```bash
npm install @getobservo/core
```

## Usage

```ts
import { ObservoClient } from '@getobservo/core'

const client = new ObservoClient({
  apiKey: process.env.OBSERVO_API_KEY!,
  baseUrl: process.env.OBSERVO_BASE_URL!, // e.g. https://api.example.com/api/v1
  appName: 'api',
  environment: 'production',
  onError: (error, ctx) => {
    console.error('[observo]', ctx.phase, error)
  },
})

client.info('checkout.completed', { operation: 'checkout.create' })
await client.close()
```

## Behavior

| Option | Default | Notes |
| --- | --- | --- |
| `flushAt` | `20` | Flush when this many events are queued |
| `flushIntervalMs` | `2000` | Time-based flush |
| `maxQueueSize` | `1000` | Hard cap |
| `overflow` | `drop-oldest` | Or `drop-newest` |
| `timeoutMs` | `10000` | Per-attempt HTTP timeout |
| `maxRetries` | `3` | Attempts per batch |
| `retryBaseDelayMs` | `250` | Exponential backoff + jitter |

Prefer `@getobservo/node` in Node for `init()` and process-exit flushing.
