import { cn } from "@/lib/cn";

import { focusRing } from "@/components/ui/interactive-styles";

export function SkipLink() {
  return (
    <a
      data-skip-link
      href="#main-content"
      className={cn(
        "type-button border-border bg-surface-elevated text-text-primary fixed top-(--ds-space-lg) left-(--ds-space-lg) z-(--ds-z-tooltip) -translate-y-[200%] rounded-md border px-(--ds-space-lg) py-(--ds-space-md) transition-transform duration-(--ds-motion-fast) focus:translate-y-0 motion-reduce:transition-none",
        focusRing,
      )}
    >
      Skip to content
    </a>
  );
}
