"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

type MenuCoords = {
  top: number;
  left: number;
  transformOrigin: string;
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
  const [coords, setCoords] = useState<MenuCoords | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const menu = menuRef.current;
      if (!trigger || !menu) return;

      const rect = trigger.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const gap = 8;
      const padding = 8;

      const spaceBelow = window.innerHeight - rect.bottom - gap;
      const spaceAbove = rect.top - gap;
      const openUp =
        spaceBelow < menuRect.height && spaceAbove > spaceBelow;

      let top = openUp
        ? rect.top - menuRect.height - gap
        : rect.bottom + gap;

      let left =
        align === "end" ? rect.right - menuRect.width : rect.left;

      left = Math.min(
        Math.max(padding, left),
        window.innerWidth - menuRect.width - padding,
      );
      top = Math.min(
        Math.max(padding, top),
        window.innerHeight - menuRect.height - padding,
      );

      const horizontal = align === "end" ? "right" : "left";
      setCoords({
        top,
        left,
        transformOrigin: openUp
          ? `bottom ${horizontal}`
          : `top ${horizontal}`,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    // Capture scroll from nested overflow containers too.
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, align]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
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
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={buttonAriaLabel}
        onClick={() => setOpen((v) => !v)}
        className={cn("cursor-pointer", buttonClassName)}
      >
        {button}
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              onClick={() => setOpen(false)}
              style={
                coords
                  ? {
                      top: coords.top,
                      left: coords.left,
                      transformOrigin: coords.transformOrigin,
                    }
                  : { visibility: "hidden", top: 0, left: 0 }
              }
              className={cn(
                "surface-panel animate-scale-in fixed z-50 min-w-52 rounded-lg p-1.5",
                menuClassName,
              )}
            >
              {children}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export type DropdownItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  danger?: boolean;
};

export function DropdownItem({
  className,
  danger,
  ...props
}: DropdownItemProps) {
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
