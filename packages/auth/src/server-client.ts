import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getPlatformConfig } from "./config";
import { applyPlatformSessionCookiePolicy } from "./session-cookies";

export async function createPlatformServerClient() {
  const config = getPlatformConfig();
  if (config.authMode !== "supabase") return null;
  const cookieStore = await cookies();

  return createServerClient(config.supabaseUrl.href, config.publishableKey, {
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure: config.appUrl.protocol === "https:",
    },
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(values) {
        try {
          applyPlatformSessionCookiePolicy(values).forEach(
            ({ name, value, options }) => cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot write cookies. The platform proxy refreshes sessions.
        }
      },
    },
  });
}
