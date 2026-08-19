import { requireCapability } from "@vilet/auth";
import { EmptyState, PageHeader } from "../../../../components/page-frame";
export default async function BillingPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireCapability(organizationSlug, "billing.manage");
  return (
    <>
      <PageHeader
        eyebrow="Billing"
        title="Account billing."
        description="Billing access is restricted to approved roles and entitlements."
        status="internal"
      />
      <EmptyState
        title={
          context.organizationKind === "internal"
            ? "Internal Vilét access"
            : "No billing system connected"
        }
        description={
          context.organizationKind === "internal"
            ? "This internal organization does not require an external subscription. No payment processor is connected."
            : "Billing operations will appear only after an approved billing system is connected."
        }
      />
    </>
  );
}
