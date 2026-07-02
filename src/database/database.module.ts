import { Global, Module } from '@nestjs/common';
import { dbProvider } from './drizzle-provider';

@Global() // so that the module is available globally
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
