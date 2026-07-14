import { createServerFn } from '@tanstack/react-start'

import { API_ENDPOINTS } from '#/constants/api-endpoint'
import { getCookieHeader } from '#/lib/auth-guards'
import { httpClient } from '#/lib/http'
import type { OverviewResponse } from '#/types/overview'

export const getOverview = createServerFn({ method: 'GET' }).handler(
  async () => {
    const cookie = await getCookieHeader()
    const response = await httpClient.get<OverviewResponse>(
      API_ENDPOINTS.overview.root(),
      {
        headers: { cookie },
      },
    )
    return response.data
  },
)
