import type { OrganizationContext } from "@vilet/authorization";
import { destinationHref, visibleDestinations } from "../lib/platform-products";
import { AppShellClient } from "./app-shell-client";

export function AppShell({
  context,
  userEmail,
  children,
}: {
  context: OrganizationContext;
  userEmail: string;
  children: React.ReactNode;
}) {
  const destinations = visibleDestinations(context).map((destination) => ({
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
