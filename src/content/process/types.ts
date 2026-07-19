import type {
  ContentId,
  ContentSlug,
  IconReference,
  PublicationLifecycle,
  RichContent,
} from "../shared";

export interface ProcessRecord {
  readonly id: ContentId;
  readonly slug: ContentSlug;
  readonly title: string;
  readonly summary: string;
  readonly deliverables: readonly string[];
  readonly icon: IconReference;
  readonly order: number;
  readonly detail?: RichContent;
  readonly detailedDescription: string;
  readonly whatHappens: readonly string[];
  readonly clientInvolvement: string;
  readonly output: string;
  readonly relatedServiceIds: readonly ContentId[];
  readonly publication: PublicationLifecycle;
}
