import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
const root = join(
  "apps",
  "platform",
  "app",
  "o",
  "[organizationSlug]",
  "growth",
);
function source(...parts: string[]) {
  return readFileSync(join(root, ...parts), "utf8");
}

test("E1 routes enforce the intended capability independently", () => {
  assert.ok(source("page.tsx").includes('"growth.access"'));
  for (const route of [
    ["prospects", "page.tsx"],
    ["prospects", "[prospectId]", "page.tsx"],
    ["review", "page.tsx"],
    ["import", "preview", "route.ts"],
    ["import", "commit", "route.ts"],
  ])
    assert.ok(source(...route).includes('"growth.prospecting"'));
  assert.ok(source("pipeline", "page.tsx").includes('"growth.pipeline"'));
});

test("mutations bind every record to verified organization context", () => {
  const actions = source("actions.ts");
  assert.doesNotMatch(actions, /form\.get\("organization_id"\)/u);
  assert.match(actions, /context\.organizationId/g);
  assert.match(actions, /requireCapability\(slug, "growth\.prospecting"\)/u);
  assert.match(actions, /requireCapability\(slug, "growth\.pipeline"\)/u);
});

test("E1 exposes only the five approved Growth destinations", () => {
  for (const route of [
    "growth",
    "growth/prospects",
    "growth/prospects/[prospectId]",
    "growth/review",
    "growth/pipeline",
  ])
    assert.ok(route);
  for (const forbidden of ["campaigns", "discovery", "outreach", "analytics"])
    assert.doesNotMatch(source("page.tsx"), new RegExp(forbidden, "iu"));
});
