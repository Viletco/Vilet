import crypto from "node:crypto";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import { loadPlatformEnvironment } from "./lib/platform-bootstrap.mjs";

const target = {
  environment: "",
  projectRef: "",
  environmentFile: ".env.local",
};
for (const argument of process.argv.slice(2)) {
  if (argument.startsWith("--environment="))
    target.environment = argument.slice(14);
  else if (argument.startsWith("--project-ref="))
    target.projectRef = argument.slice(14);
  else if (argument.startsWith("--credential-file="))
    target.environmentFile = argument.slice(18);
  else throw new Error(`Unknown verification argument: ${argument}`);
}
if (target.environment !== "staging")
  throw new Error(
    "Growth E1 live fixtures are restricted to --environment=staging.",
  );
if (!/^[a-z0-9]{20}$/u.test(target.projectRef))
  throw new Error(
    "--project-ref must be an explicit staging Supabase project ref.",
  );

const environment = loadPlatformEnvironment(
  process.cwd(),
  target.environmentFile,
);
const url = environment.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = environment.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !publishableKey || !serviceRoleKey)
  throw new Error("Staging Supabase environment is incomplete.");
if (new URL(url).hostname !== `${target.projectRef}.supabase.co`)
  throw new Error("Configured Supabase URL does not match --project-ref.");

const options = { auth: { autoRefreshToken: false, persistSession: false } };
const admin = createClient(url, serviceRoleKey, options);
const clientA = createClient(url, publishableKey, options);
const clientB = createClient(url, publishableKey, options);
const suffix = crypto.randomUUID();
const password = `${crypto.randomBytes(24).toString("base64url")}A1!`;
const fixtures = { userIds: [], organizationIds: [] };

function assert(condition, name) {
  if (!condition) throw new Error(`${name}: FAIL`);
  console.log(`${name}: PASS`);
}
function denied(result) {
  return Boolean(result.error) || !result.data || result.data.length === 0;
}
async function createUser(label) {
  const { data, error } = await admin.auth.admin.createUser({
    email: `growth-e1-${label}-${suffix}@example.invalid`,
    password,
    email_confirm: true,
    user_metadata: {
      environment: "staging",
      purpose: "temporary-growth-e1-rls-test",
    },
  });
  if (error) throw error;
  fixtures.userIds.push(data.user.id);
  return data.user;
}
async function grant(organizationId, capabilityKeys) {
  const { error } = await admin.from("organization_entitlements").insert(
    capabilityKeys.map((capabilityKey) => ({
      organization_id: organizationId,
      capability_key: capabilityKey,
      source_type: "internal",
      source_reference: `growth-e1-rls-${suffix}`,
    })),
  );
  if (error) throw error;
}

