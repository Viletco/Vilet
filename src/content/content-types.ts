import type { SitePath } from "./navigation";
import type { IconName } from "./icons";

export type ContentStatus = "placeholder" | "draft" | "approved";

export type InternalHref =
  SitePath | `${SitePath}#${string}` | `/work/${string}`;

export type ContentLink =
  | {
      readonly kind: "internal";
      readonly href: InternalHref;
    }
  | {
      readonly kind: "external";
      readonly href: `https://${string}`;
      readonly newTab?: boolean;
    }
  | {
      readonly kind: "email";
      readonly href: `mailto:${string}`;
    }
  | {
      readonly kind: "schedule";
      readonly href: `https://${string}`;
      readonly provider?: string;
    };

export interface CallToActionContent {
  readonly label: string;
  readonly link: ContentLink;
  readonly accessibleLabel?: string;
}

export type ImageSource =
  | {
      readonly kind: "local";
      readonly src: `/${string}`;
    }
  | {
      readonly kind: "remote";
      readonly src: `https://${string}`;
      readonly cdnProvider?: string;
    }
  | {
      readonly kind: "cms";
      readonly assetId: string;
      readonly deliveryUrl?: `https://${string}`;
      readonly cmsProvider?: string;
    };

export interface ContentImage {
  readonly id: string;
  readonly source: ImageSource;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly priority?: boolean;
  readonly blur?: {
    readonly dataUrl: `data:image/${string}`;
  };
  readonly caption?: string;
  readonly focalPoint?: {
    readonly x: number;
    readonly y: number;
  };
}

export type HeroVisual =
  | {
      readonly kind: "none";
      readonly description: string;
    }
  | {
      readonly kind: "image";
      readonly image: ContentImage;
    }
  | {
      readonly kind: "video";
      readonly poster: ContentImage;
      readonly source: ImageSource;
      readonly captionsSrc?: `/${string}`;
    }
  | {
      readonly kind: "cms-media";
      readonly assetId: string;
      readonly mediaType: "image" | "video" | "interactive";
      readonly fallback?: ContentImage;
    }
  | {
      readonly kind: "abstract";
      readonly pattern: "system-grid" | "directional-lines";
      readonly description: string;
    };

export interface HeroContent {
  readonly status: ContentStatus;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly supportingCopy: string;
  readonly primaryCta: CallToActionContent;
  readonly secondaryCta: CallToActionContent;
  readonly note?: string;
  readonly visual: HeroVisual;
  readonly alignment: "left" | "center";
  readonly layout: "single-column" | "split";
  readonly background: "none" | "hero" | "surface";
}

export interface ValuePillarContent {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly icon?: IconName;
}

export interface ValuePropositionContent {
  readonly status: ContentStatus;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly body: string;
  readonly pillars: readonly ValuePillarContent[];
}

export type PricingContent =
  | {
      readonly kind: "contact";
      readonly label: string;
    }
  | {
      readonly kind: "starting-at";
      readonly amount: number;
      readonly currency: string;
      readonly qualifier?: string;
    }
  | {
      readonly kind: "range";
      readonly minimum: number;
      readonly maximum: number;
      readonly currency: string;
      readonly qualifier?: string;
    };

export interface ServiceContent {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly icon: IconName;
  readonly slug: string;
  readonly cta: CallToActionContent;
  readonly features: readonly string[];
  readonly pricing?: PricingContent;
  readonly tags?: readonly string[];
  readonly caseStudyRef?: string;
  readonly aiCapability?: boolean;
  readonly automation?: boolean;
}

export interface ServicesContent {
  readonly status: ContentStatus;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly body: string;
  readonly items: readonly ServiceContent[];
}

export type PublicationState =
  | {
      readonly state: "draft";
      readonly publish: false;
      readonly draftMode: true;
    }
  | {
      readonly state: "scheduled";
      readonly publish: false;
      readonly draftMode: false;
      readonly publishAt: string;
    }
  | {
      readonly state: "published";
      readonly publish: true;
      readonly draftMode: false;
      readonly publishedAt: string;
    };

export interface FeaturedProjectContent {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly client: string;
  readonly industry: string;
  readonly summary: string;
  readonly challenge: string;
  readonly solution: string;
  readonly outcome: string;
  readonly images: readonly ContentImage[];
  readonly projectUrl: ContentLink;
  readonly technologies: readonly string[];
  readonly featured: boolean;
  readonly publication: PublicationState;
  readonly cmsId?: string;
  readonly approvalSource?: string;
}

export interface FeaturedWorkContent {
  readonly status: ContentStatus;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly body: string;
  readonly projects: readonly FeaturedProjectContent[];
}

export interface ProcessStepContent {
  readonly id: string;
  readonly title: "Discover" | "Define" | "Build" | "Launch & Evolve";
  readonly summary: string;
  readonly deliverables: readonly string[];
  readonly icon: IconName;
  readonly estimatedEffort?: string;
  readonly illustration?: ContentImage;
}

export interface ProcessContent {
  readonly status: ContentStatus;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly body: string;
  readonly steps: readonly ProcessStepContent[];
}

export type TechnicalApproachCategory =
  | "modern-web-development"
  | "ai-integrations"
  | "automation"
  | "performance"
  | "accessibility"
  | "security"
  | "scalability"
  | "seo"
  | "maintainability";

