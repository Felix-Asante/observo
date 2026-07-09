import { cn } from "../lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-md bg-white/4.5 motion-reduce:animate-none",
        className,
      )}
    />
  );
}
