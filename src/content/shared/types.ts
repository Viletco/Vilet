import type { IconName } from "../icons";

export type {
  CallToActionContent as CallToAction,
  ContentImage as MediaAsset,
  ContentLink,
  FAQAnswerContent as RichContent,
  SeoContent as SeoMetadata,
} from "../content-types";

export type ContentId = string;
export type ContentSlug = string;
export type IconReference = IconName;

export interface TaxonomyTerm {
  readonly id: ContentId;
  readonly slug: ContentSlug;
  readonly label: string;
}

export interface ApprovalMetadata {
  readonly source: string;
  readonly approvedAt?: string;
  readonly reviewAt?: string;
}

export type PublicationLifecycle =
  | { readonly state: "draft" }
  | { readonly state: "scheduled"; readonly publishAt: string }
  | { readonly state: "published"; readonly publishedAt?: string };

export interface SourceAttribution {
  readonly label: string;
  readonly url?: `https://${string}`;
}
