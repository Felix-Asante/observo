import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Container } from "./container";
import type { HTMLAttributes } from "react";

const sectionVariants = cva("relative scroll-mt-24", {
  variants: {
    size: {
      default: "py-24 md:py-32 lg:py-40",
      compact: "py-14 md:py-20",
      flush: "py-0",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type SectionProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionVariants> & {
    containerClassName?: string;
  };

export function Section({
  className,
  containerClassName,
  size,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(sectionVariants({ size }), className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
