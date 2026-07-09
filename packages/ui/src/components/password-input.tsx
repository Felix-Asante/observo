"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn";
import { inputClassName } from "./input";
import type { InputHTMLAttributes, ReactNode } from "react";

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.25" />
      {off ? (
        <path
          d="M2.5 13.5l11-11"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

export type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
  labelAction?: ReactNode;
  error?: string;
};

export function PasswordInput({
  label,
  labelAction,
  error,
  className,
  id: idProp,
  ...props
}: PasswordInputProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-ink-200">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(inputClassName, "pr-11")}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center rounded-r-lg text-ink-500 transition-colors duration-200 hover:text-ink-200"
        >
          <EyeIcon off={visible} />
        </button>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
