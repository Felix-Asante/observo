import { Controller, Get, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Session() session: UserSession) {
    return session;
  }
}
