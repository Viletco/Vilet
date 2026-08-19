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
      <dl className="divide-border/50 border-border bg-card/40 mt-8 divide-y rounded-2xl border">
        <div className="grid gap-1 p-4 sm:grid-cols-[12rem_1fr] sm:gap-3">
          <dt className="text-muted-foreground text-[12px]">Authentication</dt>
          <dd className="text-[13px]">Passwordless Supabase session</dd>
        </div>
        <div className="grid gap-1 p-4 sm:grid-cols-[12rem_1fr] sm:gap-3">
          <dt className="text-muted-foreground text-[12px]">Account</dt>
          <dd className="text-[13px]">{user?.email ?? "Authenticated user"}</dd>
        </div>
      </dl>
    </>
  );
}
