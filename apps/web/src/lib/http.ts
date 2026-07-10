import { createHttpClient } from '@observo/http-client'

export const httpClient = createHttpClient({
  baseURL: 'https://api.observo.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
