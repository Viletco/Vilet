import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface DisclosureProps {
  id: string;
  question: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Disclosure({
  id,
  question,
  children,
  className,
}: DisclosureProps) {
  return (
    <details
      className={cn(
        "group border-divider open:border-border border-b transition-colors duration-(--ds-motion-fast)",
        className,
      )}
    >
      <summary className="focus-visible:ring-focus-ring type-heading-4 text-text-primary focus-visible:ring-offset-background hover:text-accent-hover group-open:text-accent-hover flex min-h-14 cursor-pointer list-none items-center justify-between gap-(--ds-space-lg) py-(--ds-space-xl) transition-colors duration-(--ds-motion-fast) outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
        <span>{question}</span>
        <ChevronDown
          aria-hidden="true"
          className="text-text-muted size-5 shrink-0 transition-transform duration-(--ds-motion-fast) group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div
        id={id}
        className="type-body text-text-secondary max-w-(--ds-container-reading) pb-(--ds-space-xl)"
      >
        {children}
      </div>
    </details>
  );
}
