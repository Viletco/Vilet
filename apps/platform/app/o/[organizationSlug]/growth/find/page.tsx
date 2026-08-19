import { createPlatformServerClient, requireCapability } from "@vilet/auth";
import { PageHeader, StatCard } from "../../../../../components/page-frame";
import {
  fieldClass,
  GrowthNav,
  primaryButton,
} from "../../../../../components/growth-nav";
import { runLeadEngineAction } from "../lead-engine-actions";

export default async function FindProspectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ organizationSlug: string }>;
  searchParams: Promise<{ completed?: string; error?: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireCapability(
    organizationSlug,
    "growth.prospecting",
  );
  const query = await searchParams;
  const db = await createPlatformServerClient();
  const { data: latestRun } = db
    ? await db
        .from("growth_discovery_runs")
        .select(
          "found_count,created_count,duplicate_count,qualified_count,needs_contact_count,failed_count,status,created_at",
        )
        .eq("organization_id", context.organizationId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };
  return (
    <>
      <GrowthNav slug={organizationSlug} current="find" />
      <PageHeader
        eyebrow="Growth discovery"
        title="Find prospects"
        description="Run one bounded automated provider search. New businesses are deduplicated, researched, scored, enriched, and—when qualified—placed in human outreach review."
      />
      {query.completed && (
        <p className="border-border bg-card/40 mb-6 rounded-xl border p-4 text-sm">
          Discovery completed. Review Growth prospects and Outreach for results.
        </p>
      )}
      {latestRun && (
        <section
          aria-label="Latest discovery summary"
          className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-6"
        >
          {[
            ["Found", latestRun.found_count],
            ["New", latestRun.created_count],
            ["Duplicates", latestRun.duplicate_count],
            ["Qualified", latestRun.qualified_count],
            ["Needs contact", latestRun.needs_contact_count],
            ["Failed", latestRun.failed_count],
          ].map(([label, count]) => (
            <StatCard key={label} label={String(label)} value={count} />
          ))}
        </section>
      )}
      {query.error && (
        <p className="border-destructive/40 bg-destructive/10 mb-6 rounded-xl border p-4 text-sm">
          Discovery could not complete. Check the provider configuration and try
          again.
        </p>
      )}
      <form
        action={runLeadEngineAction}
        className="border-border bg-card/30 grid max-w-3xl gap-5 rounded-2xl border p-6 sm:grid-cols-2"
      >
        <input
          type="hidden"
          name="organization_slug"
          value={organizationSlug}
        />
        <label className="text-sm font-medium">
          Industry / business type
          <input
            required
            name="industry"
            maxLength={120}
            className={`${fieldClass} mt-2`}
            placeholder="Dental practices"
          />
        </label>
        <label className="text-sm font-medium">
          Location
          <input
            required
            name="location"
            maxLength={120}
            className={`${fieldClass} mt-2`}
            placeholder="Tampa, Florida"
          />
        </label>
        <label className="text-sm font-medium sm:col-span-2">
          Keywords (optional)
          <input
            name="keywords"
            maxLength={200}
            className={`${fieldClass} mt-2`}
            placeholder="independent, appointment-based"
          />
        </label>
        <label className="text-sm font-medium">
          Result limit
          <input
            name="limit"
            type="number"
            min="1"
            max="25"
            defaultValue="10"
            className={`${fieldClass} mt-2`}
          />
        </label>
        <div className="flex items-end">
          <button className={primaryButton}>Find prospects</button>
        </div>
      </form>
      <p className="text-muted-foreground mt-4 max-w-3xl text-xs leading-5">
        Maximum 25 businesses per run. No email is sent automatically. Every
        draft requires explicit approval by an authorized reviewer.
      </p>
    </>
  );
}
