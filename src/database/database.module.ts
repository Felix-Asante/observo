import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

export const DRRIZLE_DB = 'DRRIZLE_DB';
export type DrizzleClient = ReturnType<typeof drizzle>;

@Global()
@Module({
  providers: [
    {
      provide: DRRIZLE_DB,
      useFactory: () => {
        const connectionString = process.env.DATABASE_URL;
        const isProduction = process.env.NODE_ENV === 'production';

        if (!connectionString) {
          throw new Error('DATABASE_URL is not set');
        }

        if (isProduction) {
          const neonClient = neon(connectionString);
          return drizzleNeon({ client: neonClient });
        }
        return drizzle(connectionString);
      },
    },
  ],
  exports: [DRRIZLE_DB],
})
export class DatabaseModule {}
