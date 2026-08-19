import { getVerifiedUser, requireOrganizationMembership } from "@vilet/auth";
import { AppShell } from "../../../components/app-shell";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const [context, user] = await Promise.all([
    requireOrganizationMembership(organizationSlug),
    getVerifiedUser(),
  ]);
  return (
    <AppShell context={context} userEmail={user?.email ?? "Authenticated user"}>
      {children}
    </AppShell>
  );
}
