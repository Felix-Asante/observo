import { cn } from "../lib/cn";
import type { HTMLAttributes } from "react";

export type LogoProps = HTMLAttributes<HTMLSpanElement> & {
  withWordmark?: boolean;
};

/**
 * Observo mark — an aperture/pulse motif: concentric signal rings
 * with a scanning dot, nodding to observability without cliché.
 */
export function Logo({ className, withWordmark = true, ...props }: LogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      {...props}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect
          width="26"
          height="26"
          rx="7"
          fill="var(--color-iris-500)"
          fillOpacity="0.14"
        />
        <rect
          x="0.5"
          y="0.5"
          width="25"
          height="25"
          rx="6.5"
          stroke="var(--color-iris-400)"
          strokeOpacity="0.35"
        />
        <circle
          cx="13"
          cy="13"
          r="6.5"
          stroke="var(--color-iris-300)"
          strokeWidth="1.5"
          strokeDasharray="26 15"
          strokeLinecap="round"
        />
        <circle cx="13" cy="13" r="2.5" fill="var(--color-iris-400)" />
      </svg>
      {withWordmark ? (
        <span className="text-[1.0625rem] font-semibold tracking-tight text-ink-50">
          observo
        </span>
      ) : null}
    </span>
  );
}
