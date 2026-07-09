"use client";

import { createContext, useContext, useId, useState } from "react";
import { cn } from "../lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

type AccordionContextValue = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function Accordion({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <AccordionContext.Provider value={{ openId, setOpenId }}>
      <div
        className={cn("divide-y divide-border-subtle", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = {
  question: string;
  children: ReactNode;
};

export function AccordionItem({ question, children }: AccordionItemProps) {
  const context = useContext(AccordionContext);
  const id = useId();
  if (!context) throw new Error("AccordionItem must be used within Accordion");

  const isOpen = context.openId === id;

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={() => context.setOpenId(isOpen ? null : id)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left transition-colors duration-200 hover:text-iris-200"
      >
        <span className="text-[0.9375rem] font-medium text-ink-100">
          {question}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden
          className={cn(
            "shrink-0 text-ink-400 transition-transform duration-300 ease-out",
            isOpen && "rotate-45",
          )}
        >
          <path
            d="M7 1v12M1 7h12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-ink-300">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
