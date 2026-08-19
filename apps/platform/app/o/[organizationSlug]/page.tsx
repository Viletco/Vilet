import Link from "next/link";
import { requireOrganizationMembership } from "@vilet/auth";
import { PageHeader, StatusBadge } from "../../../components/page-frame";
import {
  destinationHref,
  visibleDestinations,
} from "../../../lib/platform-products";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireOrganizationMembership(organizationSlug);
  const products = visibleDestinations(context).filter(
    ({ key }) => !["overview", "settings"].includes(key),
  );
  return (
    <>
      <PageHeader
        eyebrow="Organization overview"
        title={context.organizationName}
        description="Your active Vilét products and account access, shown from the capabilities assigned to this organization."
      />
      <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
        {[
          ["Organization", context.organizationStatus],
          ["Membership", context.membershipStatus],
          ["Role", context.role],
        ].map(([label, value]) => (
          <div key={label} className="bg-[var(--surface)] p-5">
            <dt className="text-xs tracking-[0.1em] text-[var(--quiet)] uppercase">
              {label}
            </dt>
            <dd className="mt-2 capitalize">{value}</dd>
          </div>
        ))}
      </dl>
      <section className="mt-14">
        <h2 className="text-2xl font-semibold tracking-[-0.035em]">
          Product access
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.key}
              href={destinationHref(organizationSlug, product)}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:border-[var(--accent-border)] hover:bg-[var(--elevated)]"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-medium">{product.label}</h3>
                {product.status !== "available" && (
                  <StatusBadge status={product.status} />
                )}
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {product.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
