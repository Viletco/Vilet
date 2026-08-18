import {
  illustrativeBusinessData,
  illustrativeWorkflowData,
} from "@/content/demo-data";
import { cn } from "@/lib/cn";

type DemoVariant = "overview" | "insights" | "operations";

function DemoChrome({ label }: { label: string }) {
  return (
    <div className="border-divider flex min-h-11 items-center justify-between border-b px-(--ds-space-lg)">
      <div className="flex items-center gap-(--ds-space-sm)" aria-hidden="true">
        <span className="bg-text-muted/40 size-1.5 rounded-full" />
        <span className="bg-text-muted/30 size-1.5 rounded-full" />
        <span className="bg-text-muted/20 size-1.5 rounded-full" />
      </div>
      <span className="type-caption text-text-muted uppercase">{label}</span>
    </div>
  );
}

function TrendChart({ detailed = false }: { detailed?: boolean }) {
  const { chart } = illustrativeBusinessData;
  return (
    <figure className="min-w-0" aria-label={chart.label}>
      <div className="relative h-36 w-full">
        <div
          aria-hidden="true"
          className="border-divider absolute inset-0 border-y bg-[linear-gradient(to_right,transparent_24.8%,var(--ds-color-divider)_25%,transparent_25.2%,transparent_49.8%,var(--ds-color-divider)_50%,transparent_50.2%,transparent_74.8%,var(--ds-color-divider)_75%,transparent_75.2%)] opacity-60"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 338 112"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <defs>
            <linearGradient
              id={`demo-area-${detailed ? "large" : "small"}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0"
                stopColor="var(--ds-color-accent)"
                stopOpacity="0.28"
              />
              <stop
                offset="1"
                stopColor="var(--ds-color-accent)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <polygon
            points={chart.area}
            fill={`url(#demo-area-${detailed ? "large" : "small"})`}
          />
          <polyline
            points={chart.points}
            fill="none"
            stroke="var(--ds-color-accent)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="330"
            cy="12"
            r="4"
            fill="var(--ds-color-surface-elevated)"
            stroke="var(--ds-color-accent)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      {detailed && (
        <figcaption className="type-caption text-text-muted mt-(--ds-space-sm) flex justify-between">
          {chart.labels.map((label, index) => (
            <span
              key={label}
              className={cn(index % 2 === 1 && "mobile:inline hidden")}
            >
              {label}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}

function InsightPanel() {
  const { insight } = illustrativeBusinessData;
  const items = [
    ["What changed", insight.changed],
    ["Why it matters", insight.matters],
    ["Recommended next action", insight.action],
  ] as const;
  return (
    <div className="border-accent/30 background-card-glow bg-card rounded-lg border p-(--ds-space-lg)">
      <div className="flex items-center justify-between gap-(--ds-space-md)">
        <span className="type-caption text-accent uppercase">
          Vilét interpretation
        </span>
        <span className="type-caption text-text-muted">Concept</span>
      </div>
      <div className="mt-(--ds-space-lg) grid gap-(--ds-space-lg)">
        {items.map(([label, text], index) => (
          <div
            key={label}
            className={cn(
              index > 0 && "border-divider border-t pt-(--ds-space-lg)",
            )}
          >
            <p className="type-caption text-text-muted uppercase">{label}</p>
            <p className="type-body-sm text-text-secondary mt-(--ds-space-sm)">
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewDemo({ detailed = false }: { detailed?: boolean }) {
  const data = illustrativeBusinessData;
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-(--ds-space-lg)">
        <div>
          <p className="type-caption text-text-muted uppercase">
            Business overview
          </p>
          <p className="type-heading-4 mt-(--ds-space-xs)">Sample business</p>
        </div>
        <span className="type-caption text-text-muted border-border rounded-full border px-(--ds-space-md) py-(--ds-space-sm)">
          {data.period}
        </span>
      </div>
      <dl className="tablet:grid-cols-4 bg-divider mt-(--ds-space-xl) grid grid-cols-2 gap-px overflow-hidden rounded-md">
        {data.metrics.map((metric) => (
          <div key={metric.label} className="bg-surface p-(--ds-space-lg)">
            <dt className="type-caption text-text-muted">{metric.label}</dt>
            <dd className="type-heading-4 mt-(--ds-space-sm)">
              {metric.value}
            </dd>
            <dd
              className={cn(
                "type-caption mt-(--ds-space-xs)",
                metric.direction === "up" ? "text-success" : "text-text-muted",
              )}
            >
              {metric.change}
            </dd>
          </div>
        ))}
      </dl>
      <div
        className={cn(
          "mt-(--ds-space-xl) grid gap-(--ds-space-xl)",
          detailed && "laptop:grid-cols-[1.35fr_0.65fr]",
        )}
      >
        <div className="border-divider bg-surface rounded-lg border p-(--ds-space-lg)">
          <div className="mb-(--ds-space-lg) flex items-center justify-between">
            <p className="type-body-sm font-semibold">Revenue trend</p>
            <span className="type-caption text-success">+12.4%</span>
          </div>
          <TrendChart detailed={detailed} />
        </div>
        <InsightPanel />
      </div>
    </>
  );
}

function OperationsDemo() {
  const data = illustrativeWorkflowData;
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-(--ds-space-lg)">
        <div>
          <p className="type-caption text-text-muted uppercase">
            Operations system
          </p>
          <p className="type-heading-4 mt-(--ds-space-xs)">{data.title}</p>
        </div>
        <span className="type-caption text-success">Systems normal</span>
      </div>
      <dl className="tablet:grid-cols-3 bg-divider mt-(--ds-space-xl) grid gap-px overflow-hidden rounded-md">
        {data.summary.map((item) => (
          <div key={item.label} className="bg-surface p-(--ds-space-lg)">
            <dt className="type-caption text-text-muted">{item.label}</dt>
            <dd className="type-heading-4 mt-(--ds-space-sm)">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="laptop:grid-cols-[1.1fr_0.9fr] mt-(--ds-space-xl) grid gap-(--ds-space-xl)">
        <div className="border-divider bg-surface rounded-lg border p-(--ds-space-lg)">
          <p className="type-body-sm font-semibold">Automated lead workflow</p>
          <ol className="mt-(--ds-space-lg) grid gap-(--ds-space-sm)">
            {data.stages.map((stage, index) => (
              <li
                key={stage.label}
                className="border-divider flex items-center gap-(--ds-space-md) border-b py-(--ds-space-sm) last:border-0"
              >
                <span
                  className={cn(
                    "type-caption grid size-6 shrink-0 place-items-center rounded-full border",
                    stage.status === "complete"
                      ? "border-success/50 bg-success/10 text-success"
                      : stage.status === "active"
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-border text-text-muted",
                  )}
                >
                  {index + 1}
                </span>
                <span className="type-body-sm flex-1">{stage.label}</span>
                <span className="type-caption text-text-muted capitalize">
                  {stage.status}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="border-divider bg-surface rounded-lg border p-(--ds-space-lg)">
          <p className="type-body-sm font-semibold">Recent activity</p>
          <ul className="mt-(--ds-space-lg) space-y-(--ds-space-lg)">
            {data.activity.map((item) => (
              <li key={item.name}>
                <div className="flex justify-between gap-(--ds-space-md)">
                  <span className="type-body-sm">{item.name}</span>
                  <span className="type-caption text-accent">
                    {item.status}
                  </span>
                </div>
                <p className="type-caption text-text-muted mt-(--ds-space-xs)">
                  Owner · {item.owner}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export function ProductDemo({
  variant = "overview",
  className,
}: {
  variant?: DemoVariant;
  className?: string;
}) {
  const label =
    variant === "operations"
      ? illustrativeWorkflowData.disclosure
      : illustrativeBusinessData.disclosure;
  return (
    <section
      aria-label={label}
      className={cn(
        "border-border bg-surface-elevated overflow-hidden rounded-xl border shadow-lg",
        className,
      )}
    >
      <DemoChrome label={label} />
      <div className="tablet:p-(--ds-space-2xl) p-(--ds-space-lg)">
        {variant === "operations" ? (
          <OperationsDemo />
        ) : (
          <OverviewDemo detailed={variant === "insights"} />
        )}
      </div>
    </section>
  );
}
