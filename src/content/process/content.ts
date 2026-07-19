import { homepageContent } from "../homepage";
import type { ProcessRecord } from "./types";

const processDetails = [
  {
    detailedDescription:
      "The process begins by understanding the business, the audience, the current situation, and the problem worth solving.",
    whatHappens: [
      "Review goals, constraints, and priorities",
      "Understand the audience and key user actions",
      "Evaluate existing websites, workflows, or tools",
      "Identify assumptions and unanswered questions",
      "Clarify what a useful outcome looks like",
    ],
    clientInvolvement:
      "Provide business context, existing materials, access to relevant systems, and clear decision-making ownership.",
    output:
      "A shared understanding of the problem, project direction, and information required for the next stage.",
  },
  {
    detailedDescription:
      "Discovery is translated into a focused structure, scope, and implementation plan before significant production work begins.",
    whatHappens: [
      "Define information architecture or workflow structure",
      "Prioritize features and requirements",
      "Establish content needs",
      "Select the technical approach",
      "Clarify responsibilities and review points",
      "Identify risks, dependencies, and exclusions",
    ],
    clientInvolvement:
      "Review priorities, approve the direction, provide required content, and resolve open business decisions.",
    output:
      "A practical project plan that aligns the proposed solution with the business goals and available scope.",
  },
  {
    detailedDescription:
      "Design and development move through focused implementation, review, and refinement rather than being treated as isolated handoffs.",
    whatHappens: [
      "Create responsive interfaces",
      "Implement approved features",
      "Integrate content and systems",
      "Review usability and accessibility",
      "Validate performance and technical behavior",
      "Refine based on structured feedback",
    ],
    clientInvolvement:
      "Provide timely, consolidated feedback and verify that the evolving solution reflects the approved direction.",
    output:
      "A working digital experience or system that has been reviewed against the agreed requirements.",
  },
  {
    detailedDescription:
      "The final stage prepares the work for production, verifies critical behavior, and establishes what happens after release.",
    whatHappens: [
      "Complete final quality checks",
      "Prepare production configuration",
      "Validate content, links, and integrations",
      "Launch the approved solution",
      "Provide documentation or handoff",
      "Define maintenance or continued iteration where needed",
    ],
    clientInvolvement:
      "Approve the final release, confirm operational ownership, and identify immediate post-launch priorities.",
    output:
      "A production-ready release with a clear path for support, maintenance, and future improvement.",
  },
] as const;

export const processRecords = homepageContent.process.steps.map(
  (step, index) => ({
    ...processDetails[index],
    id: step.id,
    slug: step.title.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-"),
    title: step.title === "Launch & Evolve" ? "Launch and evolve" : step.title,
    summary: step.summary,
    deliverables: step.deliverables,
    icon: step.icon,
    order: index + 1,
    relatedServiceIds: [],
    publication: { state: "published" as const },
  }),
) satisfies readonly ProcessRecord[];
