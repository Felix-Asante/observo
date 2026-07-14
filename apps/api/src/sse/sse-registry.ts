import type { Response as ExpressResponse } from 'express';
import type { LogType, Subsystem } from '~/nats/types';

export interface AddClientFilters {
  userId: string;
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

const clients = new Set<SSEClient>();

export function addClient(res: ExpressResponse, filters: AddClientFilters) {
  clients.add({ res, filters });
}

export function removeClient(res: ExpressResponse) {
  for (const client of clients) {
    if (client.res === res) {
      clients.delete(client);
      break;
    }
  }
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

function writeEvent(res: ExpressResponse, payload: unknown): boolean {
  if (res.writableEnded || res.destroyed) return false;
  try {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
    return true;
  } catch {
    return false;
  }
}

export function broadcastLogs(newLogs: BroadcastLog[]) {
  const CHUNK_SIZE = 50;
  const stale: ExpressResponse[] = [];

  for (const client of clients) {
    const { res, filters } = client;
    const matched = newLogs.filter((log) => {
      if (log.userId !== filters.userId) return false;
      if (filters.type && log.type !== filters.type) return false;
      if (filters.appName && log.appName !== filters.appName) return false;
      if (filters.env && log.environment !== filters.env) return false;
      if (
        filters.search &&
        !log.message.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    if (matched.length === 0) continue;

    // Newest first to match live-tail UI ordering.
    const ordered = matched.toReversed();

    for (let i = 0; i < ordered.length; i += CHUNK_SIZE) {
      const chunk = ordered.slice(i, i + CHUNK_SIZE);
      const ok = writeEvent(res, { type: 'live', logs: chunk });
      if (!ok) {
        stale.push(res);
        break;
      }
    }
  }

  for (const res of stale) {
    removeClient(res);
  }
}

export function getSseClientCount() {
  return clients.size;
}
