import { cn } from "../lib/cn";
import type { InputHTMLAttributes, ReactNode } from "react";

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
  description?: string;
};

export function Switch({ label, description, className, ...props }: SwitchProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4 select-none",
        className,
      )}
    >
      {label ? (
        <span className="min-w-0">
          <span className="block text-sm font-medium text-ink-100">{label}</span>
          {description ? (
            <span className="mt-0.5 block text-xs leading-relaxed text-ink-400">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
      <input type="checkbox" role="switch" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full border border-border-strong bg-white/[0.04] transition-colors duration-200 peer-checked:border-iris-500 peer-checked:bg-iris-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-iris-400 peer-checked:[&>span]:translate-x-4 peer-checked:[&>span]:bg-white"
      >
        <span className="absolute top-1/2 left-0.5 size-3.5 -translate-y-1/2 rounded-full bg-ink-400 transition-[translate,transform,background-color] duration-200" />
      </span>
    </label>
  );
}
