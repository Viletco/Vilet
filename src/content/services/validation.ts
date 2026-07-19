import {
  assertDomainValid,
  findDuplicateValues,
  hasAuthoringMarkers,
  type DomainValidationIssue,
} from "../shared";
import { isIconName } from "../icons";
import type { ServiceRecord } from "./types";

export function validateServices(records: readonly ServiceRecord[]) {
  const issues: DomainValidationIssue[] = [];
  for (const value of findDuplicateValues(records.map((x) => x.id)))
    issues.push({ path: value, message: "Duplicate service ID." });
  for (const value of findDuplicateValues(records.map((x) => x.slug)))
    issues.push({ path: value, message: "Duplicate service slug." });
  const ids = new Set(records.map((x) => x.id));
  records.forEach((record, index) => {
    if (!isIconName(record.icon))
      issues.push({
        path: `services[${index}].icon`,
        message: "Unknown icon.",
      });
    if (
      record.publication.state === "published" &&
      [
        record.title,
        record.shortSummary,
        record.detailedSummary,
        record.outcomeStatement,
        ...record.features,
        ...record.bestSuitedFor,
        ...record.typicalEngagementAreas,
      ].some(hasAuthoringMarkers)
    )
      issues.push({
        path: `services[${index}]`,
        message: "Published service contains authoring markers.",
      });
    record.relatedServiceIds.forEach((id) => {
      if (!ids.has(id))
        issues.push({
          path: `services[${index}].relatedServiceIds`,
          message: `Unknown service reference: ${id}`,
        });
    });
  });
  assertDomainValid("services", issues);
  return records;
}
