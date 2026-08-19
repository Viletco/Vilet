import Link from "next/link";
import { requireCapability } from "@vilet/auth";
import {
  GrowthNav,
  fieldClass,
  primaryButton,
  secondaryButton,
} from "../../../../../../components/growth-nav";
import { ProspectForm } from "../../../../../../components/prospect-form";
import {
  getGrowthProspect,
  listGrowthMembers,
  listGrowthProspects,
} from "../../../../../../lib/growth-data";
import { growthPipelineStages } from "../../../../../../lib/growth-domain";
import {
  addNoteAction,
  setRecordStatusAction,
  updatePipelineAction,
} from "../../actions";

function dateTime(value: string | null) {
  return value ? new Date(value).toISOString().slice(0, 16) : "";
}
function eventLabel(value: string) {
  return value.replaceAll(".", " · ").replaceAll("_", " ");
}
export default async function ProspectDetail({
  params,
  searchParams,
}: {
  params: Promise<{ organizationSlug: string; prospectId: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { organizationSlug, prospectId } = await params;
  const context = await requireCapability(
    organizationSlug,
    "growth.prospecting",
  );
  const [{ prospect, notes, activities }, members, possibleDuplicates, state] =
    await Promise.all([
      getGrowthProspect(context, prospectId),
      listGrowthMembers(context),
      listGrowthProspects(context, {
        status: "active",
        page: 1,
        pageSize: 100,
      }),
      searchParams,
    ]);
  const base = `/o/${organizationSlug}/growth`;
  const canPipeline = context.capabilities.has("growth.pipeline");
  return (
    <>
      <GrowthNav slug={organizationSlug} current="prospects" />
      <Link
        className="text-sm text-[var(--muted)] hover:text-[var(--text)]"
        href={`${base}/prospects`}
      >
        ← Back to prospects
      </Link>
      <header className="mt-6 flex flex-col justify-between gap-5 border-b border-[var(--border)] pb-8 sm:flex-row sm:items-end">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs text-[var(--accent-light)] capitalize">
              {prospect.pipeline_stage.replaceAll("_", " ")}
            </span>
            <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--muted)] capitalize">
              {prospect.status}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em]">
            {prospect.business_name}
          </h1>
          <p className="mt-3 text-[var(--muted)]">
            {(prospect.domain_normalized ??
              [prospect.city, prospect.region, prospect.country]
                .filter(Boolean)
                .join(", ")) ||
              "Business prospect"}
          </p>
        </div>
        {prospect.website_url && (
          <a
            className={secondaryButton}
            href={prospect.website_url}
            target="_blank"
            rel="noreferrer"
          >
            Visit website
          </a>
        )}
      </header>
      {(state.saved || state.error) && (
        <p
          role="status"
          className={`mt-5 rounded-lg border p-3 text-sm ${state.error ? "border-red-400/30 bg-red-500/10 text-red-200" : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"}`}
        >
          {state.error
            ? "The requested change could not be saved."
            : "Changes saved."}
        </p>
      )}
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.8fr)]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold">Business details</h2>
            <ProspectForm
              slug={organizationSlug}
              members={members}
              prospect={prospect}
            />
          </section>
          {canPipeline && (
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
              <h2 className="text-xl font-semibold">Pipeline</h2>
              <form
                action={updatePipelineAction}
                className="mt-5 grid gap-5 sm:grid-cols-2"
              >
                <input
                  type="hidden"
                  name="organization_slug"
                  value={organizationSlug}
                />
                <input type="hidden" name="prospect_id" value={prospect.id} />
                <label className="grid gap-2 text-sm font-medium">
                  <span>Stage</span>
                  <select
                    className={fieldClass}
                    name="pipeline_stage"
                    defaultValue={prospect.pipeline_stage}
                  >
                    {growthPipelineStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  <span>Assigned owner</span>
                  <select
                    className={fieldClass}
                    name="assigned_user_id"
                    defaultValue={prospect.assigned_user_id ?? ""}
                  >
                    <option value="">Unassigned</option>
                    {members.map((member) => (
                      <option key={member.user_id} value={member.user_id}>
                        {member.profiles?.display_name ?? member.role}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  <span>Estimated value</span>
                  <input
                    className={fieldClass}
                    name="estimated_value"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={
                      prospect.estimated_value_minor == null
                        ? ""
                        : prospect.estimated_value_minor / 100
                    }
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  <span>Currency</span>
                  <input
                    className={fieldClass}
                    name="currency"
                    maxLength={3}
                    defaultValue={prospect.currency}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  <span>Next action</span>
                  <input
                    className={fieldClass}
                    name="next_action"
                    defaultValue={prospect.next_action ?? ""}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  <span>Next action date</span>
                  <input
                    className={fieldClass}
                    name="next_action_at"
                    type="datetime-local"
                    defaultValue={dateTime(prospect.next_action_at)}
                  />
                </label>
                <button className={primaryButton}>Save pipeline</button>
              </form>
            </section>
          )}
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-7">
            <h2 className="text-xl font-semibold">Notes</h2>
            <form action={addNoteAction} className="mt-5">
              <input
                type="hidden"
                name="organization_slug"
                value={organizationSlug}
              />
              <input type="hidden" name="prospect_id" value={prospect.id} />
              <label className="grid gap-2 text-sm font-medium">
                <span>Add note</span>
                <textarea
                  className={`${fieldClass} min-h-28 py-3`}
                  name="body"
                  maxLength={4000}
                  required
                />
              </label>
              <button className={`${primaryButton} mt-3`}>Add note</button>
            </form>
            {notes.length ? (
              <ul className="mt-6 divide-y divide-[var(--border)]">
                {notes.map((note) => (
                  <li key={note.id} className="py-4">
                    <p className="text-sm leading-6 whitespace-pre-wrap">
                      {note.body}
                    </p>
                    <time className="mt-2 block text-xs text-[var(--quiet)]">
                      {new Date(note.created_at).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-[var(--muted)]">No notes yet.</p>
            )}
          </section>
        </div>
        <aside className="space-y-8">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-semibold">Record actions</h2>
            <form action={setRecordStatusAction} className="mt-4 grid gap-3">
              <input
                type="hidden"
                name="organization_slug"
                value={organizationSlug}
              />
              <input type="hidden" name="prospect_id" value={prospect.id} />
              {prospect.status === "active" ? (
                <>
                  <button
                    className={secondaryButton}
                    name="intent"
                    value="disqualify"
                  >
                    Disqualify
                  </button>
                  <button
                    className={secondaryButton}
                    name="intent"
                    value="archive"
                  >
                    Archive
                  </button>
                  {possibleDuplicates.prospects.filter(
                    (item) => item.id !== prospect.id,
                  ).length > 0 && (
                    <>
                      <label className="grid gap-2 text-xs">
                        <span>Duplicate of</span>
                        <select
                          className={fieldClass}
                          name="duplicate_of_id"
                          defaultValue=""
                        >
                          <option value="">Select prospect</option>
                          {possibleDuplicates.prospects
                            .filter((item) => item.id !== prospect.id)
                            .map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.business_name}
                              </option>
                            ))}
                        </select>
                      </label>
                      <button
                        className={secondaryButton}
                        name="intent"
                        value="duplicate"
                      >
                        Mark duplicate
                      </button>
                    </>
                  )}
                </>
              ) : (
                <button
                  className={secondaryButton}
                  name="intent"
                  value="restore"
                >
                  Restore active record
                </button>
              )}
            </form>
          </section>
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-semibold">Activity</h2>
            {activities.length ? (
              <ol className="mt-4 border-l border-[var(--border)] pl-4">
                {activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="relative pb-5 text-sm before:absolute before:top-1.5 before:-left-[1.2rem] before:size-2 before:rounded-full before:bg-[var(--accent)]"
                  >
                    <p className="capitalize">
                      {eventLabel(activity.event_type)}
                    </p>
                    <time className="mt-1 block text-xs text-[var(--quiet)]">
                      {new Date(activity.occurred_at).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-[var(--muted)]">
                No activity yet.
              </p>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
