import { cn } from "@/lib/cn";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  variant?: "standard" | "gradient" | "muted";
  className?: string;
  decorative?: boolean;
}

export function Divider({
  orientation = "horizontal",
  variant = "standard",
  className,
  decorative = true,
}: DividerProps) {
  return (
    <div
      role={decorative ? "presentation" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full min-h-6 w-px",
        variant === "standard" && "bg-border",
        variant === "muted" && "bg-divider",
        variant === "gradient" &&
          (orientation === "horizontal"
            ? "section-divider"
            : "bg-(image:--ds-gradient-section-divider)"),
        className,
      )}
    />
  );
}
