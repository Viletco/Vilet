import { PageHeader } from "../../../../../components/page-frame";
import { PartnerNav, partnerCard } from "../../../../../components/partner-nav";
import {
  objections,
  salesServices,
  targetProfiles,
} from "../../../../../lib/partner-knowledge";
import { requireSalesPartner } from "../../../../../lib/partner-auth";

export default async function Playbook({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireSalesPartner(organizationSlug);
  return (
    <>
      <PartnerNav slug={organizationSlug} current="playbook" />
      <PageHeader
        eyebrow="Fast reference"
        title="Sales playbook"
        description="Use this during preparation and conversations. Personalize every approach and escalate any question not answered by approved guidance."
      />
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Service sales cards</h2>
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {salesServices.map((s) => (
            <article key={s.slug} className={partnerCard}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{s.name}</h3>
                <span className="text-primary text-[10px] uppercase">
                  {s.availability}
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">{s.summary}</p>
              <p className="mt-4 text-xs font-semibold">Ideal fit</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {s.idealCustomer}
              </p>
              {s.questions.length > 0 && (
                <>
                  <p className="mt-4 text-xs font-semibold">Questions to ask</p>
                  <ul className="text-muted-foreground mt-1 space-y-1 text-sm">
                    {s.questions.map((x) => (
                      <li key={x}>· {x}</li>
                    ))}
                  </ul>
                </>
              )}
              <details className="mt-4">
                <summary className="text-primary cursor-pointer text-xs">
                  Claims and guardrails
                </summary>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold">Approved</p>
                    {s.approvedClaims.map((x) => (
                      <p className="text-muted-foreground mt-1 text-xs" key={x}>
                        · {x}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Do not claim</p>
                    {s.forbiddenClaims.map((x) => (
                      <p className="text-muted-foreground mt-1 text-xs" key={x}>
                        · {x}
                      </p>
                    ))}
                  </div>
                </div>
              </details>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Who to target</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {targetProfiles.map(([name, signal]) => (
            <article key={name} className={partnerCard}>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{signal}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="text-lg font-semibold">Objection guide</h2>
        <div className="mt-4 space-y-3">
          {objections.map(([objection, meaning, response]) => (
            <article key={objection} className={partnerCard}>
              <h3 className="font-semibold">“{objection}”</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                <strong className="text-foreground">May mean:</strong> {meaning}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                <strong className="text-foreground">Respond:</strong> {response}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
