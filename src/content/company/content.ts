import type { CompanyDivision, PartnerProgramContent } from "./types";

export const companyDivisions = [
  {
    id: "division-studio",
    name: "Vilét Studio",
    slug: "studio",
    href: "/services",
    category: "services",
    status: "available",
    statusLabel: "Available now",
    shortDescription:
      "Client services for businesses that need stronger digital experiences, software, automation, and infrastructure.",
    longDescription:
      "Studio brings product thinking, design, engineering, and automation together to solve customer-facing and operational problems.",
    capabilities: [
      "Websites and digital experiences",
      "Custom software and internal tools",
      "Automation and integrations",
      "Digital identity and ongoing support",
    ],
    ctaLabel: "Explore Studio",
  },
  {
    id: "division-insights",
    name: "Vilét Insights",
    slug: "insights",
    href: "/insights",
    category: "product",
    status: "in-development",
    statusLabel: "In development",
    shortDescription:
      "A future business intelligence product designed to turn scattered data into clear explanations and useful next actions.",
    longDescription:
      "Insights is being shaped as an interpretation layer across the systems a business already uses—not simply another dashboard.",
    capabilities: [
      "Unified business context",
      "Changes and likely causes",
      "Actionable recommendations",
      "Reports, alerts, and trend visibility",
    ],
    ctaLabel: "Explore Insights",
  },
] as const satisfies readonly CompanyDivision[];

export const partnerProgram = {
  status: "in-development",
  statusLabel: "Program in development",
  description:
    "The Vilét Studio Partner Program is being developed for people who introduce qualified businesses that need websites, software, automation, or digital systems.",
  audiences: [
    "Sales professionals",
    "Consultants and freelancers",
    "Business owners",
    "Agencies with complementary services",
    "Well-connected professionals",
  ],
  steps: [
    {
      title: "Make an introduction",
      body: "Refer a qualified business with a real digital or operational need.",
    },
    {
      title: "Vilét leads delivery",
      body: "Studio handles discovery, proposals, implementation, and support.",
    },
    {
      title: "Successful referrals are recognized",
      body: "Eligible partners can earn commission when an introduction becomes a paying client. Terms are confirmed before participation.",
    },
  ],
  futurePlatform: [
    "Referral and opportunity tracking",
    "Attribution and deal status",
    "Commission and payout history",
    "Sales resources and training",
  ],
} as const satisfies PartnerProgramContent;

export const futureProductAreas = [
  "Vilét Growth",
  "Vilét CRM",
  "Vilét Marketplace",
  "Vilét Network",
] as const;
