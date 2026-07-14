import { httpClient } from '#/lib/http'
import { createServerFn } from '@tanstack/react-start'
import { API_ENDPOINTS } from '#/constants/api-endpoint'
import type { ApiKey } from '#/types/api-keys'
import { getCookieHeader } from '#/lib/auth-guards'
import { z } from 'zod'

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

export const regenerateApiKey = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      keyId: z.uuid('Valid API key ID is required'),
    }),
  )
  .handler(async ({ data }) => {
    const cookie = await getCookieHeader()
    const apiKey = await httpClient.post<ApiKey>(
      API_ENDPOINTS.apiKeys.regenerate(data.keyId),
      {
        headers: { cookie },
      },
    )
    return apiKey.data
  })

export const revokeApiKey = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      keyId: z.uuid('Valid API key ID is required'),
    }),
  )
  .handler(async ({ data }) => {
    const cookie = await getCookieHeader()
    const apiKey = await httpClient.delete<ApiKey>(
      API_ENDPOINTS.apiKeys.revoke(data.keyId),
      {
        headers: { cookie },
      },
    )
    return apiKey.data
  })
