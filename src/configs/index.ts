export const API_VERSION = 'v1';
export const APP_PREFIX = 'OBV';
export const LAST_USED_HASH = `${APP_PREFIX}:api_key:last_used:${API_VERSION}`;

export const LAST_USED_DEBOUNCE_SEC = 60;
export const LRU_SOFT_TTL_MS = 1000 * 60 * 5;
export const REDIS_HARD_TTL_MS = 1000 * 60 * 10;
