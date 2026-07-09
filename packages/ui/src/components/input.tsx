import { useId } from "react";
import { cn } from "../lib/cn";
import type { InputHTMLAttributes, ReactNode } from "react";

export const inputClassName =
  "h-11 w-full rounded-lg border border-border bg-white/[0.02] px-3.5 text-sm text-ink-50 transition-[border-color,box-shadow,background-color] duration-200 outline-none placeholder:text-ink-500 hover:border-border-strong focus:border-iris-400/60 focus:bg-white/[0.03] focus:shadow-[0_0_0_3px_var(--glow-iris-soft)] disabled:pointer-events-none disabled:opacity-50 aria-[invalid=true]:border-error/60 aria-[invalid=true]:focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-error)_12%,transparent)]";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  /** Rendered on the right of the label row (e.g. a "Forgot?" link). */
  labelAction?: ReactNode;
  error?: string;
};

export function Input({
  label,
  labelAction,
  error,
  className,
  id: idProp,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-ink-200">
          {label}
        </label>
        {labelAction}
      </div>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={inputClassName}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
