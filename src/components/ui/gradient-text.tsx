import type { ElementType } from "react";

import { cn } from "@/lib/cn";

import type { PolymorphicProps } from "./component-types";

export type GradientTextProps<T extends ElementType = "span"> =
  PolymorphicProps<T>;

export function GradientText<T extends ElementType = "span">({
  as,
  className,
  ...props
}: GradientTextProps<T>) {
  const Component = as ?? "span";

  return (
    <Component className={cn("text-gradient-accent", className)} {...props} />
  );
}
