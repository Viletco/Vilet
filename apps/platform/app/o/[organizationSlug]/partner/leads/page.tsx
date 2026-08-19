import { PageHeader, EmptyState } from "../../../../../components/page-frame";
import { PartnerNav, partnerCard } from "../../../../../components/partner-nav";
import { requireSalesPartner } from "../../../../../lib/partner-auth";

export default async function Leads({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireSalesPartner(organizationSlug);
  return (
    <>
      <PartnerNav slug={organizationSlug} current="leads" />
      <PageHeader
        eyebrow="Partner opportunities"
        title="My leads"
        description="Partner submissions use Vilét's shared prospect architecture. You see only your attribution and a limited status—not internal notes, research, pricing, or other partners' records."
      />
      <section className={`${partnerCard} mt-8`}>
        <h2 className="font-semibold">Submission requirements</h2>
        <div className="text-muted-foreground mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <p>· Business name and website/domain where available</p>
          <p>· Contact and relationship context</p>
          <p>· Publicly observable need or stated interest</p>
          <p>· Services of interest and appropriate channel/consent context</p>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          Duplicates never silently create attribution. Existing internal
          discovery, prior outreach, and competing partner claims enter owner
          review.
        </p>
      </section>
      <EmptyState
        title="No partner leads to display."
        description="Lead creation is intentionally unavailable until the staging migration is applied, a partner record is provisioned, and duplicate/conflict review is manually verified."
      />
    </>
  );
}
