import { queryOptions } from '@tanstack/react-query'

import { getOverview } from '#/functions/overview'
import { queryKeys } from '#/lib/tanstack-query/query-keys'

export const getOverviewQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.overview.all(),
    queryFn: getOverview,
    placeholderData: (previous) => previous,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
