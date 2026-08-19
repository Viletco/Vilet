import Link from "next/link";
import { requireCapability } from "@vilet/auth";
import {
  GrowthEmpty,
  GrowthNav,
  primaryButton,
  secondaryButton,
} from "../../../../../components/growth-nav";
import { listGrowthProspects } from "../../../../../lib/growth-data";
import { changeStageAction, setRecordStatusAction } from "../actions";
export default async function ReviewPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireCapability(
    organizationSlug,
    "growth.prospecting",
  );
  const { prospects } = await listGrowthProspects(context, {
    stage: "review",
    status: "active",
    pageSize: 100,
    sort: "oldest",
  });
  const base = `/o/${organizationSlug}/growth/prospects`;
  return (
    <>
      <GrowthNav slug={organizationSlug} current="review" />
      <header>
        <p className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">
          Human review
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">
          Review queue.
        </h1>
        <p className="mt-3 text-[var(--muted)]">
          Make a clear decision without simulated scores or automated
          recommendations.
        </p>
      </header>
      <div className="mt-8">
        {prospects.length ? (
          <ul className="grid gap-4">
            {prospects.map((prospect) => (
              <li
                key={prospect.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                  <div>
                    <Link
                      className="text-lg font-semibold"
                      href={`${base}/${prospect.id}`}
                    >
                      {prospect.business_name}
                    </Link>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {(prospect.domain_normalized ??
                        [prospect.city, prospect.region]
                          .filter(Boolean)
                          .join(", ")) ||
                        "No website or location"}
                    </p>
                    <p className="mt-2 text-xs text-[var(--quiet)] capitalize">
                      Source: {prospect.source_type}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <form action={changeStageAction}>
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
                      <input
                        type="hidden"
                        name="pipeline_stage"
                        value="qualified"
                      />
                      <button className={primaryButton}>Qualify</button>
                    </form>
                    <form action={setRecordStatusAction}>
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
                      <button
                        className={secondaryButton}
                        name="intent"
                        value="disqualify"
                      >
                        Disqualify
                      </button>
                    </form>
                    <Link
                      className={secondaryButton}
                      href={`${base}/${prospect.id}`}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <GrowthEmpty
            title="No prospects waiting for review."
            description="New manual and CSV prospects will appear here until a human qualifies or disqualifies them."
          />
        )}
      </div>
    </>
  );
}
