import { createPlatformServerClient } from "@vilet/auth";
import { EmptyState, PageHeader } from "../../../../../components/page-frame";
import { PartnerNav, partnerCard } from "../../../../../components/partner-nav";
import { requireSalesPartner } from "../../../../../lib/partner-auth";
import { submitPartnerLead } from "../actions";

export default async function Leads({
  params,
  searchParams,
}: {
  params: Promise<{ organizationSlug: string }>;
  searchParams: Promise<{ result?: string; error?: string }>;
}) {
  const { organizationSlug } = await params;
  const query = await searchParams;
  const { context } = await requireSalesPartner(organizationSlug);
  const client = await createPlatformServerClient();
  const { data: leads = [] } = client
    ? await client.rpc("list_partner_own_leads", {
        target_organization_id: context.organizationId,
      })
    : { data: [] };
  const fields = [
    ["businessName", "Business name *"],
    ["website", "Website or domain"],
    ["publicContact", "Public business contact"],
    ["industry", "Industry/category"],
    ["city", "City"],
    ["region", "State/region"],
    ["services", "Services of interest"],
    ["source", "Source (partner, referral, inbound)"],
  ];
  return (
    <>
      <PartnerNav slug={organizationSlug} current="leads" />
      <PageHeader
        eyebrow="Partner opportunities"
        title="My leads"
        description="Submit a qualified business and track only your partner-safe attribution status. Internal research, notes, pricing, and other partners remain private."
      />
      {query.result && (
        <p className="border-primary/30 bg-primary/5 mt-6 rounded-md border p-3 text-sm">
          {query.result === "review"
            ? "This business may already exist in Vilét. Your submission has been sent for review."
            : "Lead submitted for Vilét review."}
        </p>
      )}
      {query.error && (
        <p className="mt-6 rounded-md border border-red-500/30 p-3 text-sm text-red-300">
          The lead could not be submitted. Review the required context and try
          again.
        </p>
      )}
      <section className={`${partnerCard} mt-6`}>
        <h2 className="font-semibold">Submit a lead</h2>
        <form
          action={submitPartnerLead.bind(null, organizationSlug)}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          {fields.map(([name, label]) => (
            <label key={name} className="text-sm">
              <span className="mb-1 block font-medium">{label}</span>
              <input
                name={name}
                required={name === "businessName"}
                className="border-border bg-background w-full rounded-md border px-3 py-2"
              />
            </label>
          ))}
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">
              Relationship/context *
            </span>
            <textarea
              name="relationship"
              required
              minLength={10}
              className="border-border bg-background min-h-24 w-full rounded-md border px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">What did you notice?</span>
            <textarea
              name="noticed"
              className="border-border bg-background min-h-20 w-full rounded-md border px-3 py-2"
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Potential need</span>
            <textarea
              name="need"
              className="border-border bg-background min-h-20 w-full rounded-md border px-3 py-2"
            />
          </label>
          <button className="bg-primary text-primary-foreground rounded-md px-4 py-3 text-sm font-semibold md:col-span-2">
            Submit for review
          </button>
        </form>
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Submitted businesses</h2>
        {!leads?.length ? (
          <EmptyState
            title="No partner leads to display."
            description="Qualified submissions will appear here after they are recorded."
          />
        ) : (
          <div className="mt-4 grid gap-3">
            {leads.map((lead: Record<string, unknown>) => (
              <article
                className={partnerCard}
                key={String(lead.attribution_id)}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {String(lead.business_name)}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {[lead.city, lead.region].filter(Boolean).join(", ") ||
                        "Location not supplied"}
                    </p>
                  </div>
                  <span className="text-primary text-[10px] uppercase">
                    {String(lead.partner_status).replace("_", " ")}
                  </span>
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  Submitted{" "}
                  {new Date(String(lead.submitted_at)).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
