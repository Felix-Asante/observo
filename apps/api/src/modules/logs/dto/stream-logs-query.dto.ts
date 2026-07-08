import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { LOG_TYPES } from '~/modules/logs/dto/add-log.dto';

export type StreamLogsQuery = {
  limit?: number;
  type?: (typeof LOG_TYPES)[number];
  env?: string;
  appName?: string;
  search?: string;
};

export class StreamLogsQueryDto implements StreamLogsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number;

  @IsOptional()
  @IsIn(LOG_TYPES)
  type?: (typeof LOG_TYPES)[number];

  @IsOptional()
  @IsString()
  env?: string;

  @IsOptional()
  @IsString()
  appName?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  range?: string;
}
