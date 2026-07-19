import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

import { cn } from "@/lib/cn";

import { buttonVariants, type ButtonVariantProps } from "./button-variants";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {
  loading?: boolean;
  loadingLabel?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  loadingLabel = "Loading",
  leadingIcon,
  trailingIcon,
  disabled,
  className,
  children,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={loading ? loadingLabel : props["aria-label"]}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
    >
      {loading && (
        <span aria-hidden="true" className="absolute inline-flex">
          <LoaderCircle className="size-4" />
        </span>
      )}
      <span
        className={cn(
          "inline-flex items-center justify-center gap-(--ds-space-sm)",
          loading && "invisible",
        )}
      >
        {leadingIcon && <span aria-hidden="true">{leadingIcon}</span>}
        {children}
        {trailingIcon && <span aria-hidden="true">{trailingIcon}</span>}
      </span>
    </button>
  );
}
