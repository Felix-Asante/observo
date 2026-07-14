"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import type { ReactNode } from "react";

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  dismissible?: boolean;
  className?: string;
  children: ReactNode;
};

export function Dialog({
  open,
  onClose,
  label,
  dismissible = true,
  className,
  children,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissible) onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose, dismissible]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end justify-center p-4 sm:items-center">
      <div
        aria-hidden
        onClick={dismissible ? onClose : undefined}
        className="animate-fade-in absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "surface-panel animate-scale-in relative w-full max-w-md rounded-xl outline-none",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function DialogHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-border-subtle px-6 py-5">
      <h2 className="text-base font-medium tracking-tight text-ink-50">
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-sm leading-relaxed text-ink-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-2.5 border-t border-border-subtle px-6 py-4">
      {children}
    </div>
  );
}
