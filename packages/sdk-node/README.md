# @getobservo/node

Node.js SDK for sending logs to [Observo](https://observo-web.cwfelix.workers.dev/).

Requires Node.js 18+.

## Get started

1. Sign up at the [Observo dashboard](https://observo-web.cwfelix.workers.dev/)
2. Create an API key under [API keys](https://observo-web.cwfelix.workers.dev/dashboard/api-keys)
3. Install the SDK and send your first log (see below)

Keys look like `OBV:<key-id>:<secret>`.

## Install

```bash
npm install @getobservo/node
```

## Quick start

```ts
import { createLogger } from '@getobservo/node'

const log = createLogger({
  apiKey: process.env.OBSERVO_API_KEY!,
  host: process.env.OBSERVO_HOST!, // e.g. https://api.example.com/api/v1
  appName: 'billing-api',
  environment: process.env.NODE_ENV ?? 'production',
})

log.info('checkout.completed', {
  operation: 'checkout.create',
})

log.error('payment.failed', {
  operation: 'payment.charge',
  importance: 'high',
  metrics: { latency_ms: 420, db_query_count: 2 },
})
```

View logs in the [dashboard](https://observo-web.cwfelix.workers.dev/dashboard/logs).

## Configuration

| Option | Required | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | yes | — | Observo API key |
| `host` | yes | — | API base URL including version, e.g. `https://api.example.com/api/v1` |
| `appName` | no | `default` | Service name attached to each log |
| `environment` | no | `development` | Environment name (e.g. `production`, `staging`) |
| `bufferSize` | no | `100` | Max events per request |
| `flushInterval` | no | `2000` | Flush interval in ms |

Set values via environment variables in your app:

```bash
OBSERVO_API_KEY=OBV:...
OBSERVO_HOST=https://api.example.com/api/v1
```

The SDK does not load `.env` files — pass values in when you call `createLogger`.

## Log methods

| Method | Use for |
| --- | --- |
| `info` | Normal events |
| `warning` | Warnings |
| `error` | Errors |
| `debug` | Debug output |
| `trace` | Tracing |
| `audit` | Audit events |
| `success` | Success events |
| `security` | Auth / security events |

Each method takes a `message` and optional fields:

```ts
log.info('user.login', {
  operation: 'auth.login',
  importance: 'medium',       // critical | high | medium | low
  subsystem: 'db',            // db | cache | queue | network
  service: 1,
  app_name: 'auth',
  environment: 'staging',
  track: {
    user_id: 'usr_123',
    role: 'admin',
    ip: '203.0.113.1',
  },
  security: {
    auth_status: 'success',   // success | failed | expired
    suspicious: false,
  },
  metrics: {
    latency_ms: 84,
    db_query_count: 3,
  },
  timestamps: {
    event_time: new Date().toISOString(),
    ingest_time: new Date().toISOString(),
  },
})
```

## Recommended setup

Create one logger at startup and import it everywhere:

```ts
// logger.ts
import { createLogger } from '@getobservo/node'

export const log = createLogger({
  apiKey: process.env.OBSERVO_API_KEY!,
  host: process.env.OBSERVO_HOST!,
  appName: 'billing-api',
  environment: process.env.NODE_ENV ?? 'production',
})
```

```ts
import { log } from './logger.js'

log.error('invoice.failed', { operation: 'billing.charge' })
```

## NestJS

```ts
import { createLogger } from '@getobservo/node'

export const observo = createLogger({
  apiKey: process.env.OBSERVO_API_KEY!,
  host: process.env.OBSERVO_HOST!,
  appName: 'api',
  environment: process.env.NODE_ENV ?? 'development',
})
```

## Force an immediate send

By default logs are sent in the background. To flush manually:

```ts
import { ObservoTransport } from '@getobservo/node'

const transport = new ObservoTransport({
  apiKey: process.env.OBSERVO_API_KEY!,
  host: process.env.OBSERVO_HOST!,
})

await transport.send({
  type: 'info',
  message: 'deploy.started',
  ingested_at: Date.now(),
})

await transport.flush()
```

## Troubleshooting

| Issue | Fix |
| --- | --- |
| `401 Unauthorized` | Check your API key is valid and not revoked in the [dashboard](https://observo-web.cwfelix.workers.dev/dashboard/api-keys) |
| `Invalid base URL` | `host` must be a full URL, e.g. `https://api.example.com/api/v1` |
| Logs not showing up | Confirm `OBSERVO_HOST` and `OBSERVO_API_KEY` are set correctly |

Test your key:

```bash
curl -X POST "$OBSERVO_HOST/logs/send" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $OBSERVO_API_KEY" \
  -d '{"logs":[{"type":"info","message":"ping"}]}'
```

## License

MIT
