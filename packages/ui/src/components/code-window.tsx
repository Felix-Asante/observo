import { cn } from "../lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

export type CodeWindowProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  actions?: ReactNode;
};

/**
 * Framed window chrome for code, terminals, and product previews.
 * Content is provided by children so callers control syntax rendering.
 */
export function CodeWindow({
  title,
  actions,
  className,
  children,
  ...props
}: CodeWindowProps) {
  return (
    <div
      className={cn("surface-panel overflow-hidden rounded-xl", className)}
      {...props}
    >
      <div className="relative flex h-11 items-center justify-between border-b border-border-subtle px-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-ink-700" />
          <span className="size-2.5 rounded-full bg-ink-700" />
          <span className="size-2.5 rounded-full bg-ink-700" />
        </div>
        {title ? (
          <span className="absolute left-1/2 -translate-x-1/2 font-mono text-xs text-ink-400">
            {title}
          </span>
        ) : null}
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}
