import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { buttonVariants, type ButtonVariantProps } from "./button-variants";
import { getSafeRel, isInternalHref } from "./link-utils";

export interface ButtonLinkProps
  extends
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    ButtonVariantProps {
  href: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function ButtonLink({
  href,
  variant,
  size,
  fullWidth,
  leadingIcon,
  trailingIcon,
  className,
  children,
  target,
  rel,
  ...props
}: ButtonLinkProps) {
  const content = (
    <>
      {leadingIcon && <span aria-hidden="true">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span aria-hidden="true">{trailingIcon}</span>}
    </>
  );
  const classes = cn(buttonVariants({ variant, size, fullWidth }), className);

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
