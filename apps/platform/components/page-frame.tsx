import type { ProductStatus } from "../lib/platform-products";
import { productStatusLabel } from "../lib/platform-products";

export function PageHeader({
  eyebrow,
  title,
  description,
  status,
}: {
  eyebrow: string;
  title: string;
  description: string;
  status?: ProductStatus;
}) {
  return (
    <header className="max-w-3xl">
      <div className="flex items-center gap-3">
        <p className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">
          {eyebrow}
        </p>
        {status && status !== "available" && <StatusBadge status={status} />}
      </div>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 text-base leading-7 text-[var(--muted)] sm:text-lg">
        {description}
      </p>
    </header>
  );
}

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.1em] text-[var(--accent-light)] uppercase">
      {productStatusLabel(status)}
    </span>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="max-w-2xl">
        <p className="text-lg font-medium">{title}</p>
        <p className="mt-3 leading-7 text-[var(--muted)]">{description}</p>
      </div>
    </section>
  );
}

export function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li
          key={item}
          className="bg-[var(--surface)] p-5 text-sm text-[var(--muted)]"
        >
          <span className="mr-3 text-[var(--accent)]">·</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
