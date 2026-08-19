import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  applyPlatformSessionCookiePolicy,
  PLATFORM_SESSION_COOKIE_MAX_AGE_SECONDS,
} from "../../packages/auth/src/session-cookies.ts";

test("session writes persist for 90 days and remain host-only", () => {
  const [cookie] = applyPlatformSessionCookiePolicy([
    {
      name: "sb-staging-auth-token",
      value: "session",
      options: {
        domain: ".vilet.co",
        maxAge: 400 * 24 * 60 * 60,
        path: "/",
        sameSite: "lax" as const,
        secure: true,
      },
    },
  ]);

  assert.equal(cookie.options.maxAge, PLATFORM_SESSION_COOKIE_MAX_AGE_SECONDS);
  assert.equal(cookie.options.domain, undefined);
  assert.equal(cookie.options.path, "/");
  assert.equal(cookie.options.sameSite, "lax");
  assert.equal(cookie.options.secure, true);
});

test("refresh rotation renews the persistent cookie window", () => {
  const writes = applyPlatformSessionCookiePolicy([
    {
      name: "sb-staging-auth-token.0",
      value: "rotated-session-part-one",
      options: { maxAge: 1, path: "/", secure: true },
    },
    {
      name: "sb-staging-auth-token.1",
      value: "rotated-session-part-two",
      options: { maxAge: 1, path: "/", secure: true },
    },
  ]);

  assert.ok(
    writes.every(
      ({ options }) =>
        options.maxAge === PLATFORM_SESSION_COOKIE_MAX_AGE_SECONDS,
    ),
  );
});

test("logout and expired or revoked session cleanup remain destructive", () => {
  const [deleted] = applyPlatformSessionCookiePolicy([
    {
      name: "sb-staging-auth-token",
      value: "",
      options: {
        domain: ".vilet.co",
        maxAge: 0,
        path: "/",
        secure: true,
      },
    },
  ]);

  assert.equal(deleted.value, "");
  assert.equal(deleted.options.maxAge, 0);
  assert.equal(deleted.options.domain, undefined);
});

test("middleware refreshes sessions and logout still calls Supabase signOut", () => {
  const middleware = readFileSync("packages/auth/src/middleware.ts", "utf8");
  const logout = readFileSync("apps/platform/app/logout/route.ts", "utf8");
  assert.match(middleware, /await client\.auth\.getUser\(\)/);
  assert.match(middleware, /applyPlatformSessionCookiePolicy\(values\)/);
  assert.match(logout, /client\.auth\.signOut\(\)/);
});

test("staging and production sessions remain isolated by host and project key", () => {
  const writes = applyPlatformSessionCookiePolicy([
    {
      name: "sb-lzohhfmfdqivnjqqwmqu-auth-token",
      value: "staging",
      options: { maxAge: 10, secure: true },
    },
    {
      name: "sb-detqlxrismxlbgsgeafx-auth-token",
      value: "production",
      options: { maxAge: 10, secure: true },
    },
  ]);

  assert.notEqual(writes[0].name, writes[1].name);
  assert.ok(writes.every(({ options }) => options.domain === undefined));
});
