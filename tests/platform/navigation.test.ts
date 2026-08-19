import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import type { OrganizationContext } from "../../packages/authorization/src/index.ts";
import { visibleDestinations } from "../../apps/platform/lib/platform-products.ts";

function context(capabilities: readonly string[]): OrganizationContext {
  return {
    userId: "user",
    organizationId: "organization",
    organizationSlug: "vilet",
    organizationName: "Vilét",
    organizationKind: "internal",
    organizationStatus: "active",
    role: "owner",
    membershipStatus: "active",
    capabilities: new Set(capabilities),
    platformAdministrator: false,
  };
}

test("navigation is derived from active organization capabilities", () => {
  const labels = visibleDestinations(
    context(["studio.access", "support.access"]),
  ).map(({ label }) => label);
  assert.deepEqual(labels, ["Overview", "Studio", "Support", "Settings"]);
});

test("billing and product links disappear when their entitlement is absent", () => {
  const labels = visibleDestinations(context(["insights.access"])).map(
    ({ label }) => label,
  );
  assert.equal(labels.includes("Billing"), false);
  assert.equal(labels.includes("Growth"), false);
  assert.equal(labels.includes("Insights"), true);
});

test("every product route independently checks its required capability", () => {
  const routeCapabilities = new Map([
    ["studio", "studio.access"],
    ["growth", "growth.access"],
    ["insights", "insights.access"],
    ["ai", "ai.access"],
    ["billing", "billing.manage"],
    ["support", "support.access"],
  ]);
  const root = join(
    process.cwd(),
    "apps",
    "platform",
    "app",
    "o",
    "[organizationSlug]",
  );
  assert.ok(readdirSync(root).length > 0);
  for (const [route, capability] of routeCapabilities) {
    const source = readFileSync(join(root, route, "page.tsx"), "utf8");
    assert.match(source, /requireCapability/);
    assert.ok(source.includes(`"${capability}"`));
  }
});
