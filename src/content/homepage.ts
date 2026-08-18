import type { HomepageContent } from "./content-types";
import { projects } from "./projects/content";
import { getFeaturedProjects } from "./projects/selectors";
import {
  assertValidHomepageContent,
  getHomepageSectionVisibility,
  getPublishedFeaturedProjects,
} from "./content-validation";

const homepageContentDraft = {
  version: 2,
  locale: "en-US",
  status: "approved",
  hero: {
    status: "approved",
    eyebrow: "Technology company",
    headline: "Digital products and systems built for what comes next.",
    supportingCopy:
      "Vilét combines product thinking, software, automation, and digital infrastructure to help modern businesses operate clearly and build new opportunities.",
    primaryCta: {
      label: "Start a project",
      accessibleLabel: "Start a project with Vilét",
      link: { kind: "internal", href: "/contact" },
    },
    secondaryCta: {
      label: "Explore Studio",
      link: { kind: "internal", href: "/services" },
    },
    note: "Client services today. Original products for the future.",
    visual: {
      kind: "abstract",
      pattern: "system-grid",
      description:
        "Abstract connected grid representing an integrated digital system.",
    },
    alignment: "left",
    layout: "split",
    background: "hero",
  },
  valueProposition: {
    status: "approved",
    eyebrow: "What we build",
    headline: "Technology should make the business work better.",
    body: "Vilét designs customer experiences, software, automation, and connected systems that reduce friction, improve visibility, and create a stronger foundation for growth.",
    pillars: [
      {
        id: "value-business-first",
        title: "Built around the business",
        summary:
          "Every project begins with the goals, customers, and workflows that matter most—not a generic template.",
        icon: "compass",
      },
      {
        id: "value-clarity",
        title: "Designed for clarity",
        summary:
          "Thoughtful structure and focused interfaces make it easier for customers to understand, trust, and act.",
        icon: "layers",
      },
      {
        id: "value-evolution",
        title: "Made to evolve",
        summary:
          "Modern, maintainable technology keeps the foundation flexible as new services, tools, and opportunities emerge.",
        icon: "settings",
      },
    ],
  },
  services: {
    status: "approved",
    eyebrow: "Vilét Studio",
    headline: "From customer experience to daily operation.",
    body: "Studio brings strategy, design, engineering, and automation together—from public websites to the internal systems a business depends on.",
    items: [
      {
        id: "service-web-design-development",
        title: "Web design and development",
        summary:
          "Premium, responsive websites built around clear messaging, strong usability, and the actions customers need to take.",
        icon: "globe",
        slug: "web-design-development",
        cta: {
          label: "Explore web services",
          link: { kind: "internal", href: "/services" },
        },
        features: [
          "Website strategy and information architecture",
          "Custom responsive design",
          "Modern front-end development",
          "Performance and accessibility foundations",
          "Launch and ongoing improvement",
        ],
        aiCapability: false,
        automation: false,
      },
      {
        id: "service-ai-business-automation",
        title: "AI and business automation",
        summary:
          "Practical automation that reduces repetitive work, connects tools, and helps teams move information more efficiently.",
        icon: "workflow",
        slug: "ai-business-automation",
        cta: {
          label: "Explore automation",
          link: { kind: "internal", href: "/services" },
        },
        features: [
          "Workflow analysis",
          "AI-assisted internal tools",
          "Lead and communication automation",
          "System integrations",
          "Operational dashboards",
        ],
        aiCapability: true,
        automation: true,
      },
      {
        id: "service-custom-software",
        title: "Custom software",
        summary:
          "Purpose-built applications and digital tools for businesses whose needs have outgrown off-the-shelf solutions.",
        icon: "code",
        slug: "custom-software",
        cta: {
          label: "Explore software",
          link: { kind: "internal", href: "/services" },
        },
        features: [
          "Internal web applications",
          "Client and employee portals",
          "Custom dashboards",
          "Product prototypes",
          "Scalable software foundations",
        ],
        aiCapability: false,
        automation: false,
      },
      {
        id: "service-ongoing-digital-support",
        title: "Ongoing digital support",
        summary:
          "Continued technical support, refinement, and optimization after launch so the system stays useful and current.",
        icon: "settings",
        slug: "ongoing-digital-support",
        cta: {
          label: "Explore ongoing support",
          link: { kind: "internal", href: "/services" },
        },
        features: [
          "Website maintenance",
          "Content and feature updates",
          "Performance monitoring",
          "Technical troubleshooting",
          "Long-term product iteration",
        ],
        aiCapability: false,
        automation: false,
      },
    ],
  },
  featuredWork: {
    status: "placeholder",
    headline: "Featured work",
    body: "Approved published work will appear here when available.",
    projects: [],
  },
  process: {
    status: "approved",
    eyebrow: "How we work",
    headline: "A clear path from idea to launch.",
    body: "Every engagement follows a focused process designed to reduce uncertainty and keep the work aligned with the business.",
    steps: [
      {
        id: "process-discover",
        title: "Discover",
        summary:
          "We clarify the goals, audience, existing challenges, and definition of success.",
        deliverables: [
          "Discovery conversation",
          "Goals and requirements",
          "Audience and competitor review",
          "Project direction",
        ],
        icon: "compass",
      },
      {
        id: "process-define",
        title: "Define",
        summary:
          "We turn what we learned into a focused structure, content plan, and technical approach.",
        deliverables: [
          "Information architecture",
          "Feature scope",
          "Content hierarchy",
          "Implementation plan",
        ],
        icon: "layers",
      },
      {
        id: "process-build",
        title: "Build",
        summary:
          "Design and development move together through focused reviews, refinement, and quality checks.",
        deliverables: [
          "Responsive interface",
          "Functional implementation",
          "Iterative review",
          "Accessibility and performance checks",
        ],
        icon: "braces",
      },
      {
        id: "process-launch-evolve",
        title: "Launch & Evolve",
        summary:
          "We prepare the final experience for release and establish a practical path for support and improvement.",
        deliverables: [
          "Production launch",
          "Final validation",
          "Handoff documentation",
          "Ongoing support options",
        ],
        icon: "rocket",
      },
    ],
  },
  technicalApproach: {
    status: "approved",
    eyebrow: "Built with intention",
    headline: "Polished on the surface. Reliable underneath.",
    body: "Vilét uses modern technology and disciplined implementation practices to create experiences that remain fast, accessible, secure, and maintainable.",
    items: [
      {
        id: "approach-performance",
        category: "performance",
        title: "Performance",
        summary:
          "Lean implementation, optimized assets, and careful loading behavior support a responsive experience across devices.",
        icon: "gauge",
      },
      {
        id: "approach-accessibility",
        category: "accessibility",
        title: "Accessibility",
        summary:
          "Semantic structure, keyboard support, readable contrast, and reduced-motion handling are considered from the beginning.",
        icon: "accessibility",
      },
      {
        id: "approach-scalability",
        category: "scalability",
        title: "Scalability",
        summary:
          "Reusable systems and maintainable architecture make future features and content easier to introduce.",
        icon: "chart",
      },
      {
        id: "approach-security",
        category: "security",
        title: "Security",
        summary:
          "Sensitive configuration, user input, dependencies, and integrations are handled with appropriate safeguards.",
        icon: "lock",
      },
      {
        id: "approach-seo",
        category: "seo",
        title: "Search foundations",
        summary:
          "Clear structure, useful metadata, and technically sound pages provide a strong base for organic visibility.",
        icon: "search",
      },
      {
        id: "approach-maintainability",
        category: "maintainability",
        title: "Long-term maintainability",
        summary:
          "Organized code, documentation, and reusable components reduce unnecessary complexity after launch.",
        icon: "settings",
      },
    ],
  },
  whyVilet: {
    status: "approved",
    eyebrow: "How Vilét operates",
    headline: "Focused collaboration with product-level standards.",
    body: "Vilét is founder-led and intentionally focused, combining direct involvement with the systems, technical depth, and long-term thinking required for dependable work.",
    items: [
      {
        id: "differentiator-focused-attention",
        title: "Focused attention",
        summary:
          "Projects receive direct involvement instead of being passed through layers of account management.",
        icon: "sparkles",
      },
      {
        id: "differentiator-business-first",
        title: "Business-first thinking",
        summary:
          "Design and technology decisions are tied back to real goals, workflows, and customer needs.",
        icon: "compass",
      },
      {
        id: "differentiator-clear-communication",
        title: "Clear communication",
        summary:
          "Scope, priorities, progress, and decisions are explained without unnecessary jargon.",
        icon: "workflow",
      },
      {
        id: "differentiator-long-term",
        title: "A long-term mindset",
        summary:
          "The goal is to build a useful foundation that can continue improving—not simply deliver files and disappear.",
        icon: "settings",
      },
    ],
  },
  trust: {
    status: "placeholder",
    headline: "Trust evidence",
    body: "Approved evidence will appear here when available.",
    items: [],
  },
  faq: {
    status: "approved",
    eyebrow: "Frequently asked questions",
    headline: "Practical answers before a project begins.",
    body: "A clear starting point for common questions about fit, process, support, cost, and timing.",
    items: [
      {
        id: "faq-business-fit",
        question: "What kinds of businesses does Vilét work with?",
        answer: {
          format: "plain",
          value:
            "Vilét is initially focused on growing service businesses, local and regional companies, founders, and operators who need a stronger website, better internal workflows, or a custom digital solution. Projects are evaluated based on fit, goals, and the value Vilét can realistically provide.",
        },
        slug: "business-fit",
        category: "engagement",
        featured: true,
        searchKeywords: ["business types", "project fit", "clients"],
      },
      {
        id: "faq-templates",
        question: "Does Vilét use templates?",
        answer: {
          format: "plain",
          value:
            "Reusable systems may be used behind the scenes to improve consistency and reliability, but the visible experience and project structure are shaped around each business. Vilét does not simply resell an unchanged generic template.",
        },
        slug: "templates",
        category: "websites",
        featured: false,
        searchKeywords: ["templates", "custom design", "website"],
      },
      {
        id: "faq-redesign",
        question: "Can Vilét redesign an existing website?",
        answer: {
          format: "plain",
          value:
            "Yes. A redesign can include improved messaging, information architecture, visual design, mobile usability, performance, accessibility, and technical foundations. The exact scope depends on the condition of the existing website and the business goals.",
        },
        slug: "website-redesign",
        category: "websites",
        featured: true,
        searchKeywords: ["redesign", "existing website", "website improvement"],
      },
      {
        id: "faq-support",
        question: "Does Vilét provide support after launch?",
        answer: {
          format: "plain",
          value:
            "Yes. Ongoing support can include maintenance, content updates, technical troubleshooting, performance monitoring, and continued feature development. Support arrangements are defined according to the needs of each project.",
        },
        slug: "support-after-launch",
        category: "support",
        featured: true,
        searchKeywords: ["support", "maintenance", "after launch"],
      },
      {
        id: "faq-cost",
        question: "How much does a project cost?",
        answer: {
          format: "plain",
          value:
            "Pricing depends on scope, complexity, content requirements, integrations, and the level of ongoing support involved. After learning about the project, Vilét provides a clear proposal outlining the recommended scope and investment.",
        },
        slug: "project-cost",
        category: "engagement",
        featured: true,
        searchKeywords: ["cost", "pricing", "investment"],
      },
      {
        id: "faq-timeline",
        question: "How long does a project take?",
        answer: {
          format: "plain",
          value:
            "Timelines vary based on scope, content readiness, feedback, and technical requirements. A realistic schedule is established after discovery rather than promising the same turnaround for every project.",
        },
        slug: "project-timeline",
        category: "engagement",
        featured: false,
        searchKeywords: ["timeline", "schedule", "project duration"],
      },
      {
        id: "faq-ai-tools",
        question: "Can Vilét build AI automation or custom internal tools?",
        answer: {
          format: "plain",
          value:
            "Yes. Vilét can help evaluate repetitive workflows, connect existing systems, create focused internal applications, and introduce AI where it provides a practical business benefit. Not every problem requires AI, so the recommended approach is based on the actual workflow.",
        },
        slug: "ai-automation-internal-tools",
        category: "automation",
        featured: true,
        searchKeywords: ["AI automation", "internal tools", "workflows"],
      },
    ],
  },
  finalCta: {
    status: "approved",
    eyebrow: "Start a conversation",
    headline: "Ready to build what’s next?",
    body: "Tell Vilét what you are building, what is not working, or where your business needs a stronger digital foundation.",
    primaryButton: {
      label: "Start your project",
      accessibleLabel: "Start your project with Vilét",
      link: { kind: "internal", href: "/contact" },
    },
    secondaryButton: {
      label: "View the process",
      link: { kind: "internal", href: "/process" },
    },
    background: "elevated",
  },
  seo: {
    status: "approved",
    title: "Vilét | Digital Products, Software and Systems",
    description:
      "Vilét is a technology company building digital products, software, automation, and systems for modern businesses.",
    keywords: [],
    canonical: "https://vilet.co",
    openGraph: {
      title: "Vilét | Digital Products, Software and Systems",
      description:
        "Vilét is a technology company building digital products, software, automation, and systems for modern businesses.",
      type: "website",
      url: "https://vilet.co",
      siteName: "Vilét",
      images: [],
    },
    twitter: {
      card: "summary",
      title: "Vilét | Digital Products, Software and Systems",
      description:
        "Vilét is a technology company building digital products, software, automation, and systems for modern businesses.",
      images: [],
    },
    robots: {
      index: true,
      follow: true,
    },
    jsonLd: [
      { type: "Organization", enabled: false, data: {} },
      { type: "WebSite", enabled: false, data: {} },
      { type: "Service", enabled: false, data: {} },
      { type: "FAQPage", enabled: false, data: {} },
    ],
  },
} as const satisfies HomepageContent;

export const homepageContent = assertValidHomepageContent(homepageContentDraft);

export const portfolioFeaturedProjects = getFeaturedProjects(projects);

export const homepageSectionVisibility = {
  ...getHomepageSectionVisibility(homepageContent),
  featuredWork: portfolioFeaturedProjects.length > 0,
};

export const publishedFeaturedProjects = getPublishedFeaturedProjects(
  homepageContent.featuredWork.projects,
);

export type { HomepageContent } from "./content-types";
