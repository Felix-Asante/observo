import { cn } from "../lib/cn";
import type { HTMLAttributes } from "react";

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-content px-5 sm:px-8", className)}
      {...props}
    />
  );
}
