import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

import { focusRing, interactiveTransition } from "./interactive-styles";
import { getSafeRel, isInternalHref } from "./link-utils";

export interface TextLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  href: string;
  variant?: "inline" | "navigation";
}

export function TextLink({
  href,
  variant = "inline",
  className,
  target,
  rel,
  ...props
}: TextLinkProps) {
  const classes = cn(
    "rounded-sm underline-offset-4",
    variant === "inline"
      ? "text-accent underline decoration-border hover:text-accent-hover hover:decoration-accent-hover"
      : "type-body-sm font-medium text-text-secondary hover:text-text-primary",
    focusRing,
    interactiveTransition,
    className,
  );

  if (isInternalHref(href)) {
    return (
      <Link
        href={href}
        className={classes}
        target={target}
        rel={rel}
        {...props}
      />
    );
  }

  return (
    <a
      href={href}
      className={classes}
      target={target}
      rel={getSafeRel(target, rel)}
      {...props}
    />
  );
}
