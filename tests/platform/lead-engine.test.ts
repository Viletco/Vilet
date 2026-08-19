import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildOutreachDraft,
  buildResearch,
  leadIdempotencyKey,
  scoreLead,
  validateDiscoveryInput,
} from "../../apps/platform/lib/lead-engine-domain.ts";

test("discovery limits are enforced server-side", () => {
  assert.equal(
    validateDiscoveryInput({
      industry: "Dentist",
      location: "Tampa",
      limit: 25,
    })?.limit,
    25,
  );
  assert.equal(
    validateDiscoveryInput({
      industry: "Dentist",
      location: "Tampa",
      limit: 26,
    }),
    null,
  );
  assert.equal(
    validateDiscoveryInput({ industry: "", location: "Tampa", limit: 10 }),
    null,
  );
});
test("research separates evidence from inference and recommendation", () => {
  const result = buildResearch({
    website: null,
    phone: null,
    industry: "Dental",
    city: "Tampa",
    contactEmail: null,
    contactVerified: false,
  });
  assert.ok(Array.isArray(result.evidence));
  assert.match(result.inference, /No public website/u);
  assert.notEqual(result.inference, result.recommendation);
});
test("scoring is deterministic, bounded, explained, and versioned", () => {
  const input = {
    website: null,
    phone: "5555555555",
    industry: "Dental",
    city: "Tampa",
    contactEmail: "owner@example.com",
    contactVerified: true,
  };
  const a = scoreLead(input);
  const b = scoreLead(input);
  assert.deepEqual(a, b);
  for (const key of [
    "fit",
    "need",
    "potential_value",
    "reachability",
    "confidence",
    "priority_score",
  ] as const)
    assert.ok(a[key] >= 0 && a[key] <= 100);
  assert.equal(a.scoring_version, "vilet-fit-v1");
  assert.match(a.explanation, /Weighted deterministically/u);
});
test("draft references evidence and idempotency is stable", () => {
  const research = buildResearch({
    website: "https://example.com",
    phone: null,
    industry: "Dental",
    city: "Tampa",
    contactEmail: "owner@example.com",
    contactVerified: true,
  });
  const draft = buildOutreachDraft("Example Dental", "Alex Smith", research);
  assert.deepEqual(
    draft.evidenceReferences,
    research.evidence.map((x) => x.key),
  );
  assert.equal(
    leadIdempotencyKey("o", "p", "c"),
    leadIdempotencyKey("o", "p", "c"),
  );
  assert.notEqual(
    leadIdempotencyKey("o", "p", "c"),
    leadIdempotencyKey("o", "p2", "c"),
  );
});

test("lead engine migration applies RLS and durable send controls", () => {
  const sql = readFileSync(
    "supabase/migrations/202608190005_growth_lead_engine_mvp.sql",
    "utf8",
  );
  for (const table of [
    "growth_discovery_runs",
    "growth_research",
    "growth_scores",
    "growth_contacts",
    "growth_suppressions",
    "growth_outreach_messages",
  ])
    assert.match(
      sql,
      new RegExp(
        `alter table public\\.${table} enable row level security`,
        "u",
      ),
    );
  assert.match(sql, /unique\(organization_id,idempotency_key\)/u);
  assert.match(sql, /growth\.outreach/u);
  assert.match(sql, /growth_record_lead_engine_activity/u);
  assert.match(sql, /growth_validate_lead_engine_tenant/u);
  assert.match(sql, /growth_cross_tenant_contact_denied/u);
});

test("send path requires approval, suppression, role, and provider idempotency", () => {
  const source = readFileSync(
    "apps/platform/app/o/[organizationSlug]/growth/lead-engine-actions.ts",
    "utf8",
  );
  const provider = readFileSync(
    "apps/platform/lib/growth-providers.ts",
    "utf8",
  );
  assert.match(source, /eq\("status",\s*"approved"\)/u);
  assert.match(source, /\["owner",\s*"admin"\]/u);
  assert.match(source, /growth_suppressions/u);
  assert.match(provider, /Idempotency-Key/u);
  assert.doesNotMatch(provider, /NEXT_PUBLIC_APOLLO|NEXT_PUBLIC.*RESEND/u);
  assert.match(provider, /GROWTH_DISCOVERY_PROVIDER/u);
  assert.match(provider, /HUNTER_API_KEY/u);
  assert.match(provider, /https:\/\/api\.hunter\.io\/v2\/discover/u);
  assert.match(provider, /https:\/\/api\.hunter\.io\/v2\/domain-search/u);
  assert.match(provider, /"X-API-KEY"/u);
  assert.doesNotMatch(provider, /NEXT_PUBLIC_HUNTER/u);
});
