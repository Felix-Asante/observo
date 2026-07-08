import { clickhouseClient } from './client';

export async function createLogsTable() {
  await clickhouseClient.command({
    query: `CREATE DATABASE IF NOT EXISTS logs`,
  });

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
        subsystem Nullable(String),
        service Nullable(Int32),
        operation Nullable(String),
        track Nullable(String),
        security Nullable(String),
        metrics Nullable(String),
        timestamp DateTime DEFAULT now(),
        ingestedAt Nullable(DateTime64(3)),
      )
      ENGINE = MergeTree()
      ORDER BY (timestamp, keyId)
      PARTITION BY toYYYYMM(timestamp)
      TTL timestamp + INTERVAL 30 DAY DELETE
      SETTINGS index_granularity = 8192
    `,
  });

  console.log('ClickHouse logs.events schema ready');
}
