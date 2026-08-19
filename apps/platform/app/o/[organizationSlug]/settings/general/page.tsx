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
      <dl className="mt-10 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        {[
          ["Name", context.organizationName],
          ["Slug", context.organizationSlug],
          ["Type", context.organizationKind],
          ["Status", context.organizationStatus],
        ].map(([label, value]) => (
          <div key={label} className="grid gap-2 p-5 sm:grid-cols-[12rem_1fr]">
            <dt className="text-sm text-[var(--quiet)]">{label}</dt>
            <dd className="capitalize">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
