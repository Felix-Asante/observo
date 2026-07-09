import type { ApiKey } from './types'

/** Matches the `GET /api/v1/api-keys` response shape. */
export const apiKeys: Array<ApiKey> = [
  {
    id: 'key_4fa2c81b',
    prefix: 'OBV:4fa2c81b90de11f0…',
    createdAt: 'Jun 12, 2026',
    lastUsedAt: '2 minutes ago',
    revokedAt: null,
  },
  {
    id: 'key_77ab90c2',
    prefix: 'OBV:77ab90c24b1e88a4…',
    createdAt: 'May 28, 2026',
    lastUsedAt: '14 minutes ago',
    revokedAt: null,
  },
  {
    id: 'key_9cd114e0',
    prefix: 'OBV:9cd114e05f7cc2b1…',
    createdAt: 'Apr 3, 2026',
    lastUsedAt: '3 days ago',
    revokedAt: null,
  },
  {
    id: 'key_1e88a4d2',
    prefix: 'OBV:1e88a4d2c93f70e5…',
    createdAt: 'Feb 19, 2026',
    lastUsedAt: 'Jun 30, 2026',
    revokedAt: null,
  },
  {
    id: 'key_88d1f302',
    prefix: 'OBV:88d1f3021a45be97…',
    createdAt: 'Jan 8, 2026',
    lastUsedAt: 'Mar 2, 2026',
    revokedAt: 'Mar 2, 2026',
  },
]

export const MAX_API_KEYS = 10

/** Example of the one-time plaintext key format returned on create. */
export const exampleGeneratedKey =
  'OBV:a3f81c20d94e11f0:u8Kq2wRzXcVbNm4LpJh6TgYdSeAf1QoW'
