# `@getobservo/node`

Node.js / Bun SDK for Observo log ingest. Buffers events, flushes on an interval, and drains the buffer on process shutdown.

## Install

```bash
npm install @getobservo/node
```

Requires Node.js 18+.

## Setup

Set the Observo API base URL (scheme + host, no path):

```bash
API_URL=https://api.example.com
```

## Usage

```ts
import { createLogger } from '@getobservo/node'

const log = createLogger({
  apiKey: process.env.OBSERVO_API_KEY!,
  appName: 'api',
  environment: process.env.NODE_ENV ?? 'development',
})

log.info('checkout.completed', { operation: 'checkout.create' })
log.error('payment.failed', {
  operation: 'payment.charge',
  importance: 'high',
  metrics: { latency_ms: 420, db_query_count: 2 },
})
```

Each level method accepts a message and optional fields (everything on `ObservoLogInput` except `type` and `message`).

### Log levels

`info` · `warning` · `error` · `debug` · `trace` · `audit` · `success` · `security`

## Options

| Option | Default | Notes |
| --- | --- | --- |
| `apiKey` | — | Required. Sent as `x-api-key` |
| `environment` | `development` | Sent as `x-environment` |
| `appName` | `default` | Sent as `x-app-name` |
| `bufferSize` | `100` | Max events flushed per request |
| `flushInterval` | `2000` | Debounce window (ms) before a flush |

`API_URL` must be a valid absolute URL. The client POSTs batches to `{API_URL}/api/v1/logs`.

## Behavior

- Events are queued in memory and flushed after `flushInterval`, up to `bufferSize` per request.
- On `SIGINT` / `SIGTERM` / `SIGQUIT` / `beforeExit`, remaining buffered events are flushed before exit.
- Failed flushes are logged to stderr; events from that attempt are not re-queued.

## Advanced

You can use the transport directly if you need lower-level control:

```ts
import { ObservoTransport } from '@getobservo/node'

const transport = new ObservoTransport({
  apiKey: process.env.OBSERVO_API_KEY!,
})

await transport.send({
  type: 'info',
  message: 'checkout.completed',
  operation: 'checkout.create',
  ingested_at: Date.now(),
})

await transport.flush()
```
