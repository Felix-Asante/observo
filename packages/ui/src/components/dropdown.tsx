"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export const dropdownItemClassName =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-ink-200 transition-colors duration-150 hover:bg-white/[0.05] hover:text-ink-50 focus-visible:bg-white/[0.05] focus-visible:outline-none";

export type DropdownProps = {
  /** Content of the trigger button. */
  button: ReactNode;
  buttonClassName?: string;
  buttonAriaLabel?: string;
  align?: "start" | "end";
  menuClassName?: string;
  children: ReactNode;
};

export function Dropdown({
  button,
  buttonClassName,
  buttonAriaLabel,
  align = "end",
  menuClassName,
  children,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={buttonAriaLabel}
        onClick={() => setOpen((v) => !v)}
        className={cn("cursor-pointer", buttonClassName)}
      >
        {button}
      </button>
      {open ? (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className={cn(
            "surface-panel animate-scale-in absolute top-full z-50 mt-2 min-w-52 rounded-lg p-1.5",
            align === "end" ? "right-0" : "left-0",
            menuClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export type DropdownItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  danger?: boolean;
};

export function DropdownItem({ className, danger, ...props }: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        dropdownItemClassName,
        danger && "text-error hover:bg-error/10 hover:text-error",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownSeparator() {
  return <div role="separator" className="my-1.5 h-px bg-border-subtle" />;
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-2.5 pt-2 pb-1 font-mono text-2xs tracking-label text-ink-500 uppercase">
      {children}
    </p>
  );
}
