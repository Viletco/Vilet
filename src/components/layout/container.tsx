import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType } from "react";

import { cn } from "@/lib/cn";

import type { PolymorphicProps } from "@/components/ui/component-types";

const containerVariants = cva("w-full px-(--ds-page-padding)", {
  variants: {
    width: {
      default: "mx-auto max-w-(--ds-container-content)",
      wide: "mx-auto max-w-(--breakpoint-wide)",
      reading: "mx-auto max-w-(--ds-container-reading)",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    width: "default",
  },
});

type ContainerOwnProps = VariantProps<typeof containerVariants>;

export type ContainerProps<T extends ElementType = "div"> = PolymorphicProps<
  T,
  ContainerOwnProps
>;

export function Container<T extends ElementType = "div">({
  as,
  width,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(containerVariants({ width }), className)}
      {...props}
    />
  );
}
