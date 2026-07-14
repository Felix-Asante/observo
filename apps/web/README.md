# Observo Web

TanStack Start app — marketing site, auth, and dashboard.

See the **[root README](../../README.md)** for monorepo setup, env vars, and API wiring.

## Quick start

```bash
# from apps/web (API should be running on :8081)
pnpm dev          # http://localhost:3000
```

Vite proxies `/api` → `http://localhost:8081`.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Vite + TanStack Start |
| `pnpm build` | Production build |
| `pnpm test` | Vitest |
| `pnpm format` / `pnpm lint` | Prettier + ESLint |
