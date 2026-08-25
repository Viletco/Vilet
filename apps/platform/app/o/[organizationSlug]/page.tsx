import Link from "next/link";
import { requireOrganizationMembership } from "@vilet/auth";
import { PageHeader, ProductStatusBadge } from "../../../components/page-frame";
import {
  ProductMark,
  type PlatformProductMark,
} from "../../../components/product-mark";
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
      <dl className="command-surface mt-10 grid sm:grid-cols-3">
        {[
          ["Organization", context.organizationStatus],
          ["Membership", context.membershipStatus],
          ["Role", context.role],
        ].map(([label, value]) => (
          <div
            key={label}
            className="border-border/80 border-b p-5 last:border-0 sm:border-r sm:border-b-0"
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
      <section className="mt-14 grid gap-8 xl:grid-cols-[15rem_1fr]">
        <div>
          <p className="vilet-coordinate text-primary">System map</p>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em]">
            Your Vilét command center
          </h2>
          <p className="text-muted-foreground mt-3 text-[13px] leading-6">
            Products appear according to real organization capabilities.
            Statuses are operational, not demonstration metrics.
          </p>
          <div className="signal-line mt-6" />
        </div>
        <div className="divide-border border-border divide-y border-y">
          {products.map((product) => (
            <Link
              key={product.key}
              href={destinationHref(organizationSlug, product)}
              className="group hover:bg-primary/[0.035] grid gap-4 py-5 transition-colors sm:grid-cols-[2.5rem_1fr_auto] sm:items-center"
            >
              <ProductMark
                product={product.key as PlatformProductMark}
                className="text-primary size-6"
              />
              <div>
                <h3 className="text-[15px] font-semibold">{product.label}</h3>
                <p className="text-muted-foreground mt-1 text-[13px] leading-6">
                  {product.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {product.status !== "available" && (
                  <ProductStatusBadge status={product.status} />
                )}
                <span className="text-primary text-lg transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
