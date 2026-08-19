import { requireCapability } from "@vilet/auth";
import { EmptyState, PageHeader } from "../../../../components/page-frame";
export default async function AiPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireCapability(organizationSlug, "ai.access");
  return (
    <>
      <PageHeader
        eyebrow="Vilét AI"
        title="Organization-aware assistance."
        description="A secure product shell for future approved workflows. It currently has no access to organization documents, systems, or private business data."
      />
      <EmptyState
        title="No organization knowledge connected"
        description="Vilét AI will remain inactive here until specific sources, permissions, and operating boundaries are approved."
      />
    </>
  );
}
