import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import { cn } from "@/lib/cn";

import type { PolymorphicProps } from "./component-types";
import { focusRing, interactiveTransition } from "./interactive-styles";

const cardVariants = cva("rounded-lg bg-card", {
  variants: {
    variant: {
      default: "border-border",
      elevated: "border-border bg-surface-elevated shadow-md",
      glass: "glass",
      interactive: cn(
        "border-border hover:border-text-muted hover:bg-surface-elevated focus-within:border-focus-ring",
        interactiveTransition,
      ),
      highlight:
        "background-card-glow border-accent/50 bg-card shadow-glow-soft",
    },
    padding: {
      none: "p-0",
      sm: "p-(--ds-space-lg)",
      md: "p-(--ds-space-xl)",
      lg: "p-(--ds-space-2xl)",
    },
    border: {
      true: "border",
      false: "border-0",
    },
    glow: {
      true: "shadow-glow-soft",
    },
    hover: {
      true: cn(
        "hover:border-text-muted hover:bg-surface-elevated",
        interactiveTransition,
      ),
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
    border: true,
    glow: false,
    hover: false,
  },
});

type CardOwnProps = VariantProps<typeof cardVariants>;

export type CardProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  CardOwnProps
>;

export function Card<T extends ElementType = "div">({
  as,
  variant,
  padding,
  border,
  glow,
  hover,
  className,
  ...props
}: CardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        cardVariants({ variant, padding, border, glow, hover }),
        (Component === "a" || Component === "button") && focusRing,
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-(--ds-space-sm)", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("type-heading-4 text-text-primary", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("type-body text-text-secondary", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("mt-(--ds-space-xl)", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-(--ds-space-xl) flex items-center gap-(--ds-space-md)",
        className,
      )}
      {...props}
    />
  );
}
