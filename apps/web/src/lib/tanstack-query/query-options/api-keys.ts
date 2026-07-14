import { queryOptions } from '@tanstack/react-query'
import { queryKeys } from '../query-keys'
import { getApiKeys } from '#/functions/api-keys'

export const getApiKeysQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.apiKeys.all(),
    queryFn: getApiKeys,
    placeholderData: (previous) => previous,
  })
