import { PageHeader } from "../../../../../components/page-frame";
import { PartnerNav, partnerCard } from "../../../../../components/partner-nav";
import { approvedPolicy } from "../../../../../lib/partner-knowledge";
import { requireSalesPartner } from "../../../../../lib/partner-auth";
export default async function Assistant({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireSalesPartner(organizationSlug);
  return (
    <>
      <PartnerNav slug={organizationSlug} current="assistant" />
      <PageHeader
        eyebrow="Grounded knowledge"
        title="AI Sales Assistant foundation"
        description="The provider-neutral assistant boundary is prepared around approved training, service status, policy, and partner-authorized lead context. No external model call is enabled."
        status="internal"
      />
      <section className={`${partnerCard} mt-8`}>
        <h2 className="font-semibold">Safe answer contract</h2>
        <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
          <li>
            · Authenticate and authorize before retrieving any lead context.
          </li>
          <li>· Separate partner mode from any future public/customer mode.</li>
          <li>
            · Ground answers in versioned approved sources and name uncertainty.
          </li>
          <li>
            · Never invent pricing, commission policy, availability, timelines,
            results, or guarantees.
          </li>
          <li>
            · Retrieve only the partner&apos;s permitted lead projection—never
            internal notes or other partners&apos; records.
          </li>
        </ul>
      </section>
      <section className={`${partnerCard} mt-4`}>
        <h2 className="font-semibold">Unknown-policy response</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          “That decision is not currently approved in Vilét&apos;s sales policy.{" "}
          {approvedPolicy.escalation}”
        </p>
      </section>
    </>
  );
}
