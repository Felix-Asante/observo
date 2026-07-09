import { useId } from "react";
import { cn } from "../lib/cn";
import type { SelectHTMLAttributes } from "react";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  /** Visually hide the label while keeping it accessible. */
  hideLabel?: boolean;
};

export function Select({
  label,
  hideLabel,
  className,
  id: idProp,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={id}
          className={cn(
            "mb-2 block text-sm font-medium text-ink-200",
            hideLabel && "sr-only",
          )}
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={id}
          className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-border bg-ink-900 pr-8 pl-3 text-sm text-ink-100 transition-[border-color,box-shadow] duration-200 outline-none hover:border-border-strong focus:border-iris-400/60 focus:shadow-[0_0_0_3px_var(--glow-iris-soft)]"
          {...props}
        >
          {children}
        </select>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-500"
        >
          <path
            d="m1 1 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
