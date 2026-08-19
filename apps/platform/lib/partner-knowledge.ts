export type Availability = "available" | "internal" | "beta" | "future";

export interface SalesServiceGuide {
  slug: string;
  name: string;
  availability: Availability;
  summary: string;
  problems: readonly string[];
  idealCustomer: string;
  buyingSignals: readonly string[];
  questions: readonly string[];
  outcomes: readonly string[];
  objections: readonly string[];
  approvedClaims: readonly string[];
  forbiddenClaims: readonly string[];
}

export const salesServices: readonly SalesServiceGuide[] = [
  {
    slug: "websites",
    name: "Modern websites",
    availability: "available",
    summary:
      "Strategic, accessible websites built around credibility, clarity, and useful customer actions.",
    problems: [
      "Weak or outdated digital presence",
      "Confusing customer journeys",
      "Poor lead capture",
    ],
    idealCustomer:
      "A business whose current website no longer supports how it sells or serves customers.",
    buyingSignals: [
      "Outdated content or design",
      "No clear next step",
      "A new service, location, or market",
    ],
    questions: [
      "What should a visitor do next?",
      "Where do inquiries get lost?",
      "What has changed since the current site launched?",
    ],
    outcomes: [
      "Stronger credibility",
      "Clearer inquiries",
      "Easier customer journeys",
    ],
    objections: ["We already have a website", "Someone can do it cheaper"],
    approvedClaims: [
      "Vilét builds around business goals and customer actions",
      "Scope is defined after discovery",
    ],
    forbiddenClaims: [
      "Guaranteed rankings or revenue",
      "A fixed timeline or price before review",
    ],
  },
  {
    slug: "automation",
    name: "AI and business automation",
    availability: "available",
    summary:
      "Practical workflows that reduce repetitive work and connect information across tools.",
    problems: ["Repeated data entry", "Slow follow-up", "Disconnected systems"],
    idealCustomer:
      "A team with a clear, repeated workflow that consumes time or creates avoidable errors.",
    buyingSignals: [
      "Spreadsheet handoffs",
      "Copy-and-paste work",
      "Missed follow-ups",
    ],
    questions: [
      "Which task repeats most often?",
      "Where does information wait?",
      "Which decisions still require a person?",
    ],
    outcomes: [
      "Less manual administration",
      "Faster handoffs",
      "More consistent processes",
    ],
    objections: ["AI is not relevant", "Automation sounds risky"],
    approvedClaims: [
      "Vilét evaluates the workflow before selecting technology",
      "Human review can remain in sensitive steps",
    ],
    forbiddenClaims: [
      "AI will replace the team",
      "Every process can or should be automated",
    ],
  },
  {
    slug: "software",
    name: "Custom software",
    availability: "available",
    summary:
      "Purpose-built applications, portals, and internal tools for needs that off-the-shelf products do not fit.",
    problems: [
      "Tooling gaps",
      "Fragmented operations",
      "A unique customer or employee workflow",
    ],
    idealCustomer:
      "A business with a validated operational need that generic software cannot serve cleanly.",
    buyingSignals: [
      "Workarounds across many tools",
      "A spreadsheet has become business-critical",
      "Customers need self-service",
    ],
    questions: [
      "Who uses the process?",
      "What must the system make easier?",
      "What happens if nothing changes?",
    ],
    outcomes: [
      "A workflow matched to the business",
      "Reduced operational friction",
      "A maintainable foundation",
    ],
    objections: [
      "Can we buy an existing tool?",
      "Custom software is too complex",
    ],
    approvedClaims: ["Vilét validates the problem and scope before building"],
    forbiddenClaims: [
      "Unlimited scope",
      "Guaranteed integration with an unreviewed system",
    ],
  },
  {
    slug: "identity",
    name: "Branding and digital systems",
    availability: "available",
    summary:
      "Focused identity and digital foundations that make a business easier to recognize and trust.",
    problems: [
      "Inconsistent presentation",
      "Unclear positioning",
      "Disconnected customer touchpoints",
    ],
    idealCustomer:
      "A business whose identity no longer reflects its quality, direction, or market.",
    buyingSignals: [
      "New company or offer",
      "Inconsistent materials",
      "Repositioning",
    ],
    questions: [
      "What should customers understand immediately?",
      "Where is the brand inconsistent?",
    ],
    outcomes: [
      "Clearer positioning",
      "Consistent presentation",
      "Stronger trust",
    ],
    objections: ["We only need a logo"],
    approvedClaims: [
      "Vilét connects identity decisions to the broader digital experience",
    ],
    forbiddenClaims: ["A brand change alone guarantees growth"],
  },
  {
    slug: "growth",
    name: "Vilét Growth",
    availability: "internal",
    summary:
      "An internal prospecting and pipeline operating system currently under controlled development.",
    problems: [
      "Unstructured prospect research",
      "Disconnected pipeline activity",
    ],
    idealCustomer:
      "Not available for partner sale until owner approval changes its status.",
    buyingSignals: [],
    questions: [],
    outcomes: [],
    objections: [],
    approvedClaims: ["Vilét is developing internal Growth capabilities"],
    forbiddenClaims: [
      "Growth is generally available",
      "Automated results or campaign guarantees",
    ],
  },
  {
    slug: "insights",
    name: "Vilét Insights",
    availability: "beta",
    summary:
      "A connected performance view awaiting approved customer data integrations.",
    problems: ["Business data split across tools"],
    idealCustomer:
      "A future fit with multiple approved data sources and a need for clearer decisions.",
    buyingSignals: ["Manual reporting across platforms"],
    questions: ["Which decisions does reporting need to support?"],
    outcomes: ["A clearer connected view"],
    objections: [],
    approvedClaims: ["Insights is in beta and requires fit review"],
    forbiddenClaims: [
      "All integrations are available",
      "Insights is a finished self-service product",
    ],
  },
  {
    slug: "vilet-ai",
    name: "Vilét AI",
    availability: "future",
    summary:
      "A secure foundation for context-aware assistance; not approved as a standalone partner-sold product.",
    problems: [],
    idealCustomer: "Requires owner approval and a defined use case.",
    buyingSignals: [],
    questions: [],
    outcomes: [],
    objections: [],
    approvedClaims: ["Vilét evaluates practical AI use cases"],
    forbiddenClaims: [
      "A public or customer assistant is production-ready",
      "Unapproved data can be sent to AI",
    ],
  },
];

