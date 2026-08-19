import Link from "next/link";
import { requireCapability } from "@vilet/auth";
import { CsvImport } from "../../../../../components/csv-import";
import {
  GrowthEmpty,
  GrowthNav,
  fieldClass,
  primaryButton,
  secondaryButton,
} from "../../../../../components/growth-nav";
import { ProspectForm } from "../../../../../components/prospect-form";
import {
  listGrowthMembers,
  listGrowthProspects,
} from "../../../../../lib/growth-data";
import {
  growthPipelineStages,
  growthProspectStatuses,
  growthSourceTypes,
} from "../../../../../lib/growth-domain";

function value(prospect: {
  estimated_value_minor: number | null;
  currency: string;
}) {
  return prospect.estimated_value_minor == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: prospect.currency,
        maximumFractionDigits: 0,
      }).format(prospect.estimated_value_minor / 100);
}
export default async function ProspectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ organizationSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { organizationSlug } = await params;
  const context = await requireCapability(
    organizationSlug,
    "growth.prospecting",
  );
  const query = await searchParams;
  const text = (key: string) =>
    typeof query[key] === "string" ? (query[key] as string) : undefined;
  const [{ prospects, count, page, pageSize }, members] = await Promise.all([
    listGrowthProspects(context, {
      search: text("search"),
      stage: text("stage"),
      status: text("status") ?? "active",
      source: text("source"),
      assignment: text("assignment"),
      nextAction: text("next_action"),
      sort: text("sort"),
      page: Number(text("page") ?? 1),
    }),
    listGrowthMembers(context),
  ]);
  const base = `/o/${organizationSlug}/growth/prospects`;
  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    for (const key of [
      "search",
      "stage",
      "status",
      "source",
      "assignment",
      "next_action",
      "sort",
    ]) {
      const current = text(key);
      if (current) params.set(key, current);
    }
    params.set("page", String(targetPage));
    return `${base}?${params.toString()}`;
  };
  return (
    <>
      <GrowthNav slug={organizationSlug} current="prospects" />
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">
            Growth prospects
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">
            Prospect workspace.
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            {count} matching business prospect{count === 1 ? "" : "s"}.
          </p>
        </div>
        <a href="#add-prospect" className={primaryButton}>
          Add prospect
        </a>
      </div>
      {text("error") && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200"
        >
          {text("error") === "duplicate"
            ? "A strong duplicate already exists. Review the existing prospect instead."
            : "The prospect could not be saved. Review the fields and try again."}
        </p>
      )}
      <form className="mt-8 grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="xl:col-span-2">
          <span className="sr-only">Search prospects</span>
          <input
            className={fieldClass}
            name="search"
            defaultValue={text("search")}
            placeholder="Search business, domain, or city"
          />
        </label>
        <select
          aria-label="Stage"
          className={fieldClass}
          name="stage"
          defaultValue={text("stage") ?? ""}
        >
          <option value="">All stages</option>
          {growthPipelineStages.map((stage) => (
            <option key={stage} value={stage}>
              {stage.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <select
          aria-label="Assignment"
          className={fieldClass}
          name="assignment"
          defaultValue={text("assignment") ?? ""}
        >
          <option value="">All owners</option>
          <option value="unassigned">Unassigned</option>
          {members.map((member) => (
            <option key={member.user_id} value={member.user_id}>
              {member.profiles?.display_name ?? member.role}
            </option>
          ))}
        </select>
        <select
          aria-label="Next action"
          className={fieldClass}
          name="next_action"
          defaultValue={text("next_action") ?? ""}
        >
          <option value="">Any next action</option>
          <option value="overdue">Overdue</option>
          <option value="upcoming">Upcoming</option>
          <option value="none">No date set</option>
        </select>
        <select
          aria-label="Sort prospects"
          className={fieldClass}
          name="sort"
          defaultValue={text("sort") ?? "newest"}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Business name</option>
          <option value="value">Estimated value</option>
          <option value="next_action">Next action</option>
          <option value="stage">Stage</option>
        </select>
        <select
          aria-label="Status"
          className={fieldClass}
          name="status"
          defaultValue={text("status") ?? "active"}
        >
          {growthProspectStatuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <select
          aria-label="Source"
          className={fieldClass}
          name="source"
          defaultValue={text("source") ?? ""}
        >
          <option value="">All sources</option>
          {growthSourceTypes.map((source) => (
            <option key={source}>{source}</option>
          ))}
        </select>
        <button className={secondaryButton}>Apply filters</button>
      </form>
      <section className="mt-6">
        {prospects.length ? (
          <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
            <div className="hidden grid-cols-[minmax(12rem,2fr)_1fr_1fr_1fr_1fr] gap-4 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-xs tracking-wider text-[var(--quiet)] uppercase md:grid">
              <span>Business</span>
              <span>Stage</span>
              <span>Source</span>
              <span>Value</span>
              <span>Next action</span>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {prospects.map((prospect) => (
                <li key={prospect.id}>
                  <Link
                    href={`${base}/${prospect.id}`}
                    className="grid gap-3 bg-[var(--surface)] p-4 hover:bg-[var(--elevated)] md:grid-cols-[minmax(12rem,2fr)_1fr_1fr_1fr_1fr] md:items-center"
                  >
                    <span>
                      <strong className="block text-sm">
                        {prospect.business_name}
                      </strong>
                      <span className="text-xs text-[var(--quiet)]">
                        {(prospect.domain_normalized ??
                          [prospect.city, prospect.region]
                            .filter(Boolean)
                            .join(", ")) ||
                          "No domain"}
                      </span>
                    </span>
                    <span className="text-sm capitalize">
                      {prospect.pipeline_stage.replaceAll("_", " ")}
                    </span>
                    <span className="text-sm text-[var(--muted)] capitalize">
                      {prospect.source_type}
                    </span>
                    <span className="text-sm">{value(prospect)}</span>
                    <span className="text-sm text-[var(--muted)]">
                      {prospect.next_action ?? "—"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <GrowthEmpty
            title="No prospects match these filters."
            description="Adjust the filters, add a prospect, or import a CSV list."
          />
        )}
        {count > pageSize && (
          <div className="mt-5 flex justify-between text-sm">
            <span>
              Page {page} of {Math.ceil(count / pageSize)}
            </span>
            <div className="flex gap-2">
              {page > 1 && (
                <Link className={secondaryButton} href={pageHref(page - 1)}>
                  Previous
                </Link>
              )}
              {page * pageSize < count && (
                <Link className={secondaryButton} href={pageHref(page + 1)}>
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
      <section id="add-prospect" className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">
          Add prospect
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Business name is required. Strong domain duplicates are blocked.
        </p>
        <div className="mt-5">
          <ProspectForm slug={organizationSlug} members={members} />
        </div>
      </section>
      <section id="import-csv" className="mt-10 scroll-mt-24">
        <CsvImport slug={organizationSlug} />
      </section>
    </>
  );
}
