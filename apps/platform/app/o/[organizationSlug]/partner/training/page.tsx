import { createPlatformServerClient } from "@vilet/auth";
import { PageHeader } from "../../../../../components/page-frame";
import { PartnerNav, partnerCard } from "../../../../../components/partner-nav";
import { requireSalesPartner } from "../../../../../lib/partner-auth";
import { trainingModules } from "../../../../../lib/partner-knowledge";
import { completeLesson } from "../actions";

export default async function Training({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const { context, partner } = await requireSalesPartner(organizationSlug);
  const client = await createPlatformServerClient();
  const { data: progress = [] } = client
    ? await client
        .from("sales_training_progress")
        .select("module_key,completed_at")
        .eq("organization_id", context.organizationId)
        .eq("partner_id", partner.id)
    : { data: [] };
  const completed = new Set(
    progress?.filter((row) => row.completed_at).map((row) => row.module_key),
  );
  const next = trainingModules.findIndex(
    (_, index) => !completed.has(String(index + 1).padStart(2, "0")),
  );
  const percent = Math.round((completed.size / trainingModules.length) * 100);
  return (
    <>
      <PartnerNav slug={organizationSlug} current="training" />
      <PageHeader
        eyebrow="Partner training"
        title="Learn to represent Vilét accurately."
        description="A structured curriculum built around evidence, qualification, useful outcomes, and clear escalation boundaries."
      />
      <section className={`${partnerCard} mt-8`}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-primary text-[10px] uppercase">
              Course progress
            </p>
            <p className="mt-2 text-3xl font-semibold">{percent}%</p>
          </div>
          <p className="text-muted-foreground text-sm">
            {completed.size} of {trainingModules.length} modules complete
          </p>
        </div>
        <div className="bg-muted mt-4 h-2 overflow-hidden rounded-full">
          <div className="bg-primary h-full" style={{ width: `${percent}%` }} />
        </div>
        <p className="text-muted-foreground mt-3 text-xs">
          {next < 0
            ? "Course content complete. Readiness still requires owner-approved evaluation."
            : `Next: ${trainingModules[next][0]}`}
        </p>
      </section>
      <ol className="mt-4 grid gap-3 lg:grid-cols-2">
        {trainingModules.map(([title, summary], index) => {
          const key = String(index + 1).padStart(2, "0");
          const done = completed.has(key);
          return (
            <li key={title} className={partnerCard}>
              <div className="flex gap-4">
                <span className="text-primary font-mono text-xs">{key}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold">{title}</h2>
                    <span className="text-[10px] uppercase">
                      {done ? "Complete" : "Not complete"}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {summary}
                  </p>
                  <details className="mt-3">
                    <summary className="text-primary cursor-pointer text-xs">
                      Lesson structure
                    </summary>
                    <div className="text-muted-foreground mt-3 grid gap-2 text-xs">
                      <p>
                        <strong className="text-foreground">Objective:</strong>{" "}
                        Apply this guidance accurately in a real sales
                        conversation.
                      </p>
                      <p>
                        <strong className="text-foreground">Scenario:</strong>{" "}
                        Identify the business fact first, then ask a qualifying
                        question before recommending a service.
                      </p>
                      <p>
                        <strong className="text-foreground">Do not:</strong>{" "}
                        Invent price, scope, availability, outcomes, or
                        authority.
                      </p>
                      <p>
                        <strong className="text-foreground">Takeaway:</strong>{" "}
                        Escalate any decision not covered by an approved source.
                      </p>
                    </div>
                  </details>
                  {!done && (
                    <form
                      action={completeLesson.bind(null, organizationSlug, key)}
                      className="mt-4"
                    >
                      <input type="hidden" name="lessonKey" value="core" />
                      <button className="bg-primary text-primary-foreground rounded-md px-3 py-2 text-xs font-semibold">
                        Mark module complete
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
