import { requireOrganizationMembership } from "@vilet/auth";
import { TabNavigation } from "../../../../components/tab-navigation";

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireOrganizationMembership(organizationSlug);
  const items = [
    { label: "General", segment: "general" },
    { label: "Security", segment: "security" },
  ];
  if (["owner", "admin"].includes(context.role))
    items.splice(1, 0, { label: "Members", segment: "members" });
  if (context.capabilities.has("billing.manage"))
    items.push({ label: "Billing", segment: "billing" });
  return (
    <div>
      <TabNavigation
        label="Settings"
        className="mb-8"
        items={items.map((item) => ({
          label: item.label,
          href: `/o/${organizationSlug}/settings/${item.segment}`,
          exact: true,
        }))}
      />
      {children}
    </div>
  );
}
