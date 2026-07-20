import rawLaunchDecisions from "../../config/launch-decisions.json";

export const launchDecisionStatuses = [
  "unresolved",
  "approved",
  "rejected",
  "deferred",
  "not-required",
] as const;
export const launchDecisionCategories = [
  "owner-decision",
  "legal-approval",
  "brand-approval",
  "external-account",
  "credential",
  "infrastructure",
  "domain-dns",
  "search-seo",
  "contact-delivery",
  "rate-limiting",
  "content",
  "portfolio-evidence",
  "trust-evidence",
  "optional-post-launch",
] as const;

export type LaunchDecisionStatus = (typeof launchDecisionStatuses)[number];
export type LaunchDecisionCategory = (typeof launchDecisionCategories)[number];

export interface LaunchDecision {
  id: string;
  label: string;
  category: LaunchDecisionCategory;
  status: LaunchDecisionStatus;
  requiredForLaunch: boolean;
  owner: string;
  selection: string | null;
}

const expectedDecisionIds = [
  "primary-production-hostname",
  "www-redirect-behavior",
  "vercel-production-approval",
  "contact-delivery-provider",
  "contact-recipient",
  "contact-sender",
  "contact-reply-to-behavior",
  "shared-rate-limit-provider",
  "privacy-policy-approval",
  "terms-page-requirement",
  "final-favicon-approval",
  "final-social-card-approval",
  "footer-contact-destination",
  "social-profile-destinations",
  "analytics-decision",
  "search-console-decision",
  "portfolio-launch-requirement",
  "trust-evidence-launch-requirement",
  "final-content-review",
  "public-indexing-authorization",
  "production-launch-authorization",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIncluded<T extends string>(
  values: readonly T[],
  value: unknown,
): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function validateLaunchDecisions(
  value: unknown,
): readonly LaunchDecision[] {
  if (!Array.isArray(value))
    throw new Error("Launch decision registry must be an array.");
  const ids = new Set<string>();
  const decisions = value.map((candidate, index): LaunchDecision => {
    if (!isRecord(candidate))
      throw new Error(`Launch decision at index ${index} must be an object.`);
    const { category, id, label, owner, requiredForLaunch, selection, status } =
      candidate;
    if (typeof id !== "string" || id.trim() === "" || ids.has(id))
      throw new Error(
        `Launch decision at index ${index} has an invalid or duplicate id.`,
      );
    if (typeof label !== "string" || label.trim() === "")
      throw new Error(`Launch decision '${id}' must have a label.`);
    if (typeof owner !== "string" || owner.trim() === "")
      throw new Error(`Launch decision '${id}' must have an owner.`);
    if (!isIncluded(launchDecisionCategories, category))
      throw new Error(`Launch decision '${id}' has an invalid category.`);
    if (!isIncluded(launchDecisionStatuses, status))
      throw new Error(`Launch decision '${id}' has an invalid status.`);
    if (typeof requiredForLaunch !== "boolean")
      throw new Error(
        `Launch decision '${id}' must declare requiredForLaunch.`,
      );
    if (selection !== null && typeof selection !== "string")
      throw new Error(`Launch decision '${id}' has an invalid selection.`);
    ids.add(id);
    return { category, id, label, owner, requiredForLaunch, selection, status };
  });
  const missingIds = expectedDecisionIds.filter((id) => !ids.has(id));
  const unexpectedIds = [...ids].filter(
    (id) =>
      !expectedDecisionIds.includes(id as (typeof expectedDecisionIds)[number]),
  );
  if (missingIds.length > 0 || unexpectedIds.length > 0)
    throw new Error(
      `Launch decision registry ids do not match the expected set (missing: ${missingIds.join(", ") || "none"}; unexpected: ${unexpectedIds.join(", ") || "none"}).`,
    );
  return Object.freeze(decisions);
}

export const launchDecisions = validateLaunchDecisions(rawLaunchDecisions);
export const blockingLaunchDecisions = launchDecisions.filter(
  ({ requiredForLaunch, status }) =>
    requiredForLaunch && status !== "approved" && status !== "not-required",
);
