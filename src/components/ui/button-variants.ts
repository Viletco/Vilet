import { cva, type VariantProps } from "class-variance-authority";

import { focusRing, interactiveTransition } from "./interactive-styles";

export const buttonVariants = cva(
  [
    "type-button relative inline-flex shrink-0 items-center justify-center gap-(--ds-space-sm) rounded-md border font-semibold",
    "select-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    focusRing,
    interactiveTransition,
  ],
  {
    variants: {
      variant: {
        primary:
          "border-accent bg-accent text-background hover:border-accent-hover hover:bg-accent-hover active:bg-accent",
        secondary:
          "border-border bg-surface-elevated text-text-primary hover:bg-card active:bg-surface",
        outline:
          "border-border bg-transparent text-text-primary hover:border-text-muted hover:bg-surface",
        ghost:
          "border-transparent bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary",
        text: "border-transparent bg-transparent px-0 text-accent hover:text-accent-hover",
        destructive:
          "border-danger bg-danger text-background hover:opacity-90 active:opacity-80",
      },
      size: {
        sm: "h-9 px-(--ds-space-md)",
        md: "h-11 px-(--ds-space-xl)",
        lg: "h-13 px-(--ds-space-2xl)",
        icon: "size-11 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
