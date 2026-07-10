import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Divider } from '@observo/ui'
import { FormProvider, useForm } from 'react-hook-form'
import { useTransition } from 'react'
import { z } from 'zod'

import { AuthFormHeader } from '#/components/auth/auth-form-header'
import { AuthLayout } from '#/components/auth/auth-layout'
import { OAuthButtons } from '#/components/auth/oauth-buttons'
import { FormCheckbox, FormInput, FormPasswordInput } from '#/components/form'
import { signInWithEmail } from '#/lib/auth'
import { getSafeRedirect } from '#/lib/auth-guards'
import { toast } from '#/lib/toast'
import { signInSchema } from '#/validations/auth'
import type { SignInValues } from '#/validations/auth'

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  validateSearch: (search) => signInSearchSchema.parse(search),
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
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
    mode: 'onTouched',
  })

  const router = useRouter()
  const { redirect: redirectTo } = Route.useSearch()
  const [isPending, startTransition] = useTransition()

  const onSubmit = form.handleSubmit(async (values) => {
    startTransition(async () => {
      try {
        await signInWithEmail(values)
        router.navigate({ to: getSafeRedirect(redirectTo) })
      } catch (error) {
        toast.fromError(error, 'Unable to sign in. Check your credentials.')
      }
    })
  })

  return (
    <AuthLayout>
      <AuthFormHeader
        title="Welcome back"
        subtitle="Your logs kept streaming while you were away. Sign in to catch up."
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

          <FormInput<SignInValues>
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
          />

          <FormPasswordInput<SignInValues>
            name="password"
            label="Password"
            autoComplete="current-password"
            placeholder="••••••••••"
            labelAction={
              <Link
                to="/forgot-password"
                className="cursor-pointer text-xs font-medium text-iris-300 transition-colors duration-200 hover:text-iris-200"
              >
                Forgot password?
              </Link>
            }
          />

          <FormCheckbox<SignInValues>
            name="rememberMe"
            label="Remember me for 30 days"
          />

          <Button
            type="submit"
            size="lg"
            loading={form.formState.isSubmitting || isPending}
            className="w-full"
          >
            Continue
          </Button>
        </form>
      </FormProvider>

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
