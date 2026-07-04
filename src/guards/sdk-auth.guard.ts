import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { and, eq, isNull } from 'drizzle-orm';
import type Redis from 'ioredis';
import { LRUCache } from 'lru-cache';
import {
  API_VERSION,
  APP_PREFIX,
  LAST_USED_DEBOUNCE_SEC,
  LAST_USED_HASH,
  LRU_SOFT_TTL_MS,
  REDIS_HARD_TTL_MS,
} from '~/configs';
import type { CachedApiKey } from '~/configs/interface';
import { DB_PROVIDER } from '~/database/database-provider';
import type { DBClient } from '~/database/db';
import { REDIS_CLIENT } from '~/infra/redis.module';
import { ApiKey } from '~/modules/api-key/api-key.schema';
import { digest, extractApiKey } from '~/utils/api-key';

const localCache = new LRUCache<string, CachedApiKey>({ max: 100_000 });

type RequestWithUser = Request & { user: { id: string; keyId: string } };

@Injectable()
export class SDKAuthGuard implements CanActivate {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(DB_PROVIDER) private readonly db: DBClient,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const apiKey = request.headers['x-api-key'] as string | undefined;

    if (!apiKey) throw new UnauthorizedException('Unauthorized');

    const keyId = extractApiKey(apiKey);
    if (!keyId) throw new UnauthorizedException('Invalid API key');

    const digestedApiKey = digest(apiKey);
    const lrukey = `${API_VERSION}:${keyId}`;
    const now = Date.now();

    try {
      const c = localCache.get(lrukey);
      if (c && c.apiKeyDigest === digestedApiKey && c.expiresAt > now) {
        request.user = {
          id: c.userId,
          keyId,
        };

        void this.trackApiKeyLastUsed(keyId);
        return true;
      }

      // check redis if api key is not in local cache
      const rKeyDigest = `${APP_PREFIX}:api_key:${API_VERSION}:${keyId}`;
      const rDigest = await this.redis.hgetall(rKeyDigest);

      if (rDigest?.invalid === '1') {
        throw new UnauthorizedException('Unauthorized');
      }

      if (rDigest?.apiKeyDigest && rDigest?.apiKeyDigest !== digestedApiKey) {
        throw new UnauthorizedException('Unauthorized');
      }

      if (rDigest?.userId) {
        localCache.set(lrukey, {
          userId: rDigest.userId,
          apiKeyDigest: rDigest.apiKeyDigest,
          expiresAt: now + LRU_SOFT_TTL_MS,
        });

        request.user = {
          id: rDigest.userId,
          keyId,
        };

        void this.trackApiKeyLastUsed(keyId);
        return true;
      }

      // if api key is not in cache, check from db
      const [apiKeyRecord] = await this.db
        .select({
          key: ApiKey.key,
          userId: ApiKey.user_id,
          revokedAt: ApiKey.revokedAt,
        })
        .from(ApiKey)
        .where(and(eq(ApiKey.key, keyId), isNull(ApiKey.revokedAt)));

      if (!apiKeyRecord) throw new UnauthorizedException('Unauthorized');

      const isValid = await argon2.verify(apiKeyRecord.key, keyId);
      if (!isValid) {
        await this.redis.hset(rKeyDigest, {
          invalid: '1',
        });
        await this.redis.expire(rKeyDigest, REDIS_HARD_TTL_MS);
        throw new UnauthorizedException('Unauthorized');
      }

      await this.redis.hset(rKeyDigest, {
        apiKeyDigest: digestedApiKey,
        userId: apiKeyRecord.userId,
      });

      await this.redis.expire(rKeyDigest, REDIS_HARD_TTL_MS);

      request.user = {
        id: apiKeyRecord.userId,
        keyId,
      };

      void this.trackApiKeyLastUsed(keyId);
      return true;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private async trackApiKeyLastUsed(keyId: string) {
    const lockKey = `${APP_PREFIX}:api_key:last_used:${API_VERSION}:${keyId}`;

    const ok = await this.redis.set(
      lockKey,
      '1',
      'EX',
      LAST_USED_DEBOUNCE_SEC,
      'NX',
    );

    if (!ok) return;

    await this.redis.hset(LAST_USED_HASH, keyId, Date.now().toString());
  }
}
