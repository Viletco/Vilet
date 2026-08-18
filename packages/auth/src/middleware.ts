import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { validatePlatformEnvironment } from "@vilet/shared-config";

export async function refreshPlatformSession(request: NextRequest) {
  const config = validatePlatformEnvironment({
    PLATFORM_AUTH_MODE: process.env.PLATFORM_AUTH_MODE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  let response = NextResponse.next({ request });
  if (config.authMode !== "supabase") return response;

  const client = createServerClient(
    config.supabaseUrl.href,
    config.publishableKey,
    {
      cookieOptions: {
        path: "/",
        sameSite: "lax",
        secure: config.appUrl.protocol === "https:",
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
  await client.auth.getUser();
  return response;
}
