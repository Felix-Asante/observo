import { httpClient } from '#/lib/http'
import { createServerFn } from '@tanstack/react-start'
import { API_ENDPOINTS } from '#/constants/api-endpoint'
import type { ApiKey } from '#/types/api-keys'
import { getCookieHeader } from '#/lib/auth-guards'
import { z } from 'zod'

export type GeneratedApiKey = {
  key: string
}

const keyIdSchema = z.object({
  keyId: z.uuid('Valid API key ID is required'),
})

export const getApiKeys = createServerFn({ method: 'GET' }).handler(
  async () => {
    const cookie = await getCookieHeader()
    const apiKeys = await httpClient.get<Array<ApiKey>>(
      API_ENDPOINTS.apiKeys.root(),
      {
        headers: { cookie },
      },
    )
    return apiKeys.data
  },
)

export const createApiKey = createServerFn({ method: 'POST' }).handler(
  async () => {
    const cookie = await getCookieHeader()
    const apiKey = await httpClient.post<GeneratedApiKey>(
      API_ENDPOINTS.apiKeys.root(),
      undefined,
      {
        headers: { cookie },
      },
    )
    return apiKey.data
  },
)

export const regenerateApiKey = createServerFn({ method: 'POST' })
  .validator(keyIdSchema)
  .handler(async ({ data }) => {
    const cookie = await getCookieHeader()
    const apiKey = await httpClient.patch<GeneratedApiKey>(
      API_ENDPOINTS.apiKeys.regenerate(data.keyId),
      undefined,
      {
        headers: { cookie },
      },
    )
    return apiKey.data
  })

export const revokeApiKey = createServerFn({ method: 'POST' })
  .validator(keyIdSchema)
  .handler(async ({ data }) => {
    const cookie = await getCookieHeader()
    const result = await httpClient.delete<{ success: boolean }>(
      API_ENDPOINTS.apiKeys.revoke(data.keyId),
      {
        headers: { cookie },
      },
    )
    return result.data
  })
