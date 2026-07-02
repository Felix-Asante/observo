import { Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';

type RequestWithUser = Request & { user: { id: string } };
@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  async createApiKey(@Req() req: RequestWithUser) {
    return this.apiKeyService.createApiKey(req.user.id);
  }

  @Post(':keyId/regenerate')
  async regenerateApiKey(
    @Param('keyId') keyId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.apiKeyService.regenerateApiKey(req.user.id, keyId);
  }

  @Get()
  async listApiKeys(@Req() req: RequestWithUser) {
    return this.apiKeyService.listApiKeys(req.user.id);
  }

  @Delete(':keyId')
  async deleteApiKey(
    @Param('keyId') keyId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.apiKeyService.deleteApiKey(req.user.id, keyId);
  }

  @Get(':keyId/last-used')
  async getApiKeyLastUsed(@Param('keyId') keyId: string) {
    return this.apiKeyService.getApiKeyLastUsed(keyId);
  }
}
