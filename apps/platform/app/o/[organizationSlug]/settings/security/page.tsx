import { getVerifiedUser, requireOrganizationMembership } from "@vilet/auth";
import { PageHeader } from "../../../../../components/page-frame";
import { setAccountPassword } from "./actions";
export default async function SecuritySettings({
  params,
  searchParams,
}: {
  params: Promise<{ organizationSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { organizationSlug } = await params;
  await requireOrganizationMembership(organizationSlug);
  const user = await getVerifiedUser();
  const query = await searchParams;
  const action = setAccountPassword.bind(null, organizationSlug);
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
          <dd className="text-[13px]">
            Supabase session with magic-link and password sign-in
          </dd>
        </div>
        <div className="grid gap-1 p-4 sm:grid-cols-[12rem_1fr] sm:gap-3">
          <dt className="text-muted-foreground text-[12px]">Account</dt>
          <dd className="text-[13px]">{user?.email ?? "Authenticated user"}</dd>
        </div>
      </dl>
      <section className="border-border bg-card/40 mt-6 rounded-2xl border p-5 sm:p-6">
        <h2 className="text-base font-semibold">Set or change your password</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-[13px] leading-6">
          Create a password for future sign-ins on this browser or another
          device. Magic-link sign-in remains available as a secure recovery
          option.
        </p>
        <form action={action} className="mt-5 max-w-md space-y-4">
          <div>
            <label htmlFor="new-password" className="text-[12.5px] font-medium">
              New password
            </label>
            <input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
              className="border-input bg-background text-foreground mt-2 h-11 w-full rounded-lg border px-3 text-[13px]"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="text-[12.5px] font-medium"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
              className="border-input bg-background text-foreground mt-2 h-11 w-full rounded-lg border px-3 text-[13px]"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground h-11 rounded-lg px-5 text-[12.5px] font-semibold transition hover:brightness-110"
          >
            Save password
          </button>
        </form>
        {query.passwordUpdated === "1" && (
          <p role="status" className="mt-4 text-sm text-emerald-400">
            Your password is ready. You can use it the next time you sign in.
          </p>
        )}
        {query.passwordError && (
          <p role="alert" className="mt-4 text-sm text-rose-400">
            {query.passwordError === "too-short"
              ? "Use at least 12 characters."
              : query.passwordError === "mismatch"
                ? "The passwords do not match."
                : "Your password could not be saved. Please try again."}
          </p>
        )}
      </section>
    </>
  );
}
