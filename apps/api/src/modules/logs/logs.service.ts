import { Injectable } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { publishLogBatch } from 'src/nats/producer';
import { clickhouseClient } from '~/clickhouse/client';
import { LOGS_EVENTS_TABLE } from '~/clickhouse/schema';
import { addClient } from '~/sse/sse-registry';
import type { AddLogsDto } from '~/modules/logs/dto/add-log.dto';
import type { StreamLogsQueryDto } from '~/modules/logs/dto/stream-logs-query.dto';
import { MAX_LIMIT } from '~/configs';
import { LRUCache } from 'lru-cache';

type ResultCacheKey = {
  rows: any[];
  totalCount: number;
  ts: number;
};
const queryCooldown = new LRUCache<string, number>({
  max: 50_000,
});

const resultCache = new LRUCache<string, ResultCacheKey>({
  max: 20_000,
});

@Injectable()
export class LogsService {
  constructor() {}

  async sendLogs(body: AddLogsDto, keyId: string, userId: string) {
    const serverReceivedAt = Date.now();
    await publishLogBatch(keyId, userId, body.logs as any[], serverReceivedAt);

    return {
      message: 'OK',
      serverReceivedAt,
    };
  }

  async startSSE(
    userId: string,
    query: StreamLogsQueryDto,
    res: ExpressResponse,
  ) {
    const limit = query.limit ?? 100;
    const { type, env, appName, search } = query;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const conditions = [`userId = {userId:String}`];
    if (type) {
      conditions.push(`type = {type:String}`);
    }
    if (appName) {
      conditions.push(`appName = {appName:String}`);
    }
    if (search) {
      conditions.push(`message LIKE {search:String}`);
    }

    if (env) {
      conditions.push(`environment = {environment:String}`);
    }

    const sql = `SELECT * FROM ${LOGS_EVENTS_TABLE} WHERE ${conditions.join(' AND ')} ORDER BY timestamp DESC LIMIT {limit:UInt32}`;

    const logs = await clickhouseClient.query({
      query: sql,
      format: 'JSONEachRow',
      query_params: { limit, userId, type, appName, search, env },
    });

    const intialRows = await logs.json();

    res.write(
      `data: ${JSON.stringify({ type: 'initial', logs: intialRows.toReversed() })}\n\n`,
    );

    const clientFilters = { userId, type, appName, search, env, limit };

    addClient(res, clientFilters);

    res.on('close', () => {
      res.send();
    });
  }

  private buildCacheKey(userId: string, query: StreamLogsQueryDto) {
    const queries: string[] = [];

    Object.entries(query).forEach(([key, value]) => {
      if (value && key) queries.push(`${key}=${value}`);
    });
    const queryString = queries.join('&');
    return `${userId}:${queryString}`;
  }

  private isCooldown(userId: string) {
    const now = Date.now();
    const last = queryCooldown.get(userId);

    if (last && now - last < 2000) return true;
    queryCooldown.set(userId, now);
    return false;
  }

