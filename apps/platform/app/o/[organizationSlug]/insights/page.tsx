import { requireCapability } from "@vilet/auth";
import { PageHeader } from "../../../../components/page-frame";
export default async function InsightsPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireCapability(organizationSlug, "insights.access");
  return (
    <>
      <PageHeader
        eyebrow="Vilét Insights"
        title="Connected performance intelligence."
        description="A prepared workspace for organization-approved data sources. No analytics or business data is connected yet."
        status="beta"
      />
      <section className="command-surface mt-10 overflow-hidden p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="vilet-coordinate text-primary">Signal plane</p>
            <h2 className="mt-3 text-xl font-semibold">
              No data sources connected
            </h2>
          </div>
          <span className="vilet-coordinate text-muted-foreground">
            Awaiting approved input
          </span>
        </div>
        <svg
          viewBox="0 0 900 220"
          aria-hidden="true"
          className="mt-8 h-52 w-full"
        >
          <g stroke="currentColor" className="text-border">
            <path d="M0 40H900M0 90H900M0 140H900M0 190H900" />
            <path d="M100 0V220M300 0V220M500 0V220M700 0V220" />
          </g>
          <path
            d="M0 180 C150 170 170 110 310 130 S520 150 630 82 S790 100 900 45"
            fill="none"
            stroke="currentColor"
            className="text-primary/25"
            strokeWidth="2"
            strokeDasharray="7 10"
          />
        </svg>
        <div className="border-border grid border-t sm:grid-cols-3">
          {["Raw data", "Understanding", "Decision"].map((item, index) => (
            <div
              key={item}
              className="border-border py-4 first:pl-0 last:border-0 sm:border-r sm:px-4"
            >
              <span className="vilet-coordinate text-primary">
                0{index + 1}
              </span>
              <p className="mt-2 font-semibold">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
