import { NextResponse, type NextRequest } from "next/server";
import { createPlatformServerClient } from "@vilet/auth";

export async function POST(request: NextRequest) {
  const client = await createPlatformServerClient();
  if (client) await client.auth.signOut();
  return NextResponse.redirect(new URL("/login", request.url), 303);
}
