import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveMemberships, requireUser } from "@vilet/auth";

export const dynamic = "force-dynamic";

export default async function PlatformHomePage() {
  const user = await requireUser();
  const memberships = await getActiveMemberships(user.id);
  if (memberships.length === 1) {
    const organization = memberships[0]?.organizations;
    if (organization) redirect(`/o/${organization.slug}`);
  }
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-16">
      <p className="font-mono text-xs tracking-[0.18em] text-[var(--accent)] uppercase">
        Vilét Platform
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
        {memberships.length
          ? "Choose an organization."
          : "Private access is ready."}
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
        {memberships.length
          ? "Your access is determined by active organization membership."
          : "Your account is authenticated, but it has not been assigned to an organization. Contact Vilét for access."}
      </p>
      {memberships.length > 1 && (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {memberships.map((membership) => {
            const organization = membership.organizations;
            if (!organization) return null;
            return (
              <li key={membership.id}>
                <Link
                  href={`/o/${organization.slug}`}
                  className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:bg-[var(--elevated)]"
                >
                  <strong>{organization.name}</strong>
                  <span className="mt-2 block text-sm text-[var(--quiet)] capitalize">
                    {membership.role}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <form action="/logout" method="post" className="mt-12">
        <button className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]">
          Log out
        </button>
      </form>
    </main>
  );
}
