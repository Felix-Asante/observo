import { Checkbox } from '@observo/ui'
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import type { ReactNode } from 'react'

type FormCheckboxProps<T extends FieldValues> = {
  name: FieldPath<T>
  label: ReactNode
  className?: string
}

export function FormCheckbox<T extends FieldValues>({
  name,
  label,
  className,
}: FormCheckboxProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={className}>
          <Checkbox
            checked={Boolean(field.value)}
            onChange={(event) => field.onChange(event.target.checked)}
            onBlur={field.onBlur}
            name={field.name}
            label={label}
          />
          {fieldState.error ? (
            <p role="alert" className="mt-2 text-xs text-error">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  )
}
