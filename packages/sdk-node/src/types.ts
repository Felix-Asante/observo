export type Importance = "critical" | "high" | "medium" | "low";

export type Subsystem = "db" | "cache" | "queue" | "network";

export type UserRole = "super-admin" | "admin" | "user";

export type AuthStatus = "success" | "failed" | "expired";

export type LogTrack = {
  user_id: string;
  role?: UserRole;
  ip?: string;
  user_agent?: string;
  geo?: string;
};

export type SecurityLog = {
  auth_status: AuthStatus;
  suspicious?: boolean;
  tags?: string[];
};

export type LogMetrics = {
  latency_ms: number;
  db_query_count: number;
};

export type LogTimeStamps = {
  event_time: string;
  ingest_time: string;
};

export type ObservoLogInput = {
  message: string;
  type: LogType;
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
};

export type ObservoTransportOptions = {
  apiKey: string;
  environment?: string;
  appName?: string;
  bufferSize?: number;
  flushInterval?: number;
};

export type LogType =
  | "info"
  | "warning"
  | "error"
  | "debug"
  | "trace"
  | "audit"
  | "success"
  | "security";
