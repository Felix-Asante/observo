import type { HttpClient } from '@observo/http-client'
import type { IAuthService } from './interface'

const ApiEndpoints = {
  login: () => '/auth/sign-in/email',
  signup: () => '/auth/sign-up/email',
  logout: () => '/auth/logout',
  getUser: () => '/auth/me',
}

export function createAuthService(httpClient: HttpClient): IAuthService {
  return {
    login: async (body) => await httpClient.post(ApiEndpoints.login(), body),
    signup: async (body) => await httpClient.post(ApiEndpoints.signup(), body),
    logout: async () => await httpClient.post(ApiEndpoints.logout()),
    getUser: async () => await httpClient.get(ApiEndpoints.getUser()),
  }
}
