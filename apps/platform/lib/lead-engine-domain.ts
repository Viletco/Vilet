import { createHash } from "node:crypto";
import {
  cleanOptional,
  normalizeDomain,
  normalizeEmail,
} from "./growth-domain.ts";

export const LEAD_ENGINE_MAX_RESULTS = 25;
export const LEAD_ENGINE_DEFAULT_RESULTS = 10;
export const QUALIFICATION_THRESHOLD = 60;
export const SCORING_VERSION = "vilet-fit-v1";
export const GENERATION_VERSION = "vilet-outreach-v1";

export interface EvidenceItem {
  key: string;
  label: string;
  value: string | boolean;
  source: string;
}
export interface LeadSignals {
  website: string | null;
  phone: string | null;
  industry: string | null;
  city: string | null;
  contactEmail: string | null;
  contactVerified: boolean;
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
export function scoreLead(signals: LeadSignals) {
  const fit = clamp(signals.industry ? 70 : 50);
  const need = clamp(signals.website ? 45 : 85);
  const potentialValue = clamp(signals.website ? 60 : 70);
  const reachability = clamp(
    signals.contactEmail
      ? signals.contactVerified
        ? 90
        : 70
      : signals.phone
        ? 40
        : 10,
  );
  const confidence = clamp(
    35 +
      (signals.website ? 20 : 0) +
      (signals.industry ? 15 : 0) +
      (signals.city ? 10 : 0) +
      (signals.contactEmail ? 20 : 0),
  );
  const priorityScore = clamp(
    fit * 0.25 +
      need * 0.25 +
      potentialValue * 0.2 +
      reachability * 0.15 +
      confidence * 0.15,
  );
  return {
    fit,
    need,
    potential_value: potentialValue,
    reachability,
    confidence,
    priority_score: priorityScore,
    scoring_version: SCORING_VERSION,
    explanation: `Fit ${fit}; need ${need}; potential value ${potentialValue}; reachability ${reachability}; confidence ${confidence}. Weighted deterministically using ${SCORING_VERSION}.`,
  };
}

export function buildResearch(signals: LeadSignals) {
  const evidence: EvidenceItem[] = [
    {
      key: "website",
      label: "Public website",
      value: signals.website ?? false,
      source: "discovery_provider",
    },
    {
      key: "phone",
      label: "Public business phone available",
      value: Boolean(signals.phone),
      source: "discovery_provider",
    },
    {
      key: "industry",
      label: "Industry",
      value: signals.industry ?? "Not provided",
      source: "discovery_provider",
    },
    {
      key: "location",
      label: "City",
      value: signals.city ?? "Not provided",
      source: "discovery_provider",
    },
  ];
  const inference = signals.website
    ? "A public website is present; a focused review is needed before making website-specific claims."
    : "No public website was returned by the discovery provider, which may indicate an opportunity to improve the business's digital presence.";
  const recommendation = signals.website
    ? "Digital systems and lead-generation review"
    : "Lead-generation website and digital presence";
  return {
    evidence,
    inference,
    recommendation,
    evidence_version: "provider-evidence-v1",
  };
}

export function buildOutreachDraft(
  businessName: string,
  contactName: string | null,
  research: ReturnType<typeof buildResearch>,
) {
  const greeting = contactName
    ? `Hi ${contactName.split(/\s+/u)[0]},`
    : "Hello,";
  return {
    subject: `A digital opportunity for ${businessName}`,
    body: `${greeting}\n\nI’m reaching out from Vilét. ${research.inference}\n\nWe help businesses improve websites, lead-generation systems, automation, and custom software. For ${businessName}, a practical next step could be a ${research.recommendation.toLowerCase()}.\n\nWould you be open to a brief conversation to see whether that would be useful?\n\nCaiden\nVilét`,
    evidenceReferences: research.evidence.map((item) => item.key),
    generationVersion: GENERATION_VERSION,
  };
}

export function normalizeLeadEmail(value: unknown) {
  return normalizeEmail(value);
}
export function leadIdempotencyKey(
  organizationId: string,
  prospectId: string,
  contactId: string,
  version = GENERATION_VERSION,
) {
  return createHash("sha256")
    .update(`${organizationId}:${prospectId}:${contactId}:${version}`)
    .digest("hex");
}
export function validateDiscoveryInput(input: {
  industry?: unknown;
  location?: unknown;
  keywords?: unknown;
  limit?: unknown;
}) {
  const industry = cleanOptional(input.industry, 120);
  const location = cleanOptional(input.location, 120);
  const keywords = cleanOptional(input.keywords, 200);
  const limit = Number(input.limit ?? LEAD_ENGINE_DEFAULT_RESULTS);
  if (
    !industry ||
    !location ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > LEAD_ENGINE_MAX_RESULTS
  )
    return null;
  return { industry, location, keywords, limit };
}
export function normalizedProviderDomain(value: unknown) {
  return normalizeDomain(value);
}
