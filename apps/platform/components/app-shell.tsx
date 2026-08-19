import { createPlatformServerClient } from "@vilet/auth";
import type { OrganizationContext } from "@vilet/authorization";
import { destinationHref, visibleDestinations } from "../lib/platform-products";
import { AppShellClient } from "./app-shell-client";

export async function AppShell({
  context,
  userEmail,
  children,
}: {
  context: OrganizationContext;
  userEmail: string;
  children: React.ReactNode;
}) {
  let hasPartnerRecord = false;
  if (context.capabilities.has("partner.access")) {
    const client = await createPlatformServerClient();
    const { data } = client
      ? await client
          .from("sales_partners")
          .select("id")
          .eq("organization_id", context.organizationId)
          .eq("user_id", context.userId)
          .in("status", ["onboarding", "training", "active"])
          .maybeSingle()
      : { data: null };
    hasPartnerRecord = Boolean(data);
  }
  const destinations = visibleDestinations(context)
    .filter(({ key }) => key !== "partner" || hasPartnerRecord)
    .map((destination) => ({
      key: destination.key,
      label: destination.label,
      href: destinationHref(context.organizationSlug, destination),
      status: destination.status,
    }));
  return (
    <AppShellClient
      organizationSlug={context.organizationSlug}
      organizationName={context.organizationName}
      organizationKind={context.organizationKind}
      userEmail={userEmail}
      role={context.role}
      platformAdministrator={context.platformAdministrator}
      destinations={destinations}
    >
      {children}
    </AppShellClient>
  );
}
