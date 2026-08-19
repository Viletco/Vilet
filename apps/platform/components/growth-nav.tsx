import { TabNavigation } from "./tab-navigation";

export function GrowthNav({ slug }: { slug: string; current: string }) {
  const base = `/o/${slug}/growth`;
  const links = [
    { label: "Overview", href: base, exact: true },
    { label: "Prospects", href: `${base}/prospects` },
    { label: "Review", href: `${base}/review` },
    { label: "Pipeline", href: `${base}/pipeline` },
    { label: "Find prospects", href: `${base}/find` },
    { label: "Outreach", href: `${base}/outreach` },
  ] as const;
  return (
    <TabNavigation label="Growth navigation" items={links} className="mb-8" />
  );
}

export function GrowthEmpty({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="border-border/70 bg-card/20 rounded-2xl border border-dashed px-6 py-14 text-center sm:py-20">
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-xl text-[13px] leading-6">
        {description}
      </p>
      {actions && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {actions}
        </div>
      )}
    </section>
  );
}

export const primaryButton =
  "inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-[12.5px] font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-offset-2";
export const secondaryButton =
  "inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-white/[0.02] px-4 text-[12.5px] font-medium transition hover:bg-white/[0.05]";
export const fieldClass =
  "min-h-10 w-full rounded-lg border border-input bg-background px-3 text-[12.5px] text-foreground placeholder:text-muted-foreground/70";
