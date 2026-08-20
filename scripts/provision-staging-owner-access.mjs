import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import { loadPlatformEnvironment } from "./lib/platform-bootstrap.mjs";

const approvedProjectRef = "lzohhfmfdqivnjqqwmqu";
const email = process.argv
  .find((argument) => argument.startsWith("--user-email="))
  ?.slice("--user-email=".length)
  .toLowerCase();
const apply = process.argv.includes("--apply");

if (!email) throw new Error("--user-email is required.");

const environment = loadPlatformEnvironment(process.cwd(), ".env.local");
const url = environment.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = environment.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey)
  throw new Error("The staging Supabase environment is incomplete.");
if (new URL(url).hostname !== `${approvedProjectRef}.supabase.co`)
  throw new Error("Refusing to provision access outside staging.");

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: users, error: usersError } = await admin.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});
if (usersError) throw usersError;
const matches = users.users.filter(
  (user) => user.email?.toLowerCase() === email,
);
if (matches.length !== 1)
  throw new Error("The email must resolve to exactly one staging auth user.");
const user = matches[0];

const { data: organization, error: organizationError } = await admin
  .from("organizations")
  .select("id,slug,kind")
  .eq("slug", "vilet")
  .eq("kind", "internal")
  .single();
if (organizationError) throw organizationError;

const [{ data: membership, error: membershipError }, capabilitiesResult] =
  await Promise.all([
    admin
      .from("organization_memberships")
      .select("role,status")
      .eq("organization_id", organization.id)
      .eq("user_id", user.id)
      .single(),
    admin.from("capabilities").select("key").eq("status", "active"),
  ]);
if (membershipError) throw membershipError;
if (membership.role !== "owner" || membership.status !== "active")
  throw new Error("The target must be the active Vilét organization owner.");
if (capabilitiesResult.error) throw capabilitiesResult.error;

const capabilityKeys = capabilitiesResult.data.map(({ key }) => key);
const { data: currentEntitlements, error: entitlementError } = await admin
  .from("organization_entitlements")
  .select("capability_key")
  .eq("organization_id", organization.id)
  .is("revoked_at", null)
  .is("ends_at", null);
if (entitlementError) throw entitlementError;
const currentKeys = new Set(
  currentEntitlements.map(({ capability_key }) => capability_key),
);
const missingKeys = capabilityKeys.filter((key) => !currentKeys.has(key));

const { data: partner, error: partnerReadError } = await admin
  .from("sales_partners")
  .select("id,status")
  .eq("organization_id", organization.id)
  .eq("user_id", user.id)
  .maybeSingle();
if (partnerReadError) throw partnerReadError;

if (!apply) {
  console.log("Vilét staging owner access dry run: PASS");
  console.log(
    JSON.stringify(
      {
        missingCapabilities: missingKeys,
        partnerStatus: partner?.status ?? "missing",
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

if (missingKeys.length) {
  const { error } = await admin.from("organization_entitlements").insert(
    missingKeys.map((capabilityKey) => ({
      organization_id: organization.id,
      capability_key: capabilityKey,
      source_type: "internal",
      source_reference: "staging-owner-full-access",
      granted_by_user_id: user.id,
      metadata: { environment: "staging", mechanism: "controlled_cli" },
    })),
  );
  if (error) throw error;
}

const now = new Date().toISOString();
const { error: partnerError } = await admin.from("sales_partners").upsert(
  {
    organization_id: organization.id,
    user_id: user.id,
    status: "active",
    activated_at: partner?.status === "active" ? undefined : now,
    paused_at: null,
    terminated_at: null,
    created_by_user_id: user.id,
  },
  { onConflict: "organization_id,user_id" },
);
if (partnerError) throw partnerError;

const { error: auditError } = await admin.from("audit_events").insert({
  organization_id: organization.id,
  actor_user_id: user.id,
  action: "organization.owner_full_access.provisioned",
  target_type: "organization_membership",
  target_id: user.id,
  metadata: {
    environment: "staging",
    capabilities_granted: missingKeys,
    partner_access_activated: partner?.status !== "active",
  },
});
if (auditError) throw auditError;

console.log("Vilét staging owner full access: PASS");
console.log(`Active capabilities: ${capabilityKeys.length}`);
console.log("Active Sales Partner record: PASS");
