import { drizzle } from 'drizzle-orm/node-postgres';
import { ENV } from '~/app.environment';

export function createDrizzleClient() {
  const connectionString = ENV.DATABASE_URL;
  // const isProduction = ENV.NODE_ENV === Environment.PRODUCTION;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  // if (isProduction) {
  //   return drizzleNeon({ client: neon(connectionString) });
  // }

  return drizzle(connectionString);
}

export const db = createDrizzleClient();

export type DBClient = typeof db;