  async getLogs(userId: string, query: StreamLogsQueryDto) {
    const cleanedQuery = Object.fromEntries(
      Object.entries(query).filter(([key, value]) => value && key),
    );

    let limit = (cleanedQuery.limit ?? 100) as number;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
    if (limit < 1) limit = 1;

    let timeStampFrom: number | undefined;
    let timeStampTo: number | undefined;

    if (cleanedQuery.range) {
      const range = cleanedQuery.range as string;
      const matched = range.match(/^(\d+)([smhd])$/);
      if (matched) {
        const [, count, unit] = matched;
        const nowSec = Math.floor(Date.now() / 1000);
        const seconds = {
          s: Number(count),
          m: Number(count) * 60,
          h: Number(count) * 60 * 60,
          d: Number(count) * 60 * 60 * 24,
        }[unit];
        timeStampFrom = nowSec - (seconds ?? 0);
        timeStampTo = nowSec;
      }
    }

    if (cleanedQuery.from) {
      const f = Number(cleanedQuery.from);
      if (!Number.isNaN(f)) {
        timeStampFrom = f > 2e12 ? Math.floor(f / 1000) : f;
      }
    }

    if (cleanedQuery.to) {
      const t = Number(cleanedQuery.to);
      if (!Number.isNaN(t)) {
        timeStampTo = t > 2e12 ? Math.floor(t / 1000) : t;
      }
    }

    if (!timeStampFrom && !timeStampTo) {
      const newSec = Math.floor(Date.now() / 1000);
      timeStampFrom = newSec - 60 * 60 * 24 * 30;
      timeStampTo = newSec;
    }

    const { type, appName, search, env } = cleanedQuery;

    if (!this.isCooldown(userId)) {
      const fallback = resultCache.get(
        this.buildCacheKey(userId, cleanedQuery),
      );
      if (fallback)
        return {
          count: fallback.rows.length,
          fallback: true,
          cached: true,
          totalCount: fallback.totalCount,
          logs: fallback.rows,
        };
    }

    const cacheKey = this.buildCacheKey(userId, query);
    const cached = resultCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < 1000) {
      return {
        cached: true,
        count: cached.rows.length,
        totalCount: cached.totalCount,
        logs: cached.rows,
        ts: cached.ts,
        fallback: false,
      };
    }

    const whereClauses = [`userId = {userId:String}`];
    const queryParams: Record<string, string | number> = {
      userId,
      limit,
    };

    if (type) {
      whereClauses.push(`type = {type:String}`);
      queryParams.type = type as string;
    }
    if (appName) {
      whereClauses.push(`appName = {appName:String}`);
      queryParams.appName = appName as string;
    }
    if (search) {
      whereClauses.push(`message LIKE {search:String}`);
      queryParams.search = `%${search}%`;
    }
    if (env) {
      whereClauses.push(`environment = {environment:String}`);
      queryParams.environment = env as string;
    }

    if (timeStampFrom) {
      whereClauses.push(`timestamp >= {timeStampFrom:UInt32}`);
      queryParams.timeStampFrom = timeStampFrom;
    }
    if (timeStampTo) {
      whereClauses.push(`timestamp <= {timeStampTo:UInt32}`);
      queryParams.timeStampTo = timeStampTo;
    }

    const sql = `SELECT * FROM ${LOGS_EVENTS_TABLE} WHERE ${whereClauses.join(' AND ')} ORDER BY timestamp DESC LIMIT {limit:UInt32}`;

    const nowSec = Math.floor(Date.now() / 1000);
    const from24hSec = nowSec - 60 * 60 * 24;
    const to24hSec = nowSec;

    const where24h = [`userId = {userId:String}`];
    where24h.push(`timestamp >= {from24hSec:UInt32}`);
    where24h.push(`timestamp <= {to24hSec:UInt32}`);

    const queryCount = `SELECT COUNT(*) AS total FROM ${LOGS_EVENTS_TABLE} WHERE ${where24h.join(' AND ')}`;
    const count24hPromise = clickhouseClient.query({
      query: queryCount,
      format: 'JSONEachRow',
      query_params: { userId, from24hSec, to24hSec },
    });

    const logsPromise = clickhouseClient.query({
      query: sql,
      format: 'JSONEachRow',
      query_params: queryParams,
    });

    const [count24hResult, logsResult] = await Promise.all([
      count24hPromise,
      logsPromise,
    ]);

    const logs = await logsResult.json();
    const countRows = (await count24hResult.json()) as unknown as {
      total: string;
    }[];
    const count24hTotal = Number(countRows[0]?.total ?? 0);

    resultCache.set(cacheKey, {
      rows: logs,
      totalCount: Number(count24hTotal),
      ts: Date.now(),
    });

    return {
      count: Number(logs.length),
      totalCount: Number(count24hTotal),
      logs: logs,
      to: timeStampTo,
      from: timeStampFrom,
    };
  }
}
