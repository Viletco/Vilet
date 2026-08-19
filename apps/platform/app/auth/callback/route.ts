import { NextResponse, type NextRequest } from "next/server";
import { createPlatformServerClient, getPlatformConfig } from "@vilet/auth";
import { recordPlatformEvent } from "../../../lib/safe-events";

export async function GET(request: NextRequest) {
  const config = getPlatformConfig();
  if (config.authMode !== "supabase") {
    recordPlatformEvent("error", "auth.configuration.unavailable", {
      route: "/auth/callback",
    });
    return NextResponse.redirect(
      new URL("/login?configuration=unavailable", request.url),
    );
  }
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    recordPlatformEvent("warn", "auth.callback.rejected", {
      reason: "missing_code",
      route: "/auth/callback",
    });
    return NextResponse.redirect(
      new URL("/login?error=missing-callback-code", request.url),
    );
  }
  const client = await createPlatformServerClient();
  if (!client) {
    recordPlatformEvent("error", "auth.client.unavailable", {
      route: "/auth/callback",
    });
    return NextResponse.redirect(
      new URL("/login?configuration=unavailable", request.url),
    );
  }
  const { error } = await client.auth.exchangeCodeForSession(code);
  recordPlatformEvent(error ? "warn" : "info", "auth.callback.completed", {
    reason: error ? "exchange_failed" : "session_established",
    route: "/auth/callback",
    status: error?.status,
  });
  return NextResponse.redirect(
    new URL(error ? "/login?error=invalid-callback" : "/", request.url),
  );
}
