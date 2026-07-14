import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { and, count, eq } from 'drizzle-orm';
import { Redis } from 'ioredis';
import { LRUCache } from 'lru-cache/raw';
import { randomBytes, randomUUID } from 'node:crypto';
import {
  API_VERSION,
  APP_PREFIX,
  LAST_USED_DEBOUNCE_SEC,
  LAST_USED_HASH,
} from 'src/configs';
import type { CachedApiKey } from 'src/configs/interface';
import { REDIS_CLIENT } from 'src/infra/redis.module';
import { DB_PROVIDER } from '~/database/database-provider';
import type { DBClient } from '~/database/db';
import { ApiKey } from './api-key.schema';

const MAX_API_KEYS_PER_USER = 10;

const localCache = new LRUCache<string, CachedApiKey>({
  max: 100_000,
});

function normalizeKeyId(keyId: string): string {
  return keyId.replace(/-/g, '').toLowerCase();
}

@Injectable()
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  constructor(
    @Inject(DB_PROVIDER) private readonly db: DBClient,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async createApiKey(userId: string): Promise<{ key: string }> {
    const [result] = await this.db
      .select({ count: count() })
      .from(ApiKey)
      .where(eq(ApiKey.user_id, userId));

    if (result.count >= MAX_API_KEYS_PER_USER) {
      throw new UnprocessableEntityException(
        'You have reached the maximum number of API keys. Please contact support to upgrade your plan.',
      );
    }

    const { plainTextKey, keyId } = this.generateApiKey();
    const hashedKey = await argon2.hash(plainTextKey, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 1 << 16,
      parallelism: 1,
    });

    const prefix = plainTextKey.substring(0, 18) + '...';

    await this.db.insert(ApiKey).values({
      id: keyId,
      user_id: userId,
      key: hashedKey,
      prefix,
      lastUsedAt: null,
    });
    return { key: plainTextKey };
  }

  async listApiKeys(userId: string) {
    const keys = await this.db
      .select({
        id: ApiKey.id,
        prefix: ApiKey.prefix,
        createdAt: ApiKey.createdAt,
        lastUsedAt: ApiKey.lastUsedAt,
        revokedAt: ApiKey.revokedAt,
      })
      .from(ApiKey)
      .where(eq(ApiKey.user_id, userId));

    if (keys.length === 0) return keys;

    const redisLastUsed = await this.redis.hgetall(LAST_USED_HASH);
    if (!redisLastUsed || Object.keys(redisLastUsed).length === 0) {
      return keys;
    }

    return keys.map((key) => {
      const redisTs = redisLastUsed[normalizeKeyId(key.id)];
      if (!redisTs) return key;

      const redisDate = new Date(Number(redisTs));
      if (Number.isNaN(redisDate.getTime())) return key;
      if (key.lastUsedAt && key.lastUsedAt.getTime() >= redisDate.getTime()) {
        return key;
      }

      return { ...key, lastUsedAt: redisDate };
    });
  }

  async deleteApiKey(userId: string, keyId: string) {
    const normalizedKeyId = normalizeKeyId(keyId);

    await this.db
      .update(ApiKey)
      .set({ revokedAt: new Date() })
      .where(and(eq(ApiKey.user_id, userId), eq(ApiKey.id, keyId)));

    const { versionKeyId, cacheKey } = this.getCacheKeys(normalizedKeyId);
    await this.redis.del(cacheKey);
    await this.clearLastUsed(normalizedKeyId);
    localCache.delete(versionKeyId);

    return { success: true };
  }

  async regenerateApiKey(userId: string, keyId: string) {
    const [apiKey] = await this.db
      .select()
      .from(ApiKey)
      .where(and(eq(ApiKey.user_id, userId), eq(ApiKey.id, keyId)));

    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }

    if (apiKey.revokedAt) {
      throw new BadRequestException('API key has been revoked');
    }

    // Keep the same key id — rotate only the secret so auth lookup,
    // cache keys, and historical log association stay valid.
    const normalizedKeyId = normalizeKeyId(keyId);
    const secretKey = randomBytes(32).toString('base64url');
    const plainTextKey = `${APP_PREFIX}:${normalizedKeyId}:${secretKey}`;
    const hashedKey = await argon2.hash(plainTextKey, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 1 << 16,
      parallelism: 1,
    });
    const prefix = plainTextKey.substring(0, 18) + '...';

    await this.db
      .update(ApiKey)
      .set({
        key: hashedKey,
        prefix,
        lastUsedAt: null,
        updatedAt: new Date(),
      })
      .where(and(eq(ApiKey.user_id, userId), eq(ApiKey.id, keyId)));

    const { versionKeyId, cacheKey } = this.getCacheKeys(normalizedKeyId);

    await this.redis.del(cacheKey);
    await this.clearLastUsed(normalizedKeyId);
    localCache.delete(versionKeyId);

    return { key: plainTextKey };
  }

  async touchLastUsed(keyId: string): Promise<void> {
    const normalizedKeyId = normalizeKeyId(keyId);

    try {
      const lockKey = `${APP_PREFIX}:api_key:last_used_lock:${API_VERSION}:${normalizedKeyId}`;
      const acquired = await this.redis.set(
        lockKey,
        '1',
        'EX',
        LAST_USED_DEBOUNCE_SEC,
        'NX',
      );

      if (acquired !== 'OK') return;

      const now = Date.now();
      await this.redis.hset(LAST_USED_HASH, normalizedKeyId, String(now));

      await this.db
        .update(ApiKey)
        .set({ lastUsedAt: new Date(now) })
        .where(eq(ApiKey.id, normalizedKeyId));
    } catch (error) {
      this.logger.warn(
        `Failed to update lastUsedAt for API key ${normalizedKeyId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async getApiKeyLastUsed(keyId: string) {
    const normalizedKeyId = normalizeKeyId(keyId);

    const redisValue = await this.redis.hget(LAST_USED_HASH, normalizedKeyId);
    if (redisValue) {
      return { last_used_at: new Date(Number(redisValue)) };
    }

    const [apiKey] = await this.db
      .select({ lastUsedAt: ApiKey.lastUsedAt })
      .from(ApiKey)
      .where(eq(ApiKey.id, keyId));
    if (!apiKey) {
      throw new NotFoundException('API key not found');
    }
    return { last_used_at: apiKey.lastUsedAt ?? null };
  }

  private async clearLastUsed(normalizedKeyId: string) {
    const lockKey = `${APP_PREFIX}:api_key:last_used_lock:${API_VERSION}:${normalizedKeyId}`;
    await this.redis.hdel(LAST_USED_HASH, normalizedKeyId);
    await this.redis.del(lockKey);
  }

  private generateApiKey(): { plainTextKey: string; keyId: string } {
    const keyId = randomUUID().replace(/-/g, '');
    const secretKey = randomBytes(32).toString('base64url');
    const plainTextKey = `${APP_PREFIX}:${keyId}:${secretKey}`;
    return { plainTextKey, keyId };
  }

  private getCacheKeys(keyId: string): {
    versionKeyId: string;
    cacheKey: string;
  } {
    const versionKeyId = `${API_VERSION}:${keyId}`;
    const cacheKey = `${APP_PREFIX}:api_key:${versionKeyId}`;
    return { versionKeyId, cacheKey };
  }
}
