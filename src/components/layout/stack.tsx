import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import { cn } from "@/lib/cn";

import type { PolymorphicProps } from "@/components/ui/component-types";

const stackVariants = cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
      responsive: "flex-col tablet:flex-row",
    },
    gap: {
      none: "gap-0",
      xs: "gap-(--ds-space-xs)",
      sm: "gap-(--ds-space-sm)",
      md: "gap-(--ds-space-md)",
      lg: "gap-(--ds-space-lg)",
      xl: "gap-(--ds-space-xl)",
      "2xl": "gap-(--ds-space-2xl)",
      "3xl": "gap-(--ds-space-3xl)",
      "4xl": "gap-(--ds-space-4xl)",
      "5xl": "gap-(--ds-space-5xl)",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    direction: "vertical",
    gap: "lg",
    align: "stretch",
    justify: "start",
    wrap: false,
  },
});

type StackOwnProps = VariantProps<typeof stackVariants>;

export type StackProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  StackOwnProps
>;

export function Stack<T extends ElementType = "div">({
  as,
  direction,
  gap,
  align,
  justify,
  wrap,
  className,
  ...props
}: StackProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        stackVariants({ direction, gap, align, justify, wrap }),
        className,
      )}
      {...props}
    />
  );
}
