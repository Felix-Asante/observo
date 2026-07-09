import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import type { HTMLAttributes } from "react";

const cardVariants = cva("rounded-xl", {
  variants: {
    variant: {
      default: "surface-card",
      panel: "surface-panel",
      inset: "surface-inset",
      glass: "surface-glass",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props} />
  );
}
