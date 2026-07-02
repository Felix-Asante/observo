import { drizzle } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { ENV, Environment } from '~/app.environment';

export function createDrizzleClient() {
  const connectionString = ENV.DATABASE_URL;
  const isProduction = ENV.NODE_ENV === Environment.PRODUCTION;

  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  if (isProduction) {
    return drizzleNeon({ client: neon(connectionString) });
  }

  return drizzle(connectionString);
}

export const db = createDrizzleClient();

export type DBClient = typeof db;
