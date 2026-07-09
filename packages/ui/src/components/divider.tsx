import { cn } from "../lib/cn";

export type DividerProps = {
  label?: string;
  className?: string;
};

export function Divider({ label, className }: DividerProps) {
  return (
    <div
      role="separator"
      aria-label={label}
      className={cn("flex items-center gap-4", className)}
    >
      <span aria-hidden className="h-px flex-1 bg-border" />
      {label ? (
        <span className="font-mono text-2xs tracking-label text-ink-500 uppercase">
          {label}
        </span>
      ) : null}
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
}
