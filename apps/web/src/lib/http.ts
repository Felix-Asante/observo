import { createHttpClient } from '@observo/http-client'

export const httpClient = createHttpClient({
  baseURL: import.meta.env.VITE_API_URL!,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
