import { createPlatformServerClient } from "@vilet/auth";
import {
  ArrowRight,
  Bot,
  CircleDollarSign,
  Clock3,
  GraduationCap,
  ListChecks,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { PartnerNav, partnerCard } from "../../../../components/partner-nav";
import { requireSalesPartner } from "../../../../lib/partner-auth";
import { trainingModules } from "../../../../lib/partner-knowledge";

const money = (minor: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(minor / 100);

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof UsersRound;
}) {
  return (
    <article className="border-border bg-card/55 rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.08em] uppercase">
          {label}
        </p>
        <Icon aria-hidden="true" className="text-primary" size={15} />
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-muted-foreground mt-1 text-[11px]">{detail}</p>
    </article>
  );
}

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const { context, partner } = await requireSalesPartner(organizationSlug);
  const client = await createPlatformServerClient();
  const [
    { data: progress = [] },
    { data: leads = [] },
    { data: commissions = [] },
  ] = client
    ? await Promise.all([
        client
          .from("sales_training_progress")
          .select("module_key,completed_at")
          .eq("organization_id", context.organizationId)
          .eq("partner_id", partner.id),
        client.rpc("list_partner_own_leads", {
          target_organization_id: context.organizationId,
        }),
        client
          .from("commission_ledger")
          .select("status,amount_minor,currency,created_at")
          .eq("organization_id", context.organizationId)
          .eq("partner_id", partner.id)
          .order("created_at", { ascending: false }),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];

  const completed = new Set(
    progress?.filter((row) => row.completed_at).map((row) => row.module_key),
  );
  const percent = Math.round((completed.size / trainingModules.length) * 100);
  const nextIndex = trainingModules.findIndex(
    (_, index) => !completed.has(String(index + 1).padStart(2, "0")),
  );
  const safeLeads = (leads ?? []) as Record<string, unknown>[];
  const accepted = safeLeads.filter(
    (lead) => lead.partner_status === "accepted",
  ).length;
  const inReview = safeLeads.filter((lead) =>
    ["pending_review", "conflict"].includes(String(lead.partner_status)),
  ).length;
  const totals = (commissions ?? []).reduce<Record<string, number>>(
    (sum, row) => ({
      ...sum,
      [row.status]: (sum[row.status] ?? 0) + Number(row.amount_minor),
    }),
    {},
  );
  const currency = commissions?.[0]?.currency ?? "USD";
  const base = `/o/${organizationSlug}/partner`;
  const pipeline = [
    ["Submitted", safeLeads.length],
    ["In review", inReview],
    ["Accepted", accepted],
    ["Commissioned", commissions?.length ?? 0],
  ] as const;
  const pipelineMax = Math.max(1, ...pipeline.map(([, count]) => count));

  return (
    <>
      <PartnerNav slug={organizationSlug} current="dashboard" />
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="text-primary flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase">
            <Sparkles aria-hidden="true" size={13} /> Sales partner dashboard
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Welcome to your partner workspace.
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
            Learn Vilét, qualify opportunities responsibly, and track the real
            activity you are authorized to see.
          </p>
        </div>
        <Link
          href={`${base}/leads`}
          className="bg-primary text-primary-foreground inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold"
        >
          <Send aria-hidden="true" size={15} /> Submit a lead
        </Link>
      </header>

      <section
        aria-label="Partner metrics"
        className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5"
      >
        <MetricCard
          label="Leads submitted"
          value={String(safeLeads.length)}
          detail="Real partner submissions"
          icon={UsersRound}
        />
        <MetricCard
          label="Under review"
          value={String(inReview)}
          detail="Pending Vilét review"
          icon={Clock3}
        />
        <MetricCard
          label="Accepted"
          value={String(accepted)}
          detail="Approved attributions"
          icon={Target}
        />
        <MetricCard
          label="Earned"
          value={money(totals.earned ?? 0, currency)}
          detail="Approved ledger value"
          icon={TrendingUp}
        />
        <MetricCard
          label="Pending"
          value={money(totals.pending ?? 0, currency)}
          detail="Not yet earned or paid"
          icon={CircleDollarSign}
        />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_1fr_0.9fr]">
        <article className={partnerCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground eyebrow">Training progress</p>
              <h2 className="mt-1 text-lg font-semibold">Partner readiness</h2>
            </div>
            <GraduationCap
              aria-hidden="true"
              className="text-primary"
              size={19}
            />
          </div>
          <div className="mt-5 flex items-center gap-5">
            <div
              className="partner-progress-ring grid size-24 shrink-0 place-items-center rounded-full"
              style={{ "--partner-progress": percent } as CSSProperties}
              aria-label={`${percent}% of training complete`}
            >
              <div className="bg-card grid size-[76px] place-items-center rounded-full text-xl font-semibold">
                {percent}%
              </div>
            </div>
            <div>
              <p className="font-semibold">
                {nextIndex < 0
                  ? "Core training complete"
                  : trainingModules[nextIndex][0]}
              </p>
              <p className="text-muted-foreground mt-1 text-xs leading-5">
                {completed.size} of {trainingModules.length} modules complete.
                Owner evaluation remains separate.
              </p>
              <Link
                className="text-primary mt-3 inline-flex items-center gap-1 text-xs font-semibold"
                href={`${base}/training`}
              >
                {nextIndex < 0 ? "Review training" : "Continue learning"}{" "}
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </article>

        <article className={partnerCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground eyebrow">Next up</p>
              <h2 className="mt-1 text-lg font-semibold">
                Recommended actions
              </h2>
            </div>
            <ListChecks aria-hidden="true" className="text-primary" size={19} />
          </div>
          <div className="mt-4 divide-y divide-white/[0.06]">
            {[
              [
                nextIndex < 0
                  ? "Review approved positioning"
                  : `Complete ${trainingModules[nextIndex][0]}`,
                `${base}/training`,
              ],
              ["Review the sales playbook", `${base}/playbook`],
              [
                safeLeads.length
                  ? "Check submitted lead statuses"
                  : "Submit your first qualified lead",
                `${base}/leads`,
              ],
            ].map(([label, href], index) => (
              <Link
                key={label}
                href={href}
                className="group flex items-center gap-3 py-3 text-sm"
              >
                <span className="border-primary/30 text-primary grid size-6 place-items-center rounded-full border text-[10px]">
                  {index + 1}
                </span>
                <span className="flex-1">{label}</span>
                <ArrowRight
                  className="text-muted-foreground group-hover:text-primary"
                  size={14}
                />
              </Link>
            ))}
          </div>
        </article>

        <article className={`${partnerCard} relative overflow-hidden`}>
          <div className="bg-primary/10 absolute -top-12 -right-12 size-32 rounded-full blur-3xl" />
          <Bot aria-hidden="true" className="text-primary" size={22} />
          <h2 className="mt-4 text-lg font-semibold">Sales Assistant</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Get grounded guidance about services, discovery, and approved
            objection handling.
          </p>
          <Link
            href={`${base}/assistant`}
            className="border-primary/30 bg-primary/10 text-primary mt-5 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold"
          >
            Ask the assistant <ArrowRight size={13} />
          </Link>
        </article>
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <article className={partnerCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground eyebrow">Recent activity</p>
              <h2 className="mt-1 text-lg font-semibold">Partner leads</h2>
            </div>
            <Link className="text-primary text-xs" href={`${base}/leads`}>
              View all
            </Link>
          </div>
          {!safeLeads.length ? (
            <div className="border-border mt-4 rounded-xl border border-dashed p-8 text-center">
              <p className="font-medium">No leads submitted yet.</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Real submissions will appear here—no demonstration records are
                inserted.
              </p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-white/[0.06]">
              {safeLeads.slice(0, 4).map((lead) => (
                <div
                  key={String(lead.attribution_id)}
                  className="flex items-center gap-3 py-3"
                >
                  <span className="bg-primary/10 text-primary grid size-8 place-items-center rounded-lg text-xs font-semibold">
                    {String(lead.business_name).slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {String(lead.business_name)}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      {[lead.city, lead.region].filter(Boolean).join(", ") ||
                        "Location not supplied"}
                    </p>
                  </div>
                  <span className="border-primary/20 text-primary rounded-full border px-2 py-1 text-[9px] font-semibold uppercase">
                    {String(lead.partner_status).replaceAll("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className={partnerCard}>
          <p className="text-muted-foreground eyebrow">Pipeline overview</p>
          <h2 className="mt-1 text-lg font-semibold">Your visible lifecycle</h2>
          <div className="mt-5 space-y-4">
            {pipeline.map(([label, count], index) => (
              <div key={label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span>{label}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400"
                    style={{
                      width: `${Math.max(count ? 12 : 0, (count / pipelineMax) * 100)}%`,
                      opacity: 1 - index * 0.12,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-5 text-[11px]">
            Only partner-safe lifecycle states are shown. Internal Growth notes
            and research remain private.
          </p>
        </article>
      </section>

      <p className="text-muted-foreground mt-5 text-[11px]">
        Partner lifecycle: {partner.status}. Values reflect current authorized
        staging records only.
      </p>
    </>
  );
}
