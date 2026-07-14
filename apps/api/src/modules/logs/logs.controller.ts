import {
  Controller,
  Get,
  Req,
  Post,
  UseGuards,
  Body,
  Res,
  Query,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { SDKAuthGuard, type RequestWithUser } from '~/guards/sdk-auth.guard';
import type { Response as ExpressResponse } from 'express';
import { AddLogsDto } from '~/modules/logs/dto/add-log.dto';
import { StreamLogsQueryDto } from '~/modules/logs/dto/stream-logs-query.dto';
import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post('send')
  @UseGuards(SDKAuthGuard)
  sendLogs(@Body() body: AddLogsDto, @Req() req: RequestWithUser) {
    return this.logsService.sendLogs(body, req.user.keyId, req.user.id);
  }

  @Get('stream')
  @UseGuards(AuthGuard)
  async startSSE(
    @Query() query: StreamLogsQueryDto,
    @Session() session: UserSession,
    @Res() res: ExpressResponse,
  ) {
    return this.logsService.startSSE(session.user.id, query, res);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getLogs(
    @Query() query: StreamLogsQueryDto,
    @Session() session: UserSession,
  ) {
    return this.logsService.getLogs(session.user.id, query);
  }
}
