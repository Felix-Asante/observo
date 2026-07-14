import { Inject, Injectable } from '@nestjs/common';
import { and, count, eq, gte, isNull } from 'drizzle-orm';
import type Redis from 'ioredis';
import { clickhouseClient } from '~/clickhouse/client';
import { LOGS_EVENTS_TABLE } from '~/clickhouse/schema';
import { DB_PROVIDER } from '~/database/database-provider';
import type { DBClient } from '~/database/db';
import { REDIS_CLIENT } from '~/infra/redis.module';
import { ApiKey } from '~/modules/api-key/api-key.schema';
import { getSseClientCount } from '~/sse/sse-registry';
import {
  downsample,
  percentDelta,
  percentile,
  percentPointDelta,
} from '~/utils/overview';

const MAX_API_KEYS = 10;
const HOUR_SEC = 60 * 60;
const DAY_SEC = 24 * HOUR_SEC;

type HourlyRow = {
  hour: string | number;
  total: string | number;
  errors: string | number;
};

export type OverviewSystemStatus = {
  name: string;
  status: 'operational' | 'degraded';
  detail: string;
};

export type OverviewResponse = {
  generatedAt: string;
  metrics: {
    events24h: number;
    eventsDeltaPercent: number | null;
    errorRate: number;
    errorRateDelta: number | null;
    ingestLatencyP95Ms: number | null;
    activeApiKeys: number;
    maxApiKeys: number;
    keysUsedToday: number;
    eventsSpark: Array<number>;
    errorRateSpark: Array<number>;
    latencySpark: Array<number>;
  };
  volumeSeries: Array<number>;
  systemStatus: Array<OverviewSystemStatus>;
};

@Injectable()
export class OverviewService {
  constructor(
    @Inject(DB_PROVIDER) private readonly db: DBClient,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async getOverview(userId: string): Promise<OverviewResponse> {
    const nowSec = Math.floor(Date.now() / 1000);
    const previousWindowStart = nowSec - DAY_SEC * 2;

    const [hourly, apiKeyStats, latencySamples] = await Promise.all([
      this.queryHourlyVolume(userId, previousWindowStart),
      this.getApiKeyStatsForUser(userId),
      this.getIngestLatencySamples(),
    ]);

    const currentHours = this.buildHourBuckets(nowSec, 24);
    const previousHours = this.buildHourBuckets(nowSec - DAY_SEC, 24);

    const byHour = new Map<number, { total: number; errors: number }>();
    for (const row of hourly) {
      byHour.set(Number(row.hour), {
        total: Number(row.total) || 0,
        errors: Number(row.errors) || 0,
      });
    }

    const volumeSeries = currentHours.map(
      (hour) => byHour.get(hour)?.total ?? 0,
    );
    const errorSeries = currentHours.map(
      (hour) => byHour.get(hour)?.errors ?? 0,
    );
    const previousVolume = previousHours.map(
      (hour) => byHour.get(hour)?.total ?? 0,
    );
    const previousErrors = previousHours.map(
      (hour) => byHour.get(hour)?.errors ?? 0,
    );

    const events24h = volumeSeries.reduce((sum, n) => sum + n, 0);
    const eventsPrevious = previousVolume.reduce((sum, n) => sum + n, 0);
    const errors24h = errorSeries.reduce((sum, n) => sum + n, 0);
    const errorsPrevious = previousErrors.reduce((sum, n) => sum + n, 0);

    const errorRate = events24h > 0 ? (errors24h / events24h) * 100 : 0;
    const previousErrorRate =
      eventsPrevious > 0 ? (errorsPrevious / eventsPrevious) * 100 : 0;

    const ingestLatencyP95Ms = percentile(latencySamples, 95);
    const latencySpark = downsample(latencySamples, 12);
    const errorRateSpark = volumeSeries.map((total, index) => {
      if (total <= 0) return 0;
      return (errorSeries[index] / total) * 100;
    });

    return {
      generatedAt: new Date().toISOString(),
      metrics: {
        events24h,
        eventsDeltaPercent: percentDelta(events24h, eventsPrevious),
        errorRate,
        errorRateDelta: percentPointDelta(errorRate, previousErrorRate),
        ingestLatencyP95Ms,
        activeApiKeys: apiKeyStats.active,
        maxApiKeys: MAX_API_KEYS,
        keysUsedToday: apiKeyStats.usedToday,
        eventsSpark: downsample(volumeSeries, 12),
        errorRateSpark: downsample(errorRateSpark, 12),
        latencySpark:
          latencySpark.length > 0
            ? latencySpark
            : Array.from({ length: 12 }, () => 0),
      },
      volumeSeries,
      systemStatus: this.buildSystemStatus(
        ingestLatencyP95Ms,
        getSseClientCount(),
      ),
    };
  }

  private async queryHourlyVolume(
    userId: string,
    fromSec: number,
  ): Promise<Array<HourlyRow>> {
    const result = await clickhouseClient.query({
      query: `
        SELECT
          toUnixTimestamp(toStartOfHour(timestamp)) AS hour,
          count() AS total,
          countIf(type = 'error') AS errors
        FROM ${LOGS_EVENTS_TABLE}
        WHERE userId = {userId:String}
          AND timestamp >= toDateTime({fromSec:UInt32})
        GROUP BY hour
        ORDER BY hour ASC
      `,
      format: 'JSONEachRow',
      query_params: { userId, fromSec },
    });

    const rows = (await result.json()) as unknown as Array<HourlyRow>;
    return rows;
  }

  private async getApiKeyStatsForUser(userId: string) {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const [activeRow] = await this.db
      .select({ count: count() })
      .from(ApiKey)
      .where(and(eq(ApiKey.user_id, userId), isNull(ApiKey.revokedAt)));

    const [usedTodayRow] = await this.db
      .select({ count: count() })
      .from(ApiKey)
      .where(
        and(
          eq(ApiKey.user_id, userId),
          isNull(ApiKey.revokedAt),
          gte(ApiKey.lastUsedAt, startOfDay),
        ),
      );

    return {
      active: Number(activeRow?.count ?? 0),
      usedToday: Number(usedTodayRow?.count ?? 0),
    };
  }

  private async getIngestLatencySamples(): Promise<Array<number>> {
    const raw = await this.redis.lrange('ingest:latency', 0, 59);
    return raw
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value) && value >= 0);
  }

  private buildHourBuckets(endSec: number, count: number): Array<number> {
    const endHour = Math.floor(endSec / HOUR_SEC) * HOUR_SEC;
    return Array.from(
      { length: count },
      (_, index) => endHour - (count - 1 - index) * HOUR_SEC,
    );
  }

  private buildSystemStatus(
    ingestLatencyP95Ms: number | null,
    liveClients: number,
  ): Array<OverviewSystemStatus> {
    const ingestStatus: OverviewSystemStatus =
      ingestLatencyP95Ms === null
        ? {
            name: 'Ingest API',
            status: 'operational',
            detail: 'awaiting traffic',
          }
        : {
            name: 'Ingest API',
            status: ingestLatencyP95Ms > 1000 ? 'degraded' : 'operational',
            detail: `${Math.round(ingestLatencyP95Ms)}ms p95`,
          };

    return [
      ingestStatus,
      {
        name: 'Query engine',
        status: 'operational',
        detail: 'ok',
      },
      {
        name: 'Live stream',
        status: 'operational',
        detail: `${liveClients} client${liveClients === 1 ? '' : 's'}`,
      },
    ];
  }
}
