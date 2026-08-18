import type { AboutContent } from "./types";

export const aboutContent = {
  hero: {
    eyebrow: "About",
    title:
      "A technology company built around useful systems and long-term value.",
    body: "Vilét builds digital products, software, automation, and infrastructure for modern businesses. Vilét Studio delivers client work today while new product directions, beginning with Vilét Insights, are developed deliberately for the future.",
  },
  philosophy: {
    title:
      "Build technology that helps people do better work and create new opportunities.",
    body: "The best systems solve a clear problem, remain understandable, and improve with the business. Vilét is founder-led and intentionally focused: ambitious about the future without overstating what is available today.",
  },
  principles: [
    "Excellence over average",
    "Simplicity over complexity",
    "Innovation with purpose",
    "Design that earns trust",
    "Long-term thinking",
    "Relentless attention to detail",
    "Continuous improvement",
  ],
  collaboration: [
    {
      title: "Discovery and planning",
      body: "Work begins by understanding the business context, audience, constraints, and decisions that shape a useful direction.",
    },
    {
      title: "Design and development",
      body: "Ideas move through focused design and implementation together, with review points that keep the solution aligned with the approved goals.",
    },
    {
      title: "Validation and launch",
      body: "The work is reviewed for clarity, accessibility, responsive behavior, performance foundations, and functional readiness before release.",
    },
    {
      title: "Support and improvement",
      body: "After launch, documentation, maintenance, or continued iteration can help the digital foundation remain useful as needs change.",
    },
  ],
  technology: [
    {
      title: "Modern foundations",
      body: "Current web standards, type safety, and scalable architecture reduce avoidable ambiguity and make future change easier to manage.",
    },
    {
      title: "Accessible and performant by design",
      body: "Accessibility and performance are considered during planning and implementation because they affect whether people can use the result effectively.",
    },
    {
      title: "Server-first, progressively enhanced",
      body: "Content and essential interactions work with minimal client-side JavaScript, while enhancement is added only when it provides a clear benefit.",
    },
    {
      title: "Maintainability over novelty",
      body: "Technology choices are evaluated by how well they fit the problem, how clearly they can be maintained, and whether added complexity is justified.",
    },
  ],
  workingTogether: {
    title: "Vilét Studio works through direct, clear collaboration.",
    body: "Studio is the part of Vilét businesses can hire today. It works well with teams that value considered planning, iterative improvement, and a technical relationship that can continue beyond launch.",
    indicators: [
      "A meaningful business or customer problem to solve",
      "A clear project owner or decision-maker",
      "Openness to discovery before implementation",
      "Timely access to accurate content and context",
      "A preference for maintainable work over fragile shortcuts",
    ],
  },
  faqSlugs: [
    "business-fit",
    "templates",
    "website-redesign",
    "support-after-launch",
    "project-timeline",
  ],
  finalCta: {
    title: "Build the next useful system.",
    body: "Whether the need is customer-facing, operational, or the beginning of a new product, Vilét Studio can help define a practical next step.",
  },
} as const satisfies AboutContent;
