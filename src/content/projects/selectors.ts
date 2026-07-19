import { isPublishedAt } from "../shared";
import type { ProjectRecord, ProjectSummary } from "./types";

export function getPublishedProjects(
  records: readonly ProjectRecord[],
  asOf = new Date(),
) {
  return records.filter((record) => isPublishedAt(record.publication, asOf));
}
export function getFeaturedProjects(
  records: readonly ProjectRecord[],
  asOf = new Date(),
) {
  return getPublishedProjects(records, asOf).filter(
    (record) => record.featured,
  );
}
export function getProjectBySlug(
  records: readonly ProjectRecord[],
  slug: string,
  asOf = new Date(),
) {
  return getPublishedProjects(records, asOf).find(
    (record) => record.slug === slug,
  );
}
export function getRelatedProjects(
  records: readonly ProjectRecord[],
  project: ProjectRecord,
  asOf = new Date(),
) {
  const published = getPublishedProjects(records, asOf);
  return project.relatedProjectIds
    .map((id) => published.find((record) => record.id === id))
    .filter((record): record is ProjectRecord => Boolean(record));
}
export function getProjectNavigation(
  records: readonly ProjectRecord[],
  project: ProjectRecord,
  asOf = new Date(),
) {
  const published = getPublishedProjects(records, asOf);
  const index = published.findIndex((record) => record.id === project.id);
  return {
    previous: index > 0 ? published[index - 1] : undefined,
    next:
      index >= 0 && index < published.length - 1
        ? published[index + 1]
        : undefined,
  };
}
export function toProjectSummary(project: ProjectRecord): ProjectSummary {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    safeClientLabel: project.safeClientLabel,
    projectType: project.projectType,
    industry: project.industry,
    summary: project.summary,
    serviceIds: project.serviceIds,
    heroMedia: project.heroMedia,
  };
}
