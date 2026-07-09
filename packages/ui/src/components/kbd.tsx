import { cn } from "../lib/cn";
import type { HTMLAttributes } from "react";

export function Kbd({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-white/[0.04] px-1.5 font-mono text-2xs text-ink-300",
        className,
      )}
      {...props}
    />
  );
}
