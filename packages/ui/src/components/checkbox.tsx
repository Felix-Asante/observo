import { cn } from "../lib/cn";
import type { InputHTMLAttributes, ReactNode } from "react";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: ReactNode;
};

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer items-start gap-2.5 text-sm text-ink-300 select-none",
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border border-border-strong bg-white/[0.02] text-transparent transition-all duration-200 group-hover:border-ink-500 peer-checked:border-iris-500 peer-checked:bg-iris-500 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-iris-400"
      >
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4.2 3.6 6.8 9 1.3"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="leading-snug">{label}</span>
    </label>
  );
}
