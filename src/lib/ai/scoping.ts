export const projectCategories = [
  "website",
  "website-redesign",
  "automation",
  "custom-software",
  "ongoing-support",
  "not-sure",
] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export interface ProjectScopeInput {
  readonly category: ProjectCategory;
  readonly businessType: string;
  readonly problem: string;
  readonly outcome: string;
  readonly users?: string;
  readonly integrations?: string;
  readonly contentReadiness?: string;
}

const serviceByCategory: Record<ProjectCategory, string> = {
  website: "Web Design & Development",
  "website-redesign": "Web Design & Development",
  automation: "AI & Business Automation",
  "custom-software": "Custom Software",
  "ongoing-support": "Ongoing Digital Support",
  "not-sure": "Requires discovery",
};

export function createProjectBrief(input: ProjectScopeInput) {
  return {
    label: "Preliminary project brief — requires Vilét review.",
    projectType: input.category,
    businessObjective: input.outcome.trim(),
    keyRequirements: [input.problem, input.users, input.integrations]
      .filter(Boolean)
      .map((item) => item!.trim()),
    recommendedService: serviceByCategory[input.category],
    importantUnknowns: [
      !input.contentReadiness && "Content readiness",
      !input.integrations && "Required integrations",
      !input.users && "Intended users",
    ].filter(Boolean) as string[],
    suggestedNextStep:
      "Review and edit this summary before sharing it through the Contact page.",
  };
}

export function formatProjectBrief(
  brief: ReturnType<typeof createProjectBrief>,
) {
  return [
    brief.label,
    `Project type: ${brief.projectType}`,
    `Business objective: ${brief.businessObjective}`,
    `Key requirements: ${brief.keyRequirements.join("; ") || "To be clarified"}`,
    `Recommended service: ${brief.recommendedService}`,
    `Important unknowns: ${brief.importantUnknowns.join("; ") || "None recorded"}`,
    `Next step: ${brief.suggestedNextStep}`,
  ].join("\n\n");
}

export interface ContactHandoff {
  readonly projectSummary: string;
  readonly goals: string;
}

export function serializeContactHandoff(summary: string) {
  const handoff: ContactHandoff = {
    projectSummary: summary.trim().slice(0, 2000),
    goals:
      "Review the preliminary discovery summary and clarify the appropriate next step.",
  };
  return JSON.stringify(handoff);
}

export function parseContactHandoff(value: string): ContactHandoff | null {
  try {
    const parsed = JSON.parse(value) as Partial<ContactHandoff>;
    if (
      typeof parsed.projectSummary !== "string" ||
      !parsed.projectSummary.trim() ||
      parsed.projectSummary.length > 2000 ||
      typeof parsed.goals !== "string" ||
      parsed.goals.length > 1500
    )
      return null;
    return {
      projectSummary: parsed.projectSummary,
      goals: parsed.goals,
    };
  } catch {
    return null;
  }
}

export function createGrowthAdvice(input: {
  challenge: string;
  repetitiveProcess: string;
  websiteRole: string;
  priority: string;
}) {
  const combined =
    `${input.challenge} ${input.repetitiveProcess}`.toLowerCase();
  const automationFit =
    /(manual|repeat|copy|routing|report|document|schedule)/.test(combined);
  return {
    label: "Preliminary opportunity — requires Vilét review.",
    currentChallenge: input.challenge.trim(),
    possibleImprovement: automationFit
      ? "Map the repeatable workflow before deciding whether rules-based automation or an AI-assisted tool is appropriate."
      : "Clarify the customer journey and improve the simplest website or process bottleneck first.",
    suggestedService: automationFit
      ? "AI & Business Automation"
      : "Web Design & Development",
    complexity: automationFit ? ("medium" as const) : ("low" as const),
    dependencies: [
      input.repetitiveProcess.trim(),
      input.websiteRole.trim(),
    ].filter(Boolean),
    nextStep: `Use discovery to validate whether this supports the stated priority: ${input.priority.trim()}.`,
  };
}
