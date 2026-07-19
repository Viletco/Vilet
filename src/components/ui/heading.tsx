import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { GradientText } from "./gradient-text";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingVariant =
  | "display-xl"
  | "display-lg"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4";

const variantClasses: Record<HeadingVariant, string> = {
  "display-xl": "type-display-xl",
  "display-lg": "type-display-lg",
  "heading-1": "type-heading-1",
  "heading-2": "type-heading-2",
  "heading-3": "type-heading-3",
  "heading-4": "type-heading-4",
};

export interface HeadingProps {
  as?: `h${HeadingLevel}`;
  level?: HeadingLevel;
  variant?: HeadingVariant;
  align?: "left" | "center" | "right";
  muted?: boolean;
  gradient?: boolean;
  className?: string;
  children: ReactNode;
  id?: string;
}

export function Heading({
  as,
  level = 2,
  variant = "heading-2",
  align = "left",
  muted = false,
  gradient = false,
  className,
  children,
  ...props
}: HeadingProps) {
  const Component = as ?? (`h${level}` as const);
  const content = gradient ? <GradientText>{children}</GradientText> : children;

  return (
    <Component
      className={cn(
        variantClasses[variant],
        "text-text-primary",
        align === "center" && "text-center",
        align === "right" && "text-right",
        muted && "text-text-secondary",
        className,
      )}
      {...props}
    >
      {content}
    </Component>
  );
}
