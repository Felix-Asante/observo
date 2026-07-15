# `@getobservo/node`

Node.js / Bun SDK for Observo. Wraps `@getobservo/core` with `init()`, helpers, and awaited process-exit flushing.

## Install

```bash
npm install @getobservo/node
```

## Usage

```ts
import { observo } from '@getobservo/node'

observo.init({
  apiKey: process.env.OBSERVO_API_KEY!,
  baseUrl: process.env.OBSERVO_BASE_URL!, // e.g. https://api.example.com/api/v1
  appName: 'api',
  environment: process.env.NODE_ENV ?? 'development',
  onError: (error, ctx) => {
    console.error('[observo]', ctx.phase, error)
  },
})

observo.info('checkout.completed', {
  operation: 'checkout.create',
})

// Optional: flush on your own shutdown path
await observo.close()
```

`SIGINT` / `SIGTERM` / `beforeExit` flush remaining events via `close()`. Prefer calling `observo.close()` yourself in frameworks that manage shutdown.
