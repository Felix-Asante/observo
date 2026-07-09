import { cn } from "../lib/cn";
import type { HTMLAttributes } from "react";

export type GradientTextProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "white" | "iris";
};

export function GradientText({
  className,
  variant = "white",
  ...props
}: GradientTextProps) {
  return (
    <span
      className={cn(
        variant === "white" ? "text-gradient" : "text-gradient-iris",
        className,
      )}
      {...props}
    />
  );
}
