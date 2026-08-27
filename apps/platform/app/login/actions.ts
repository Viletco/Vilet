"use server";

import { redirect } from "next/navigation";
import { createPlatformServerClient, getPlatformConfig } from "@vilet/auth";
import { resolvePlatformAppUrl } from "@vilet/shared-config";
import { recordPlatformEvent } from "../../lib/safe-events";

export async function requestMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    redirect("/login?error=invalid-email");
  const config = getPlatformConfig();
  if (config.authMode !== "supabase") {
    recordPlatformEvent("error", "auth.configuration.unavailable", {
      route: "/login",
    });
    redirect("/login?configuration=unavailable");
  }
  const client = await createPlatformServerClient();
  if (!client) {
    recordPlatformEvent("error", "auth.client.unavailable", {
      route: "/login",
    });
    redirect("/login?configuration=unavailable");
  }
  const appUrl = resolvePlatformAppUrl(config.appUrl, {
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
  });
  const { error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: new URL("/auth/callback", appUrl).href,
      shouldCreateUser: false,
    },
  });
  if (error) {
    const rateLimited =
      error.status === 429 || error.code === "over_email_send_rate_limit";
    recordPlatformEvent("warn", "auth.magic_link.request_failed", {
      reason: rateLimited ? "rate_limited" : "provider_rejected",
      route: "/login",
      status: error.status,
    });
    redirect(
      rateLimited
        ? "/login?error=rate-limited"
        : "/login?error=authentication-unavailable",
    );
  }
  recordPlatformEvent("info", "auth.magic_link.request_accepted", {
    route: "/login",
  });
  redirect("/login?sent=1");
}

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    redirect("/login?method=password&error=invalid-email");
  if (!password) redirect("/login?method=password&error=missing-password");

  const config = getPlatformConfig();
  if (config.authMode !== "supabase") {
    recordPlatformEvent("error", "auth.configuration.unavailable", {
      route: "/login",
    });
    redirect("/login?method=password&configuration=unavailable");
  }

  const client = await createPlatformServerClient();
  if (!client) redirect("/login?method=password&configuration=unavailable");

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    const rateLimited = error.status === 429;
    recordPlatformEvent("warn", "auth.password.sign_in_failed", {
      reason: rateLimited ? "rate_limited" : "invalid_credentials",
      route: "/login",
      status: error.status,
    });
    redirect(
      rateLimited
        ? "/login?method=password&error=rate-limited"
        : "/login?method=password&error=invalid-credentials",
    );
  }

  recordPlatformEvent("info", "auth.password.sign_in_accepted", {
    route: "/login",
  });
  redirect("/");
}
