import { queryOptions } from '@tanstack/react-query'

import { getLogs } from '#/functions/logs.actions'
import { queryKeys } from '#/lib/tanstack-query/query-keys'
import type { GetLogsParams } from '#/types/logs'

export const DEFAULT_LOGS_LIMIT = 100

export const getLogsQueryOptions = (params: GetLogsParams) =>
  queryOptions({
    queryKey: queryKeys.logs.all(params),
    queryFn: () => getLogs({ data: params }),
    placeholderData: (previous) => previous,
  })
