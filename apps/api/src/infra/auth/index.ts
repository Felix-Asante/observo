import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { ENV, Environment } from '~/app.environment';
import { db } from '~/database/db';
import * as schema from '../../database/schema';

const { User, Session, Account, Verification, ...restSchema } = schema;

const isProduction = ENV.NODE_ENV === Environment.PRODUCTION;

const authConfig = {
  emailAndPassword: {
    enabled: true,
  },
  plugins: [],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...restSchema,
      user: User,
      session: Session,
      account: Account,
      verification: Verification,
    },
  }),
  trustedOrigins: [ENV.FRONTEND_URL],
  advanced: {
    disableOriginCheck: !isProduction,
    defaultCookieAttributes: {
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
      secure: isProduction,
      httpOnly: true,
    },
    database: {
      generateId: 'uuid' as const,
    },
  },
  basePath: '/api/v1/auth',
};

export const auth = betterAuth(authConfig);

export type Auth = typeof auth;
