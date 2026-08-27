import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { resolvePlatformAppUrl } from "../../packages/shared-config/src/index.ts";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

test("public account entry preserves primary navigation and project CTA", () => {
  const navigation = read("src/content/navigation.ts");
  const header = read("src/components/layout/header.tsx");
  const mobile = read("src/components/layout/mobile-navigation.tsx");
  for (const label of [
    "Studio",
    "Work",
    "Insights",
    "Partners",
    "About",
    "Contact",
  ])
    assert.ok(navigation.includes(`label: "${label}"`));
  assert.match(navigation, /https:\/\/app\.vilet\.co\/login/);
  assert.match(header, /Log In/);
  assert.match(header, /Discuss a project/);
  assert.match(mobile, /Log In/);
  assert.match(mobile, /Discuss a project/);
});

test("marketing remains outside the platform authentication boundary", () => {
  const marketingFiles = [
    "src/components/layout/header.tsx",
    "src/components/layout/mobile-navigation.tsx",
    "src/content/navigation.ts",
  ];
  for (const file of marketingFiles) {
    const source = read(file);
    assert.doesNotMatch(
      source,
      /@supabase|SUPABASE_|organization_memberships|document\.cookie/,
    );
  }
});

test("production magic links use app.vilet.co and previews use only Vercel preview origins", () => {
  const production = new URL("https://app.vilet.co");
  assert.equal(
    resolvePlatformAppUrl(production, {
      vercelEnv: "production",
      vercelUrl: "ignored.vercel.app",
    }).href,
    "https://app.vilet.co/",
  );
  assert.equal(
    resolvePlatformAppUrl(production, {
      vercelEnv: "preview",
      vercelUrl: "vilet-preview.vercel.app",
    }).href,
    "https://vilet-preview.vercel.app/",
  );
  assert.throws(
    () =>
      resolvePlatformAppUrl(production, {
        vercelEnv: "preview",
        vercelUrl: "attacker.example",
      }),
    /Vercel preview hostname/,
  );
});

test("invalid callbacks return to a branded login error without reflecting redirects", () => {
  const callback = read("apps/platform/app/auth/callback/route.ts");
  assert.match(callback, /invalid-callback/);
  assert.match(callback, /missing-callback-code/);
  assert.doesNotMatch(callback, /redirect_to|returnTo|next=/);
});

test("authentication failures are actionable and safely observable", () => {
  const action = read("apps/platform/app/login/actions.ts");
  const login = read("apps/platform/app/login/page.tsx");
  const events = read("apps/platform/lib/safe-events.ts");
  assert.match(action, /over_email_send_rate_limit/);
  assert.match(action, /rate-limited/);
  assert.match(login, /Wait about an hour/);
  assert.match(events, /scope: "vilet-platform"/);
  assert.doesNotMatch(events, /email|token|cookie|authorization|service.role/i);
});

test("login offers native password authentication alongside magic links", () => {
  const loginPage = read("apps/platform/app/login/page.tsx");
  const loginActions = read("apps/platform/app/login/actions.ts");

  assert.match(loginPage, /Password/);
  assert.match(loginPage, /Magic link/);
  assert.match(loginPage, /autoComplete="current-password"/);
  assert.match(loginActions, /auth\.signInWithPassword/);
  assert.match(loginActions, /invalid-credentials/);
  assert.doesNotMatch(loginActions, /serviceRole|service_role/);
});

test("privileged staging identity and connectivity tools require explicit targets", () => {
  const identity = read("scripts/create-platform-test-user.mjs");
  const connectivity = read("scripts/verify-platform-connectivity.mjs");
  assert.match(identity, /Test identities may be created only in staging/);
  assert.match(identity, /validateBootstrapTarget/);
  assert.match(connectivity, /--environment must be staging or production/);
  assert.match(
    connectivity,
    /Configured Supabase URL does not match --project-ref/,
  );
});
