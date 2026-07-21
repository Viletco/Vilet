import "server-only";
import {
  aboutContent,
  faqs,
  getPublishedProjects,
  globalSettings,
  processRecords,
  projects,
  services,
} from "@/content";

export function formatApprovedKnowledge() {
  const publishedServices = services
    .filter((item) => item.publication.state === "published")
    .map((item) => ({
      id: item.id,
      title: item.title,
      summary: item.shortSummary,
      suitedFor: item.bestSuitedFor,
      areas: item.typicalEngagementAreas,
    }));
  const publishedFaqs = faqs
    .filter((item) => item.publication.state === "published")
    .map(({ question, answer }) => ({ question, answer }));
  return JSON.stringify({
    brand: {
      name: globalSettings.brandName,
      description: globalSettings.businessDescription,
      tagline: globalSettings.tagline,
    },
    services: publishedServices,
    process: processRecords.map(({ title, summary, output }) => ({
      title,
      summary,
      output,
    })),
    about: {
      philosophy: aboutContent.philosophy,
      workingTogether: aboutContent.workingTogether,
    },
    faq: publishedFaqs,
    workEvidence:
      getPublishedProjects(projects).length > 0
        ? "Published project records exist."
        : "No published projects are currently presented; do not claim completed client work.",
    contact:
      "The public Contact form is the review handoff. Delivery may be disabled and must never be claimed unless its provider confirms acceptance.",
  });
}
