import "server-only";

import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import {
  AuthorizationError,
  hasCapability,
  hasOrganizationRole,
  type CapabilityKey,
  type OrganizationContext,
  type OrganizationRole,
} from "@vilet/authorization";

import { getPlatformConfig } from "./config";
import { createPlatformServerClient } from "./server-client";

export { createPlatformServerClient, getPlatformConfig };

export interface ActiveMembership {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  status: "active";
  joined_at: string;
  created_at: string;
  updated_at: string;
  organizations: {
    id: string;
    slug: string;
    name: string;
    kind: "internal" | "customer";
    status: "active" | "suspended" | "archived";
    created_at: string;
    updated_at: string;
  } | null;
}

export const getVerifiedUser = cache(async function getVerifiedUser() {
  const client = await createPlatformServerClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  if (error) return null;
  return data.user;
});

export async function requireUser() {
  const user = await getVerifiedUser();
  if (!user) redirect("/login");
  return user;
}

export async function getActiveMemberships(userId: string) {
  const client = await createPlatformServerClient();
  if (!client) return [];
  const { data, error } = await client
    .from("organization_memberships")
    .select(
      "id, organization_id, user_id, role, status, joined_at, created_at, updated_at, organizations!inner(id, slug, name, kind, status, created_at, updated_at)",
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .eq("organizations.status", "active")
    .returns<ActiveMembership[]>();
  if (error)
    throw new Error("Active organization memberships could not be loaded.");
  return data ?? [];
}

export const requireOrganizationMembership = cache(
  async function requireOrganizationMembership(
    organizationSlug: string,
  ): Promise<OrganizationContext> {
    const user = await requireUser();
    const client = await createPlatformServerClient();
    if (!client) redirect("/login?configuration=unavailable");

    const { data: membership } = await client
      .from("organization_memberships")
      .select(
        "organization_id, role, status, organizations!inner(slug, name, kind, status)",
      )
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("organizations.slug", organizationSlug)
      .eq("organizations.status", "active")
      .returns<
        {
          organization_id: string;
          role: OrganizationRole;
          status: "active";
          organizations: {
            slug: string;
            name: string;
            kind: "internal" | "customer";
            status: "active" | "suspended" | "archived";
          } | null;
        }[]
      >()
      .maybeSingle();
    if (!membership) notFound();
    if (!membership.organizations) notFound();

    const [{ data: grants }, { data: administrator }] = await Promise.all([
      client
        .from("organization_entitlements")
        .select("capability_key")
        .eq("organization_id", membership.organization_id)
        .is("revoked_at", null)
        .lte("starts_at", new Date().toISOString())
        .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
        .returns<{ capability_key: CapabilityKey }[]>(),
      client
        .from("platform_administrators")
        .select("user_id")
        .eq("user_id", user.id)
        .is("revoked_at", null)
        .returns<{ user_id: string }[]>()
        .maybeSingle(),
    ]);

    return {
      userId: user.id,
      organizationId: membership.organization_id,
      organizationSlug,
      organizationName: membership.organizations.name,
      organizationKind: membership.organizations.kind,
      organizationStatus: membership.organizations.status,
      role: membership.role,
      membershipStatus: membership.status,
      capabilities: new Set(
        (grants ?? []).map((grant) => grant.capability_key),
      ),
      platformAdministrator: Boolean(administrator),
    };
  },
);

export async function requireOrganizationRole(
  slug: string,
  roles: readonly OrganizationRole[],
) {
  const context = await requireOrganizationMembership(slug);
  if (!hasOrganizationRole(context, roles)) throw new AuthorizationError();
  return context;
}

export async function requireCapability(
  slug: string,
  capability: CapabilityKey,
) {
  const context = await requireOrganizationMembership(slug);
  if (!hasCapability(context, capability)) notFound();
  return context;
}

export async function requirePlatformAdministrator() {
  const user = await requireUser();
  const client = await createPlatformServerClient();
  if (!client) notFound();
  const { data } = await client
    .from("platform_administrators")
    .select("user_id")
    .eq("user_id", user.id)
    .is("revoked_at", null)
    .returns<{ user_id: string }[]>()
    .maybeSingle();
  if (!data) notFound();
  return user;
}
