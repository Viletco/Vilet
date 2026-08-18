import Link from "next/link";
import { requireOrganizationMembership } from "@vilet/auth";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireOrganizationMembership(organizationSlug);
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-12">
      <header className="flex items-center justify-between border-b border-[var(--border)] pb-5">
        <Link href="/" className="font-semibold">
          Vilét
        </Link>
        <form action="/logout" method="post">
          <button className="text-sm text-[var(--muted)]">Log out</button>
        </form>
      </header>
      <section className="py-16">
        <p className="font-mono text-xs tracking-[0.18em] text-[var(--accent)] uppercase">
          Organization overview
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
          {context.organizationSlug}
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">
          The account foundation is active. Product areas will be introduced
          only when their functionality and entitlements are ready.
        </p>
        <dl className="mt-10 grid gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] sm:grid-cols-3">
          <div className="p-5">
            <dt className="text-xs text-[var(--quiet)] uppercase">Role</dt>
            <dd className="mt-2 capitalize">{context.role}</dd>
          </div>
          <div className="p-5">
            <dt className="text-xs text-[var(--quiet)] uppercase">
              Membership
            </dt>
            <dd className="mt-2 capitalize">{context.membershipStatus}</dd>
          </div>
          <div className="p-5">
            <dt className="text-xs text-[var(--quiet)] uppercase">
              Capabilities
            </dt>
            <dd className="mt-2">{context.capabilities.size}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
