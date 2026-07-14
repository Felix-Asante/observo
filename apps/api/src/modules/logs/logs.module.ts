import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { ApiKeyModule } from '~/modules/api-key/api-key.module';
import { SDKAuthGuard } from '~/guards/sdk-auth.guard';

@Module({
  imports: [ApiKeyModule],
  controllers: [LogsController],
  providers: [LogsService, SDKAuthGuard],
})
export class LogsModule {}
