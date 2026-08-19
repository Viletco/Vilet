import { redirect } from "next/navigation";
import { requireCapability } from "@vilet/auth";
export default async function BillingSettings({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireCapability(organizationSlug, "billing.manage");
  redirect(`/o/${organizationSlug}/billing`);
}
