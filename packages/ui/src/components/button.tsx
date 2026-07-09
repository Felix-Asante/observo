import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ease-out focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_0_0_1px_var(--color-iris-600)] hover:bg-iris-400",
        secondary:
          "border border-border bg-white/[0.03] text-ink-100 hover:border-border-strong hover:bg-white/[0.06]",
        ghost: "text-ink-300 hover:bg-white/[0.05] hover:text-ink-50",
        link: "text-iris-300 underline-offset-4 hover:text-iris-200 hover:underline",
      },
      size: {
        sm: "h-8 px-3.5 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-[0.9375rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariants;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonVariants;

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
