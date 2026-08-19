import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const migration = fs.readFileSync(
  "supabase/migrations/202608190001_bootstrap_vilet_internal_organization.sql",
  "utf8",
);

test("bootstrap database command is service-role-only and transactional", () => {
  assert.match(migration, /^begin;/u);
  assert.match(migration, /commit;\s*$/u);
  assert.match(migration, /security definer/u);
  assert.match(migration, /auth\.role\(\) <> 'service_role'/u);
  assert.match(
    migration,
    /revoke all on function public\.bootstrap_vilet_owner\(uuid\) from authenticated/u,
  );
  assert.match(
    migration,
    /grant execute on function public\.bootstrap_vilet_owner\(uuid\) to service_role/u,
  );
});

test("bootstrap serializes execution and protects canonical organization attributes", () => {
  assert.match(migration, /pg_advisory_xact_lock/u);
  assert.match(migration, /where slug = 'vilet'/u);
  assert.match(migration, /values \('Vilét', 'vilet', 'internal', 'active'\)/u);
  assert.match(migration, /conflicting protected attributes/u);
  assert.match(migration, /conflicting Vilét membership/u);
});

test("bootstrap records only real grants and uses internal entitlements", () => {
  for (const action of [
    "platform.internal_organization.created",
    "organization.owner_membership.granted",
    "platform.administrator.granted",
    "organization.internal_entitlement.granted",
    "platform.owner_bootstrap.completed",
  ])
    assert.match(migration, new RegExp(action.replaceAll(".", "\\."), "u"));
  assert.match(migration, /'internal'/u);
  assert.match(migration, /if not exists/u);
});
