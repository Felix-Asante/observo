import { clickhouseClient } from './client';

export async function createLogsTable() {
  await clickhouseClient.command({
    query: `
      CREATE TABLE IF NOT EXISTS logs.events (
      keyId String,
      userId String,
      type LowCardinality(String),
      message String,
      appName LowCardinality(String),
      environment LowCardinality(String),
      importance Nullable(Int32),
      subSystem Nullable(String),
      service Nullable(String),
      operation Nullable(String), 
      track Nullable(String),
      security Nullable(String),
      metrics Nullable(String),
      timestamp DateTime DEFAULT now(),
      injestedAt DateTime DEFAULT now(),
    )
    ENGINE = MergeTree()
    ORDER BY (timestamp, keyId)
    PARTITION BY toYYYYMM(timestamp) 
    TTL timestamp + INTERVAL 30 DAY DELETE;
    SETTINGS index_granularity = 8192;
    `,
  });
}
