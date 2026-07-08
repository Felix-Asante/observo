import { LogType, Importance, Subsystem, UserRole, AuthStatus } from './index';
import { LogTrack } from './track';
import { SecurityLog } from './security';
import { LogMetrics } from './metrics';

export interface LogTimeStamps {
  event_time: string;
  ingest_time: string;
}

export interface LogMessage {
  type: LogType;
  importance: Importance;
  subsystem: Subsystem;
  user_role: UserRole;
  auth_status: AuthStatus;
  message: string;
  track: LogTrack;
  security: SecurityLog;
  metrics: LogMetrics;
  timestamps: LogTimeStamps;
  operation?: string;
}
