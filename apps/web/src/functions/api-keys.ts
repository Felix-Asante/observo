import { httpClient } from '#/lib/http'
import { createServerFn } from '@tanstack/react-start'
import { API_ENDPOINTS } from '#/constants/api-endpoint'
import type { ApiKey } from '#/types/api-keys'
import { getCookieHeader } from '#/lib/auth-guards'

export const getApiKeys = createServerFn({ method: 'GET' }).handler(
  async () => {
    const cookie = await getCookieHeader()
    const apiKeys = await httpClient.get<ApiKey[]>(
      API_ENDPOINTS.apiKeys.root(),
      {
        headers: { cookie },
      },
    )
    return apiKeys.data
  },
)
