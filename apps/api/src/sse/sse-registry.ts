import type { Response as ExpressResponse } from 'express';
import type { LogType, Subsystem } from '~/nats/types';

export interface AddClientFilters {
  userId?: string;
  type?: string;
  appName?: string;
  search?: string;
  env?: string;
  limit?: number;
}

export interface SSEClient {
  res: ExpressResponse;
  filters: AddClientFilters;
}

const clients: SSEClient[] = [];

export function addClient(res: ExpressResponse, filters: AddClientFilters) {
  clients.push({ res, filters });
}

type BroadcastLog = {
  keyId: string;
  userId: string;
  type: LogType;
  message: string;
  service: number | undefined;
  appName: string | undefined;
  environment: string | undefined;
  importance: number;
  subsystem: Subsystem | null;
  operation: string | null;
  track: string | null;
  security: string | null;
  metrics: string | null;
  timestamp: number;
  ingestedAt: number | undefined;
};
export function broadcastLogs(newLogs: BroadcastLog[]) {
  const CHUNK_SIZE = 50;

  for (const { res, filters } of clients) {
    const matched = [...newLogs].reverse().filter((log) => {
      if (log.userId !== filters.userId) return false;
      if (filters.type && log.type !== filters.type) return false;
      if (filters.appName && log.appName !== filters.appName) return false;
      if (filters.env && log.environment !== filters.env) return false;
      if (filters.search && !log.message.includes(filters.search)) return false;
      return true;
    });

    if (matched.length === 0) continue;

    for (let i = 0; i < matched.length; i += CHUNK_SIZE) {
      const chunk = matched.slice(i, i + CHUNK_SIZE);
      res.write(`data: ${JSON.stringify({ type: 'live', logs: chunk })}\n\n`);
    }
  }
}
