import type { NextConfig } from "next";

import { homepageContent } from "./src/content";
import { validateContactEnvironment } from "./src/lib/contact/config-core";

// Importing validated content makes malformed authoring data fail the build.
void homepageContent;
validateContactEnvironment({
  CONTACT_DELIVERY_MODE: process.env.CONTACT_DELIVERY_MODE,
  CONTACT_RATE_LIMIT_MODE: process.env.CONTACT_RATE_LIMIT_MODE,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CONTACT_FORM_RECIPIENT: process.env.CONTACT_FORM_RECIPIENT,
  CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  CONTACT_REPLY_TO_MODE: process.env.CONTACT_REPLY_TO_MODE,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  CONTACT_RATE_LIMIT_SALT: process.env.CONTACT_RATE_LIMIT_SALT,
});
const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://vilet.co";
const parsedSiteUrl = new URL(configuredSiteUrl);
if (
  parsedSiteUrl.protocol !== "https:" ||
  parsedSiteUrl.origin !== "https://vilet.co" ||
  parsedSiteUrl.pathname !== "/"
)
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must be the approved origin https://vilet.co.",
  );

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      ...(process.env.NODE_ENV === "production"
        ? ["upgrade-insecure-requests"]
        : []),
    ].join("; "),
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ]
    : []),
] as const;

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: [...securityHeaders] }];
  },
  experimental: {
    serverActions: { bodySizeLimit: "64kb" },
  },
};

export default nextConfig;
