import { createAuthClient } from 'better-auth/react'

function getAuthBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL as string
  return apiUrl.replace(/\/api\/v\d+\/?$/, '')
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseUrl(),
  basePath: '/api/v1/auth',
  fetchOptions: {
    credentials: 'include',
  },
})
