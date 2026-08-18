import { ChartNoAxesCombined, Code2, Globe2, Workflow } from "lucide-react";

const systems = [
  { label: "Website", icon: Globe2 },
  { label: "Automation", icon: Workflow, status: "Running" },
  { label: "Software", icon: Code2, status: "Stable" },
  { label: "Analytics", icon: ChartNoAxesCombined, status: "Syncing" },
] as const;

export function DigitalProductVisual() {
  return (
    <figure
      className="laptop:min-h-[25rem] relative min-w-0"
      aria-label="Concept preview of a connected digital system"
    >
      <div className="border-accent/25 bg-surface-elevated shadow-glow-soft laptop:absolute laptop:inset-x-8 laptop:top-6 overflow-hidden rounded-xl border">
        <figcaption className="border-divider flex h-12 items-center justify-between border-b px-(--ds-space-lg)">
          <span className="type-caption text-text-secondary flex items-center gap-(--ds-space-sm) font-mono tracking-[0.18em] uppercase">
            <span className="bg-accent size-2 rounded-full" />
            Digital system
          </span>
          <span className="type-caption border-accent/40 bg-accent/10 text-accent rounded-md border px-(--ds-space-sm) py-(--ds-space-xs) font-mono uppercase">
            Active
          </span>
        </figcaption>
        <ul>
          {systems.map(({ label, icon: Icon, ...system }) => (
            <li
              key={label}
              className="border-divider flex h-12 items-center gap-(--ds-space-md) border-b px-(--ds-space-lg) last:border-0"
            >
              <Icon aria-hidden="true" className="text-accent size-4" />
              <span className="type-body-sm text-text-primary font-semibold">
                {label}
              </span>
              {"status" in system && (
                <span className="type-caption text-text-secondary ml-auto flex items-center gap-(--ds-space-sm) font-mono">
                  <span className="bg-success size-1.5 rounded-full" />
                  {system.status}
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="border-divider border-t px-(--ds-space-lg) py-(--ds-space-md)">
          <div className="type-caption text-text-muted mb-(--ds-space-sm) flex justify-between font-mono uppercase">
            <span>Performance</span>
            <span className="text-success">● Live</span>
          </div>
          <svg
            viewBox="0 0 420 62"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="h-14 w-full"
          >
            <defs>
              <linearGradient id="system-area" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0"
                  stopColor="var(--ds-color-accent)"
                  stopOpacity=".28"
                />
                <stop
                  offset="1"
                  stopColor="var(--ds-color-accent)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path
              d="M0 53 L44 47 L88 49 L132 38 L176 41 L220 29 L264 32 L308 22 L352 25 L420 16 L420 62 L0 62 Z"
              fill="url(#system-area)"
            />
            <polyline
              points="0,53 44,47 88,49 132,38 176,41 220,29 264,32 308,22 352,25 420,16"
              fill="none"
              stroke="var(--ds-color-accent)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      <div className="border-border bg-card laptop:absolute laptop:right-0 laptop:top-16 mt-(--ds-space-md) w-40 rounded-lg border p-(--ds-space-md) shadow-md">
        <p className="type-caption text-text-muted font-mono uppercase">
          Client portal
        </p>
        <div className="bg-divider mt-(--ds-space-md) h-1.5 overflow-hidden rounded-full">
          <div className="bg-accent h-full w-3/4" />
        </div>
        <div className="bg-divider mt-(--ds-space-sm) h-1.5 overflow-hidden rounded-full">
          <div className="bg-accent/50 h-full w-1/2" />
        </div>
      </div>

      <div className="border-border bg-card laptop:absolute laptop:bottom-2 laptop:left-0 mt-(--ds-space-md) w-44 rounded-lg border p-(--ds-space-md) shadow-md">
        <p className="type-caption text-text-muted font-mono uppercase">
          Workflow
        </p>
        <ol className="mt-(--ds-space-md) grid grid-cols-3 gap-(--ds-space-sm) text-center">
          {["Capture", "Process", "Deliver"].map((label, index) => (
            <li key={label}>
              <span className="border-border text-accent mx-auto grid size-6 place-items-center rounded-full border font-mono text-xs">
                {index + 1}
              </span>
              <span className="type-caption text-text-muted mt-(--ds-space-xs) block font-mono uppercase">
                {label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
