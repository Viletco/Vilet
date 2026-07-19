import {
  assertDomainValid,
  findDuplicateValues,
  hasAuthoringMarkers,
  type DomainValidationIssue,
} from "../shared";
import type { AboutContent } from "./types";

export function validateAbout(content: AboutContent) {
  const issues: DomainValidationIssue[] = [];
  const values = [
    content.hero.eyebrow,
    content.hero.title,
    content.hero.body,
    content.philosophy.title,
    content.philosophy.body,
    ...content.principles,
    ...content.collaboration.flatMap((item) => [item.title, item.body]),
    ...content.technology.flatMap((item) => [item.title, item.body]),
    content.workingTogether.title,
    content.workingTogether.body,
    ...content.workingTogether.indicators,
    content.finalCta.title,
    content.finalCta.body,
  ];
  if (values.some((value) => !value.trim() || hasAuthoringMarkers(value)))
    issues.push({
      path: "about",
      message: "About content is incomplete or contains authoring markers.",
    });
  for (const value of findDuplicateValues(content.principles))
    issues.push({ path: value, message: "Duplicate About principle." });
  assertDomainValid("about", issues);
  return content;
}
