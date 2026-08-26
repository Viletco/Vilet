import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migration = new URL(
  "../../supabase/migrations/202608260010_insights_foundation.sql",
  import.meta.url,
);
const page = new URL(
  "../../apps/platform/app/o/[organizationSlug]/insights/page.tsx",
  import.meta.url,
);
const provider = new URL(
  "../../apps/platform/lib/google-analytics.ts",
  import.meta.url,
);
const analytics = new URL(
  "../../src/components/analytics-consent.tsx",
  import.meta.url,
);

test("Insights schema is tenant isolated and protected with RLS", async () => {
  const sql = await readFile(migration, "utf8");
  for (const table of [
    "insights_sources",
    "insights_sync_runs",
    "insights_metric_snapshots",
  ]) {
    assert.match(
      sql,
      new RegExp(`alter table public\\.${table} enable row level security`),
    );
  }
  assert.match(sql, /insights_validate_tenant/);
  assert.match(sql, /insights_cross_tenant_source_denied/);
  assert.match(sql, /insights\.analytics/);
});

test("Insights provider keeps credentials server-only and property allowlisted", async () => {
  const source = await readFile(provider, "utf8");
  assert.match(source, /import "server-only"/);
  assert.match(source, /GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON/);
  assert.match(source, /GOOGLE_ANALYTICS_PROPERTY_ID/);
  assert.doesNotMatch(source, /NEXT_PUBLIC_GOOGLE/);
  assert.match(source, /analytics\.readonly/);
});

test("Insights UI uses real aggregate rows without demonstration metrics", async () => {
  const source = await readFile(page, "utf8");
  assert.match(source, /getInsightsWorkspace/);
  assert.match(source, /No page rows returned yet/);
  assert.doesNotMatch(source, /12,480|48,920|demonstration/i);
});

test("Marketing analytics is consent gated and disables ad personalization", async () => {
  const source = await readFile(analytics, "utf8");
  assert.match(source, /Allow analytics/);
  assert.match(source, /allow_ad_personalization_signals: false/);
  assert.match(source, /localStorage/);
});
