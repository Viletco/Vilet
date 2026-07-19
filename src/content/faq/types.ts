import type {
  ContentId,
  ContentSlug,
  PublicationLifecycle,
  RichContent,
} from "../shared";
export interface FaqRecord {
  readonly id: ContentId;
  readonly slug: ContentSlug;
  readonly question: string;
  readonly answer: RichContent;
  readonly category: string;
  readonly keywords: readonly string[];
  readonly featured: boolean;
  readonly publication: PublicationLifecycle;
  readonly eligibleForStructuredData: boolean;
}
