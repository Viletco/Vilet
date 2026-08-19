import { requireCapability } from "@vilet/auth";
import { EmptyState, PageHeader } from "../../../../components/page-frame";
export default async function StudioPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireCapability(organizationSlug, "studio.access");
  return (
    <>
      <PageHeader
        eyebrow="Vilét Studio"
        title="Projects and delivery."
        description="A private workspace for approved projects, deliverables, and collaboration."
      />
      <EmptyState
        title="No projects yet"
        description="Projects will appear here only after they are created for this organization. No demonstration projects have been added."
      />
    </>
  );
}
