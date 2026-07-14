import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { OverviewService } from './overview.service';

@Controller('overview')
@UseGuards(AuthGuard)
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  getOverview(@Session() session: UserSession) {
    return this.overviewService.getOverview(session.user.id);
  }
}
