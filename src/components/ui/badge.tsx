import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "type-caption inline-flex items-center gap-(--ds-space-sm) rounded-full border font-semibold",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-elevated text-text-secondary",
        outline: "border-border bg-transparent text-text-secondary",
        accent: "border-accent/40 bg-accent/10 text-accent-hover",
        success: "border-success/40 bg-success/10 text-success",
        warning: "border-warning/40 bg-warning/10 text-warning",
        danger: "border-danger/40 bg-danger/10 text-danger",
        ai: "border-accent/40 bg-glass text-accent-hover shadow-glow-soft",
        featured: "border-accent bg-accent text-background",
      },
      size: {
        sm: "min-h-6 px-(--ds-space-sm) py-(--ds-space-xs)",
        md: "min-h-8 px-(--ds-space-md) py-(--ds-space-sm)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  icon?: ReactNode;
  dot?: boolean;
}

export function Badge({
  variant,
  size,
  icon,
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      )}
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
