import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Divider } from '@observo/ui'
import { FormProvider, useForm } from 'react-hook-form'

import { AuthFormHeader } from '#/components/auth/auth-form-header'
import { AuthLayout } from '#/components/auth/auth-layout'
import { OAuthButtons } from '#/components/auth/oauth-buttons'
import { PasswordStrength } from '#/components/auth/password-strength'
import { FormCheckbox, FormInput, FormPasswordInput } from '#/components/form'
import { signUpSchema } from '#/validations/auth'
import type { SignUpValues } from '#/validations/auth'
import { useTransition } from 'react'
import { toast } from '#/lib/toast'
import { signUpAction } from '#/actions/auth-actions'

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
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    mode: 'onTouched',
  })

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const password = form.watch('password')

  const onSubmit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      try {
        await signUpAction({ data: values })
        router.navigate({ to: '/dashboard' })
      } catch (error) {
        toast.fromError(error, 'Unable to create your workspace.')
      }
    })
  })

  return (
    <AuthLayout>
      <AuthFormHeader
        title="Create your workspace"
        subtitle="First log line in under a minute. Free for side projects, no credit card."
      />

      <OAuthButtons />

      <Divider label="or continue with email" className="my-7" />

      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {form.formState.errors.root ? (
            <p role="alert" className="text-sm text-error">
              {form.formState.errors.root.message}
            </p>
          ) : null}

          <FormInput
            name="name"
            label="Full name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
          />

          <FormInput
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
          />

          <div className="space-y-3.5">
            <FormPasswordInput
              name="password"
              label="Password"
              autoComplete="new-password"
              placeholder="••••••••••"
            />
            <PasswordStrength password={password || ''} />
          </div>

          <FormPasswordInput
            name="confirmPassword"
            label="Confirm password"
            autoComplete="new-password"
            placeholder="••••••••••"
          />

          <FormCheckbox
            name="acceptTerms"
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

          <Button
            type="submit"
            size="lg"
            loading={form.formState.isSubmitting || isPending}
            className="w-full"
          >
            Create workspace
          </Button>
        </form>
      </FormProvider>

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
