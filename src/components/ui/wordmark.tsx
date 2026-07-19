import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

import { focusRing, interactiveTransition } from "./interactive-styles";

const wordmarkVariants = cva("font-semibold tracking-[-0.04em]", {
  variants: {
    size: {
      sm: "text-lg",
      md: "text-2xl",
      lg: "text-3xl",
    },
    tone: {
      default: "text-text-primary",
      muted: "text-text-secondary",
    },
  },
  defaultVariants: {
    size: "md",
    tone: "default",
  },
});

export interface WordmarkProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof wordmarkVariants> {
  linked?: boolean;
}

export function Wordmark({
  size,
  tone,
  linked = false,
  className,
  ...props
}: WordmarkProps) {
  const wordmark = (
    <span
      className={cn(wordmarkVariants({ size, tone }), !linked && className)}
      {...props}
    >
      Vilét
    </span>
  );

  if (!linked) return wordmark;

  return (
    <Link
      href="/"
      aria-label="Vilét home"
      className={cn(
        "inline-flex rounded-sm",
        focusRing,
        interactiveTransition,
        className,
      )}
    >
      {wordmark}
    </Link>
  );
}
