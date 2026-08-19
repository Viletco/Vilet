import { EmptyState, PageHeader } from "../../../../../components/page-frame";
import { PartnerNav, partnerCard } from "../../../../../components/partner-nav";
import { approvedPolicy } from "../../../../../lib/partner-knowledge";
import { requireSalesPartner } from "../../../../../lib/partner-auth";
export default async function Commissions({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireSalesPartner(organizationSlug);
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
      <EmptyState
        title="No commission records."
        description="No fabricated estimate is shown. A versioned owner-approved rule and accepted lead attribution are required before a commission event can exist."
      />
    </>
  );
}
