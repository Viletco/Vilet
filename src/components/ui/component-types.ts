import type { ComponentPropsWithoutRef, ElementType } from "react";

export type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | "as">;
