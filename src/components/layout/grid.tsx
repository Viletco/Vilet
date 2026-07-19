import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import { cn } from "@/lib/cn";

import type { PolymorphicProps } from "@/components/ui/component-types";

const gridVariants = cva("grid", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 tablet:grid-cols-2",
      3: "grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3",
      4: "grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4",
    },
    gap: {
      sm: "gap-(--ds-space-sm)",
      md: "gap-(--ds-space-md)",
      lg: "gap-(--ds-space-lg)",
      xl: "gap-(--ds-space-xl)",
      "2xl": "gap-(--ds-space-2xl)",
      grid: "gap-(--ds-grid-gap)",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    columns: 1,
    gap: "grid",
    align: "stretch",
  },
});

type GridOwnProps = VariantProps<typeof gridVariants>;

export type GridProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  GridOwnProps
>;

export function Grid<T extends ElementType = "div">({
  as,
  columns,
  gap,
  align,
  className,
  ...props
}: GridProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(gridVariants({ columns, gap, align }), className)}
      {...props}
    />
  );
}
