import "server-only";
import {
  normalizeLeadEmail,
  normalizedProviderDomain,
} from "./lead-engine-domain";
import { hunterDiscoveryQueries } from "./growth-provider-query";

const timeout = 12_000;
async function providerFetch(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(timeout),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`PROVIDER_${response.status}`);
  return response.json() as Promise<Record<string, unknown>>;
}
function apolloKey() {
  const key = process.env.APOLLO_API_KEY?.trim();
  if (!key) throw new Error("APOLLO_NOT_CONFIGURED");
  return key;
}

export type GrowthDiscoveryProvider = "hunter" | "apollo";

export function growthDiscoveryProvider(): GrowthDiscoveryProvider {
  return process.env.GROWTH_DISCOVERY_PROVIDER?.trim().toLowerCase() ===
    "apollo"
    ? "apollo"
    : "hunter";
}

function hunterKey() {
  const key = process.env.HUNTER_API_KEY?.trim();
  if (!key) throw new Error("HUNTER_NOT_CONFIGURED");
  return key;
}

export interface DiscoveredBusiness {
  provider: GrowthDiscoveryProvider;
  providerId: string;
  name: string;
  website: string | null;
  domain: string | null;
  industry: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  phone: string | null;
}

interface DiscoveryInput {
  industry: string;
  location: string;
  keywords: string | null;
  limit: number;
}

async function discoverWithApollo(
  input: DiscoveryInput,
): Promise<DiscoveredBusiness[]> {
  const data = await providerFetch(
    "https://api.apollo.io/api/v1/mixed_companies/search",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": apolloKey() },
      body: JSON.stringify({
        q_organization_keyword_tags: [
          input.industry,
          ...(input.keywords ? [input.keywords] : []),
        ],
        organization_locations: [input.location],
        page: 1,
        per_page: input.limit,
      }),
    },
  );
  const organizations = Array.isArray(data.organizations)
    ? data.organizations
    : [];
  return organizations.slice(0, input.limit).flatMap((raw) => {
    const item = raw as Record<string, unknown>;
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!name) return [];
    const domain = normalizedProviderDomain(
      item.primary_domain ?? item.website_url,
    );
    return [
      {
        provider: "apollo",
        providerId: String(item.id ?? ""),
        name,
        website: domain ? `https://${domain}` : null,
        domain,
        industry: typeof item.industry === "string" ? item.industry : null,
        city: typeof item.city === "string" ? item.city : null,
        region: typeof item.state === "string" ? item.state : null,
        country: typeof item.country === "string" ? item.country : null,
        phone: typeof item.phone === "string" ? item.phone : null,
      },
    ];
  });
}

async function enrichWithApollo(providerOrganizationId: string) {
  if (!providerOrganizationId) return null;
  const search = await providerFetch(
    "https://api.apollo.io/api/v1/mixed_people/api_search",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": apolloKey() },
      body: JSON.stringify({
        organization_ids: [providerOrganizationId],
        person_titles: [
          "owner",
          "founder",
          "marketing",
          "operations",
          "business development",
        ],
        page: 1,
        per_page: 1,
      }),
    },
  );
  const person = Array.isArray(search.people)
    ? (search.people[0] as Record<string, unknown> | undefined)
    : undefined;
  if (!person?.id) return null;
  const match = await providerFetch(
    "https://api.apollo.io/api/v1/people/match",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": apolloKey() },
      body: JSON.stringify({
        id: person.id,
        reveal_personal_emails: false,
        reveal_phone_number: false,
      }),
    },
  );
  const enriched = match.person as Record<string, unknown> | undefined;
  const email = normalizeLeadEmail(enriched?.email);
  if (!enriched || !email) return null;
  return {
    providerId: String(enriched.id ?? person.id),
    name: typeof enriched.name === "string" ? enriched.name : null,
    title: typeof enriched.title === "string" ? enriched.title : null,
    email,
    verificationStatus:
      enriched.email_status === "verified"
        ? ("verified" as const)
        : ("unverified" as const),
    confidence: enriched.email_status === "verified" ? 90 : 50,
  };
}

async function discoverWithHunter(
  input: DiscoveryInput,
): Promise<DiscoveredBusiness[]> {
  let companies: unknown[] = [];
  for (const query of hunterDiscoveryQueries(input)) {
    const data = await providerFetch("https://api.hunter.io/v2/discover", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": hunterKey(),
      },
      body: JSON.stringify({ query }),
    });
    companies = Array.isArray(data.data) ? data.data : [];
    if (companies.length > 0) break;
  }
  return companies.slice(0, input.limit).flatMap((raw) => {
    const item = raw as Record<string, unknown>;
    const name =
      typeof item.organization === "string" ? item.organization.trim() : "";
    const domain = normalizedProviderDomain(item.domain);
    if (!name || !domain) return [];
    return [
      {
        provider: "hunter" as const,
        providerId: domain,
        name,
        website: `https://${domain}`,
        domain,
        industry: input.industry,
        city: input.location,
        region: null,
        country: null,
        phone: null,
      },
    ];
  });
}

