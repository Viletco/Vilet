import "server-only";

import { createPlatformServerClient } from "@vilet/auth";
import type { OrganizationContext } from "@vilet/authorization";
import type {
  InsightsMetricSnapshot,
  InsightsSource,
  InsightsSyncRun,
} from "./insights-domain";

async function client() {
  const value = await createPlatformServerClient();
  if (!value) throw new Error("Insights database unavailable.");
  return value;
}

export async function getInsightsWorkspace(context: OrganizationContext) {
  const db = await client();
  const [{ data: source }, { data: metrics }, { data: runs }] =
    await Promise.all([
      db
        .from("insights_sources")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("provider", "google_analytics")
        .order("created_at", { ascending: false })
        .limit(1)
        .returns<InsightsSource[]>()
        .maybeSingle(),
      db
        .from("insights_metric_snapshots")
        .select(
          "metric_date,scope,dimension_key,dimension_label,active_users,sessions,page_views,key_events,engagement_rate,average_session_duration",
        )
        .eq("organization_id", context.organizationId)
        .gte(
          "metric_date",
          new Date(Date.now() - 31 * 86400000).toISOString().slice(0, 10),
        )
        .order("metric_date", { ascending: true })
        .returns<InsightsMetricSnapshot[]>(),
      db
        .from("insights_sync_runs")
        .select(
          "id,status,rows_written,safe_failure_code,started_at,completed_at",
        )
        .eq("organization_id", context.organizationId)
        .order("started_at", { ascending: false })
        .limit(5)
        .returns<InsightsSyncRun[]>(),
    ]);
  return { source: source ?? null, metrics: metrics ?? [], runs: runs ?? [] };
}

export function summarizeInsights(metrics: readonly InsightsMetricSnapshot[]) {
  const overview = metrics.filter((metric) => metric.scope === "overview");
  const totals = overview.reduce(
    (sum, item) => ({
      activeUsers: sum.activeUsers + Number(item.active_users),
      sessions: sum.sessions + Number(item.sessions),
      pageViews: sum.pageViews + Number(item.page_views),
      keyEvents: sum.keyEvents + Number(item.key_events),
      duration:
        sum.duration +
        Number(item.average_session_duration) * Number(item.sessions),
      engaged:
        sum.engaged + Number(item.engagement_rate) * Number(item.sessions),
    }),
    {
      activeUsers: 0,
      sessions: 0,
      pageViews: 0,
      keyEvents: 0,
      duration: 0,
      engaged: 0,
    },
  );
  return {
    ...totals,
    engagementRate: totals.sessions ? totals.engaged / totals.sessions : 0,
    averageSessionDuration: totals.sessions
      ? totals.duration / totals.sessions
      : 0,
  };
}
