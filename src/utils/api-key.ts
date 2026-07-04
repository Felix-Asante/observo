import { ENV } from '~/app.environment';
import { APP_PREFIX } from '~/configs';
import crypto from 'node:crypto';

export function extractApiKey(plainApiKey: string): string | null {
  if (!plainApiKey?.startsWith(`${APP_PREFIX}:`)) return null;

  const parts = plainApiKey.split(':');
  if (parts.length < 3) return null;

  const keyId = parts[1];

  if (!/^[a-f0-9]{32}$/i.test(keyId)) return null;

  return keyId;
}

export function digest(plainApiKey: string): string {
  const REDIS_KEY_SECRET = ENV.REDIS_KEY_SECRET;
  if (!REDIS_KEY_SECRET) throw new Error('REDIS_KEY_SECRET is not set');

  return crypto
    .createHmac('sha256', REDIS_KEY_SECRET)
    .update(plainApiKey)
    .digest('hex');
}
