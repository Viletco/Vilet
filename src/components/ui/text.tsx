import type { ElementType } from "react";

import { cn } from "@/lib/cn";

import type { PolymorphicProps } from "./component-types";

type TextVariant = "body-lg" | "body" | "body-sm" | "caption" | "code";

const variantClasses: Record<TextVariant, string> = {
  "body-lg": "type-body-lg",
  body: "type-body",
  "body-sm": "type-body-sm",
  caption: "type-caption",
  code: "type-code",
};

type TextOwnProps = {
  variant?: TextVariant;
  muted?: boolean;
  strong?: boolean;
};

export type TextProps<T extends ElementType = "p"> = PolymorphicProps<
  T,
  TextOwnProps
>;

export function Text<T extends ElementType = "p">({
  as,
  variant = "body",
  muted = false,
  strong = false,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(
        variantClasses[variant],
        muted ? "text-text-muted" : "text-text-secondary",
        strong && "text-text-primary font-semibold",
        className,
      )}
      {...props}
    />
  );
}
