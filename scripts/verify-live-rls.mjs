import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const environmentPath = path.join(
  process.cwd(),
  "apps",
  "platform",
  ".env.local",
);
const environment = Object.fromEntries(
  fs
    .readFileSync(environmentPath, "utf8")
    .split(/\r?\n/u)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1).trim()];
    }),
);

const url = environment.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = environment.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !publishableKey || !serviceRoleKey)
  throw new Error("Supabase environment is incomplete.");

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const clientA = createClient(url, publishableKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const clientB = createClient(url, publishableKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const suffix = crypto.randomUUID();
const password = `${crypto.randomBytes(24).toString("base64url")}A1!`;
const fixtures = { userIds: [], organizationIds: [] };
const results = [];

function pass(name) {
  results.push(name);
  console.log(`${name}: PASS`);
}

function assert(condition, name) {
  if (!condition) throw new Error(`${name}: FAIL`);
  pass(name);
}

function denied(result) {
  return Boolean(result.error) || !result.data || result.data.length === 0;
}

async function createUser(label) {
  const { data, error } = await admin.auth.admin.createUser({
    email: `phase-a-${label}-${suffix}@example.invalid`,
    password,
    email_confirm: true,
    user_metadata: { environment: "staging", purpose: "temporary-rls-test" },
  });
  if (error) throw error;
  fixtures.userIds.push(data.user.id);
  return data.user;
}

async function setMembership(membershipId, values) {
  const { error } = await admin
    .from("organization_memberships")
    .update(values)
    .eq("id", membershipId);
  if (error) throw error;
}

try {
  const [userA, userB] = await Promise.all([createUser("a"), createUser("b")]);
  const { data: organizations, error: organizationError } = await admin
    .from("organizations")
    .insert([
      {
        slug: `phase-a-org-a-${suffix}`,
        name: "Phase A RLS Fixture A",
        kind: "customer",
      },
      {
        slug: `phase-a-org-b-${suffix}`,
        name: "Phase A RLS Fixture B",
        kind: "customer",
      },
    ])
    .select("id, slug")
    .order("slug");
  if (organizationError) throw organizationError;
  const [organizationA, organizationB] = organizations;
  fixtures.organizationIds.push(organizationA.id, organizationB.id);

  const { data: memberships, error: membershipError } = await admin
    .from("organization_memberships")
    .insert([
      {
        organization_id: organizationA.id,
        user_id: userA.id,
        role: "owner",
        status: "active",
        joined_at: new Date().toISOString(),
      },
      {
        organization_id: organizationB.id,
        user_id: userB.id,
        role: "owner",
        status: "active",
        joined_at: new Date().toISOString(),
      },
    ])
    .select("id, organization_id");
  if (membershipError) throw membershipError;
  const membershipA = memberships.find(
    (item) => item.organization_id === organizationA.id,
  );

  const [signInA, signInB] = await Promise.all([
    clientA.auth.signInWithPassword({ email: userA.email, password }),
    clientB.auth.signInWithPassword({ email: userB.email, password }),
  ]);
  if (signInA.error) throw signInA.error;
  if (signInB.error) throw signInB.error;

  const [readA, readB] = await Promise.all([
    clientA.from("organizations").select("id"),
    clientB.from("organizations").select("id"),
  ]);
  assert(
    readA.data?.length === 1 && readA.data[0].id === organizationA.id,
    "User A reads only Organization A",
  );
  assert(
    readB.data?.length === 1 && readB.data[0].id === organizationB.id,
    "User B reads only Organization B",
  );

  const [crossReadA, crossReadB] = await Promise.all([
    clientA.from("organizations").select("id").eq("id", organizationB.id),
    clientB.from("organizations").select("id").eq("id", organizationA.id),
  ]);
  assert(crossReadA.data?.length === 0, "User A cannot read Organization B");
  assert(crossReadB.data?.length === 0, "User B cannot read Organization A");

  const crossWrite = await clientA
    .from("organizations")
    .update({ name: "Unauthorized cross-tenant change" })
    .eq("id", organizationB.id)
    .select("id");
  assert(denied(crossWrite), "Cross-tenant organization mutation denied");

  const crossMembership = await clientA
    .from("organization_memberships")
    .insert({
      organization_id: organizationB.id,
      user_id: userA.id,
      role: "viewer",
      status: "active",
      joined_at: new Date().toISOString(),
    })
    .select("id");
  assert(denied(crossMembership), "Cross-tenant membership insertion denied");

  const ownerWrite = await clientA
    .from("organizations")
    .update({ name: "Phase A RLS Fixture A Owner Verified" })
    .eq("id", organizationA.id)
    .select("id");
  assert(ownerWrite.data?.length === 1, "Owner can update own organization");

  await setMembership(membershipA.id, { role: "admin", status: "active" });
  const adminWrite = await clientA
    .from("organizations")
    .update({ name: "Phase A RLS Fixture A Admin Verified" })
    .eq("id", organizationA.id)
    .select("id");
  assert(adminWrite.data?.length === 1, "Admin can update own organization");

  const adminSelfPromotion = await clientA
    .from("organization_memberships")
    .update({ role: "owner" })
    .eq("id", membershipA.id)
    .select("role");
  assert(denied(adminSelfPromotion), "Admin cannot promote self to owner");

  const adminGrantOwner = await clientA
    .from("organization_memberships")
    .insert({
      organization_id: organizationA.id,
      user_id: userB.id,
      role: "owner",
      status: "active",
      joined_at: new Date().toISOString(),
    })
    .select("id");
  assert(denied(adminGrantOwner), "Admin cannot grant owner role");

  for (const role of ["member", "billing", "viewer"]) {
    await setMembership(membershipA.id, { role, status: "active" });
    const roleRead = await clientA
      .from("organizations")
      .select("id")
      .eq("id", organizationA.id);
    assert(roleRead.data?.length === 1, `${role} has active base read access`);
    const roleWrite = await clientA
      .from("organizations")
      .update({ name: `Unauthorized ${role} change` })
      .eq("id", organizationA.id)
      .select("id");
    assert(denied(roleWrite), `${role} organization mutation denied`);
  }

  for (const status of ["suspended", "invited"]) {
    await setMembership(membershipA.id, { role: "member", status });
    const statusRead = await clientA
      .from("organizations")
      .select("id")
      .eq("id", organizationA.id);
    assert(
      statusRead.data?.length === 0,
      `${status} membership grants no organization access`,
    );
  }
  await setMembership(membershipA.id, { role: "owner", status: "active" });

  const platformAdminEscalation = await clientA
    .from("platform_administrators")
    .insert({ user_id: userA.id, granted_by_user_id: userA.id })
    .select("user_id");
  assert(
    denied(platformAdminEscalation),
    "Organization owner cannot grant platform administration",
  );

  const { data: capabilities, error: capabilityError } = await admin
    .from("capabilities")
    .select("key")
    .in("key", ["studio.access", "ai.access", "support.access"]);
  if (capabilityError) throw capabilityError;
  const now = Date.now();
  const { error: entitlementFixtureError } = await admin
    .from("organization_entitlements")
    .insert([
      {
        organization_id: organizationA.id,
        capability_key: capabilities[0].key,
        source_type: "manual",
        starts_at: new Date(now - 60_000).toISOString(),
        granted_by_user_id: userA.id,
      },
      {
        organization_id: organizationA.id,
        capability_key: capabilities[1].key,
        source_type: "manual",
        starts_at: new Date(now - 120_000).toISOString(),
        revoked_at: new Date(now - 60_000).toISOString(),
        granted_by_user_id: userA.id,
      },
      {
        organization_id: organizationA.id,
        capability_key: capabilities[2].key,
        source_type: "trial",
        starts_at: new Date(now - 120_000).toISOString(),
        ends_at: new Date(now - 60_000).toISOString(),
        granted_by_user_id: userA.id,
      },
    ]);
  if (entitlementFixtureError) throw entitlementFixtureError;

  const activeEntitlements = await clientA
    .from("organization_entitlements")
    .select("capability_key")
    .eq("organization_id", organizationA.id)
    .is("revoked_at", null)
    .lte("starts_at", new Date().toISOString())
    .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`);
  assert(
    activeEntitlements.data?.length === 1,
    "Active entitlement filtering excludes revoked and expired grants",
  );

  const entitlementEscalation = await clientA
    .from("organization_entitlements")
    .insert({
      organization_id: organizationA.id,
      capability_key: "billing.manage",
      source_type: "manual",
      granted_by_user_id: userA.id,
    })
    .select("id");
  assert(
    denied(entitlementEscalation),
    "Organization owner cannot self-grant capabilities",
  );

  const rawInvitationToken = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawInvitationToken)
    .digest("hex");
  const { data: invitation, error: invitationError } = await admin
    .from("organization_invitations")
    .insert({
      organization_id: organizationA.id,
      email_normalized: `invite-${suffix}@example.invalid`,
      role: "viewer",
      token_hash: tokenHash,
      expires_at: new Date(now + 3_600_000).toISOString(),
      invited_by_user_id: userA.id,
    })
    .select("token_hash")
    .single();
  if (invitationError) throw invitationError;
  assert(
    invitation.token_hash === tokenHash &&
      invitation.token_hash !== rawInvitationToken,
    "Invitation stores only a one-way token hash",
  );
  const invitationRead = await clientA
    .from("organization_invitations")
    .select("id");
  assert(
    invitationRead.data?.length === 0,
    "Invitation records are unavailable to ordinary users",
  );

  assert(results.length === 23, "All planned live RLS scenarios executed");
} finally {
  if (fixtures.organizationIds.length) {
    await admin
      .from("organizations")
      .delete()
      .in("id", fixtures.organizationIds);
  }
  for (const userId of fixtures.userIds) {
    await admin.auth.admin.deleteUser(userId);
  }
  console.log("Temporary RLS fixtures removed: PASS");
}