export const trainingModules = [
  [
    "Understanding Vilét",
    "Position Vilét as a technology and digital-product company spanning Studio, Growth, Insights, and AI—never as a commodity page builder.",
  ],
  [
    "Studio services",
    "Match websites, software, automation, identity, and support to an observed business problem. Never promise scope, price, or timing before review.",
  ],
  [
    "Who to sell to",
    "Prioritize visible need, operational friction, and readiness. Disqualify poor fit, no authority, no meaningful problem, or requests Vilét cannot responsibly support.",
  ],
  [
    "Prospect research",
    "Record FACT/EVIDENCE separately from INFERENCE and RECOMMENDATION. Public evidence supports a question; it does not prove an internal problem.",
  ],
  [
    "Starting conversations",
    "Use concise, personalized openers through appropriate business channels. State who you are, why the observation is relevant, and invite—not pressure—a conversation.",
  ],
  [
    "Discovery",
    "Listen before pitching. Ask how customers find the business, what happens next, where work remains manual, and which outcome matters most.",
  ],
  [
    "Selling outcomes",
    "Connect solutions to qualified inquiries, easier booking, credibility, reduced admin, visibility, and scalable operations without guaranteeing ROI.",
  ],
  [
    "Objection handling",
    "Clarify the concern, respond to the real issue, and stop when there is no fit or interest. Objections are information, not permission to pressure.",
  ],
  [
    "Pricing conversations",
    "Qualify before quoting. Pricing and discounts are owner-controlled; a scoped proposal is required when no approved guidance exists.",
  ],
  [
    "Lead submission",
    "Submit the business, contact context, relationship, observable need, service interest, and consent/channel context. Duplicate submissions enter review.",
  ],
  [
    "Pipeline",
    "Partner-safe stages are Submitted, Under review, Qualified, In progress, Won, and Lost. Internal Growth stages remain more detailed.",
  ],
  [
    "Commissions",
    "Pending, earned, paid, reversed, and disputed are ledger states. No percentage or eligibility rule is approved until a versioned owner rule exists.",
  ],
  [
    "Professional conduct",
    "Represent Vilét accurately, protect information, avoid spam and deception, document context, and escalate uncertainty.",
  ],
  [
    "Readiness",
    "Demonstrate accurate positioning, ethical qualification, evidence discipline, objection handling, service matching, and policy escalation.",
  ],
] as const;

export const objections = [
  [
    "It is too expensive",
    "The scope or value may be unclear, or budget may be unavailable.",
    "Ask what they are comparing and which outcome matters. Do not discount without authorization.",
  ],
  [
    "We already have a website",
    "They may not see a business problem worth solving.",
    "Ask what works well and what they wish it did better. Agree when the current site is sufficient.",
  ],
  [
    "We do not need that",
    "The need may be absent or poorly understood.",
    "Ask one clarifying question, then stop if there is no meaningful problem.",
  ],
  [
    "Someone can do it cheaper",
    "Price may outweigh fit, quality, or long-term value.",
    "Acknowledge alternatives and explain Vilét's strategy-to-implementation approach without criticizing competitors.",
  ],
  [
    "We do not have time",
    "Change cost or timing may be the concern.",
    "Ask when the issue becomes important and offer to revisit; never create false urgency.",
  ],
  [
    "Send me information",
    "They may need a low-pressure way to evaluate fit.",
    "Send only relevant approved material and agree on whether a follow-up is welcome.",
  ],
] as const;

export const targetProfiles = [
  [
    "Local service business",
    "Weak lead capture, unclear services, phone-only processes, or booking friction.",
  ],
  [
    "Professional practice",
    "Credibility, intake, scheduling, privacy-aware workflows, and clear service education.",
  ],
  [
    "Growing multi-location business",
    "Inconsistent locations, fragmented information, and scaling customer journeys.",
  ],
  [
    "Manual-process-heavy SMB",
    "Repeated data entry, spreadsheet handoffs, and slow internal follow-up.",
  ],
  [
    "Business needing internal software",
    "A validated workflow that off-the-shelf tools cannot support cleanly.",
  ],
] as const;

export const approvedPolicy = {
  pricing:
    "Owner approval required; no public rate card is approved in this repository.",
  discounts: "Partners may not offer discounts without written owner approval.",
  commissions:
    "No commission percentage, eligibility trigger, or payout schedule is approved yet.",
  escalation:
    "Escalate pricing, scope, availability, timelines, legal terms, integrations, and commission questions when an approved source does not answer them.",
} as const;

export function searchSalesKnowledge(query: string) {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return [];
  return salesServices.filter((service) =>
    JSON.stringify(service).toLocaleLowerCase().includes(term),
  );
}
