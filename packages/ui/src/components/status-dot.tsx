import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import type { HTMLAttributes } from "react";

const statusDotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    tone: {
      success: "bg-success shadow-[0_0_8px_var(--color-success)]",
      iris: "bg-iris-400 shadow-[0_0_8px_var(--color-iris-400)]",
      warning: "bg-warning",
      error: "bg-error",
      muted: "bg-ink-500",
    },
    size: {
      sm: "size-1.5",
      md: "size-2",
    },
    pulse: {
      true: "animate-pulse-dot motion-reduce:animate-none",
    },
  },
  defaultVariants: {
    tone: "success",
    size: "sm",
  },
});

export type StatusDotProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusDotVariants>;

export function StatusDot({
  className,
  tone,
  size,
  pulse,
  ...props
}: StatusDotProps) {
  return (
    <span
      className={cn(statusDotVariants({ tone, size, pulse }), className)}
      {...props}
    />
  );
}
