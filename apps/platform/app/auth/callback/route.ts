import { NextResponse, type NextRequest } from "next/server";
import { createPlatformServerClient, getPlatformConfig } from "@vilet/auth";

export async function GET(request: NextRequest) {
  const config = getPlatformConfig();
  if (config.authMode !== "supabase")
    return NextResponse.redirect(
      new URL("/login?configuration=unavailable", request.url),
    );
  const code = request.nextUrl.searchParams.get("code");
  if (!code)
    return NextResponse.redirect(
      new URL("/login?error=invalid-callback", request.url),
    );
  const client = await createPlatformServerClient();
  const { error } = await client!.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(
    new URL(error ? "/login?error=invalid-callback" : "/", request.url),
  );
}
