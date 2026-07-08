import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export const LOG_TYPES = [
  'info',
  'error',
  'warning',
  'debug',
  'trace',
  'audit',
  'success',
] as const;

const IMPORTANCE_LEVELS = ['critical', 'high', 'medium', 'low'] as const;

const SUBSYSTEMS = ['db', 'cache', 'queue', 'network'] as const;

const USER_ROLES = ['super-admin', 'admin', 'user'] as const;

const AUTH_STATUSES = ['success', 'failed', 'expired'] as const;

export class LogTimeStampsDto {
  @IsString()
  @IsNotEmpty()
  event_time: string;

  @IsString()
  @IsNotEmpty()
  ingest_time: string;
}

export class LogTrackDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsOptional()
  @IsIn(USER_ROLES)
  role?: (typeof USER_ROLES)[number];

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  user_agent?: string;

  @IsOptional()
  @IsString()
  geo?: string;
}

export class SecurityLogDto {
  @IsIn(AUTH_STATUSES)
  auth_status: (typeof AUTH_STATUSES)[number];

  @IsOptional()
  @IsBoolean()
  suspicious?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class LogMetricsDto {
  @IsNumber()
  latency_ms: number;

  @IsNumber()
  db_query_count: number;
}

export class AddLogDto {
  @IsIn(LOG_TYPES)
  type: (typeof LOG_TYPES)[number];

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsIn(IMPORTANCE_LEVELS)
  importance?: (typeof IMPORTANCE_LEVELS)[number];

  @IsOptional()
  @IsIn(SUBSYSTEMS)
  subsystem?: (typeof SUBSYSTEMS)[number];

  @IsOptional()
  @IsString()
  operation?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LogTrackDto)
  track?: LogTrackDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SecurityLogDto)
  security?: SecurityLogDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LogMetricsDto)
  metrics?: LogMetricsDto;

  @IsOptional()
  @IsNumber()
  service?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LogTimeStampsDto)
  timestamps?: LogTimeStampsDto;

  @IsOptional()
  @IsNumber()
  ingested_at?: number;

  @IsOptional()
  @IsString()
  app_name?: string;

  @IsOptional()
  @IsString()
  environment?: string;
}

export class AddLogsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddLogDto)
  logs: AddLogDto[];
}
