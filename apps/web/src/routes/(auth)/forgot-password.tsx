import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Button, Input } from '@observo/ui'

import { AuthFormHeader } from '#/components/auth/auth-form-header'
import { AuthLayout } from '#/components/auth/auth-layout'

export const Route = createFileRoute('/(auth)/forgot-password')({
  head: () => ({
    meta: [
      { title: 'Reset password · Observo' },
      {
        name: 'description',
        content: 'Request a password reset link for your Observo account.',
      },
    ],
  }),
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [submitting, setSubmitting] = useState(false)

  return (
    <AuthLayout>
      <AuthFormHeader
        title="Reset your password"
        subtitle="Enter the email for your account and we'll send you a reset link. It expires in one hour."
      />

      <form
        method="POST"
        action="/api/auth/request-password-reset"
        className="space-y-5"
        onSubmit={() => setSubmitting(true)}
      >
        <input type="hidden" name="redirectTo" value="/reset-password" />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
        />

        <Button type="submit" size="lg" loading={submitting} className="w-full">
          Send reset link
        </Button>
      </form>

      <p className="mt-8 text-center">
        <Link
          to="/sign-in"
          className="group inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-iris-300 transition-colors duration-200 hover:text-iris-200"
        >
          <ArrowLeft
            className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden
          />
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
