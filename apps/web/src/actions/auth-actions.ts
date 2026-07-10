import { httpClient } from '#/lib/http'
import { signInSchema, signUpSchema } from '#/validations/auth'
import { createServerFn } from '@tanstack/react-start'

export const signUpAction = createServerFn()
  .validator(signUpSchema)
  .handler(async ({ data }) => {
    const body = {
      name: data.name,
      email: data.email,
      password: data.password,
    }
    await httpClient.post('/auth/sign-up/email', body)
  })

export const signInAction = createServerFn()
  .validator(signInSchema)
  .handler(async ({ data }) => {
    const body = {
      email: data.email,
      password: data.password,
    }
    await httpClient.post('/auth/sign-in/email', body)
  })

export const signOutAction = createServerFn().handler(async () => {
  await httpClient.post('/auth/sign-out')
})

export const getCurrentUserAction = createServerFn().handler(async () => {
  const response = await httpClient.get('/users/me')
  return response.data
})
