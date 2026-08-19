import Link from "next/link";
import { requireOrganizationMembership } from "@vilet/auth";
import { PageHeader, ProductStatusBadge } from "../../../components/page-frame";
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
      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["Organization", context.organizationStatus],
          ["Membership", context.membershipStatus],
          ["Role", context.role],
        ].map(([label, value]) => (
          <div
            key={label}
            className="border-border bg-card/40 rounded-xl border p-4"
          >
            <dt className="text-muted-foreground text-[11px] tracking-wide uppercase">
              {label}
            </dt>
            <dd className="mt-2 text-[15px] font-semibold capitalize">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <section className="mt-10">
        <h2 className="text-muted-foreground text-[13px] font-semibold tracking-[0.08em] uppercase">
          Product access
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.key}
              href={destinationHref(organizationSlug, product)}
              className="group border-border bg-card/40 hover:border-primary/30 hover:bg-card/70 rounded-2xl border p-5 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-primary group-hover:bg-primary/10 group-hover:ring-primary/20 grid size-9 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.05] transition">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-current"
                  />
                </span>
                {product.status !== "available" && (
                  <ProductStatusBadge status={product.status} />
                )}
              </div>
              <h3 className="mt-4 text-[15px] font-semibold">
                {product.label}
              </h3>
              <p className="text-muted-foreground mt-2 text-[13px] leading-6">
                {product.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