async function enrichWithHunter(domain: string) {
  if (!domain) return null;
  const params = new URLSearchParams({
    domain,
    limit: "10",
    decision_maker: "true",
  });
  const response = await providerFetch(
    `https://api.hunter.io/v2/domain-search?${params.toString()}`,
    { headers: { "X-API-KEY": hunterKey() } },
  );
  const payload = response.data as Record<string, unknown> | undefined;
  const emails = Array.isArray(payload?.emails) ? payload.emails : [];
  const candidates = emails
    .map((raw) => raw as Record<string, unknown>)
    .map((item) => ({
      item,
      email: normalizeLeadEmail(item.value),
      confidence: typeof item.confidence === "number" ? item.confidence : 0,
      status:
        (item.verification as Record<string, unknown> | undefined)?.status ??
        "unknown",
    }))
    .filter((candidate) => Boolean(candidate.email))
    .sort((a, b) => {
      const aValid = a.status === "valid" ? 1 : 0;
      const bValid = b.status === "valid" ? 1 : 0;
      return bValid - aValid || b.confidence - a.confidence;
    });
  const selected = candidates[0];
  if (!selected?.email) return null;
  const firstName =
    typeof selected.item.first_name === "string"
      ? selected.item.first_name.trim()
      : "";
  const lastName =
    typeof selected.item.last_name === "string"
      ? selected.item.last_name.trim()
      : "";
  return {
    providerId: selected.email,
    name: [firstName, lastName].filter(Boolean).join(" ") || null,
    title:
      typeof selected.item.position === "string"
        ? selected.item.position
        : null,
    email: selected.email,
    verificationStatus:
      selected.status === "valid"
        ? ("verified" as const)
        : ("unverified" as const),
    confidence: Math.max(0, Math.min(100, Math.round(selected.confidence))),
  };
}

export async function discoverBusinesses(
  input: DiscoveryInput,
): Promise<DiscoveredBusiness[]> {
  return growthDiscoveryProvider() === "apollo"
    ? discoverWithApollo(input)
    : discoverWithHunter(input);
}

export async function enrichBusinessContact(
  business: Pick<DiscoveredBusiness, "provider" | "providerId" | "domain">,
) {
  return business.provider === "apollo"
    ? enrichWithApollo(business.providerId)
    : enrichWithHunter(business.domain ?? business.providerId);
}

export async function sendGrowthEmail(input: {
  to: string;
  subject: string;
  text: string;
  idempotencyKey: string;
}) {
  const sendMode = process.env.GROWTH_SEND_MODE?.trim().toLowerCase();
  const apiKey = process.env.GROWTH_RESEND_API_KEY?.trim();
  const fromName = process.env.GROWTH_EMAIL_FROM_NAME?.trim();
  const fromEmail = normalizeLeadEmail(process.env.GROWTH_EMAIL_FROM);
  const replyTo = normalizeLeadEmail(process.env.GROWTH_EMAIL_REPLY_TO);
  if (sendMode !== "test" && sendMode !== "live")
    throw new Error("EMAIL_SENDING_DISABLED");
  const testRecipient = normalizeLeadEmail(process.env.GROWTH_TEST_RECIPIENT);
  if (
    !apiKey ||
    !fromName ||
    !fromEmail ||
    !replyTo ||
    !process.env.GROWTH_BUSINESS_ADDRESS?.trim()
  )
    throw new Error("EMAIL_NOT_CONFIGURED");
  if (sendMode === "test" && !testRecipient)
    throw new Error("EMAIL_TEST_RECIPIENT_NOT_CONFIGURED");
  const recipient = sendMode === "test" ? testRecipient : input.to;
  const data = await providerFetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Idempotency-Key": input.idempotencyKey,
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [recipient],
      reply_to: replyTo,
      subject: input.subject,
      text: `${input.text}\n\n${process.env.GROWTH_BUSINESS_ADDRESS.trim()}`,
    }),
  });
  if (typeof data.id !== "string")
    throw new Error("EMAIL_PROVIDER_INVALID_RESPONSE");
  return { providerMessageId: data.id, sendMode };
}
