export interface CachedApiKey {
  userId: string;
  apiKeyDigest: string;
  expiresAt: Date;
}
