import { requireCapability } from "@vilet/auth";
import { FeatureList, PageHeader } from "../../../../components/page-frame";
export default async function GrowthPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireCapability(organizationSlug, "growth.access");
  return (
    <>
      <PageHeader
        eyebrow="Vilét Growth"
        title="Growth operations."
        description="The internal foundation for prospecting, campaigns, pipeline, and activity. Operational tools have not been activated."
        status="internal"
      />
      <FeatureList
        items={["Prospects", "Campaigns", "Pipeline", "Activity", "Settings"]}
      />
    </>
  );
}
