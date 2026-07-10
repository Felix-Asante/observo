import { createAuthClient } from 'better-auth/react'

import { getAuthBaseUrl } from '#/lib/api-url'

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  basePath: '/api/v1/auth',
  fetchOptions: {
    credentials: 'include',
  },
})
