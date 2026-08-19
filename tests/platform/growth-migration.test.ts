import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const migration = readFileSync(
  "supabase/migrations/202608190002_growth_e1_foundation.sql",
  "utf8",
);

test("Growth E1 migration is transactional and creates the bounded tenant schema", () => {
  assert.match(migration, /^begin;/u);
  assert.match(migration, /commit;\s*$/u);
  for (const table of [
    "growth_prospects",
    "growth_sources",
    "growth_prospect_notes",
    "growth_activities",
    "growth_import_batches",
  ])
    assert.match(migration, new RegExp(`create table public\\.${table}`, "u"));
  assert.match(migration, /row_count between 0 and 500/u);
});

test("every Growth table enables RLS and policies derive access from capabilities", () => {
  for (const table of [
    "growth_import_batches",
    "growth_prospects",
    "growth_sources",
    "growth_prospect_notes",
    "growth_activities",
  ])
    assert.match(
      migration,
      new RegExp(
        `alter table public\\.${table} enable row level security`,
        "u",
      ),
    );
  for (const capability of ["growth.access", "growth.prospecting"])
    assert.ok(migration.includes(`'${capability}'`));
  assert.match(migration, /private\.current_user_is_active_member/u);
});

test("Growth E1 protects strong duplicates, assignment, import retries, and activity atomically", () => {
  assert.match(migration, /growth_prospects_active_domain_uidx/u);
  assert.match(migration, /growth_pipeline_access_denied/u);
  assert.match(migration, /invalid_growth_duplicate_target/u);
  assert.match(migration, /unique \(organization_id, idempotency_key\)/u);
  assert.match(migration, /invalid_growth_assignee/u);
  assert.match(migration, /growth_record_prospect_activity/u);
  assert.match(migration, /commit_growth_csv_import/u);
  assert.match(migration, /exception when unique_violation/u);
});

test("Growth activity is separate from security audit and excludes raw records", () => {
  assert.doesNotMatch(
    migration,
    /insert into public\.audit_events[\s\S]*prospect/u,
  );
  assert.match(
    migration,
    /jsonb_build_object\('from_stage', old\.pipeline_stage, 'to_stage', new\.pipeline_stage\)/u,
  );
});

test("CSV import definer is capability-gated and not publicly executable", () => {
  assert.match(
    migration,
    /returns jsonb language plpgsql security definer set search_path = pg_catalog, public/u,
  );
  assert.match(
    migration,
    /if not private\.current_user_has_capability\(target_organization_id, 'growth\.prospecting'\)/u,
  );
  assert.match(
    migration,
    /revoke all on function public\.commit_growth_csv_import\(uuid, uuid, text, jsonb\) from public/u,
  );
  assert.match(
    migration,
    /grant execute on function public\.commit_growth_csv_import\(uuid, uuid, text, jsonb\) to authenticated/u,
  );
});
