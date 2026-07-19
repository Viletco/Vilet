import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

import { focusRing, interactiveTransition } from "./interactive-styles";
import { getSafeRel, isInternalHref } from "./link-utils";

const icons = {
  right: ArrowRight,
  left: ArrowLeft,
  up: ArrowUp,
  down: ArrowDown,
};

export interface ArrowLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  href: string;
  direction?: keyof typeof icons;
}

export function ArrowLink({
  href,
  direction = "right",
  className,
  children,
  target,
  rel,
  ...props
}: ArrowLinkProps) {
  const Icon = icons[direction];
  const classes = cn(
    "type-button group inline-flex items-center gap-(--ds-space-sm) rounded-sm text-text-primary hover:text-accent-hover",
    focusRing,
    interactiveTransition,
    className,
  );
  const content = (
    <>
      {children}
      <Icon
        aria-hidden="true"
        className="size-4 transition-transform duration-(--ds-motion-hover) ease-(--ds-ease-standard) group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
      />
    </>
  );

  if (isInternalHref(href)) {
    return (
      <Link
        href={href}
        className={classes}
        target={target}
        rel={rel}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      target={target}
      rel={getSafeRel(target, rel)}
      {...props}
    >
      {content}
    </a>
  );
}
