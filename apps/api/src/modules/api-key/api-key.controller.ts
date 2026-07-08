import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { ApiKeyService } from './api-key.service';

@Controller('api-keys')
@UseGuards(AuthGuard)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  async createApiKey(@Session() session: UserSession) {
    return this.apiKeyService.createApiKey(session.user.id);
  }

  @Post(':keyId/regenerate')
  async regenerateApiKey(
    @Param('keyId') keyId: string,
    @Session() session: UserSession,
  ) {
    return this.apiKeyService.regenerateApiKey(session.user.id, keyId);
  }

  @Get()
  async listApiKeys(@Session() session: UserSession) {
    return this.apiKeyService.listApiKeys(session.user.id);
  }

  @Delete(':keyId')
  async deleteApiKey(
    @Param('keyId') keyId: string,
    @Session() session: UserSession,
  ) {
    return this.apiKeyService.deleteApiKey(session.user.id, keyId);
  }

  @Get(':keyId/last-used')
  async getApiKeyLastUsed(@Param('keyId') keyId: string) {
    return this.apiKeyService.getApiKeyLastUsed(keyId);
  }
}
