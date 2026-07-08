import { clickhouseClient } from './client';
import { ENV } from '~/app.environment';

const database = ENV.CLICKHOUSE_DATABASE || 'logs';

export const LOGS_EVENTS_TABLE = `${database}.events`;

export async function createLogsTable() {
  await clickhouseClient.command({
    query: `CREATE DATABASE IF NOT EXISTS ${database}`,
  });

  await clickhouseClient.command({
    query: `
      CREATE TABLE IF NOT EXISTS ${LOGS_EVENTS_TABLE} (
      keyId String,
      userId String,
      type LowCardinality(String),
      message String,
      appName LowCardinality(String),
      environment LowCardinality(String),
      importance Nullable(Int32),
      subsystem Nullable(String),
      service Nullable(String),
      operation Nullable(String),
      track Nullable(String),
      security Nullable(String),
      metrics Nullable(String),
      timestamp DateTime DEFAULT now(),
      ingestedAt DateTime DEFAULT now()
    )
    ENGINE = MergeTree()
    ORDER BY (timestamp, keyId)
    PARTITION BY toYYYYMM(timestamp)
    TTL timestamp + INTERVAL 30 DAY DELETE
    SETTINGS index_granularity = 8192
    `,
  });
}
