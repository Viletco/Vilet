import { requireOrganizationRole } from "@vilet/auth";
import { EmptyState, PageHeader } from "../../../../../components/page-frame";
export default async function MemberSettings({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireOrganizationRole(organizationSlug, ["owner", "admin"]);
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Members."
        description="Membership administration is restricted to organization owners and administrators."
      />
      <EmptyState
        title="Membership management is not enabled"
        description="The active owner access remains managed through the protected administrative workflow. Invitations and role changes are not available in this phase."
      />
    </>
  );
}
