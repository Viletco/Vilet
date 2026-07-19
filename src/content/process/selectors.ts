import { isPublishedAt } from "../shared";
import type { ProcessRecord } from "./types";

export function getPublishedProcess(
  records: readonly ProcessRecord[],
  asOf = new Date(),
) {
  return records
    .filter((record) => isPublishedAt(record.publication, asOf))
    .toSorted((a, b) => a.order - b.order);
}
