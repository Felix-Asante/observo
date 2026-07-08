# Observo

Developer-first logging and monitoring platform.

## Structure

```
apps/
  api/     NestJS API
sdk/       Client SDK (workspace packages)
```

## Setup

```bash
pnpm install
pnpm api:dev
```

## Docker (API)

```bash
cd apps/api
docker compose up -d
```
