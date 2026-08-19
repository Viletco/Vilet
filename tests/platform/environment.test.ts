import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { validatePlatformEnvironment } from "../../packages/shared-config/src/index.ts";

test("disabled mode requires no credentials and remains explicit", () => {
  assert.deepEqual(validatePlatformEnvironment({}), {
    authMode: "disabled",
    appUrl: new URL("http://localhost:3001"),
  });
});

test("supabase mode fails closed without required public configuration", () => {
  assert.throws(
    () => validatePlatformEnvironment({ PLATFORM_AUTH_MODE: "supabase" }),
    /NEXT_PUBLIC_SUPABASE_URL/,
  );
  assert.throws(
    () =>
      validatePlatformEnvironment({
        PLATFORM_AUTH_MODE: "supabase",
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      }),
    /PUBLISHABLE_KEY/,
  );
});

test("invalid modes and insecure production origins are rejected", () => {
  assert.throws(
    () => validatePlatformEnvironment({ PLATFORM_AUTH_MODE: "fake" }),
    /disabled or supabase/,
  );
  assert.throws(
    () =>
      validatePlatformEnvironment({
        NEXT_PUBLIC_APP_URL: "http://app.vilet.co",
      }),
    /HTTPS/,
  );
});

test("valid Supabase configuration keeps the service role optional and server-directed", () => {
  const config = validatePlatformEnvironment({
    PLATFORM_AUTH_MODE: "supabase",
    NEXT_PUBLIC_APP_URL: "https://app.vilet.co",
    NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "publishable-placeholder",
  });
  assert.equal(config.authMode, "supabase");
  if (config.authMode === "supabase")
    assert.equal(config.serviceRoleKey, undefined);
});

test("live RLS fixture verification requires an explicit environment and project", () => {
  const source = readFileSync("scripts/verify-live-rls.mjs", "utf8");
  assert.match(source, /--environment must be staging or production/);
  assert.match(source, /Configured Supabase URL does not match --project-ref/);
  assert.match(source, /Production RLS fixtures require --confirm-production/);
  assert.match(source, /Temporary RLS fixtures removed/);
});
