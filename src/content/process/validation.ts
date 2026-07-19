import {
  assertDomainValid,
  findDuplicateValues,
  hasAuthoringMarkers,
  type DomainValidationIssue,
} from "../shared";
import { isIconName } from "../icons";
import type { ProcessRecord } from "./types";

export function validateProcess(records: readonly ProcessRecord[]) {
  const issues: DomainValidationIssue[] = [];
  for (const value of findDuplicateValues(records.map((item) => item.id)))
    issues.push({ path: value, message: "Duplicate process ID." });
  for (const value of findDuplicateValues(records.map((item) => item.slug)))
    issues.push({ path: value, message: "Duplicate process slug." });
  records.forEach((record, index) => {
    if (!isIconName(record.icon))
      issues.push({
        path: `process[${index}].icon`,
        message: "Unknown icon.",
      });
    if (
      record.publication.state !== "draft" &&
      [
        record.title,
        record.summary,
        record.detailedDescription,
        record.clientInvolvement,
        record.output,
        ...record.deliverables,
        ...record.whatHappens,
      ].some(hasAuthoringMarkers)
    )
      issues.push({
        path: `process[${index}]`,
        message: "Visible process content contains authoring markers.",
      });
  });
  assertDomainValid("process", issues);
  return records;
}
