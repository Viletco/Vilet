export const organizationRoles = [
  "owner",
  "admin",
  "member",
  "billing",
  "viewer",
] as const;
export type OrganizationRole = (typeof organizationRoles)[number];
export type MembershipStatus = "invited" | "active" | "suspended";

export const capabilityKeys = [
  "studio.access",
  "studio.projects",
  "studio.project_admin",
  "growth.access",
  "growth.prospecting",
  "growth.outreach",
  "growth.pipeline",
  "insights.access",
  "insights.analytics",
  "insights.seo",
  "ai.access",
  "billing.manage",
  "support.access",
] as const;
export type CapabilityKey = (typeof capabilityKeys)[number];

export interface OrganizationContext {
  readonly userId: string;
  readonly organizationId: string;
  readonly organizationSlug: string;
  readonly role: OrganizationRole;
  readonly membershipStatus: MembershipStatus;
  readonly capabilities: ReadonlySet<string>;
  readonly platformAdministrator: boolean;
}

export interface TenantResource {
  readonly organizationId: string;
}

export function hasActiveMembership(context: OrganizationContext) {
  return context.membershipStatus === "active";
}

export function hasOrganizationRole(
  context: OrganizationContext,
  allowedRoles: readonly OrganizationRole[],
) {
  return hasActiveMembership(context) && allowedRoles.includes(context.role);
}

export function hasCapability(
  context: OrganizationContext,
  capability: CapabilityKey,
) {
  return hasActiveMembership(context) && context.capabilities.has(capability);
}

export function canAccessTenantResource(
  context: OrganizationContext,
  resource: TenantResource,
) {
  return (
    hasActiveMembership(context) &&
    context.organizationId === resource.organizationId
  );
}

export function canMutateTenantResource(
  context: OrganizationContext,
  resource: TenantResource,
) {
  return (
    canAccessTenantResource(context, resource) &&
    hasOrganizationRole(context, ["owner", "admin", "member"])
  );
}

export function canGrantPlatformAdministration(context: OrganizationContext) {
  return context.platformAdministrator;
}

export class AuthorizationError extends Error {
  constructor(message = "Access denied.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function assertTenantAccess(
  context: OrganizationContext,
  resource: TenantResource,
) {
  if (!canAccessTenantResource(context, resource))
    throw new AuthorizationError();
}

export type PlatformEntryDecision =
  | { readonly kind: "login" }
  | { readonly kind: "private-access" }
  | { readonly kind: "organization"; readonly slug: string }
  | { readonly kind: "chooser" };

export function resolvePlatformEntry(
  authenticated: boolean,
  organizationSlugs: readonly string[],
): PlatformEntryDecision {
  if (!authenticated) return { kind: "login" };
  if (organizationSlugs.length === 0) return { kind: "private-access" };
  if (organizationSlugs.length === 1)
    return { kind: "organization", slug: organizationSlugs[0]! };
  return { kind: "chooser" };
}

export function authenticatedLoginDestination(authenticated: boolean) {
  return authenticated ? "/" : null;
}
