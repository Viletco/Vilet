import Link from "next/link";
import { requireCapability } from "@vilet/auth";
import {
  GrowthEmpty,
  GrowthNav,
  fieldClass,
  secondaryButton,
} from "../../../../../components/growth-nav";
import { listGrowthProspects } from "../../../../../lib/growth-data";
import { growthPipelineStages } from "../../../../../lib/growth-domain";
import { changeStageAction } from "../actions";
const visibleStages = [
  "qualified",
  "outreach_ready",
  "contacted",
  "replied",
  "opportunity",
  "won",
  "lost",
] as const;
export default async function PipelinePage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireCapability(organizationSlug, "growth.pipeline");
  const { prospects } = await listGrowthProspects(context, {
    status: "active",
    page: 1,
    pageSize: 100,
    sort: "next_action",
  });
  const active = prospects.filter((item) =>
    visibleStages.includes(item.pipeline_stage as never),
  );
  const base = `/o/${organizationSlug}/growth/prospects`;
  return (
    <>
      <GrowthNav slug={organizationSlug} current="pipeline" />
      <header>
        <p className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">
          Active pipeline
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">
          Move the work forward.
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          A compact stage-based view with server-authorized movement and
          recorded history.
        </p>
      </header>
      <div className="mt-8">
        {active.length ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {visibleStages.map((stage) => {
              const items = active.filter(
                (item) => item.pipeline_stage === stage,
              );
              return (
                <section
                  key={stage}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                >
                  <div className="flex justify-between border-b border-[var(--border)] p-4">
                    <h2 className="font-semibold capitalize">
                      {stage.replaceAll("_", " ")}
                    </h2>
                    <span className="text-sm text-[var(--quiet)]">
                      {items.length}
                    </span>
                  </div>
                  <ul className="divide-y divide-[var(--border)]">
                    {items.map((prospect) => (
                      <li key={prospect.id} className="p-4">
                        <Link
                          href={`${base}/${prospect.id}`}
                          className="font-medium"
                        >
                          {prospect.business_name}
                        </Link>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          {prospect.next_action ?? "No next action"}
                        </p>
                        <form
                          action={changeStageAction}
                          className="mt-3 flex gap-2"
                        >
                          <input
                            type="hidden"
                            name="organization_slug"
                            value={organizationSlug}
                          />
                          <input
                            type="hidden"
                            name="prospect_id"
                            value={prospect.id}
                          />
                          <select
                            aria-label={`Move ${prospect.business_name} to stage`}
                            className={fieldClass}
                            name="pipeline_stage"
                            defaultValue={prospect.pipeline_stage}
                          >
                            {growthPipelineStages.map((option) => (
                              <option key={option} value={option}>
                                {option.replaceAll("_", " ")}
                              </option>
                            ))}
                          </select>
                          <button className={secondaryButton}>Move</button>
                        </form>
                      </li>
                    ))}
                  </ul>
                  {!items.length && (
                    <p className="p-4 text-sm text-[var(--quiet)]">
                      No prospects in this stage.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <GrowthEmpty
            title="No active pipeline opportunities yet."
            description="Qualify prospects from the review queue to begin building the pipeline."
          />
        )}
      </div>
    </>
  );
}
