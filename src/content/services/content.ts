import { homepageContent } from "../homepage";
import type { ServiceRecord } from "./types";

const serviceDetails = {
  "web-design-development": {
    detailedSummary:
      "Vilét creates custom websites that communicate clearly, feel refined across devices, and give visitors a straightforward path toward the next action.",
    bestSuitedFor: [
      "Businesses with an outdated or inconsistent website",
      "New companies establishing a professional digital presence",
      "Service businesses that need clearer messaging and stronger mobile usability",
      "Organizations preparing to add new services, locations, or digital capabilities",
    ],
    typicalEngagementAreas: [
      "Discovery and website strategy",
      "Information architecture",
      "Messaging and content hierarchy",
      "Responsive interface design",
      "Front-end development",
      "Accessibility and performance foundations",
      "Launch preparation",
      "Ongoing iteration",
    ],
    outcomeStatement:
      "A polished, maintainable website designed around the business, its customers, and its next stage of growth.",
  },
  "ai-business-automation": {
    detailedSummary:
      "Vilét evaluates repetitive workflows and disconnected tools, then designs practical automation that reduces unnecessary manual effort and improves how information moves through the business.",
    bestSuitedFor: [
      "Teams repeating the same administrative tasks",
      "Businesses manually transferring data between tools",
      "Companies responding to leads or requests through inconsistent processes",
      "Operators who need clearer internal visibility",
    ],
    typicalEngagementAreas: [
      "Workflow analysis",
      "AI-assisted internal tools",
      "Lead-routing and communication workflows",
      "Form and data automation",
      "System integrations",
      "Reporting and internal dashboards",
      "Documentation and handoff",
    ],
    outcomeStatement:
      "A more connected workflow designed to reduce friction and support more consistent execution.",
  },
  "custom-software": {
    detailedSummary:
      "Vilét builds focused web applications and digital tools for businesses whose requirements no longer fit a generic off-the-shelf product.",
    bestSuitedFor: [
      "Businesses relying on spreadsheets or disconnected tools for critical workflows",
      "Teams that need a custom internal application",
      "Founders validating a software concept",
      "Organizations requiring a client or employee portal",
    ],
    typicalEngagementAreas: [
      "Product discovery",
      "Requirements and feature definition",
      "Internal applications",
      "Client portals",
      "Employee tools",
      "Dashboards",
      "Product prototypes",
      "Scalable technical foundations",
    ],
    outcomeStatement:
      "A purpose-built digital tool shaped around the real workflow rather than forcing the workflow into an unsuitable product.",
  },
  "ongoing-digital-support": {
    detailedSummary:
      "Vilét provides continued technical care after launch so websites and digital systems can remain current, stable, and useful as the business changes.",
    bestSuitedFor: [
      "Businesses without an internal web or software team",
      "Projects that require regular updates",
      "Organizations planning continued feature development",
      "Clients who want a consistent technical partner after launch",
    ],
    typicalEngagementAreas: [
      "Content and design updates",
      "Website maintenance",
      "Technical troubleshooting",
      "Performance review",
      "Dependency and platform updates",
      "Feature refinement",
      "Continued product development",
    ],
    outcomeStatement:
      "A clear support arrangement that helps the digital foundation continue evolving after the initial launch.",
  },
} as const;

export const services = homepageContent.services.items.map((service) => ({
  ...serviceDetails[service.slug as keyof typeof serviceDetails],
  id: service.id,
  slug: service.slug,
  title: service.title,
  shortSummary: service.summary,
  icon: service.icon,
  category: service.tags?.[0] ?? "digital-services",
  features: service.features,
  outcomes: [],
  cta: service.cta,
  relatedServiceIds: [],
  relatedProjectIds: [],
  publication: { state: "published" as const },
})) satisfies readonly ServiceRecord[];
