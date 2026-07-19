import { isPublishedAt } from "../shared";
import type { FaqRecord } from "./types";
export function getVisibleFaqs(
  records: readonly FaqRecord[],
  asOf = new Date(),
) {
  return records.filter((record) => isPublishedAt(record.publication, asOf));
}
export function getFeaturedFaqs(
  records: readonly FaqRecord[],
  asOf = new Date(),
) {
  return getVisibleFaqs(records, asOf).filter((record) => record.featured);
}
export function getFaqsBySlugs(
  records: readonly FaqRecord[],
  slugs: readonly string[],
  asOf = new Date(),
) {
  const visible = getVisibleFaqs(records, asOf);
  return slugs
    .map((slug) => visible.find((record) => record.slug === slug))
    .filter((record): record is FaqRecord => Boolean(record));
}
