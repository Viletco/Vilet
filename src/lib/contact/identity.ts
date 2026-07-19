import "server-only";

import { createHash, randomUUID } from "node:crypto";

import type { ContactSubmission } from "./types";

export function deriveConnectionIdentifier(requestHeaders: Headers) {
  if (process.env.VERCEL === "1") {
    const value = requestHeaders
      .get("x-vercel-forwarded-for")
      ?.split(",")[0]
      ?.trim();
    if (value) return value;
  }
  return process.env.NODE_ENV === "production"
    ? "unavailable"
    : "local-development";
}
function hash(value: string, salt: string) {
  return createHash("sha256")
    .update(salt)
    .update("\0")
    .update(value)
    .digest("hex");
}
export function createAbuseKeys(
  connectionIdentifier: string,
  submission: ContactSubmission,
  salt: string,
) {
  const normalized = JSON.stringify({
    ...submission,
    email: submission.email.toLowerCase(),
    website: submission.website?.toLowerCase(),
  });
  return {
    connectionKey: hash(connectionIdentifier, salt),
    duplicateKey: hash(normalized, salt),
  };
}
export function createCorrelationId() {
  return randomUUID();
}
