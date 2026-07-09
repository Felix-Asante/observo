/**
 * Canonical product numbers — the single source of truth.
 * Every latency, volume, and uptime claim on the page reads from here
 * so the copy can never contradict itself.
 */
export const stats = {
  /** p99 search latency in milliseconds. */
  searchP99Ms: 38,
  /** Ingest capacity, logs per minute. */
  ingestPerMin: '2M+',
  /** Seconds from install to first log line. */
  setupSeconds: 60,
  /** ClickHouse storage compression. */
  compression: '~10x',
  /** ClickHouse scan throughput. */
  scanRate: '2B rows/s',
} as const
