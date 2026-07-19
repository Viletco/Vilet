import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import { cn } from "@/lib/cn";

import type { PolymorphicProps } from "@/components/ui/component-types";

const sectionVariants = cva("relative", {
  variants: {
    spacing: {
      compact: "py-(--ds-space-3xl)",
      default: "py-(--ds-section-space)",
      spacious: "py-[calc(var(--ds-section-space)+var(--ds-space-2xl))]",
    },
    background: {
      none: "bg-transparent",
      surface: "bg-surface",
      elevated: "bg-surface-elevated",
      hero: "background-hero",
    },
    divider: {
      true: "border-t border-divider",
    },
  },
  defaultVariants: {
    spacing: "default",
    background: "none",
    divider: false,
  },
});

type SectionOwnProps = VariantProps<typeof sectionVariants>;

export type SectionProps<T extends ElementType = "section"> = PolymorphicProps<
  T,
  SectionOwnProps
>;

export function Section<T extends ElementType = "section">({
  as,
  spacing,
  background,
  divider,
  className,
  ...props
}: SectionProps<T>) {
  const Component = as ?? "section";

  return (
    <Component
      className={cn(
        sectionVariants({ spacing, background, divider }),
        className,
      )}
      {...props}
    />
  );
}
