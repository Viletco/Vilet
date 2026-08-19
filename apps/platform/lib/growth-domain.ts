import { createHash } from "node:crypto";

export const growthProspectStatuses = [
  "active",
  "archived",
  "duplicate",
] as const;
export const growthPipelineStages = [
  "review",
  "qualified",
  "outreach_ready",
  "contacted",
  "replied",
  "opportunity",
  "won",
  "lost",
  "disqualified",
] as const;
export const growthSourceTypes = ["manual", "csv", "referral"] as const;
export type GrowthProspectStatus = (typeof growthProspectStatuses)[number];
export type GrowthPipelineStage = (typeof growthPipelineStages)[number];
export type GrowthSourceType = (typeof growthSourceTypes)[number];

export const CSV_MAX_BYTES = 512 * 1024;
export const CSV_MAX_ROWS = 500;

export function cleanOptional(value: unknown, maximum = 240) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\s+/gu, " ");
  return cleaned ? cleaned.slice(0, maximum) : null;
}

export function normalizeDomain(value: unknown) {
  const candidate = cleanOptional(value, 2048);
  if (!candidate) return null;
  try {
    const url = new URL(
      candidate.includes("://") ? candidate : `https://${candidate}`,
    );
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return null;
    let hostname = url.hostname.toLowerCase().replace(/\.$/u, "");
    if (hostname.startsWith("www.")) hostname = hostname.slice(4);
    if (
      !hostname.includes(".") ||
      hostname.includes("..") ||
      hostname === "localhost"
    )
      return null;
    return hostname;
  } catch {
    return null;
  }
}

export function normalizeWebsite(value: unknown) {
  const domain = normalizeDomain(value);
  if (!domain) return null;
  return `https://${domain}`;
}

export function normalizeBusinessName(value: unknown) {
  const display = cleanOptional(value, 200);
  if (!display) return "";
  return display
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/gu, " and ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(
      /\b(?:incorporated|corporation|company|limited|llc|inc|corp|ltd|co)\b\.?/gu,
      " ",
    )
    .replace(/\s+/gu, " ")
    .trim();
}

export function normalizeEmail(value: unknown) {
  const email = cleanOptional(value, 320)?.toLowerCase() ?? null;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) return null;
  return email;
}

export function normalizePhone(value: unknown) {
  const phone = cleanOptional(value, 80);
  if (!phone) return null;
  const digits = phone.replace(/\D/gu, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return phone.trim().startsWith("+") ? `+${digits}` : digits;
}

export function normalizeLocationPart(value: unknown) {
  return cleanOptional(value, 120)?.toLowerCase() ?? "";
}

export interface GrowthCandidate {
  business_name: string;
  business_name_normalized: string;
  website_url: string | null;
  domain_normalized: string | null;
  email_public: string | null;
  email_normalized: string | null;
  phone: string | null;
  phone_normalized: string | null;
  industry: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  initial_note: string | null;
  fingerprint: string;
}

export function buildGrowthCandidate(
  input: Record<string, unknown>,
): GrowthCandidate | null {
  const businessName = cleanOptional(input.business_name ?? input.name, 200);
  const businessNameNormalized = normalizeBusinessName(businessName);
  if (!businessName || !businessNameNormalized) return null;
  const websiteUrl = normalizeWebsite(input.website_url ?? input.website);
  const emailPublic = cleanOptional(input.email_public ?? input.email, 320);
  const phone = cleanOptional(input.phone, 80);
  const candidate = {
    business_name: businessName,
    business_name_normalized: businessNameNormalized,
    website_url: websiteUrl,
    domain_normalized: normalizeDomain(input.website_url ?? input.website),
    email_public: emailPublic,
    email_normalized: normalizeEmail(emailPublic),
    phone,
    phone_normalized: normalizePhone(phone),
    industry: cleanOptional(input.industry, 120),
    city: cleanOptional(input.city, 120),
    region: cleanOptional(input.region ?? input.state, 120),
    country: cleanOptional(input.country, 120),
    initial_note: cleanOptional(input.initial_note ?? input.notes, 4000),
  };
  return {
    ...candidate,
    fingerprint: createHash("sha256")
      .update(JSON.stringify(candidate))
      .digest("hex"),
  };
}

function parseCsvRecords(text: string) {
  const records: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]!;
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      records.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") field += char;
  }
  if (quoted) throw new Error("CSV_QUOTE");
  if (field || row.length) {
    row.push(field);
    records.push(row);
  }
  return records.filter((record) => record.some((value) => value.trim()));
}

const headerAliases: Record<string, string> = {
  "business name": "business_name",
  name: "business_name",
  business: "business_name",
  website: "website",
  url: "website",
  email: "email",
  phone: "phone",
  industry: "industry",
  city: "city",
  state: "region",
  region: "region",
  country: "country",
  notes: "notes",
};

export interface CsvPreviewRow {
  row: number;
  candidate: GrowthCandidate | null;
  error: string | null;
  duplicateInFile: boolean;
}

export function previewGrowthCsv(text: string): CsvPreviewRow[] {
  if (new TextEncoder().encode(text).byteLength > CSV_MAX_BYTES)
    throw new Error("CSV_SIZE");
  const records = parseCsvRecords(text.replace(/^\uFEFF/u, ""));
  if (records.length < 2) throw new Error("CSV_EMPTY");
  if (records.length - 1 > CSV_MAX_ROWS) throw new Error("CSV_ROWS");
  const headers = records[0]!.map(
    (header) =>
      headerAliases[header.trim().toLowerCase()] ??
      header.trim().toLowerCase().replace(/\s+/gu, "_"),
  );
  if (!headers.includes("business_name")) throw new Error("CSV_NAME_HEADER");
  const seen = new Set<string>();
  return records.slice(1).map((record, index) => {
    const raw = Object.fromEntries(
      headers.map((header, column) => [header, record[column] ?? ""]),
    );
    const candidate = buildGrowthCandidate(raw);
    if (!candidate)
      return {
        row: index + 2,
        candidate: null,
        error: "Business name is required.",
        duplicateInFile: false,
      };
    const identity = candidate.domain_normalized
      ? `domain:${candidate.domain_normalized}`
      : `fallback:${candidate.business_name_normalized}:${normalizeLocationPart(candidate.city)}:${normalizeLocationPart(candidate.region)}`;
    const duplicateInFile = seen.has(identity);
    seen.add(identity);
    return {
      row: index + 2,
      candidate,
      error: duplicateInFile ? "Duplicate row in this file." : null,
      duplicateInFile,
    };
  });
}

export function isStrongDuplicate(
  candidate: GrowthCandidate,
  existing: {
    domain_normalized: string | null;
    business_name_normalized: string;
    city: string | null;
    region: string | null;
    phone_normalized: string | null;
    email_normalized: string | null;
  },
) {
  if (
    candidate.domain_normalized &&
    candidate.domain_normalized === existing.domain_normalized
  )
    return true;
  if (
    candidate.phone_normalized &&
    candidate.phone_normalized === existing.phone_normalized
  )
    return true;
  if (
    candidate.email_normalized &&
    candidate.email_normalized === existing.email_normalized
  )
    return true;
  return (
    candidate.business_name_normalized === existing.business_name_normalized &&
    normalizeLocationPart(candidate.city) ===
      normalizeLocationPart(existing.city) &&
    normalizeLocationPart(candidate.region) ===
      normalizeLocationPart(existing.region) &&
    Boolean(candidate.city || candidate.region)
  );
}
