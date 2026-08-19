import { redirect } from "next/navigation";
export default async function SettingsPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  redirect(`/o/${organizationSlug}/settings/general`);
}
