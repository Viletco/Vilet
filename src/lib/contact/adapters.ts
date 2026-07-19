import "server-only";

import type { ContactConfig } from "./config-core";
import type {
  ContactAbuseStore,
  ContactProvider,
  ContactSubmission,
} from "./types";

export const CONTACT_LIMIT = 5;
export const CONTACT_WINDOW_SECONDS = 15 * 60;
export const DUPLICATE_WINDOW_SECONDS = 5 * 60;

export const disabledContactProvider: ContactProvider = {
  type: "disabled",
  async submit() {
    return { delivery: "not-configured" };
  },
};

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
}
function lines(submission: ContactSubmission, serviceLabel: string) {
  return [
    ["Name", submission.name],
    ["Company", submission.company],
    ["Email", submission.email],
    ["Website", submission.website || "Not provided"],
    ["Service", serviceLabel],
    ["Project summary", submission.projectSummary],
    ["Goals", submission.goals],
    ["Budget range", submission.budgetRange || "Not specified"],
    ["Timeline", submission.timeline || "Not specified"],
    ["Preferred contact method", submission.preferredContactMethod],
  ] as const;
}

export function createResendContactProvider(
  config: Extract<ContactConfig["delivery"], { mode: "resend" }>,
  request: typeof fetch = fetch,
): ContactProvider {
  return {
    type: "resend",
    async submit(submission, context) {
      const content = lines(submission, context.serviceLabel);
      try {
        const response = await request("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: config.from,
            to: [config.recipient],
            reply_to: submission.email,
            subject: `New Vilét project inquiry — ${context.serviceLabel}`,
            text: content
              .map(([label, value]) => `${label}:\n${value}`)
              .join("\n\n"),
            html: `<main><h1>New Vilét project inquiry</h1>${content
              .map(
                ([label, value]) =>
                  `<section><h2>${escapeHtml(label)}</h2><p>${escapeHtml(value).replace(/\n/g, "<br>")}</p></section>`,
              )
              .join("")}</main>`,
          }),
          signal: AbortSignal.timeout(10_000),
        });
        return response.ok
          ? { delivery: "delivered" }
          : { delivery: "provider-error" };
      } catch {
        return { delivery: "provider-error" };
      }
    },
  };
}

const attempts = new Map<string, number[]>();
const duplicates = new Map<string, number>();
export const memoryContactAbuseStore: ContactAbuseStore = {
  type: "memory",
  async check(connectionKey, duplicateKey) {
    const now = Date.now();
    const duplicateUntil = duplicates.get(duplicateKey) ?? 0;
    if (duplicateUntil > now) return { allowed: false, duplicate: true };
    const windowStart = now - CONTACT_WINDOW_SECONDS * 1000;
    const recent = (attempts.get(connectionKey) ?? []).filter(
      (value) => value > windowStart,
    );
    if (recent.length >= CONTACT_LIMIT)
      return {
        allowed: false,
        duplicate: false,
        retryAfterSeconds: Math.ceil(
          (recent[0] + CONTACT_WINDOW_SECONDS * 1000 - now) / 1000,
        ),
      };
    recent.push(now);
    attempts.set(connectionKey, recent);
    duplicates.set(duplicateKey, now + DUPLICATE_WINDOW_SECONDS * 1000);
    return { allowed: true, duplicate: false };
  },
};

export function createUpstashContactAbuseStore(
  config: Extract<ContactConfig["rateLimit"], { mode: "upstash" }>,
  request: typeof fetch = fetch,
): ContactAbuseStore {
  async function command(parts: readonly (string | number)[]) {
    const response = await request(config.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parts),
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error("Shared abuse-control request failed.");
    return (await response.json()) as {
      readonly result?: number | string | null;
    };
  }
  return {
    type: "upstash",
    async check(connectionKey, duplicateKey) {
      const duplicate = await command([
        "SET",
        `contact:duplicate:${duplicateKey}`,
        "1",
        "EX",
        DUPLICATE_WINDOW_SECONDS,
        "NX",
      ]);
      if (duplicate.result !== "OK") return { allowed: false, duplicate: true };
      const window = Math.floor(Date.now() / (CONTACT_WINDOW_SECONDS * 1000));
      const rateKey = `contact:rate:${connectionKey}:${window}`;
      const count = Number((await command(["INCR", rateKey])).result);
      if (count === 1)
        await command(["EXPIRE", rateKey, CONTACT_WINDOW_SECONDS]);
      return {
        allowed: count <= CONTACT_LIMIT,
        duplicate: false,
        retryAfterSeconds:
          count > CONTACT_LIMIT ? CONTACT_WINDOW_SECONDS : undefined,
      };
    },
  };
}

export function createContactProvider(config: ContactConfig): ContactProvider {
  return config.delivery.mode === "resend"
    ? createResendContactProvider(config.delivery)
    : disabledContactProvider;
}
export function createContactAbuseStore(
  config: ContactConfig,
): ContactAbuseStore {
  return config.rateLimit.mode === "upstash"
    ? createUpstashContactAbuseStore(config.rateLimit)
    : memoryContactAbuseStore;
}
