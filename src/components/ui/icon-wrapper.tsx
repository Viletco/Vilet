import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

const iconWrapperVariants = cva(
  "inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        sm: "size-8 [&>svg]:size-4",
        md: "size-10 [&>svg]:size-5",
        lg: "size-12 [&>svg]:size-6",
      },
      variant: {
        default: "text-text-primary",
        accent: "bg-accent/10 text-accent-hover",
        muted: "text-text-muted",
        surface: "border border-border bg-surface-elevated text-text-secondary",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      shape: "square",
    },
  },
);

type AccessibilityProps =
  { decorative?: true; label?: never } | { decorative: false; label: string };

export type IconWrapperProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "aria-label"
> &
  VariantProps<typeof iconWrapperVariants> &
  AccessibilityProps & {
    children: ReactNode;
  };

export function IconWrapper({
  size,
  variant,
  shape,
  decorative = true,
  label,
  className,
  children,
  ...props
}: IconWrapperProps) {
  return (
    <span
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      className={cn(iconWrapperVariants({ size, variant, shape }), className)}
      {...props}
    >
      {children}
    </span>
  );
}
