import { createPlatformServerClient, requireCapability } from "@vilet/auth";
import { PageHeader } from "../../../../../components/page-frame";
import {
  fieldClass,
  GrowthEmpty,
  GrowthNav,
  primaryButton,
  secondaryButton,
} from "../../../../../components/growth-nav";
import {
  sendApprovedOutreachAction,
  updateOutreachAction,
} from "../lead-engine-actions";

export default async function OutreachPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const context = await requireCapability(organizationSlug, "growth.outreach");
  const db = await createPlatformServerClient();
  const { data: messages } = db
    ? await db
        .from("growth_outreach_messages")
        .select("id,prospect_id,contact_id,subject,body,status,created_at")
        .eq("organization_id", context.organizationId)
        .order("created_at", { ascending: false })
        .limit(50)
    : { data: [] };
  const prospectIds = [
    ...new Set((messages ?? []).map((item) => item.prospect_id)),
  ];
  const contactIds = [
    ...new Set((messages ?? []).map((item) => item.contact_id)),
  ];
  const [prospectResult, contactResult, scoreResult, researchResult] =
    db && prospectIds.length
      ? await Promise.all([
          db
            .from("growth_prospects")
            .select("id,business_name,website_url")
            .eq("organization_id", context.organizationId)
            .in("id", prospectIds),
          db
            .from("growth_contacts")
            .select("id,name,title,email,source_type,verification_status")
            .eq("organization_id", context.organizationId)
            .in("id", contactIds),
          db
            .from("growth_scores")
            .select(
              "prospect_id,fit,need,potential_value,reachability,confidence,priority_score,explanation",
            )
            .eq("organization_id", context.organizationId)
            .in("prospect_id", prospectIds),
          db
            .from("growth_research")
            .select("prospect_id,evidence,inference,recommendation")
            .eq("organization_id", context.organizationId)
            .in("prospect_id", prospectIds),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }];
  const prospects = new Map(
    (prospectResult.data ?? []).map((item) => [item.id, item]),
  );
  const contacts = new Map(
    (contactResult.data ?? []).map((item) => [item.id, item]),
  );
  const scores = new Map(
    (scoreResult.data ?? []).map((item) => [item.prospect_id, item]),
  );
  const research = new Map(
    (researchResult.data ?? []).map((item) => [item.prospect_id, item]),
  );
  return (
    <>
      <GrowthNav slug={organizationSlug} current="outreach" />
      <PageHeader
        eyebrow="Human approval boundary"
        title="Outreach review"
        description="Review evidence-grounded drafts. Nothing sends until an Owner or Admin approves and explicitly sends it."
      />
      {!messages?.length ? (
        <GrowthEmpty
          title="No outreach drafts"
          description="Qualified prospects with a reliable contact will appear here after a discovery run."
        />
      ) : (
        <div className="space-y-5">
          {messages.map((message) => (
            <article
              key={message.id}
              className="border-border bg-card/30 rounded-2xl border p-6"
            >
              {(() => {
                const prospect = prospects.get(message.prospect_id);
                const contact = contacts.get(message.contact_id);
                const score = scores.get(message.prospect_id);
                const finding = research.get(message.prospect_id);
                const evidence = Array.isArray(finding?.evidence)
                  ? finding.evidence
                  : [];
                return (
                  <div className="border-border/70 mb-5 grid gap-4 border-b pb-5 lg:grid-cols-3">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase">
                        Business
                      </p>
                      <p className="mt-1 font-medium">
                        {prospect?.business_name ?? "Prospect"}
                      </p>
                      {prospect?.website_url && (
                        <a
                          href={prospect.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[var(--accent-light)]"
                        >
                          View website
                        </a>
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase">
                        Contact
                      </p>
                      <p className="mt-1 font-medium">
                        {contact?.name ?? contact?.email ?? "Unavailable"}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {[contact?.title, contact?.verification_status]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase">
                        Priority
                      </p>
                      <p className="mt-1 font-medium">
                        {score ? `${score.priority_score}/100` : "Not scored"}
                      </p>
                      {score && (
                        <p className="text-muted-foreground text-xs">
                          Fit {score.fit} · Need {score.need} · Value{" "}
                          {score.potential_value}
                          {" · "}Reach {score.reachability} · Confidence{" "}
                          {score.confidence}
                        </p>
                      )}
                    </div>
                    {finding && (
                      <div className="lg:col-span-3">
                        <p className="text-sm">{finding.inference}</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Recommendation: {finding.recommendation}. Evidence
                          items: {evidence.length}.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{message.subject}</h2>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Status: {message.status}
                  </p>
                </div>
              </div>
              <form action={updateOutreachAction} className="space-y-3">
                <input
                  type="hidden"
                  name="organization_slug"
                  value={organizationSlug}
                />
                <input type="hidden" name="message_id" value={message.id} />
                <input
                  name="subject"
                  defaultValue={message.subject}
                  maxLength={200}
                  className={fieldClass}
                />
                <textarea
                  name="body"
                  defaultValue={message.body}
                  maxLength={5000}
                  rows={9}
                  className={`${fieldClass} py-3`}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    name="intent"
                    value="edit"
                    className={secondaryButton}
                  >
                    Save edits
                  </button>
                  <button
                    name="intent"
                    value="approve"
                    className={primaryButton}
                  >
                    Approve
                  </button>
                  <button
                    name="intent"
                    value="reject"
                    className={secondaryButton}
                  >
                    Reject
                  </button>
                  <button
                    name="intent"
                    value="research"
                    className={secondaryButton}
                  >
                    Return for research
                  </button>
                  <button
                    name="intent"
                    value="suppress"
                    className={secondaryButton}
                  >
                    Suppress
                  </button>
                </div>
              </form>
              {message.status === "approved" && (
                <form action={sendApprovedOutreachAction} className="mt-3">
                  <input
                    type="hidden"
                    name="organization_slug"
                    value={organizationSlug}
                  />
                  <input type="hidden" name="message_id" value={message.id} />
                  <button className={primaryButton}>
                    Send approved email once
                  </button>
                </form>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  );
}
