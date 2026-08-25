import type { ProductStatus } from "../lib/platform-products";
import { productStatusLabel } from "../lib/platform-products";

export function PageHeader({
  eyebrow,
  title,
  description,
  status,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  status?: ProductStatus;
  actions?: React.ReactNode;
}) {
  return (
    <header className="border-border relative flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <p className="text-primary/80 text-[11px] font-semibold tracking-[0.1em] uppercase">
            {eyebrow}
          </p>
          {status && status !== "available" && (
            <ProductStatusBadge status={status} />
          )}
        </div>
        <h1 className="vilet-product-title mt-3 text-[30px] sm:text-[40px]">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-[13.5px] leading-6">
          {description}
        </p>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  );
}

const tones: Record<ProductStatus, string> = {
  available: "bg-emerald-400",
  internal: "bg-sky-400",
  beta: "bg-violet-400",
  coming_soon: "bg-zinc-400",
};

export function ProductStatusBadge({
  status,
  compact = false,
}: {
  status: ProductStatus;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-white/[0.03] font-medium tracking-wide uppercase ${compact ? "gap-1 px-1.5 py-0.5 text-[9px]" : "gap-1.5 px-2 py-1 text-[10px]"}`}
    >
      <span
        aria-hidden="true"
        className={`size-1 rounded-full ${tones[status]}`}
      />
      {productStatusLabel(status)}
    </span>
  );
}

export const StatusBadge = ProductStatusBadge;

export function EmptyState({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="command-surface relative mt-8 px-6 py-14 sm:py-20">
      <span
        aria-hidden="true"
        className="bg-primary absolute top-0 left-[12%] h-4 w-px -translate-y-1/2 rotate-[28deg]"
      />
      <div
        aria-hidden="true"
        className="border-border mx-auto mb-6 h-7 max-w-40 border-b"
      >
        <span className="bg-primary block h-full w-px translate-x-1/2 rotate-[28deg]" />
      </div>
      <h2 className="text-center text-[15px] font-semibold">{title}</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-[13px] leading-6">
        {description}
      </p>
      {actions && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {actions}
        </div>
      )}
    </section>
  );
}

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: React.ReactNode;
  detail?: string;
}) {
  return (
    <div className="border-border bg-card/20 border-l p-4">
      <p className="vilet-coordinate text-muted-foreground">{label}</p>
      <p className="mt-2 text-[24px] font-semibold tracking-tight">{value}</p>
      {detail && (
        <p className="text-muted-foreground mt-1 text-[11.5px]">{detail}</p>
      )}
    </div>
  );
}

export function StageBadge({ stage }: { stage: string }) {
  return (
    <span className="border-primary/15 bg-primary/8 text-primary inline-flex rounded-full border px-2 py-1 text-[10.5px] font-medium capitalize">
      {stage.replaceAll("_", " ")}
    </span>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse bg-white/[0.05] ${className}`}
    />
  );
}

export function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li
          key={item}
          className="group border-border bg-card/20 text-muted-foreground hover:border-primary/40 hover:bg-card/45 border-l p-5 text-[13px] transition-colors duration-200"
        >
          <span className="text-primary mr-2">·</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
