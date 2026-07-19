export interface AboutItem {
  readonly title: string;
  readonly body: string;
}
export interface AboutContent {
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly body: string;
  };
  readonly philosophy: { readonly title: string; readonly body: string };
  readonly principles: readonly string[];
  readonly collaboration: readonly AboutItem[];
  readonly technology: readonly AboutItem[];
  readonly workingTogether: {
    readonly title: string;
    readonly body: string;
    readonly indicators: readonly string[];
  };
  readonly faqSlugs: readonly string[];
  readonly finalCta: { readonly title: string; readonly body: string };
}
