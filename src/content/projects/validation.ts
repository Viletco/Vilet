import { services } from "../services";
import {
  assertDomainValid,
  findDuplicateValues,
  hasAuthoringMarkers,
  isHttpsUrl,
  type DomainValidationIssue,
} from "../shared";
import type { ProjectRecord } from "./types";

export function validateProjects(records: readonly ProjectRecord[]) {
  const issues: DomainValidationIssue[] = [];
  const projectIds = new Set(records.map((record) => record.id));
  const serviceIds = new Set(services.map((service) => service.id));
  for (const value of findDuplicateValues(records.map((x) => x.id)))
    issues.push({ path: value, message: "Duplicate project ID." });
  for (const value of findDuplicateValues(records.map((x) => x.slug)))
    issues.push({ path: value, message: "Duplicate project slug." });
  records.forEach((record, index) => {
    const path = `projects[${index}]`;
    const published = record.publication.state === "published";
    const publishable = record.publication.state !== "draft";
    if (record.featured && !published)
      issues.push({
        path: `${path}.featured`,
        message: "Featured projects must be published.",
      });
    if (
      publishable &&
      (!record.approval ||
        !record.heroMedia ||
        record.media.length === 0 ||
        !record.seo)
    )
      issues.push({
        path,
        message:
          "Published projects require approval, hero media, media, and SEO.",
      });
    if (
      publishable &&
      [
        record.title,
        record.safeClientLabel,
        record.summary,
        record.challenge,
        record.strategy,
        record.solution,
        record.outcome,
      ].some((value) => !value.trim() || hasAuthoringMarkers(value))
    )
      issues.push({
        path,
        message:
          "Published project content is incomplete or contains authoring markers.",
      });
    if (
      record.publication.state === "scheduled" &&
      Number.isNaN(new Date(record.publication.publishAt).valueOf())
    )
      issues.push({
        path: `${path}.publication.publishAt`,
        message: "Scheduled projects require a valid publication time.",
      });
    [...record.serviceIds, ...record.relatedServiceIds].forEach((id) => {
      if (!serviceIds.has(id))
        issues.push({
          path: `${path}.serviceIds`,
          message: `Unknown service reference: ${id}`,
        });
    });
    record.relatedProjectIds.forEach((id) => {
      if (!projectIds.has(id))
        issues.push({
          path: `${path}.relatedProjectIds`,
          message: `Unknown project reference: ${id}`,
        });
    });
    [
      ...record.media,
      ...record.gallery,
      ...(record.heroMedia ? [record.heroMedia] : []),
      ...(record.mobileMedia ? [record.mobileMedia] : []),
    ].forEach((media, mediaIndex) => {
      if (media.width <= 0 || media.height <= 0)
        issues.push({
          path: `${path}.media[${mediaIndex}]`,
          message: "Media requires intrinsic dimensions.",
        });
      if (!media.alt.trim())
        issues.push({
          path: `${path}.media[${mediaIndex}].alt`,
          message: "Project media requires useful alt text.",
        });
    });
    record.metrics.forEach((metric, metricIndex) => {
      if (
        !metric.unit.trim() ||
        !metric.context.trim() ||
        !metric.source.label.trim() ||
        !metric.approval.source.trim()
      )
        issues.push({
          path: `${path}.metrics[${metricIndex}]`,
          message:
            "Metrics require units, context, source evidence, and approval.",
        });
    });
    record.testimonials.forEach((item, itemIndex) => {
      if (
        !item.quote.trim() ||
        !item.person.trim() ||
        !item.approval.source.trim()
      )
        issues.push({
          path: `${path}.testimonials[${itemIndex}]`,
          message: "Testimonials require quote, attribution, and approval.",
        });
    });
    if (
      record.seo &&
      (!isHttpsUrl(record.seo.canonical) ||
        record.seo.canonical !== `https://vilet.co/work/${record.slug}` ||
        record.seo.title.length > 60 ||
        record.seo.description.length < 50 ||
        record.seo.description.length > 160)
    )
      issues.push({
        path: `${path}.seo`,
        message: "Project SEO metadata is invalid.",
      });
  });
  assertDomainValid("projects", issues);
  return records;
}
