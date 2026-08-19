import crypto from "node:crypto";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import { loadPlatformEnvironment } from "./lib/platform-bootstrap.mjs";

const projectRef = "lzohhfmfdqivnjqqwmqu";
const environment = loadPlatformEnvironment(process.cwd(), ".env.local");
const url = environment.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = environment.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !publishableKey || !serviceRoleKey) {
  throw new Error("Staging Supabase environment is incomplete.");
}
if (new URL(url).hostname !== `${projectRef}.supabase.co`) {
  throw new Error("Refusing to run outside the approved staging project.");
}

const options = { auth: { autoRefreshToken: false, persistSession: false } };
const admin = createClient(url, serviceRoleKey, options);
const ownerClient = createClient(url, publishableKey, options);
const partnerAClient = createClient(url, publishableKey, options);
const partnerBClient = createClient(url, publishableKey, options);
const suffix = crypto.randomUUID();
const password = `${crypto.randomBytes(24).toString("base64url")}A1!`;
const fixture = { organizationId: null, userIds: [] };

function assert(condition, name) {
  if (!condition) throw new Error(`${name}: FAIL`);
  console.log(`${name}: PASS`);
}

function denied(result) {
  return Boolean(result.error) || !result.data || result.data.length === 0;
}

async function createUser(label) {
  const { data, error } = await admin.auth.admin.createUser({
    email: `partner-rls-${label}-${suffix}@example.invalid`,
    password,
    email_confirm: true,
    user_metadata: { environment: "staging", purpose: "partner-rls-test" },
  });
  if (error) throw error;
  fixture.userIds.push(data.user.id);
  return data.user;
}

async function signIn(client, user) {
  const result = await client.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (result.error) throw result.error;
}

