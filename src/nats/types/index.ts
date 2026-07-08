import { LogTrack } from './track';
import { SecurityLog } from './security';
import { LogMetrics } from './metrics';
import { LogTimeStamps } from './log';
export type LogLevel = 'info' | 'warning' | 'error';

export interface LoggerConfig {
  apiKey: string;
  appName?: string;
  environment?: string;
}

export interface LogPayload {
  type: LogType;
  message: string;
  importance?: Importance;
  subsystem?: Subsystem;
  operation?: string;
  track?: LogTrack;
  security?: SecurityLog;
  metrics?: LogMetrics;
  service?: number;
  timestamps?: LogTimeStamps;
  ingested_at?: number;
  app_name?: string;
  environment?: string;
}

export type LogType =
  'info' | 'error' | 'warning' | 'debug' | 'trace' | 'audit' | 'success';

export type Importance = 'critical' | 'high' | 'medium' | 'low';

export type Subsystem = 'db' | 'cache' | 'queue' | 'network';

export type UserRole = 'super-admin' | 'admin' | 'user';

export type AuthStatus = 'success' | 'failed' | 'expired';
