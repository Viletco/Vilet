import type { SitePath } from "../navigation";

export type DivisionStatus =
  "available" | "private" | "in-development" | "planned";

export interface CompanyDivision {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly href: SitePath;
  readonly category: "services" | "product";
  readonly status: DivisionStatus;
  readonly statusLabel: string;
  readonly shortDescription: string;
  readonly longDescription: string;
  readonly capabilities: readonly string[];
  readonly ctaLabel: string;
}

export interface PartnerProgramContent {
  readonly status: DivisionStatus;
  readonly statusLabel: string;
  readonly description: string;
  readonly audiences: readonly string[];
  readonly steps: readonly { title: string; body: string }[];
  readonly futurePlatform: readonly string[];
}
