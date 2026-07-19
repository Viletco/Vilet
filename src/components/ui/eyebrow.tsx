import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

import type { PolymorphicProps } from "./component-types";

type EyebrowOwnProps = {
  icon?: ReactNode;
  marker?: boolean;
  variant?: "muted" | "accent";
  uppercase?: boolean;
};

export type EyebrowProps<T extends ElementType = "p"> = PolymorphicProps<
  T,
  EyebrowOwnProps
>;

export function Eyebrow<T extends ElementType = "p">({
  as,
  icon,
  marker = false,
  variant = "muted",
  uppercase = true,
  className,
  children,
  ...props
}: EyebrowProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(
        "type-caption inline-flex items-center gap-(--ds-space-sm) font-semibold tracking-[0.12em]",
        uppercase && "uppercase",
        variant === "accent" ? "text-accent" : "text-text-muted",
        className,
      )}
      {...props}
    >
      {marker && (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {icon && (
        <span aria-hidden="true" className="inline-flex shrink-0">
          {icon}
        </span>
      )}
      {children}
    </Component>
  );
}
