import { type NextRequest, NextResponse } from "next/server";

const VERCEL_PREVIEW_HOST_SUFFIX = ".vercel.app";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.hostname.endsWith(VERCEL_PREVIEW_HOST_SUFFIX)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

// Static assets and metadata do not need hostname-based indexing protection.
// Preview builds still receive the build-level X-Robots-Tag header.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon|opengraph-image|twitter-image|manifest.webmanifest|robots.txt|sitemap.xml).*)",
  ],
};
