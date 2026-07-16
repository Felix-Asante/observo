# `@observo/api`

NestJS API for Observo — ingest, query, live SSE, API keys, overview, and Better Auth.

See the **[root README](../../README.md)** for architecture, Docker services, env vars, and how to run the full stack.

## Quick start

```bash
# from apps/api
docker compose up -d
pnpm db:migrate
pnpm dev          # PORT=8081 recommended
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Nest watch mode |
| `pnpm build` | Compile |
| `pnpm db:generate` / `pnpm db:migrate` | Drizzle (local, via drizzle-kit) |
| `pnpm db:migrate:prod` | Run SQL migrations from `drizzle/` (production image / Railway release) |
| `pnpm test` | Jest |

### Railway

Set the service **Release Command** to:

```bash
node dist/src/database/migrate.js
```

That runs once per deploy before the new container starts serving traffic.

API base path: `/api/v1`.
