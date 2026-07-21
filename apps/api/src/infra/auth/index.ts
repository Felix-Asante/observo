import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { ENV, Environment } from '~/app.environment';
import { db } from '~/database/db';
import * as schema from '../../database/schema';

const { User, Session, Account, Verification, ...restSchema } = schema;

const useCrossOriginAuth =
  ENV.NODE_ENV === Environment.PRODUCTION ||
  ENV.NODE_ENV === Environment.STAGING ||
  ENV.NODE_ENV === Environment.DEVELOPMENT;

const authConfig = {
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: ENV.GITHUB_CLIENT_ID,
      clientSecret: ENV.GITHUB_CLIENT_SECRET,
      prompt: 'select_account' as const,
    },
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

  baseURL: ENV.FRONTEND_URL,
  trustedOrigins: [ENV.FRONTEND_URL],
  account: {
    storeStateStrategy: 'database' as const,
    skipStateCookieCheck: useCrossOriginAuth,
  },
  advanced: {
    disableOriginCheck: !useCrossOriginAuth,
    defaultCookieAttributes: {
      sameSite: useCrossOriginAuth ? ('none' as const) : ('lax' as const),
      secure: useCrossOriginAuth,
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