try {
  const [owner, partnerA, partnerB] = await Promise.all([
    createUser("owner"),
    createUser("a"),
    createUser("b"),
  ]);
  const { data: organization, error: organizationError } = await admin
    .from("organizations")
    .insert({
      slug: `partner-rls-${suffix}`,
      name: "Partner RLS Staging Fixture",
      kind: "internal",
    })
    .select("id")
    .single();
  if (organizationError) throw organizationError;
  fixture.organizationId = organization.id;

  const { error: membershipError } = await admin
    .from("organization_memberships")
    .insert([
      {
        organization_id: organization.id,
        user_id: owner.id,
        role: "owner",
        status: "active",
        joined_at: new Date().toISOString(),
      },
      {
        organization_id: organization.id,
        user_id: partnerA.id,
        role: "member",
        status: "active",
        joined_at: new Date().toISOString(),
      },
      {
        organization_id: organization.id,
        user_id: partnerB.id,
        role: "member",
        status: "active",
        joined_at: new Date().toISOString(),
      },
    ]);
  if (membershipError) throw membershipError;
  const { error: entitlementError } = await admin
    .from("organization_entitlements")
    .insert(
      ["partner.access", "sales.enablement"].map((capabilityKey) => ({
        organization_id: organization.id,
        capability_key: capabilityKey,
        source_type: "internal",
        source_reference: `partner-rls-${suffix}`,
      })),
    );
  if (entitlementError) throw entitlementError;

  await Promise.all([
    signIn(ownerClient, owner),
    signIn(partnerAClient, partnerA),
    signIn(partnerBClient, partnerB),
  ]);

  const { data: partnerRows, error: partnerError } = await ownerClient
    .from("sales_partners")
    .insert([
      {
        organization_id: organization.id,
        user_id: partnerA.id,
        status: "active",
        activated_at: new Date().toISOString(),
        created_by_user_id: owner.id,
      },
      {
        organization_id: organization.id,
        user_id: partnerB.id,
        status: "active",
        activated_at: new Date().toISOString(),
        created_by_user_id: owner.id,
      },
    ])
    .select("id,user_id");
  if (partnerError) throw partnerError;
  const partnerARow = partnerRows.find((row) => row.user_id === partnerA.id);
  const partnerBRow = partnerRows.find((row) => row.user_id === partnerB.id);
  assert(partnerRows.length === 2, "Owner provisions partner records");

  const ownTraining = await partnerAClient
    .from("sales_training_progress")
    .insert({
      organization_id: organization.id,
      partner_id: partnerARow.id,
      module_key: "01",
      lesson_key: "positioning",
      completed_at: new Date().toISOString(),
      knowledge_check_score: 100,
    })
    .select("id");
  if (ownTraining.error) throw ownTraining.error;
  assert(
    ownTraining.data?.length === 1,
    "Partner records own training progress",
  );
  const crossTraining = await partnerAClient
    .from("sales_training_progress")
    .insert({
      organization_id: organization.id,
      partner_id: partnerBRow.id,
      module_key: "01",
      lesson_key: "unauthorized",
    })
    .select("id");
  assert(
    denied(crossTraining),
    "Partner cannot mutate another partner training record",
  );

  const domain = `partner-${suffix}.example`;
  const leadA = await partnerAClient.rpc("submit_partner_lead", {
    target_organization_id: organization.id,
    submitted_business_name: "Partner Fixture Company",
    submitted_website_url: `https://${domain}`,
    submitted_industry: "Professional services",
    submitted_city: "Raleigh",
    submitted_region: "NC",
    submitted_relationship_context:
      "Partner A has a legitimate direct business relationship.",
    submission_key: crypto.randomUUID(),
  });
  if (leadA.error) throw leadA.error;
  assert(
    leadA.data.status === "pending_review" && leadA.data.prospect_created,
    "New partner lead is queued for review",
  );

  const leadB = await partnerBClient.rpc("submit_partner_lead", {
    target_organization_id: organization.id,
    submitted_business_name: "Partner Fixture Company",
    submitted_website_url: `https://${domain}`,
    submitted_industry: "Professional services",
    submitted_city: "Raleigh",
    submitted_region: "NC",
    submitted_relationship_context:
      "Partner B reports a separate relationship requiring review.",
    submission_key: crypto.randomUUID(),
  });
  if (leadB.error) throw leadB.error;
  assert(
    leadB.data.status === "conflict" && !leadB.data.prospect_created,
    "Duplicate lead creates an attribution conflict",
  );

  const [ownLeads, otherLeads, growthAccess] = await Promise.all([
    partnerAClient.rpc("list_partner_own_leads", {
      target_organization_id: organization.id,
    }),
    partnerBClient.rpc("list_partner_own_leads", {
      target_organization_id: organization.id,
    }),
    partnerAClient
      .from("growth_prospects")
      .select("id")
      .eq("organization_id", organization.id),
  ]);
  assert(
    ownLeads.data?.length === 1 &&
      ownLeads.data[0].attribution_id === leadA.data.attribution_id,
    "Partner A sees only Partner A attribution",
  );
  assert(
    otherLeads.data?.length === 1 &&
      otherLeads.data[0].attribution_id === leadB.data.attribution_id,
    "Partner B sees only Partner B attribution",
  );
  assert(
    growthAccess.data?.length === 0,
    "Partner cannot access internal Growth prospect data",
  );

  const accepted = await ownerClient
    .from("partner_lead_attributions")
    .update({
      status: "accepted",
      reviewed_by_user_id: owner.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", leadA.data.attribution_id)
    .select("id,status");
  if (accepted.error) throw accepted.error;
  assert(
    accepted.data?.[0]?.status === "accepted",
    "Owner reviews and accepts attribution",
  );

  const { data: rule, error: ruleError } = await ownerClient
    .from("commission_rules")
    .insert({
      organization_id: organization.id,
      name: "Staging fixture",
      version: 1,
      rule_type: "percentage",
      configuration: { basis_points: 1000 },
      effective_from: new Date().toISOString(),
      approved_by_user_id: owner.id,
    })
    .select("id")
    .single();
  if (ruleError) throw ruleError;
  const unauthorizedRule = await partnerAClient
    .from("commission_rules")
    .insert({
      organization_id: organization.id,
      name: "Unauthorized",
      version: 1,
      rule_type: "fixed",
      configuration: {},
      effective_from: new Date().toISOString(),
      approved_by_user_id: partnerA.id,
    })
    .select("id");
  assert(denied(unauthorizedRule), "Partner cannot create commission rules");

  const { data: ledger, error: ledgerError } = await ownerClient
    .from("commission_ledger")
    .insert({
      organization_id: organization.id,
      partner_id: partnerARow.id,
      attribution_id: leadA.data.attribution_id,
      commission_rule_id: rule.id,
      prospect_id: leadA.data.prospect_id,
      status: "pending",
      basis_minor: 100000,
      amount_minor: 10000,
      currency: "USD",
      rule_snapshot: { basis_points: 1000 },
      event_key: `fixture-${suffix}`,
      created_by_user_id: owner.id,
    })
    .select("id")
    .single();
  if (ledgerError) throw ledgerError;
  const [ledgerA, ledgerB] = await Promise.all([
    partnerAClient
      .from("commission_ledger")
      .select("id,status")
      .eq("id", ledger.id),
    partnerBClient
      .from("commission_ledger")
      .select("id,status")
      .eq("id", ledger.id),
  ]);
  assert(ledgerA.data?.length === 1, "Partner sees own commission ledger");
  assert(
    ledgerB.data?.length === 0,
    "Partner cannot see another partner commission ledger",
  );
  const unauthorizedLedger = await partnerAClient
    .from("commission_ledger")
    .update({ status: "paid" })
    .eq("id", ledger.id)
    .select("id");
  assert(denied(unauthorizedLedger), "Partner cannot mutate commission state");
  for (const status of ["earned", "paid", "reversed", "disputed"]) {
    const update = await ownerClient
      .from("commission_ledger")
      .update({ status })
      .eq("id", ledger.id)
      .select("status");
    assert(
      update.data?.[0]?.status === status,
      `Owner can record ${status} commission state`,
    );
  }

  await ownerClient
    .from("sales_partners")
    .update({ status: "paused", paused_at: new Date().toISOString() })
    .eq("id", partnerARow.id);
  const paused = await partnerAClient.rpc("list_partner_own_leads", {
    target_organization_id: organization.id,
  });
  assert(
    paused.data?.length === 0,
    "Paused partner loses active Partner Hub data access",
  );

  console.log("Sales Partner staging RLS verification: PASS");
} finally {
  if (fixture.organizationId) {
    for (const table of [
      "commission_payouts",
      "commission_ledger",
      "commission_rules",
      "partner_lead_attributions",
      "sales_training_progress",
      "sales_partners",
      "growth_prospects",
      "organization_entitlements",
      "organization_memberships",
      "audit_events",
    ]) {
      await admin
        .from(table)
        .delete()
        .eq("organization_id", fixture.organizationId);
    }
    await admin.from("organizations").delete().eq("id", fixture.organizationId);
  }
  for (const userId of fixture.userIds)
    await admin.auth.admin.deleteUser(userId);
}
