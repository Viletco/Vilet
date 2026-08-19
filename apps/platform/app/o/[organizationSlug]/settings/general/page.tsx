import { requireOrganizationMembership } from "@vilet/auth";
import { PageHeader } from "../../../../../components/page-frame";
export default async function GeneralSettings({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireOrganizationMembership(organizationSlug);
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Organization."
        description="Verified organization information. Changes are not enabled in this phase."
      />
      <dl className="divide-border/50 border-border bg-card/40 mt-8 divide-y rounded-2xl border">
        {[
          ["Name", context.organizationName],
          ["Slug", context.organizationSlug],
          ["Type", context.organizationKind],
          ["Status", context.organizationStatus],
        ].map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 p-4 sm:grid-cols-[12rem_1fr] sm:gap-3"
          >
            <dt className="text-muted-foreground text-[12px]">{label}</dt>
            <dd className="text-[13px] capitalize">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
