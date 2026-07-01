import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [ApiKeyModule, BillingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
