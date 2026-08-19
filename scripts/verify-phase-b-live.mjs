import crypto from "node:crypto";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import {
  internalCapabilityKeys,
  loadPlatformEnvironment,
  parseBootstrapArguments,
  validateBootstrapTarget,
} from "./lib/platform-bootstrap.mjs";

const options = parseBootstrapArguments(process.argv.slice(2));
const environment = loadPlatformEnvironment();
validateBootstrapTarget(options, environment.NEXT_PUBLIC_SUPABASE_URL);
if (
  !environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  !environment.SUPABASE_SERVICE_ROLE_KEY
)
  throw new Error("Supabase verification environment is incomplete.");

const admin = createClient(
  environment.NEXT_PUBLIC_SUPABASE_URL,
  environment.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
const ordinary = createClient(
  environment.NEXT_PUBLIC_SUPABASE_URL,
  environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

function assert(condition, label) {
  if (!condition) throw new Error(`${label}: FAIL`);
  console.log(`${label}: PASS`);
}

async function resolveTargetUser() {
  if (options.userId) {
    const { data, error } = await admin.auth.admin.getUserById(options.userId);
    if (error || !data.user) throw new Error("Owner identity was not found.");
    return data.user;
  }
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) throw error;
  const matches = data.users.filter(
    (user) => user.email?.toLowerCase() === options.userEmail,
  );
  if (matches.length !== 1)
    throw new Error("Owner identity did not resolve uniquely.");
  return matches[0];
}

const owner = await resolveTargetUser();
const fixtures = { userId: "", organizationIds: [] };

try {
  const { data: organizations, error: organizationError } = await admin
    .from("organizations")
    .select("id, name, slug, kind, status")
    .eq("slug", "vilet");
  if (organizationError) throw organizationError;
  assert(organizations.length === 1, "Vilét organization exists exactly once");
  const organization = organizations[0];
  assert(
    organization.name === "Vilét" &&
      organization.kind === "internal" &&
      organization.status === "active",
    "Vilét organization protected attributes are correct",
  );

  const { data: memberships, error: membershipError } = await admin
    .from("organization_memberships")
    .select("role, status")
    .eq("organization_id", organization.id)
    .eq("user_id", owner.id);
  if (membershipError) throw membershipError;
  assert(
    memberships.length === 1 &&
      memberships[0].role === "owner" &&
      memberships[0].status === "active",
    "Owner membership exists exactly once and is active",
  );

  const { data: administrators, error: administratorError } = await admin
    .from("platform_administrators")
    .select("revoked_at")
    .eq("user_id", owner.id);
  if (administratorError) throw administratorError;
  assert(
    administrators.length === 1 && administrators[0].revoked_at === null,
    "Platform-administrator grant exists independently",
  );

  const { data: entitlements, error: entitlementError } = await admin
    .from("organization_entitlements")
    .select("capability_key, source_type, ends_at, revoked_at")
    .eq("organization_id", organization.id)
    .eq("source_type", "internal")
    .is("revoked_at", null)
    .is("ends_at", null);
  if (entitlementError) throw entitlementError;
  assert(
    entitlements.length === internalCapabilityKeys.length &&
      internalCapabilityKeys.every((key) =>
        entitlements.some((entitlement) => entitlement.capability_key === key),
      ),
    "All canonical internal capabilities are active exactly once",
  );

  const { data: audits, error: auditError } = await admin
    .from("audit_events")
    .select("action, metadata")
    .eq("organization_id", organization.id);
  if (auditError) throw auditError;
  const actionCount = (action) =>
    audits.filter((event) => event.action === action).length;
  assert(
    actionCount("platform.internal_organization.created") === 1 &&
      actionCount("organization.owner_membership.granted") === 1 &&
      actionCount("platform.administrator.granted") === 1 &&
      actionCount("organization.internal_entitlement.granted") ===
        internalCapabilityKeys.length &&
      actionCount("platform.owner_bootstrap.completed") === 1,
    "Bootstrap grants are auditable without duplicate grant events",
  );

  const suffix = crypto.randomUUID();
  const password = `${crypto.randomBytes(24).toString("base64url")}A1!`;
  const { data: temporaryUser, error: userError } =
    await admin.auth.admin.createUser({
      email: `phase-b-ordinary-${suffix}@example.invalid`,
      password,
      email_confirm: true,
      user_metadata: { purpose: "temporary-phase-b-security-test" },
    });
  if (userError) throw userError;
  fixtures.userId = temporaryUser.user.id;
  const { data: customerOrganization, error: customerError } = await admin
    .from("organizations")
    .insert({
      name: "Phase B Customer Fixture",
      slug: `phase-b-customer-${suffix}`,
      kind: "customer",
      status: "active",
    })
    .select("id")
    .single();
  if (customerError) throw customerError;
  fixtures.organizationIds.push(customerOrganization.id);
  const { error: fixtureMembershipError } = await admin
    .from("organization_memberships")
    .insert({
      organization_id: customerOrganization.id,
      user_id: temporaryUser.user.id,
      role: "owner",
      status: "active",
      joined_at: new Date().toISOString(),
    });
  if (fixtureMembershipError) throw fixtureMembershipError;
  const { error: signInError } = await ordinary.auth.signInWithPassword({
    email: temporaryUser.user.email,
    password,
  });
  if (signInError) throw signInError;

  const crossTenantRead = await ordinary
    .from("organizations")
    .select("slug")
    .eq("slug", "vilet");
  assert(
    !crossTenantRead.error && crossTenantRead.data.length === 0,
    "Ordinary customer owner cannot access Vilét by slug",
  );
  const bootstrapAttempt = await ordinary.rpc("bootstrap_vilet_owner", {
    target_user_id: temporaryUser.user.id,
  });
  assert(
    Boolean(bootstrapAttempt.error),
    "Ordinary user cannot invoke the owner bootstrap",
  );
  const administratorAttempt = await ordinary
    .from("platform_administrators")
    .insert({ user_id: temporaryUser.user.id })
    .select("user_id");
  assert(
    Boolean(administratorAttempt.error) ||
      administratorAttempt.data.length === 0,
    "Customer owner cannot grant platform administration",
  );
  const entitlementAttempt = await ordinary
    .from("organization_entitlements")
    .insert({
      organization_id: customerOrganization.id,
      capability_key: "studio.access",
      source_type: "internal",
      granted_by_user_id: temporaryUser.user.id,
    })
    .select("id");
  assert(
    Boolean(entitlementAttempt.error) || entitlementAttempt.data.length === 0,
    "Customer owner cannot grant internal entitlements",
  );

  const { error: suspensionError } = await admin
    .from("organization_memberships")
    .update({ status: "suspended" })
    .eq("organization_id", customerOrganization.id)
    .eq("user_id", temporaryUser.user.id);
  if (suspensionError) throw suspensionError;
  const suspendedRead = await ordinary
    .from("organizations")
    .select("id")
    .eq("id", customerOrganization.id);
  assert(
    !suspendedRead.error && suspendedRead.data.length === 0,
    "Suspended membership removes organization access",
  );
} finally {
  if (fixtures.organizationIds.length)
    await admin
      .from("organizations")
      .delete()
      .in("id", fixtures.organizationIds);
  if (fixtures.userId) await admin.auth.admin.deleteUser(fixtures.userId);
  console.log("Temporary Phase B security fixtures removed: PASS");
}
