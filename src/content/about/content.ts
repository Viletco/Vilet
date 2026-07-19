import type { AboutContent } from "./types";

export const aboutContent = {
  hero: {
    eyebrow: "About",
    title: "Building thoughtful digital products with long-term value.",
    body: "Vilét helps businesses solve meaningful digital problems through modern websites, software, automation, and carefully designed systems. Every project is approached with clarity, collaboration, and long-term thinking rather than unnecessary complexity.",
  },
  philosophy: {
    title: "Technology should make businesses easier to run.",
    body: "The best digital products are not defined by how many features they include, but by how clearly they solve the right problem. Vilét focuses on creating systems that are understandable, maintainable, accessible, and intentionally designed for long-term growth.",
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
    title: "Thoughtful work benefits from clear collaboration.",
    body: "Vilét works well with businesses that value clear communication, considered planning, iterative improvement, and a digital relationship that can continue beyond the initial launch.",
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
    title: "Let's build something that lasts.",
    body: "Whether you're starting from scratch or improving an existing digital product, Vilét is ready to help define the right next step.",
  },
} as const satisfies AboutContent;
