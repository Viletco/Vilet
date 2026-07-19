import type {
  ApprovalMetadata,
  ContentId,
  ContentLink,
  ContentSlug,
  MediaAsset,
  PublicationLifecycle,
  SeoMetadata,
  SourceAttribution,
} from "../shared";

export interface ProjectMetricEvidence {
  readonly id: ContentId;
  readonly value: number;
  readonly unit: string;
  readonly label: string;
  readonly context: string;
  readonly source: SourceAttribution;
  readonly approval: ApprovalMetadata;
}
export interface ProjectTestimonialEvidence {
  readonly id: ContentId;
  readonly quote: string;
  readonly person: string;
  readonly role?: string;
  readonly organization?: string;
  readonly approval: ApprovalMetadata;
}
export interface ProjectCredit {
  readonly label: string;
  readonly name: string;
  readonly url?: ContentLink;
}

export interface ProjectRecord {
  readonly id: ContentId;
  readonly slug: ContentSlug;
  readonly title: string;
  readonly clientName?: string;
  readonly safeClientLabel: string;
  readonly projectType: string;
  readonly industry: string;
  readonly summary: string;
  readonly challenge: string;
  readonly strategy: string;
  readonly solution: string;
  readonly outcome: string;
  readonly serviceIds: readonly ContentId[];
  readonly technologies: readonly string[];
  readonly capabilities: readonly string[];
  readonly timelineLabel?: string;
  readonly year?: number;
  readonly projectUrl?: ContentLink;
  readonly media: readonly MediaAsset[];
  readonly heroMedia?: MediaAsset;
  readonly gallery: readonly MediaAsset[];
  readonly mobileMedia?: MediaAsset;
  readonly credits: readonly ProjectCredit[];
  readonly attribution: readonly SourceAttribution[];
  readonly relatedServiceIds: readonly ContentId[];
  readonly relatedProjectIds: readonly ContentId[];
  readonly featured: boolean;
  readonly publication: PublicationLifecycle;
  readonly approval?: ApprovalMetadata;
  readonly reviewAt?: string;
  readonly seo?: SeoMetadata;
  readonly metrics: readonly ProjectMetricEvidence[];
  readonly testimonials: readonly ProjectTestimonialEvidence[];
  readonly externalLinks: readonly ContentLink[];
}

export interface ProjectSummary {
  readonly id: ContentId;
  readonly slug: ContentSlug;
  readonly title: string;
  readonly safeClientLabel: string;
  readonly projectType: string;
  readonly industry: string;
  readonly summary: string;
  readonly serviceIds: readonly ContentId[];
  readonly heroMedia?: MediaAsset;
}
