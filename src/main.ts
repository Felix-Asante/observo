import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startLogConsumer } from './nats/consumer';
import { initNatsStream } from './nats/init-stream';
import { createLogsTable } from './clickhouse/schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  await createLogsTable().catch((error) =>
    console.error('ClickHouse schema init error', error),
  );
  await initNatsStream().catch((error) =>
    console.error('NATS stream init error', error),
  );

  // Don't await — the consumer runs forever
  void startLogConsumer().catch((error) =>
    console.error('Log consumer error', error),
  );

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
