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

export const ENV = {
  NODE_ENV: env('NODE_ENV').required().asEnum(Object.values(Environment)),
  FRONTEND_URL: env('FRONTEND_URL').required().asUrlString(),
  DATABASE_URL: env('DATABASE_URL').required().asUrlString(),
  REDIS_HOST: env('REDIS_HOST').required().asString(),
  REDIS_PORT: env('REDIS_PORT').required().asString(),
  REDIS_PASSWORD: env('REDIS_PASSWORD').asString(),
  REDIS_DB: env('REDIS_DB').required().asString(),
  REDIS_KEY_SECRET: env('REDIS_KEY_SECRET').required().asString(),
  CLICKHOUSE_URL: env('CLICKHOUSE_URL').required().asUrlString(),
  CLICKHOUSE_USERNAME: env('CLICKHOUSE_USERNAME').required().asString(),
  CLICKHOUSE_PASSWORD: env('CLICKHOUSE_PASSWORD').required().asString(),
  CLICKHOUSE_DATABASE: env('CLICKHOUSE_DATABASE').required().asString(),
};
