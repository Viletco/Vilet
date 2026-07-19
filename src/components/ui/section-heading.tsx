import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Eyebrow } from "./eyebrow";
import { Heading } from "./heading";
import { Text } from "./text";

export interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  width?: "reading" | "wide";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  titleId?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  width = "reading",
  level = 2,
  titleId,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-(--ds-space-lg)",
        width === "reading" ? "max-w-(--ds-container-reading)" : "max-w-4xl",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow variant="accent">{eyebrow}</Eyebrow>}
      <Heading id={titleId} level={level} variant="heading-2" align={align}>
        {title}
      </Heading>
      {description && (
        <Text
          variant="body-lg"
          className={cn(align === "center" && "text-center")}
        >
          {description}
        </Text>
      )}
    </div>
  );
}
