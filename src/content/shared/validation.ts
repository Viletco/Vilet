import type { PublicationLifecycle } from "./types";

export interface DomainValidationIssue {
  readonly path: string;
  readonly message: string;
}

export function hasAuthoringMarkers(value: string) {
  return /\[|\]|lorem ipsum|coming soon|placeholder|foundation initialized/i.test(
    value,
  );
}

export function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function isPublishedAt(lifecycle: PublicationLifecycle, asOf: Date) {
  if (lifecycle.state === "published") return true;
  if (lifecycle.state === "draft") return false;
  const publishAt = new Date(lifecycle.publishAt);
  return !Number.isNaN(publishAt.valueOf()) && publishAt <= asOf;
}

export function findDuplicateValues(values: readonly string[]) {
  const seen = new Set<string>();
  return values.filter((value) => {
    const key = value.trim().toLowerCase();
    if (seen.has(key)) return true;
    seen.add(key);
    return false;
  });
}

export function assertDomainValid(
  name: string,
  issues: readonly DomainValidationIssue[],
) {
  if (issues.length === 0) return;
  throw new Error(
    `Invalid ${name} content:\n${issues.map((item) => `${item.path}: ${item.message}`).join("\n")}`,
  );
}
