import type { CapabilityKey, OrganizationContext } from "@vilet/authorization";
import { hasCapability, hasOrganizationRole } from "@vilet/authorization";

export type ProductStatus = "available" | "beta" | "internal" | "coming_soon";

export interface PlatformDestination {
  readonly key: string;
  readonly label: string;
  readonly segment: string;
  readonly capability?: CapabilityKey;
  readonly roles?: readonly OrganizationContext["role"][];
  readonly status: ProductStatus;
  readonly description: string;
}

export const platformDestinations: readonly PlatformDestination[] = [
  {
    key: "overview",
    label: "Overview",
    segment: "",
    status: "available",
    description: "Your organization, access, and product readiness.",
  },
  {
    key: "studio",
    label: "Studio",
    segment: "studio",
    capability: "studio.access",
    status: "available",
    description: "Projects, deliverables, and collaboration.",
  },
  {
    key: "growth",
    label: "Growth",
    segment: "growth",
    capability: "growth.access",
    status: "internal",
    description: "Prospecting and pipeline systems in development.",
  },
  {
    key: "partner",
    label: "Partner Hub",
    segment: "partner",
    capability: "partner.access",
    status: "internal",
    description: "Training, approved sales guidance, leads, and commissions.",
  },
  {
    key: "insights",
    label: "Insights",
    segment: "insights",
    capability: "insights.access",
    status: "beta",
    description: "Connected performance intelligence awaiting data sources.",
  },
  {
    key: "ai",
    label: "Vilét AI",
    segment: "ai",
    capability: "ai.access",
    status: "available",
    description: "A secure foundation for organization-aware assistance.",
  },
  {
    key: "billing",
    label: "Billing",
    segment: "billing",
    capability: "billing.manage",
    status: "internal",
    description: "Internal access status and future billing operations.",
  },
  {
    key: "support",
    label: "Support",
    segment: "support",
    capability: "support.access",
    status: "available",
    description: "Account help and direct Vilét support.",
  },
  {
    key: "settings",
    label: "Settings",
    segment: "settings/general",
    status: "available",
    description: "Organization, membership, and security information.",
  },
] as const;

export function canAccessDestination(
  context: OrganizationContext,
  destination: PlatformDestination,
) {
  if (destination.capability && !hasCapability(context, destination.capability))
    return false;
  if (destination.roles && !hasOrganizationRole(context, destination.roles))
    return false;
  return true;
}

export function visibleDestinations(context: OrganizationContext) {
  return platformDestinations.filter((destination) =>
    canAccessDestination(context, destination),
  );
}

export function destinationHref(
  organizationSlug: string,
  destination: PlatformDestination,
) {
  const base = `/o/${organizationSlug}`;
  return destination.segment ? `${base}/${destination.segment}` : base;
}

export function productStatusLabel(status: ProductStatus) {
  return status === "coming_soon" ? "Coming soon" : status;
}
