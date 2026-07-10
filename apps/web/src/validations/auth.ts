import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, { error: 'Password must be at least 8 characters' })
  .regex(/[a-z]/, { error: 'Include a lowercase letter' })
  .regex(/[A-Z]/, { error: 'Include an uppercase letter' })
  .regex(/\d/, { error: 'Include a number' })
  .regex(/[^A-Za-z0-9]/, { error: 'Include a symbol' })

export const signInSchema = z
  .object({
    email: z.email({ error: 'Enter a valid email address' }),
    password: z.string().min(1, { error: 'Password is required' }),
    rememberMe: z.boolean(),
  })
  .transform((data) => ({
    ...data,
    email: data.email.trim(),
    password: data.password.trim(),
  }))

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { error: 'Name is required' })
      .max(100, { error: 'Name must be 100 characters or less' }),
    email: z.email({ error: 'Enter a valid email address' }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, { error: 'Confirm your password' }),
    acceptTerms: z.boolean().refine((value) => value, {
      error: 'You must accept the Terms of Service and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .transform((data) => ({
    ...data,
    name: data.name.trim(),
    email: data.email.trim(),
    password: data.password.trim(),
    confirmPassword: data.confirmPassword.trim(),
  }))

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
