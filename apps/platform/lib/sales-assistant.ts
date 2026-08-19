import {
  approvedPolicy,
  objections,
  salesServices,
  trainingModules,
} from "./partner-knowledge";

export interface SalesAssistantAnswer {
  answer: string;
  sources: readonly string[];
  escalationRequired: boolean;
  mode: "deterministic-staging";
}

export interface SalesAssistantProvider {
  answer(question: string): Promise<SalesAssistantAnswer>;
}

const unknown: SalesAssistantAnswer = {
  answer: `This requires Vilét owner approval. ${approvedPolicy.escalation}`,
  sources: ["Approved sales policy"],
  escalationRequired: true,
  mode: "deterministic-staging",
};

export const deterministicSalesAssistant: SalesAssistantProvider = {
  async answer(question) {
    const query = question.trim().toLocaleLowerCase();
    if (!query) return unknown;
    if (
      /price|cost|discount|commission|percentage|timeline|guarantee/u.test(
        query,
      )
    )
      return unknown;
    const objection = objections.find(([name]) =>
      query.includes(name.toLocaleLowerCase()),
    );
    if (objection)
      return {
        answer: `${objection[1]} Recommended approach: ${objection[2]}`,
        sources: ["Approved objection guide"],
        escalationRequired: false,
        mode: "deterministic-staging",
      };
    const service = salesServices.find((item) =>
      [item.name, item.slug, ...item.problems]
        .join(" ")
        .toLocaleLowerCase()
        .split(/\s+/u)
        .some((term) => term.length > 4 && query.includes(term)),
    );
    if (service)
      return {
        answer: `${service.name} is ${service.availability}. ${service.summary} Start by asking: ${service.questions[0] ?? "What business outcome matters most?"}`,
        sources: [`Service guide: ${service.name}`],
        escalationRequired: service.availability !== "available",
        mode: "deterministic-staging",
      };
    const trainingModule = trainingModules.find(([title]) =>
      query.includes(title.toLocaleLowerCase()),
    );
    if (trainingModule)
      return {
        answer: trainingModule[1],
        sources: [`Training: ${trainingModule[0]}`],
        escalationRequired: false,
        mode: "deterministic-staging",
      };
    return unknown;
  },
};
