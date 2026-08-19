import { requireCapability } from "@vilet/auth";
import {
  EmptyState,
  FeatureList,
  PageHeader,
} from "../../../../components/page-frame";
export default async function InsightsPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireCapability(organizationSlug, "insights.access");
  return (
    <>
      <PageHeader
        eyebrow="Vilét Insights"
        title="Connected performance intelligence."
        description="A prepared workspace for organization-approved data sources. No analytics or business data is connected yet."
        status="beta"
      />
      <FeatureList
        items={[
          "Website",
          "Marketing",
          "SEO",
          "Sales",
          "Uptime",
          "Recommendations",
        ]}
      />
      <EmptyState
        title="No data sources connected"
        description="Approved website, analytics, marketing, search, sales, and reliability connections will appear here when configured. No integrations are simulated."
      />
    </>
  );
}
