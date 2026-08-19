import { getVerifiedUser, requireOrganizationMembership } from "@vilet/auth";
import { PageHeader } from "../../../../../components/page-frame";
export default async function SecuritySettings({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireOrganizationMembership(organizationSlug);
  const user = await getVerifiedUser();
  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Security."
        description="Current authentication state for this private Vilét Platform session."
      />
      <dl className="mt-10 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="grid gap-2 p-5 sm:grid-cols-[12rem_1fr]">
          <dt className="text-sm text-[var(--quiet)]">Authentication</dt>
          <dd>Passwordless Supabase session</dd>
        </div>
        <div className="grid gap-2 p-5 sm:grid-cols-[12rem_1fr]">
          <dt className="text-sm text-[var(--quiet)]">Account</dt>
          <dd>{user?.email ?? "Authenticated user"}</dd>
        </div>
      </dl>
    </>
  );
}
