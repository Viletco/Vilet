import {
  assertDomainValid,
  isHttpsUrl,
  type DomainValidationIssue,
} from "../shared";
import type { GlobalSettings } from "./types";

export function validateSettings(settings: GlobalSettings) {
  const issues: DomainValidationIssue[] = [];
  if (!settings.brandName.trim())
    issues.push({ path: "brandName", message: "Brand name is required." });
  if (!isHttpsUrl(`https://${settings.domain}`))
    issues.push({ path: "domain", message: "Domain is invalid." });
  settings.socialProfiles.forEach((item, index) => {
    if (!isHttpsUrl(item.url))
      issues.push({
        path: `socialProfiles[${index}].url`,
        message: "Social URLs must use HTTPS.",
      });
  });
  assertDomainValid("global settings", issues);
  return settings;
}
