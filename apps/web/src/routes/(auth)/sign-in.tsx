import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Button, Checkbox, Divider, Input, PasswordInput } from '@observo/ui'

import { AuthFormHeader } from '#/components/auth/auth-form-header'
import { AuthLayout } from '#/components/auth/auth-layout'
import { OAuthButtons } from '#/components/auth/oauth-buttons'

export const Route = createFileRoute('/(auth)/sign-in')({
  head: () => ({
    meta: [
      { title: 'Sign in · Observo' },
      {
        name: 'description',
        content:
          'Sign in to Observo and get back to your logs, traces, and dashboards.',
      },
    ],
  }),
  component: SignInPage,
})

function SignInPage() {
  const [submitting, setSubmitting] = useState(false)

  return (
    <AuthLayout>
      <AuthFormHeader
        title="Welcome back"
        subtitle="Your logs kept streaming while you were away. Sign in to catch up."
      />

      <OAuthButtons />

      <Divider label="or continue with email" className="my-7" />

      <form
        method="POST"
        action="/api/auth/sign-in/email"
        className="space-y-5"
        onSubmit={() => setSubmitting(true)}
      >
        <input type="hidden" name="callbackURL" value="/dashboard" />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••••"
          required
          labelAction={
            <Link
              to="/forgot-password"
              className="cursor-pointer text-xs font-medium text-iris-300 transition-colors duration-200 hover:text-iris-200"
            >
              Forgot password?
            </Link>
          }
        />

        <Checkbox
          name="rememberMe"
          value="true"
          defaultChecked
          label="Remember me for 30 days"
        />

        <Button type="submit" size="lg" loading={submitting} className="w-full">
          Continue
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-400">
        New to Observo?{' '}
        <Link
          to="/sign-up"
          className="cursor-pointer font-medium text-iris-300 transition-colors duration-200 hover:text-iris-200"
        >
          Create your workspace
        </Link>
      </p>
    </AuthLayout>
  )
}
