import { EmptyState, PageHeader } from "../../../../../components/page-frame";
import { PartnerNav, partnerCard } from "../../../../../components/partner-nav";
import { approvedPolicy } from "../../../../../lib/partner-knowledge";
import { requireSalesPartner } from "../../../../../lib/partner-auth";
import { createPlatformServerClient } from "@vilet/auth";
export default async function Commissions({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const { context, partner } = await requireSalesPartner(organizationSlug);
  const client = await createPlatformServerClient();
  const { data: ledger = [] } = client
    ? await client
        .from("commission_ledger")
        .select("id,status,amount_minor,currency,created_at,earned_at,paid_at")
        .eq("organization_id", context.organizationId)
        .eq("partner_id", partner.id)
        .order("created_at", { ascending: false })
    : { data: [] };
  const totals = (ledger ?? []).reduce<Record<string, number>>(
    (sum, row) => ({
      ...sum,
      [row.status]: (sum[row.status] ?? 0) + Number(row.amount_minor),
    }),
    {},
  );
  const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: ledger?.[0]?.currency ?? "USD",
    }).format(value / 100);
  return (
    <>
      <PartnerNav slug={organizationSlug} current="commissions" />
      <PageHeader
        eyebrow="Partner compensation"
        title="Commissions"
        description="A durable, versioned ledger for pending, earned, paid, reversed, and disputed events. Values appear only from approved real records."
      />
      <section className={`${partnerCard} mt-8`}>
        <h2 className="font-semibold">Policy not yet approved</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {approvedPolicy.commissions}
        </p>
        <p className="text-muted-foreground mt-2 text-sm">
          Historical ledger entries retain the exact rule version and
          currency-minor-unit calculation used when created.
        </p>
      </section>
      <section className="mt-4 grid gap-3 sm:grid-cols-3">
        {["pending", "earned", "paid"].map((status) => (
          <div className={partnerCard} key={status}>
            <p className="text-muted-foreground text-[10px] uppercase">
              {status}
            </p>
            <p className="mt-2 text-xl font-semibold">
              {money(totals[status] ?? 0)}
            </p>
          </div>
        ))}
      </section>
      {!ledger?.length ? (
        <EmptyState
          title="No commission records."
          description="No fabricated estimate is shown. A versioned owner-approved rule and accepted lead attribution are required before a commission event can exist."
        />
      ) : (
        <div className="mt-6 space-y-3">
          {ledger.map((entry) => (
            <article key={entry.id} className={partnerCard}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {money(Number(entry.amount_minor))}
                </p>
                <span className="text-primary text-[10px] uppercase">
                  {entry.status}
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Recorded {new Date(entry.created_at).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
