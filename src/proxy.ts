import { type NextRequest, NextResponse } from "next/server";

const VERCEL_PREVIEW_HOST_SUFFIX = ".vercel.app";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.hostname.endsWith(VERCEL_PREVIEW_HOST_SUFFIX)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}
