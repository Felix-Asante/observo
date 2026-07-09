import { cn } from "../lib/cn";
import type { HTMLAttributes } from "react";

export type SectionHeadingProps = HTMLAttributes<HTMLDivElement> & {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-14 max-w-2xl md:mb-20",
        centered && "mx-auto text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <p
          className={cn("label-mono mb-4 text-iris-400", centered && "mx-auto")}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-gradient text-3xl font-medium tracking-heading text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed text-pretty text-ink-300 sm:text-lg",
            centered && "mx-auto max-w-xl",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
