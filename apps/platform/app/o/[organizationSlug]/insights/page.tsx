import { requireCapability } from "@vilet/auth";
import { hasCapability, hasOrganizationRole } from "@vilet/authorization";
import { PageHeader, StatCard } from "../../../../components/page-frame";
import {
  getInsightsWorkspace,
  summarizeInsights,
} from "../../../../lib/insights-data";
import { connectGoogleAnalytics, synchronizeInsights } from "./actions";
import { ConnectAnalyticsForm, SyncAnalyticsForm } from "./insights-controls";

const formatter = new Intl.NumberFormat("en-US");
const percentage = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

function Trend({ values }: { values: readonly number[] }) {
  const max = Math.max(...values, 1);
  const points = values
    .map(
      (value, index) =>
        `${(index / Math.max(1, values.length - 1)) * 600},${150 - (value / max) * 125}`,
    )
    .join(" ");
  return (
    <svg
      viewBox="0 0 600 165"
      role="img"
      aria-label="Daily traffic trend"
      className="mt-6 h-44 w-full"
    >
      <path
        d="M0 150H600M0 100H600M0 50H600"
        className="text-border"
        stroke="currentColor"
        fill="none"
      />
      <polyline
        points={points || "0,150 600,150"}
        className="text-primary"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireCapability(organizationSlug, "insights.access");
  const workspace = await getInsightsWorkspace(context);
  const canManage =
    hasCapability(context, "insights.analytics") &&
    hasOrganizationRole(context, ["owner", "admin"]);
  const totals = summarizeInsights(workspace.metrics);
  const daily = workspace.metrics.filter((item) => item.scope === "overview");
  const pages = workspace.metrics
    .filter((item) => item.scope === "page")
    .sort((a, b) => b.page_views - a.page_views)
    .slice(0, 8);
  const channels = workspace.metrics
    .filter((item) => item.scope === "channel")
    .reduce(
      (map, item) =>
        map.set(
          item.dimension_label ?? item.dimension_key,
          (map.get(item.dimension_label ?? item.dimension_key) ?? 0) +
            Number(item.sessions),
        ),
      new Map<string, number>(),
    );
  const channelRows = [...channels.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  return (
    <>
      <PageHeader
        eyebrow="Vilét Insights"
        title="Your website, resolved."
        description="A private, organization-scoped view of approved performance signals from vilet.co."
        status="beta"
        actions={
          workspace.source && canManage ? (
            <SyncAnalyticsForm
              sourceId={workspace.source.id}
              action={synchronizeInsights.bind(null, organizationSlug)}
            />
          ) : undefined
        }
      />
      {!workspace.source ? (
        <section className="command-surface mt-10 p-6 sm:p-8">
          <p className="vilet-coordinate text-primary">Source configuration</p>
          <h2 className="mt-3 text-xl font-semibold">
            Connect Google Analytics 4
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
            Insights reads aggregate reporting data through Google’s server API.
            The service-account credential remains in Vercel and is never stored
            in Supabase or sent to the browser.
          </p>
          {canManage ? (
            <ConnectAnalyticsForm
              action={connectGoogleAnalytics.bind(null, organizationSlug)}
            />
          ) : (
            <p className="text-muted-foreground mt-6 text-sm">
              An organization owner or administrator with analytics access must
              connect this source.
            </p>
          )}
        </section>
      ) : (
        <>
          <section className="border-border bg-border mt-8 grid gap-px overflow-hidden border sm:grid-cols-3 xl:grid-cols-6">
            <StatCard
              label="Active users"
              value={formatter.format(totals.activeUsers)}
              detail="Last 30 complete days"
            />
            <StatCard
              label="Sessions"
              value={formatter.format(totals.sessions)}
            />
            <StatCard
              label="Page views"
              value={formatter.format(totals.pageViews)}
            />
            <StatCard
              label="Key events"
              value={formatter.format(totals.keyEvents)}
            />
            <StatCard
              label="Engagement"
              value={percentage.format(totals.engagementRate)}
            />
            <StatCard
              label="Avg. session"
              value={`${Math.round(totals.averageSessionDuration)}s`}
            />
          </section>
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_1fr]">
            <div className="command-surface p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="vilet-coordinate text-primary">
                    Traffic signal
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">Daily sessions</h2>
                </div>
                <span className="text-muted-foreground text-xs">30 days</span>
              </div>
              <Trend values={daily.map((item) => Number(item.sessions))} />
            </div>
            <div className="command-surface p-6">
              <p className="vilet-coordinate text-primary">Acquisition</p>
              <h2 className="mt-2 text-lg font-semibold">
                Sessions by channel
              </h2>
              <div className="mt-6 space-y-4">
                {channelRows.length ? (
                  channelRows.map(([label, value]) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs">
                        <span>{label}</span>
                        <span className="text-muted-foreground">
                          {formatter.format(value)}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 bg-white/5">
                        <div
                          className="bg-primary h-full"
                          style={{
                            width: `${Math.max(3, (value / Math.max(channelRows[0]?.[1] ?? 1, 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No acquisition rows returned yet.
                  </p>
                )}
              </div>
            </div>
          </section>
          <section className="command-surface mt-6 overflow-hidden">
            <div className="border-border border-b p-6">
              <p className="vilet-coordinate text-primary">
                Content performance
              </p>
              <h2 className="mt-2 text-lg font-semibold">Top pages</h2>
            </div>
            <div className="divide-border divide-y">
              {pages.length ? (
                pages.map((page) => (
                  <div
                    key={`${page.metric_date}-${page.dimension_key}`}
                    className="grid grid-cols-[1fr_auto_auto] gap-6 px-6 py-4 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {page.dimension_label || page.dimension_key}
                      </p>
                      <p className="text-muted-foreground mt-1 truncate text-xs">
                        {page.dimension_key}
                      </p>
                    </div>
                    <span>{formatter.format(page.active_users)} users</span>
                    <span>{formatter.format(page.page_views)} views</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground p-6 text-sm">
                  No page rows returned yet. Run the first synchronization after
                  GA4 begins collecting data.
                </p>
              )}
            </div>
          </section>
          <footer className="text-muted-foreground mt-6 flex flex-wrap justify-between gap-3 text-xs">
            <span>
              {workspace.source.display_name} · GA4 property{" "}
              {workspace.source.external_property_id}
            </span>
            <span>
              {workspace.source.last_synced_at
                ? `Last synchronized ${new Date(workspace.source.last_synced_at).toLocaleString("en-US")}`
                : "Not synchronized yet"}
            </span>
          </footer>
        </>
      )}
    </>
  );
}
