import Link from "next/link";
import { requireCapability } from "@vilet/auth";
import { PageHeader, StatCard } from "../../../../components/page-frame";
import {
  GrowthEmpty,
  GrowthNav,
  primaryButton,
  secondaryButton,
} from "../../../../components/growth-nav";
import { getGrowthOverview } from "../../../../lib/growth-data";
function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value / 100);
}
export default async function GrowthPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireCapability(organizationSlug, "growth.access");
  const overview = await getGrowthOverview(context);
  const base = `/o/${organizationSlug}/growth`;
  return (
    <>
      <GrowthNav slug={organizationSlug} current="overview" />
      <PageHeader
        eyebrow="Vilét Growth"
        title="Growth operations."
        description="A focused workspace for reviewing businesses, managing next actions, and moving real opportunities forward."
        status="internal"
      />
      {overview.active === 0 ? (
        <div className="mt-10">
          <GrowthEmpty
            title="Growth is ready."
            description="Add your first prospect or import a list to begin building Vilét’s pipeline."
            actions={
              <>
                <Link
                  className={primaryButton}
                  href={`${base}/prospects#add-prospect`}
                >
                  Add prospect
                </Link>
                <Link
                  className={secondaryButton}
                  href={`${base}/prospects#import-csv`}
                >
                  Import CSV
                </Link>
              </>
            }
          />
        </div>
      ) : (
        <>
          <section
            aria-label="Growth summary"
            className="mt-8 grid grid-cols-2 gap-3 xl:grid-cols-4"
          >
            {[
              ["Active prospects", overview.active],
              ["Awaiting review", overview.review],
              ["Qualified", overview.qualified],
              ["Open pipeline value", money(overview.pipelineValue)],
            ].map(([label, value]) => (
              <StatCard key={label} label={String(label)} value={value} />
            ))}
          </section>
          <div className="mt-6 grid gap-3 xl:grid-cols-2">
            <section className="border-border bg-card/40 rounded-2xl border p-5">
              <div className="flex justify-between">
                <h2 className="font-semibold">Recently added</h2>
                <Link
                  className="text-sm text-[var(--accent-light)]"
                  href={`${base}/prospects`}
                >
                  View all
                </Link>
              </div>
              <ul className="divide-border/50 mt-4 divide-y">
                {overview.recent.map((item) => (
                  <li key={item.id}>
                    <Link
                      className="flex justify-between gap-4 py-3 text-sm"
                      href={`${base}/prospects/${item.id}`}
                    >
                      <span>{String(item.business_name)}</span>
                      <span className="text-[var(--quiet)] capitalize">
                        {String(item.pipeline_stage).replaceAll("_", " ")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section className="border-border bg-card/40 rounded-2xl border p-5">
              <h2 className="font-semibold">Upcoming next actions</h2>
              {overview.upcoming.length ? (
                <ul className="divide-border/50 mt-4 divide-y">
                  {overview.upcoming.map((item) => (
                    <li key={item.id} className="py-3">
                      <Link
                        className="text-sm font-medium"
                        href={`${base}/prospects/${item.id}`}
                      >
                        {String(item.business_name)}
                      </Link>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {String(item.next_action)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-[var(--muted)]">
                  No upcoming actions are scheduled.
                </p>
              )}
            </section>
          </div>
        </>
      )}
    </>
  );
}
