import { isPublishedAt } from "../shared";
import type { ServiceRecord } from "./types";

export function getPublishedServices(
  records: readonly ServiceRecord[],
  asOf = new Date(),
) {
  return records.filter((record) => isPublishedAt(record.publication, asOf));
}
export function getServiceById(records: readonly ServiceRecord[], id: string) {
  return records.find((record) => record.id === id);
}
export function getRelatedServices(
  records: readonly ServiceRecord[],
  service: ServiceRecord,
) {
  return service.relatedServiceIds
    .map((id) => getServiceById(records, id))
    .filter((item): item is ServiceRecord => Boolean(item));
}
