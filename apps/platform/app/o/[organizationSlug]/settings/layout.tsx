import Link from "next/link";
import { requireOrganizationMembership } from "@vilet/auth";

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
      <nav
        aria-label="Settings"
        className="mb-10 flex gap-2 overflow-x-auto border-b border-[var(--border)] pb-3"
      >
        {items.map((item) => (
          <Link
            key={item.segment}
            className="min-h-10 rounded-lg px-3 py-2 text-sm whitespace-nowrap text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]"
            href={`/o/${organizationSlug}/settings/${item.segment}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
