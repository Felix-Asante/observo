# syntax=docker/dockerfile:1
#
# Build from the monorepo root:
#   docker build -f apps/api/Dockerfile -t observo-api .
#
# Railway release command (run migrations once per deploy):
#   node dist/src/database/migrate.js

ARG NODE_VERSION=24.14.1

# ---- base ----
FROM node:${NODE_VERSION}-alpine AS base

ARG PNPM_VERSION=9.15.9

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH

RUN corepack enable \
  && corepack prepare "pnpm@${PNPM_VERSION}" --activate

WORKDIR /repo

# ---- dependencies ----
FROM base AS deps

# Needed for Argon2
RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/

RUN printf 'packages:\n  - apps/api\n' > pnpm-workspace.yaml

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=@observo/api...

# ---- build ----
FROM base AS builder

COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /repo/package.json /repo/pnpm-lock.yaml /repo/pnpm-workspace.yaml ./
COPY apps/api ./apps/api

RUN pnpm --filter=@observo/api build \
  && pnpm --filter=@observo/api deploy --prod /deploy \
  && rm -rf /deploy/src /deploy/Dockerfile /deploy/.dockerignore \
     /deploy/eslint.config.mjs /deploy/.prettierrc \
     /deploy/tsconfig.json /deploy/tsconfig.build.json \
     /deploy/nest-cli.json /deploy/drizzle.config.ts \
  && cp -R apps/api/dist /deploy/dist \
  && cp -R apps/api/drizzle /deploy/drizzle

# ---- runtime ----
FROM node:${NODE_VERSION}-alpine AS runner

ENV NODE_ENV=production \
    PORT=8081

RUN apk add --no-cache tini \
  && addgroup -S -g 1001 observo \
  && adduser -S -u 1001 -G observo api

WORKDIR /app

COPY --from=builder --chown=api:observo /deploy ./

USER api

EXPOSE 8081

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8081)+'/api/v1').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/src/main.js"]
