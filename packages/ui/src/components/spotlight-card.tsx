"use client";

import { cn } from "../lib/cn";
import { useSpotlight } from "../hooks/use-spotlight";
import type { HTMLAttributes } from "react";

/**
 * Card with a cursor-following radial highlight.
 * Depth comes from layered borders + the spotlight, not shadows.
 */
export function SpotlightCard({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn("spotlight surface-card rounded-xl", className)}
      {...props}
    >
      {children}
    </div>
  );
}
