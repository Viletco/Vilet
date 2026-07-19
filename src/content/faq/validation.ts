import {
  assertDomainValid,
  findDuplicateValues,
  hasAuthoringMarkers,
  type DomainValidationIssue,
} from "../shared";
import type { FaqRecord } from "./types";

export function validateFaqs(records: readonly FaqRecord[]) {
  const issues: DomainValidationIssue[] = [];
  for (const value of findDuplicateValues(records.map((item) => item.id)))
    issues.push({ path: value, message: "Duplicate FAQ ID." });
  for (const value of findDuplicateValues(records.map((item) => item.slug)))
    issues.push({ path: value, message: "Duplicate FAQ slug." });
  records.forEach((record, index) => {
    if (
      record.publication.state !== "draft" &&
      (hasAuthoringMarkers(record.question) ||
        (record.answer.format !== "rich-text" &&
          hasAuthoringMarkers(record.answer.value)))
    )
      issues.push({
        path: `faqs[${index}]`,
        message: "Visible FAQ contains authoring markers.",
      });
  });
  assertDomainValid("FAQs", issues);
  return records;
}
