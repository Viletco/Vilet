import assert from "node:assert/strict";
import test from "node:test";
import {
  authenticatedLoginDestination,
  canAccessTenantResource,
  canGrantPlatformAdministration,
  canMutateTenantResource,
  hasCapability,
  hasOrganizationRole,
  resolvePlatformEntry,
  type OrganizationContext,
} from "../../packages/authorization/src/index.ts";

function context(
  overrides: Partial<OrganizationContext> = {},
): OrganizationContext {
  return {
    userId: "user-a",
    organizationId: "organization-a",
    organizationSlug: "organization-a",
    organizationName: "Organization A",
    organizationKind: "customer",
    organizationStatus: "active",
    role: "member",
    membershipStatus: "active",
    capabilities: new Set(["studio.access"]),
    platformAdministrator: false,
    ...overrides,
  };
}

test("unauthenticated entry is denied and authenticated login redirects", () => {
  assert.deepEqual(resolvePlatformEntry(false, []), { kind: "login" });
  assert.equal(authenticatedLoginDestination(true), "/");
  assert.equal(authenticatedLoginDestination(false), null);
});

test("authenticated root resolves private, single-organization, and chooser states", () => {
  assert.deepEqual(resolvePlatformEntry(true, []), { kind: "private-access" });
  assert.deepEqual(resolvePlatformEntry(true, ["vilet"]), {
    kind: "organization",
    slug: "vilet",
  });
  assert.deepEqual(resolvePlatformEntry(true, ["vilet", "customer"]), {
    kind: "chooser",
  });
});

test("role and capability checks require active membership", () => {
  assert.equal(
    hasOrganizationRole(context({ role: "owner" }), ["owner"]),
    true,
  );
  assert.equal(hasCapability(context(), "studio.access"), true);
  assert.equal(
    hasCapability(context({ membershipStatus: "suspended" }), "studio.access"),
    false,
  );
});

test("organization A cannot read or mutate organization B resources", () => {
  const member = context();
  assert.equal(
    canAccessTenantResource(member, { organizationId: "organization-b" }),
    false,
  );
  assert.equal(
    canMutateTenantResource(member, { organizationId: "organization-b" }),
    false,
  );
  assert.equal(
    canAccessTenantResource(member, { organizationId: "organization-a" }),
    true,
  );
});

test("viewers cannot mutate and suspended users have no tenant access", () => {
  assert.equal(
    canMutateTenantResource(context({ role: "viewer" }), {
      organizationId: "organization-a",
    }),
    false,
  );
  assert.equal(
    canAccessTenantResource(context({ membershipStatus: "suspended" }), {
      organizationId: "organization-a",
    }),
    false,
  );
});

test("ordinary organization owners cannot grant platform administration", () => {
  assert.equal(
    canGrantPlatformAdministration(context({ role: "owner" })),
    false,
  );
  assert.equal(
    canGrantPlatformAdministration(context({ platformAdministrator: true })),
    true,
  );
});

test("capabilities cannot be self-granted by changing organization context", () => {
  const member = context({ capabilities: new Set() });
  assert.equal(hasCapability(member, "growth.access"), false);
});

test("internal organization kind does not grant roles, capabilities, or platform administration", () => {
  const internal = context({
    organizationKind: "internal",
    role: "viewer",
    capabilities: new Set(),
    platformAdministrator: false,
  });
  assert.equal(hasOrganizationRole(internal, ["owner"]), false);
  assert.equal(hasCapability(internal, "studio.access"), false);
  assert.equal(canGrantPlatformAdministration(internal), false);
});
