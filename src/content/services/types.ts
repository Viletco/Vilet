import type {
  CallToAction,
  ContentId,
  ContentSlug,
  IconReference,
  MediaAsset,
  PublicationLifecycle,
  SeoMetadata,
} from "../shared";

export interface ServiceRecord {
  readonly id: ContentId;
  readonly slug: ContentSlug;
  readonly title: string;
  readonly shortSummary: string;
  readonly detailedSummary: string;
  readonly icon: IconReference;
  readonly category: string;
  readonly features: readonly string[];
  readonly outcomes: readonly string[];
  readonly bestSuitedFor: readonly string[];
  readonly typicalEngagementAreas: readonly string[];
  readonly outcomeStatement: string;
  readonly cta: CallToAction;
  readonly relatedServiceIds: readonly ContentId[];
  readonly relatedProjectIds: readonly ContentId[];
  readonly publication: PublicationLifecycle;
  readonly seo?: SeoMetadata;
  readonly media?: MediaAsset;
  readonly pricingReference?: string;
}
