"use server";

import { redirect } from "next/navigation";
import { createPlatformServerClient, getPlatformConfig } from "@vilet/auth";
import { resolvePlatformAppUrl } from "@vilet/shared-config";

export async function requestMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    redirect("/login?error=invalid-email");
  const config = getPlatformConfig();
  if (config.authMode !== "supabase")
    redirect("/login?configuration=unavailable");
  const client = await createPlatformServerClient();
  if (!client) redirect("/login?configuration=unavailable");
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
  if (error) redirect("/login?error=authentication-unavailable");
  redirect("/login?sent=1");
}