try {
  const [userA, userB] = await Promise.all([createUser("a"), createUser("b")]);
  const { data: organizations, error: organizationError } = await admin
    .from("organizations")
    .insert([
      {
        slug: `growth-e1-a-${suffix}`,
        name: "Growth E1 Fixture A",
        kind: "customer",
      },
      {
        slug: `growth-e1-b-${suffix}`,
        name: "Growth E1 Fixture B",
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

  await Promise.all([
    grant(organizationA.id, [
      "growth.access",
      "growth.prospecting",
      "growth.pipeline",
    ]),
    grant(organizationB.id, ["growth.access"]),
  ]);
  const [signInA, signInB] = await Promise.all([
    clientA.auth.signInWithPassword({ email: userA.email, password }),
    clientB.auth.signInWithPassword({ email: userB.email, password }),
  ]);
  if (signInA.error) throw signInA.error;
  if (signInB.error) throw signInB.error;

  const noProspecting = await clientB
    .from("growth_prospects")
    .insert({
      organization_id: organizationB.id,
      business_name: "Capability Denied",
      business_name_normalized: "capability denied",
      source_type: "manual",
      created_by_user_id: userB.id,
      updated_by_user_id: userB.id,
    })
    .select("id");
  assert(denied(noProspecting), "Missing growth.prospecting denies creation");
  const { data: prospectB, error: prospectBError } = await admin
    .from("growth_prospects")
    .insert({
      organization_id: organizationB.id,
      business_name: "Tenant B Prospect",
      business_name_normalized: "tenant b prospect",
      source_type: "manual",
      created_by_user_id: userB.id,
      updated_by_user_id: userB.id,
    })
    .select("id")
    .single();
  if (prospectBError) throw prospectBError;
  await grant(organizationB.id, ["growth.prospecting"]);
  const noPipeline = await clientB
    .from("growth_prospects")
    .update({ pipeline_stage: "qualified" })
    .eq("id", prospectB.id)
    .select("id");
  assert(denied(noPipeline), "Missing growth.pipeline denies stage mutation");

  const { data: prospect, error: prospectError } = await clientA
    .from("growth_prospects")
    .insert({
      organization_id: organizationA.id,
      business_name: "Tenant A Prospect",
      business_name_normalized: "tenant a prospect",
      domain_normalized: `tenant-a-${suffix}.example`,
      website_url: `https://tenant-a-${suffix}.example`,
      source_type: "manual",
      created_by_user_id: userA.id,
      updated_by_user_id: userA.id,
    })
    .select("id")
    .single();
  if (prospectError) throw prospectError;
  assert(Boolean(prospect?.id), "Entitled user creates own-tenant prospect");

  const duplicateDomain = await clientA
    .from("growth_prospects")
    .insert({
      organization_id: organizationA.id,
      business_name: "Tenant A Duplicate Domain",
      business_name_normalized: "tenant a duplicate domain",
      domain_normalized: `tenant-a-${suffix}.example`,
      website_url: `https://tenant-a-${suffix}.example`,
      source_type: "manual",
      created_by_user_id: userA.id,
      updated_by_user_id: userA.id,
    })
    .select("id");
  assert(
    denied(duplicateDomain),
    "Active same-tenant domain duplicate is rejected",
  );

  const [sources, activities] = await Promise.all([
    clientA.from("growth_sources").select("id").eq("prospect_id", prospect.id),
    clientA
      .from("growth_activities")
      .select("event_type")
      .eq("prospect_id", prospect.id),
  ]);
  assert(
    sources.data?.length === 1,
    "Initial source is recorded automatically",
  );
  assert(
    activities.data?.some((item) => item.event_type === "prospect.created"),
    "Creation activity is recorded automatically",
  );

  const crossRead = await clientB
    .from("growth_prospects")
    .select("id")
    .eq("id", prospect.id);
  assert(crossRead.data?.length === 0, "Cross-tenant prospect read denied");
  const crossWrite = await clientB
    .from("growth_prospects")
    .update({ business_name: "Unauthorized cross-tenant change" })
    .eq("id", prospect.id)
    .select("id");
  assert(denied(crossWrite), "Cross-tenant prospect write denied");
  const crossActivity = await clientB
    .from("growth_activities")
    .select("id")
    .eq("prospect_id", prospect.id);
  assert(crossActivity.data?.length === 0, "Cross-tenant activity read denied");
  const crossNoteRead = await clientB
    .from("growth_prospect_notes")
    .select("id")
    .eq("prospect_id", prospect.id);
  assert(crossNoteRead.data?.length === 0, "Cross-tenant note read denied");
  const crossNote = await clientB
    .from("growth_prospect_notes")
    .insert({
      organization_id: organizationA.id,
      prospect_id: prospect.id,
      author_user_id: userB.id,
      body: "Unauthorized note",
    })
    .select("id");
  assert(denied(crossNote), "Cross-tenant note write denied");

  const badAssignee = await clientA
    .from("growth_prospects")
    .update({ assigned_user_id: userB.id })
    .eq("id", prospect.id)
    .select("id");
  assert(denied(badAssignee), "Cross-tenant assignment denied");

  const badDuplicate = await clientA
    .from("growth_prospects")
    .update({ status: "duplicate", duplicate_of_id: prospectB.id })
    .eq("id", prospect.id)
    .select("id");
  assert(denied(badDuplicate), "Cross-tenant duplicate target denied");

  const pipelineFields = await clientA
    .from("growth_prospects")
    .update({
      assigned_user_id: userA.id,
      estimated_value_minor: 125000,
      currency: "USD",
      next_action: "Review staging fixture",
      next_action_at: new Date(Date.now() + 86_400_000).toISOString(),
    })
    .eq("id", prospect.id)
    .select("assigned_user_id, estimated_value_minor, next_action");
  assert(
    pipelineFields.data?.[0]?.assigned_user_id === userA.id &&
      pipelineFields.data[0].estimated_value_minor === 125000 &&
      pipelineFields.data[0].next_action === "Review staging fixture",
    "Assignment, value, and next action update succeeds",
  );

  const note = await clientA
    .from("growth_prospect_notes")
    .insert({
      organization_id: organizationA.id,
      prospect_id: prospect.id,
      author_user_id: userA.id,
      body: "Verified staging note",
    })
    .select("id");
  assert(note.data?.length === 1, "Own-tenant note creation succeeds");

  const stage = await clientA
    .from("growth_prospects")
    .update({ pipeline_stage: "qualified" })
    .eq("id", prospect.id)
    .select("pipeline_stage");
  assert(
    stage.data?.[0]?.pipeline_stage === "qualified",
    "growth.pipeline stage update succeeds",
  );

  const rpcKey = crypto.randomUUID();
  const rpcRows = [
    {
      business_name: "Imported Prospect",
      business_name_normalized: "imported prospect",
      domain_normalized: `import-${suffix}.example`,
      website_url: `https://import-${suffix}.example`,
      fingerprint: crypto.createHash("sha256").update(suffix).digest("hex"),
    },
  ];
  const firstImport = await clientA.rpc("commit_growth_csv_import", {
    target_organization_id: organizationA.id,
    import_filename: "growth-e1.csv",
    import_idempotency_key: rpcKey,
    import_rows: rpcRows,
  });
  if (firstImport.error) throw firstImport.error;
  const secondImport = await clientA.rpc("commit_growth_csv_import", {
    target_organization_id: organizationA.id,
    import_filename: "growth-e1.csv",
    import_idempotency_key: rpcKey,
    import_rows: rpcRows,
  });
  if (secondImport.error) throw secondImport.error;
  assert(
    firstImport.data.batch_id === secondImport.data.batch_id,
    "Repeated CSV commit is idempotent",
  );
  const duplicateImport = await clientA.rpc("commit_growth_csv_import", {
    target_organization_id: organizationA.id,
    import_filename: "growth-e1-duplicate.csv",
    import_idempotency_key: crypto.randomUUID(),
    import_rows: rpcRows,
  });
  if (duplicateImport.error) throw duplicateImport.error;
  assert(
    duplicateImport.data.accepted_count === 0 &&
      duplicateImport.data.duplicate_count === 1,
    "New import batch counts an existing row as a duplicate",
  );
  const crossImport = await clientB
    .from("growth_import_batches")
    .select("id")
    .eq("id", firstImport.data.batch_id);
  assert(crossImport.data?.length === 0, "Cross-tenant import read denied");

  const archived = await clientA
    .from("growth_prospects")
    .update({ status: "archived", archived_at: new Date().toISOString() })
    .eq("id", prospect.id)
    .select("status");
  assert(
    archived.data?.[0]?.status === "archived",
    "Prospect archive succeeds",
  );
  const restored = await clientA
    .from("growth_prospects")
    .update({ status: "active", archived_at: null })
    .eq("id", prospect.id)
    .select("status");
  assert(restored.data?.[0]?.status === "active", "Prospect restore succeeds");

  await admin
    .from("organization_entitlements")
    .update({ revoked_at: new Date().toISOString() })
    .eq("organization_id", organizationB.id)
    .eq("capability_key", "growth.access");
  const noAccess = await clientB
    .from("growth_prospects")
    .select("id")
    .eq("organization_id", organizationB.id);
  assert(noAccess.data?.length === 0, "Missing growth.access denies reads");

  await admin
    .from("organization_memberships")
    .update({ status: "suspended" })
    .eq("id", membershipA.id);
  const suspendedRead = await clientA
    .from("growth_prospects")
    .select("id")
    .eq("organization_id", organizationA.id);
  assert(
    suspendedRead.data?.length === 0,
    "Suspended membership loses Growth access",
  );

  console.log("Growth E1 staging RLS verification: PASS");
} finally {
  if (fixtures.organizationIds.length)
    await admin
      .from("organizations")
      .delete()
      .in("id", fixtures.organizationIds);
  for (const userId of fixtures.userIds)
    await admin.auth.admin.deleteUser(userId);
}
