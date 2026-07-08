import { Global, Module } from '@nestjs/common';
import { dbProvider } from './database-provider';

@Global() // so that the module is available globally
@Module({
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
