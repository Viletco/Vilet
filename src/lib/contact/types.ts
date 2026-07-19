export const budgetRanges = [
  "not-specified",
  "under-10k",
  "10k-25k",
  "25k-50k",
  "50k-plus",
] as const;
export const timelineOptions = [
  "not-specified",
  "as-soon-as-practical",
  "one-to-three-months",
  "three-to-six-months",
  "six-months-plus",
] as const;
export const contactMethods = ["email", "video-call"] as const;
export type BudgetRange = (typeof budgetRanges)[number];
export type TimelineOption = (typeof timelineOptions)[number];
export type PreferredContactMethod = (typeof contactMethods)[number];

export interface ContactSubmission {
  readonly name: string;
  readonly company: string;
  readonly email: string;
  readonly website?: string;
  readonly serviceId: string;
  readonly projectSummary: string;
  readonly goals: string;
  readonly budgetRange?: BudgetRange;
  readonly timeline?: TimelineOption;
  readonly preferredContactMethod: PreferredContactMethod;
}
export type ContactFormValues = Readonly<
  Record<keyof ContactSubmission, string>
>;

export type ContactResultCode =
  | "delivered"
  | "not-configured"
  | "validation-error"
  | "rate-limited"
  | "duplicate"
  | "spam-rejected"
  | "provider-error"
  | "unexpected-error";
export type ContactField = keyof ContactSubmission | "form";
export interface ContactActionState {
  readonly status: "idle" | "error" | "success" | "notice";
  readonly code?: ContactResultCode;
  readonly message?: string;
  readonly fieldErrors?: Partial<Record<ContactField, readonly string[]>>;
  readonly values?: ContactFormValues;
  readonly clearForm?: boolean;
}
export type ContactProviderResult =
  | { readonly delivery: "delivered" }
  | { readonly delivery: "not-configured" }
  | { readonly delivery: "provider-error" };
export interface ContactProviderContext {
  readonly correlationId: string;
  readonly serviceLabel: string;
}
export interface ContactProvider {
  readonly type: "disabled" | "resend";
  submit(
    submission: ContactSubmission,
    context: ContactProviderContext,
  ): Promise<ContactProviderResult>;
}
export interface ContactAbuseResult {
  readonly allowed: boolean;
  readonly duplicate: boolean;
  readonly retryAfterSeconds?: number;
}
export interface ContactAbuseStore {
  readonly type: "memory" | "upstash";
  check(
    connectionKey: string,
    duplicateKey: string,
  ): Promise<ContactAbuseResult>;
}
