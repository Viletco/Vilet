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
      <section className="ecosystem-panel mt-9 p-5 sm:p-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="vilet-coordinate text-[var(--champagne)]">
              Ecosystem status
            </p>
            <h2 className="editorial-title mt-2 text-2xl sm:text-3xl">
              One connected Vilét experience.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-[12.5px] leading-5">
            Your products, permissions, and operating surfaces remain connected
            through one secure organization.
          </p>
        </div>
        <div className="champagne-rule mt-5" />
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ["Organization", context.organizationStatus],
            ["Membership", context.membershipStatus],
            ["Role", context.role],
          ].map(([label, value]) => (
            <div key={label} className="metric-panel p-4">
              <dt className="text-muted-foreground text-[11px] tracking-wide uppercase">
                {label}
              </dt>
              <dd className="mt-2 text-[15px] font-semibold capitalize">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
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
        <div className="grid gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <Link
              key={product.key}
              href={destinationHref(organizationSlug, product)}
              className="ecosystem-panel group hover:border-primary/35 grid min-h-40 gap-4 p-5 transition duration-200 hover:-translate-y-0.5 sm:grid-cols-[2.5rem_1fr]"
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
              <div className="col-span-full flex items-center justify-between border-t border-white/[0.05] pt-3">
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
