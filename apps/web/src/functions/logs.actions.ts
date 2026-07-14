import { API_ENDPOINTS } from '#/constants/api-endpoint'
import { getCookieHeader } from '#/lib/auth-guards'
import { httpClient } from '#/lib/http'
import type { GetLogsParams, GetLogsResponse } from '#/types/logs'
import { createServerFn } from '@tanstack/react-start'
import { toQueryString } from '@observo/utils'
import { z } from 'zod'

const getLogsSchema = z.object({
  limit: z.number().int().min(1).max(500).optional(),
  search: z.string().max(500).optional(),
  type: z
    .enum(['info', 'error', 'warning', 'debug', 'trace', 'audit', 'success'])
    .optional(),
  env: z.string().max(64).optional(),
  appName: z.string().max(128).optional(),
  range: z
    .string()
    .regex(/^\d+[smhd]$/, 'Invalid time range')
    .optional(),
})

export const getLogs = createServerFn({ method: 'GET' })
  .validator(getLogsSchema)
  .handler(async ({ data }): Promise<GetLogsResponse> => {
    const cookie = await getCookieHeader()
    const params: GetLogsParams = {
      limit: data.limit,
      search: data.search?.trim() || undefined,
      type: data.type,
      env: data.env,
      appName: data.appName,
      range: data.range,
    }

    const qs = toQueryString(params)
    const url = qs
      ? `${API_ENDPOINTS.logs.root()}?${qs}`
      : API_ENDPOINTS.logs.root()

    const response = await httpClient.get<GetLogsResponse>(url, {
      headers: { cookie },
    })
    return response.data
  })