export interface TechnicalApproachItemContent {
  readonly id: string;
  readonly category: TechnicalApproachCategory;
  readonly title: string;
  readonly summary: string;
  readonly icon: IconName;
  readonly technologies?: readonly string[];
}

export interface TechnicalApproachContent {
  readonly status: ContentStatus;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly body: string;
  readonly items: readonly TechnicalApproachItemContent[];
}

export interface DifferentiatorContent {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly icon?: IconName;
  readonly link?: ContentLink;
}

export interface WhyViletContent {
  readonly status: ContentStatus;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly body: string;
  readonly items: readonly DifferentiatorContent[];
}

interface TrustBase {
  readonly id: string;
  readonly status: Exclude<ContentStatus, "placeholder">;
  readonly source: string;
  readonly approvedAt?: string;
  readonly reviewAt?: string;
}

export type TrustEvidenceContent =
  | (TrustBase & {
      readonly kind: "testimonial";
      readonly quote: string;
      readonly person: string;
      readonly role?: string;
      readonly organization?: string;
    })
  | (TrustBase & {
      readonly kind: "logo";
      readonly organization: string;
      readonly image: ContentImage;
      readonly url?: ContentLink;
    })
  | (TrustBase & {
      readonly kind: "metric";
      readonly value: string;
      readonly label: string;
      readonly context: string;
    })
  | (TrustBase & {
      readonly kind: "award";
      readonly title: string;
      readonly issuer: string;
      readonly year: number;
      readonly url?: ContentLink;
    })
  | (TrustBase & {
      readonly kind: "certification";
      readonly title: string;
      readonly issuer: string;
      readonly expiresAt?: string;
      readonly credentialUrl?: ContentLink;
    })
  | (TrustBase & {
      readonly kind: "partner";
      readonly organization: string;
      readonly relationship: string;
      readonly url?: ContentLink;
    });

export interface TrustContent {
  readonly status: ContentStatus;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly body: string;
  readonly items: readonly TrustEvidenceContent[];
}

export type FAQAnswerContent =
  | {
      readonly format: "plain";
      readonly value: string;
    }
  | {
      readonly format: "markdown";
      readonly value: string;
    }
  | {
      readonly format: "rich-text";
      readonly document: Readonly<Record<string, unknown>>;
    };

export interface FAQItemContent {
  readonly id: string;
  readonly question: string;
  readonly answer: FAQAnswerContent;
  readonly slug: string;
  readonly category: string;
  readonly featured: boolean;
  readonly searchKeywords: readonly string[];
  readonly cmsId?: string;
}

export interface FAQContent {
  readonly status: ContentStatus;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly body: string;
  readonly items: readonly FAQItemContent[];
}

export interface FinalCtaContent {
  readonly status: ContentStatus;
  readonly eyebrow?: string;
  readonly headline: string;
  readonly body: string;
  readonly primaryButton: CallToActionContent;
  readonly secondaryButton?: CallToActionContent;
  readonly background: "none" | "surface" | "elevated" | "accent-soft";
  readonly schedulingLink?: ContentLink & { readonly kind: "schedule" };
  readonly bookingIntegration?: {
    readonly provider: string;
    readonly integrationId: string;
  };
}

export interface SocialImageContent extends ContentImage {
  readonly url?: `https://${string}`;
}

export interface OpenGraphContent {
  readonly title: string;
  readonly description: string;
  readonly type: "website";
  readonly url: `https://${string}`;
  readonly siteName: string;
  readonly images: readonly SocialImageContent[];
}

export interface TwitterContent {
  readonly card: "summary" | "summary_large_image";
  readonly title: string;
  readonly description: string;
  readonly images: readonly SocialImageContent[];
  readonly creator?: `@${string}`;
}

export interface RobotsContent {
  readonly index: boolean;
  readonly follow: boolean;
  readonly noarchive?: boolean;
  readonly noimageindex?: boolean;
}

export type JsonLdPlaceholder =
  | {
      readonly type: "Organization";
      readonly enabled: boolean;
      readonly data: Readonly<Record<string, unknown>>;
    }
  | {
      readonly type: "WebSite";
      readonly enabled: boolean;
      readonly data: Readonly<Record<string, unknown>>;
    }
  | {
      readonly type: "Service";
      readonly enabled: boolean;
      readonly data: Readonly<Record<string, unknown>>;
    }
  | {
      readonly type: "FAQPage";
      readonly enabled: boolean;
      readonly data: Readonly<Record<string, unknown>>;
    };

export interface SeoContent {
  readonly status: ContentStatus;
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly canonical: `https://${string}`;
  readonly openGraph: OpenGraphContent;
  readonly twitter: TwitterContent;
  readonly robots: RobotsContent;
  readonly jsonLd: readonly JsonLdPlaceholder[];
}

export interface HomepageContent {
  readonly version: number;
  readonly locale: string;
  readonly status: ContentStatus;
  readonly hero: HeroContent;
  readonly valueProposition: ValuePropositionContent;
  readonly services: ServicesContent;
  readonly featuredWork: FeaturedWorkContent;
  readonly process: ProcessContent;
  readonly technicalApproach: TechnicalApproachContent;
  readonly whyVilet: WhyViletContent;
  readonly trust: TrustContent;
  readonly faq: FAQContent;
  readonly finalCta: FinalCtaContent;
  readonly seo: SeoContent;
}
