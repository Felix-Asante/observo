import type { SignInValues, SignUpValues } from '#/validations/auth'

import { authClient } from '#/lib/auth-client'

function assertNoAuthError(
  error: { message?: string } | null | undefined,
  fallback: string,
) {
  if (error) {
    throw new Error(error.message ?? fallback)
  }
}

export async function signInWithEmail(values: SignInValues) {
  const { error } = await authClient.signIn.email({
    email: values.email,
    password: values.password,
    rememberMe: values.rememberMe,
    callbackURL: '/dashboard',
  })

  assertNoAuthError(error, 'Unable to sign in. Check your credentials.')
}

export async function signUpWithEmail(values: SignUpValues) {
  const { error } = await authClient.signUp.email({
    name: values.name,
    email: values.email,
    password: values.password,
    callbackURL: '/dashboard',
  })

  assertNoAuthError(error, 'Unable to create your workspace.')
}

export async function signOut() {
  const { error } = await authClient.signOut()

  assertNoAuthError(error, 'Failed to sign out.')
}

export async function signInWithProvider(
  provider: 'google' | 'github',
  callbackURL = '/dashboard',
) {
  const { error } = await authClient.signIn.social({
    provider,
    callbackURL,
  })

  assertNoAuthError(error, `Unable to sign in with ${provider}.`)
}
