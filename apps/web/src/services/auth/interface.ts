import type { ApiResponse } from '@observo/http-client'

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
}

export interface IAuthService {
  login(body: LoginRequest): Promise<ApiResponse<void>>
  signup(body: SignupRequest): Promise<ApiResponse<any>>
  logout(): Promise<ApiResponse<void>>
  getUser(): Promise<ApiResponse<User>>
}
