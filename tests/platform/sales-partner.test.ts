import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  "supabase/migrations/202608190006_sales_partner_foundation.sql",
  "utf8",
);
const triggerCorrection = readFileSync(
  "supabase/migrations/202608190007_fix_partner_tenant_trigger.sql",
  "utf8",
);
const triggerSecurity = readFileSync(
  "supabase/migrations/202608190008_secure_partner_tenant_trigger.sql",
  "utf8",
);
const operations = readFileSync(
  "supabase/migrations/202608190009_partner_operations.sql",
  "utf8",
);
const partnerActions = readFileSync(
  "apps/platform/app/o/[organizationSlug]/partner/actions.ts",
  "utf8",
);
const assistant = readFileSync("apps/platform/lib/sales-assistant.ts", "utf8");
const knowledge = readFileSync(
  "apps/platform/lib/partner-knowledge.ts",
  "utf8",
);
const auth = readFileSync("packages/authorization/src/index.ts", "utf8");
const partnerAuth = readFileSync("apps/platform/lib/partner-auth.ts", "utf8");

test("partner access uses a small capability surface", () => {
  assert.match(auth, /"partner\.access"/u);
  assert.match(auth, /"sales\.enablement"/u);
  assert.doesNotMatch(auth, /partner\.commissions\.mutate/u);
  assert.match(
    partnerAuth,
    /requireCapability\(organizationSlug, "partner\.access"\)/u,
  );
  assert.match(
    partnerAuth,
    /\.in\("status", \["onboarding", "training", "active"\]\)/u,
  );
});

test("all partner tables are tenant scoped and RLS protected", () => {
  for (const table of [
    "sales_partners",
    "sales_training_progress",
    "partner_lead_attributions",
    "commission_rules",
    "commission_ledger",
    "commission_payouts",
  ]) {
    assert.match(
      migration,
      new RegExp(
        `create table public\\.${table} \\([\\s\\S]*?organization_id uuid not null`,
      ),
    );
    assert.ok(
      migration.includes(
        `alter table public.${table} enable row level security;`,
      ),
    );
  }
  assert.match(migration, /validate_partner_tenant/u);
  assert.match(triggerCorrection, /elsif tg_table_name='commission_ledger'/u);
  assert.match(triggerSecurity, /security definer/u);
  assert.match(
    triggerSecurity,
    /revoke all on function private\.validate_partner_tenant\(\) from public, anon, authenticated/u,
  );
});

test("partners see only their records and cannot mutate finance policy", () => {
  assert.match(
    migration,
    /partner_id=private\.current_sales_partner\(organization_id\)/u,
  );
  assert.match(migration, /commission_ledger_select_own_or_manager/u);
  assert.match(
    migration,
    /commission_ledger_manage[\s\S]*current_user_is_sales_manager/u,
  );
  assert.match(
    migration,
    /commission_rules_manage[\s\S]*current_user_is_sales_manager/u,
  );
  assert.doesNotMatch(migration, /commission_ledger.*insert_own/u);
});

test("lead attribution is conflict-reviewed and uses the Growth prospect", () => {
  assert.match(
    migration,
    /prospect_id uuid not null references public\.growth_prospects/u,
  );
  assert.match(
    migration,
    /pending_review','accepted','rejected','conflict','superseded/u,
  );
  assert.match(
    migration,
    /status='pending_review' and reviewed_by_user_id is null/u,
  );
  assert.match(migration, /partner_own_leads with \(security_invoker=true\)/u);
  assert.match(migration, /submit_partner_lead\(/u);
  assert.match(migration, /list_partner_own_leads\(/u);
  assert.match(migration, /partner_access_denied/u);
  assert.match(migration, /attribution_state := 'conflict'/u);
  assert.match(
    migration,
    /source_type,pipeline_stage[\s\S]*'referral','review'/u,
  );
});

test("commissions are durable, versioned, and use minor units", () => {
  assert.match(migration, /version integer not null check \(version > 0\)/u);
  assert.match(migration, /basis_minor bigint/u);
  assert.match(migration, /amount_minor bigint/u);
  assert.match(migration, /rule_snapshot jsonb not null/u);
  assert.match(migration, /event_key text not null/u);
});

test("canonical content marks product status and unknown policy", () => {
  for (const status of ["available", "internal", "beta", "future"])
    assert.ok(knowledge.includes(`availability: "${status}"`));
  assert.match(knowledge, /No commission percentage/u);
  assert.match(knowledge, /forbiddenClaims/u);
  assert.match(knowledge, /FACT\/EVIDENCE/u);
});

test("partner operations add invitation, assessment, and notification boundaries", () => {
  for (const table of [
    "sales_partner_invitations",
    "sales_assessment_attempts",
    "partner_notifications",
  ]) {
    assert.match(operations, new RegExp(`create table public\\.${table}`));
    assert.match(
      operations,
      new RegExp(`alter table public\\.${table} enable row level security`),
    );
  }
  assert.match(operations, /token_hash bytea not null/u);
  assert.match(operations, /intended_role not in \('owner','admin'\)/u);
  assert.match(operations, /assessment_insert_own/u);
  assert.match(operations, /notification_mark_read_own/u);
});

test("partner workflows remain server-authorized and provider-neutral", () => {
  assert.match(partnerActions, /requireSalesPartner/u);
  assert.match(partnerActions, /submit_partner_lead/u);
  assert.match(partnerActions, /sales_training_progress/u);
  assert.match(assistant, /interface SalesAssistantProvider/u);
  assert.match(assistant, /deterministic-staging/u);
  assert.match(assistant, /This requires Vilét owner approval/u);
  assert.doesNotMatch(assistant, /OPENAI|ANTHROPIC|HUNTER_API_KEY/u);
});
