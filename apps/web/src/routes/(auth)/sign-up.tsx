import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Button, Checkbox, Divider, Input, PasswordInput } from '@observo/ui'

import { AuthFormHeader } from '#/components/auth/auth-form-header'
import { AuthLayout } from '#/components/auth/auth-layout'
import { OAuthButtons } from '#/components/auth/oauth-buttons'
import { PasswordStrength } from '#/components/auth/password-strength'
import type { FormEvent } from 'react'

export const Route = createFileRoute('/(auth)/sign-up')({
  head: () => ({
    meta: [
      { title: 'Create your workspace · Observo' },
      {
        name: 'description',
        content:
          'Create your Observo workspace and start streaming logs in under a minute. Free for side projects, no credit card required.',
      },
    ],
  }),
  component: SignUpPage,
})

function SignUpPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [confirmError, setConfirmError] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (password !== confirm) {
      event.preventDefault()
      setConfirmError('Passwords do not match')
      return
    }
    setSubmitting(true)
  }

  return (
    <AuthLayout>
      <AuthFormHeader
        title="Create your workspace"
        subtitle="First log line in under a minute. Free for side projects, no credit card."
      />

      <OAuthButtons />

      <Divider label="or continue with email" className="my-7" />

      <form
        method="POST"
        action="/api/auth/sign-up/email"
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="callbackURL" value="/dashboard" />

        <Input
          label="Full name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
        />

        <div className="space-y-3.5">
          <PasswordInput
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="••••••••••"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <PasswordStrength password={password} />
        </div>

        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••••"
          required
          value={confirm}
          error={confirmError}
          onChange={(event) => {
            setConfirm(event.target.value)
            setConfirmError(undefined)
          }}
        />

        <Checkbox
          required
          label={
            <>
              I agree to the{' '}
              <a
                href="#"
                className="cursor-pointer font-medium text-iris-300 transition-colors duration-200 hover:text-iris-200"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="#"
                className="cursor-pointer font-medium text-iris-300 transition-colors duration-200 hover:text-iris-200"
              >
                Privacy Policy
              </a>
            </>
          }
        />

        <Button type="submit" size="lg" loading={submitting} className="w-full">
          Create workspace
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-400">
        Already have an account?{' '}
        <Link
          to="/sign-in"
          className="cursor-pointer font-medium text-iris-300 transition-colors duration-200 hover:text-iris-200"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
