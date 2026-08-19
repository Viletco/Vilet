import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import {
  internalCapabilityKeys,
  loadPlatformEnvironment,
  parseBootstrapArguments,
  summarizeBootstrapState,
  validateBootstrapTarget,
} from "./lib/platform-bootstrap.mjs";

const options = parseBootstrapArguments(process.argv.slice(2));
const environment = loadPlatformEnvironment(
  process.cwd(),
  options.environmentFile,
);
options.projectRef ||= environment.VILET_SUPABASE_PROJECT_REF ?? "";
if (!options.userId && !options.userEmail)
  options.userId = environment.VILET_BOOTSTRAP_ADMIN_USER_ID ?? "";
for (const key of ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]) {
  if (!environment[key]) throw new Error(`${key} is required.`);
}
validateBootstrapTarget(options, environment.NEXT_PUBLIC_SUPABASE_URL);

const admin = createClient(
  environment.NEXT_PUBLIC_SUPABASE_URL,
  environment.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function resolveTargetUser() {
  if (options.userId) {
    const { data, error } = await admin.auth.admin.getUserById(options.userId);
    if (error || !data.user)
      throw new Error("The target authentication user does not exist.");
    return data.user;
  }
  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (error) throw new Error("Authentication users could not be inspected.");
  const matches = data.users.filter(
    (user) => user.email?.toLowerCase() === options.userEmail,
  );
  if (matches.length !== 1)
    throw new Error("The owner email must resolve to exactly one auth user.");
  return matches[0];
}

async function readState(userId) {
  const { data: organization, error: organizationError } = await admin
    .from("organizations")
    .select("id, name, slug, kind, status")
    .eq("slug", "vilet")
    .maybeSingle();
  if (organizationError) throw organizationError;
  if (!organization)
    return {
      organization: null,
      membership: null,
      administrator: null,
      entitlements: [],
      auditCount: 0,
    };
  const [membership, administrator, entitlements, audits] = await Promise.all([
    admin
      .from("organization_memberships")
      .select("role, status")
      .eq("organization_id", organization.id)
      .eq("user_id", userId)
      .maybeSingle(),
    admin
      .from("platform_administrators")
      .select("revoked_at")
      .eq("user_id", userId)
      .maybeSingle(),
    admin
      .from("organization_entitlements")
      .select("capability_key, source_type, starts_at, ends_at, revoked_at")
      .eq("organization_id", organization.id)
      .eq("source_type", "internal")
      .is("revoked_at", null)
      .is("ends_at", null),
    admin
      .from("audit_events")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", organization.id),
  ]);
  for (const result of [membership, administrator, entitlements, audits])
    if (result.error) throw result.error;
  return {
    organization,
    membership: membership.data,
    administrator: administrator.data,
    entitlements: entitlements.data,
    auditCount: audits.count ?? 0,
  };
}

const targetUser = await resolveTargetUser();
const { data: capabilities, error: capabilityError } = await admin
  .from("capabilities")
  .select("key, status")
  .in("key", internalCapabilityKeys);
if (capabilityError) throw capabilityError;
const activeKeys = new Set(
  (capabilities ?? [])
    .filter((capability) => capability.status === "active")
    .map((capability) => capability.key),
);
const missing = internalCapabilityKeys.filter((key) => !activeKeys.has(key));
if (missing.length)
  throw new Error(
    `The capability catalog is incomplete (${missing.length} missing).`,
  );

const before = summarizeBootstrapState(await readState(targetUser.id));
if (!options.apply) {
  console.log("Vilét owner bootstrap dry run: PASS");
  console.log(
    JSON.stringify({ environment: options.environment, before }, null, 2),
  );
  process.exit(0);
}

const { data: result, error: bootstrapError } = await admin.rpc(
  "bootstrap_vilet_owner",
  { target_user_id: targetUser.id },
);
if (bootstrapError)
  throw new Error(`Bootstrap failed: ${bootstrapError.message}`);
const after = summarizeBootstrapState(await readState(targetUser.id));
if (
  !after.organizationReady ||
  !after.membershipReady ||
  !after.platformAdministratorReady ||
  after.entitlementCount !== internalCapabilityKeys.length
)
  throw new Error("Bootstrap verification failed closed.");

console.log("Vilét owner bootstrap apply: PASS");
console.log(
  JSON.stringify({ environment: options.environment, result, after }, null, 2),
);
