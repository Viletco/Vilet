import assert from "node:assert/strict";
import test from "node:test";
import {
  internalCapabilityKeys,
  parseBootstrapArguments,
  summarizeBootstrapState,
  validateBootstrapTarget,
} from "../../scripts/lib/platform-bootstrap.mjs";

const projectRef = "lzohhfmfdqivnjqqwmqu";
const userId = "123e4567-e89b-42d3-a456-426614174000";

test("bootstrap defaults to dry run and requires an explicit target", () => {
  const options = parseBootstrapArguments([
    "--environment=staging",
    `--project-ref=${projectRef}`,
    `--user-id=${userId}`,
  ]);
  assert.equal(options.apply, false);
  assert.doesNotThrow(() =>
    validateBootstrapTarget(options, `https://${projectRef}.supabase.co`),
  );
});

test("bootstrap rejects environment confusion and ambiguous identities", () => {
  const ambiguous = parseBootstrapArguments([
    "--environment=staging",
    `--project-ref=${projectRef}`,
    `--user-id=${userId}`,
    "--user-email=owner@example.com",
  ]);
  assert.throws(() =>
    validateBootstrapTarget(ambiguous, `https://${projectRef}.supabase.co`),
  );
  const mismatch = { ...ambiguous, userEmail: "" };
  assert.throws(() =>
    validateBootstrapTarget(
      mismatch,
      "https://aaaaaaaaaaaaaaaaaaaa.supabase.co",
    ),
  );
});

test("production apply requires an exact project confirmation", () => {
  const options = parseBootstrapArguments([
    "--apply",
    "--environment=production",
    `--project-ref=${projectRef}`,
    `--user-id=${userId}`,
  ]);
  assert.throws(() =>
    validateBootstrapTarget(options, `https://${projectRef}.supabase.co`),
  );
  assert.doesNotThrow(() =>
    validateBootstrapTarget(
      { ...options, productionConfirmation: projectRef },
      `https://${projectRef}.supabase.co`,
    ),
  );
});

test("the canonical internal grant contains every Phase B capability once", () => {
  assert.equal(internalCapabilityKeys.length, 13);
  assert.equal(new Set(internalCapabilityKeys).size, 13);
  for (const product of [
    "studio",
    "growth",
    "insights",
    "ai",
    "billing",
    "support",
  ])
    assert.equal(
      internalCapabilityKeys.some((key: string) =>
        key.startsWith(`${product}.`),
      ),
      true,
    );
});

test("bootstrap verification derives authority from records, not internal kind", () => {
  const incomplete = summarizeBootstrapState({
    organization: {
      name: "Vilét",
      slug: "vilet",
      kind: "internal",
      status: "active",
    },
    membership: null,
    administrator: null,
    entitlements: [],
    auditCount: 0,
  });
  assert.equal(incomplete.organizationReady, true);
  assert.equal(incomplete.membershipReady, false);
  assert.equal(incomplete.platformAdministratorReady, false);
  assert.equal(incomplete.entitlementCount, 0);
});

test("a completed state remains identical on an idempotent read", () => {
  const state = {
    organization: {
      name: "Vilét",
      slug: "vilet",
      kind: "internal",
      status: "active",
    },
    membership: { role: "owner", status: "active" },
    administrator: { revoked_at: null },
    entitlements: internalCapabilityKeys.map((capabilityKey: string) => ({
      capability_key: capabilityKey,
    })),
    auditCount: 18,
  };
  assert.deepEqual(
    summarizeBootstrapState(state),
    summarizeBootstrapState(state),
  );
});
