import 'dotenv/config';
import { get } from 'env-var';

export enum Environment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

type EnvVarAccessor = {
  required(): EnvVarAccessor;
  asEnum<T extends string>(values: readonly T[]): T;
  asUrlString(): string;
  asString(): string;
};

const env = get as unknown as (name: string) => EnvVarAccessor;

/**
 * env-var asUrlString() uses URL#toString(), which appends a trailing `/` to
 * origin-only URLs. Better Auth compares trusted origins with strict equality
 * against `url.origin` (no trailing slash), so normalize here.
 */
function asOrigin(url: string) {
  return new URL(url).origin;
}

export const ENV = {
  NODE_ENV: env('NODE_ENV').required().asEnum(Object.values(Environment)),
  FRONTEND_URL: asOrigin(env('FRONTEND_URL').required().asUrlString()),
  DATABASE_URL: env('DATABASE_URL').required().asUrlString(),
  REDIS_HOST: env('REDIS_HOST').required().asString(),
  REDIS_PORT: env('REDIS_PORT').required().asString(),
  REDIS_PASSWORD: env('REDIS_PASSWORD').asString(),
  REDIS_DB: env('REDIS_DB').required().asString(),
  REDIS_KEY_SECRET: env('REDIS_KEY_SECRET').required().asString(),
  CLICKHOUSE_URL: env('CLICKHOUSE_URL').required().asUrlString(),
  CLICKHOUSE_USERNAME: env('CLICKHOUSE_USERNAME').required().asString(),
  CLICKHOUSE_PASSWORD: env('CLICKHOUSE_PASSWORD').asString(),
  CLICKHOUSE_DATABASE: env('CLICKHOUSE_DATABASE').asString(),
  NATS_URL: env('NATS_URL').required().asString(),
  GITHUB_CLIENT_ID: env('GITHUB_CLIENT_ID').required().asString(),
  GITHUB_CLIENT_SECRET: env('GITHUB_CLIENT_SECRET').required().asString(),
};
