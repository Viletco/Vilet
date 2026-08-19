import { Inbox } from "lucide-react";
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
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <p className="text-primary/80 text-[11px] font-semibold tracking-[0.1em] uppercase">
            {eyebrow}
          </p>
          {status && status !== "available" && (
            <ProductStatusBadge status={status} />
          )}
        </div>
        <h1 className="mt-2 text-[22px] font-semibold tracking-tight sm:text-[26px]">
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
    <section className="border-border/70 bg-card/20 mt-8 rounded-2xl border border-dashed px-6 py-14 text-center sm:py-20">
      <span className="bg-primary/10 text-primary ring-primary/15 mx-auto grid size-12 place-items-center rounded-xl ring-1">
        <Inbox aria-hidden="true" size={20} strokeWidth={1.8} />
      </span>
      <h2 className="mt-5 text-[15px] font-semibold">{title}</h2>
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
    <div className="border-border bg-card/40 rounded-xl border p-4">
      <p className="text-muted-foreground text-[11px] tracking-wide uppercase">
        {label}
      </p>
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
      className={`block animate-pulse rounded-lg bg-white/[0.05] ${className}`}
    />
  );
}

export function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li
          key={item}
          className="group border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:bg-card/70 rounded-2xl border p-5 text-[13px] transition-all duration-200"
        >
          <span className="text-primary mr-2">·</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
