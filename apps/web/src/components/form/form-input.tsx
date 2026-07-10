import {
  Input,
  PasswordInput,
  type PasswordInputProps,
} from '@observo/ui'
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import type { InputHTMLAttributes, ReactNode } from 'react'

type SharedFieldProps<T extends FieldValues> = {
  name: FieldPath<T>
  label: string
  labelAction?: ReactNode
  className?: string
}

type FormInputProps<T extends FieldValues> = SharedFieldProps<T> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'defaultValue'>

type FormPasswordInputProps<T extends FieldValues> = SharedFieldProps<T> &
  Omit<PasswordInputProps, 'name' | 'value' | 'defaultValue' | 'error'>

export function FormInput<T extends FieldValues>({
  name,
  label,
  labelAction,
  className,
  ...inputProps
}: FormInputProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          {...inputProps}
          label={label}
          labelAction={labelAction}
          className={className}
          value={field.value ?? ''}
          error={fieldState.error?.message}
        />
      )}
    />
  )
}

export function FormPasswordInput<T extends FieldValues>({
  name,
  label,
  labelAction,
  className,
  ...inputProps
}: FormPasswordInputProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <PasswordInput
          {...field}
          {...inputProps}
          label={label}
          labelAction={labelAction}
          className={className}
          value={field.value ?? ''}
          error={fieldState.error?.message}
        />
      )}
    />
  )
}
