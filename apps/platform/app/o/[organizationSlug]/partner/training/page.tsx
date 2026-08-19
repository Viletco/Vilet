import { PageHeader } from "../../../../../components/page-frame";
import { PartnerNav, partnerCard } from "../../../../../components/partner-nav";
import { trainingModules } from "../../../../../lib/partner-knowledge";
import { requireSalesPartner } from "../../../../../lib/partner-auth";

export default async function Training({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireSalesPartner(organizationSlug);
  return (
    <>
      <PartnerNav slug={organizationSlug} current="training" />
      <PageHeader
        eyebrow="Partner training"
        title="Learn to represent Vilét accurately."
        description="A structured curriculum built around evidence, qualification, useful outcomes, and clear escalation boundaries."
      />
      <ol className="mt-8 grid gap-3 lg:grid-cols-2">
        {trainingModules.map(([title, summary], index) => (
          <li key={title} className={partnerCard}>
            <div className="flex gap-4">
              <span className="text-primary font-mono text-xs">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-semibold">{title}</h2>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {summary}
                </p>
                <p className="text-muted-foreground mt-3 text-[11px]">
                  Progress becomes available after partner provisioning.
                  Readiness requires owner-approved assessment completion.
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
