import type { Query } from '#/types'
import { toQueryString } from '@observo/utils'

export const queryKeys = {
  apiKeys: {
    all: () => ['api-keys'],
  },
  logs: {
    all: (q: Query) => ['logs', toQueryString(q)],
  },
}
