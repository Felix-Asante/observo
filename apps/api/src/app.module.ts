import { Module } from '@nestjs/common';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { ApiKeyModule } from '~/modules/api-key/api-key.module';
import { BillingModule } from '~/modules/billing/billing.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '~/database/database.module';
import { RedisModule } from '~/infra/redis.module';
import { CacheModule } from '~/infra/cache.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '~/infra/auth';
import { LogsModule } from './modules/logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
    }),
    ApiKeyModule,
    BillingModule,
    DatabaseModule,
    RedisModule,
    CacheModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
