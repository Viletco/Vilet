"use server";

import { createPlatformServerClient, requireCapability } from "@vilet/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  buildGrowthCandidate,
  isStrongDuplicate,
} from "../../../../lib/growth-domain";
import {
  buildOutreachDraft,
  buildResearch,
  leadIdempotencyKey,
  scoreLead,
  validateDiscoveryInput,
} from "../../../../lib/lead-engine-domain";
import {
  discoverBusinesses,
  enrichBusinessContact,
  growthDiscoveryProvider,
  sendGrowthEmail,
} from "../../../../lib/growth-providers";

const value = (form: FormData, key: string) =>
  String(form.get(key) ?? "").trim();
const base = (slug: string) => `/o/${slug}/growth`;
async function database() {
  const db = await createPlatformServerClient();
  if (!db) throw new Error("Growth database unavailable.");
  return db;
}

export async function runLeadEngineAction(form: FormData) {
  const slug = value(form, "organization_slug");
  const context = await requireCapability(slug, "growth.prospecting");
  const input = validateDiscoveryInput({
    industry: form.get("industry"),
    location: form.get("location"),
    keywords: form.get("keywords"),
    limit: form.get("limit"),
  });
  if (!input) redirect(`${base(slug)}/find?error=input`);
  const db = await database();
  const provider = growthDiscoveryProvider();
  const { data: run } = await db
    .from("growth_discovery_runs")
    .insert({
      organization_id: context.organizationId,
      created_by_user_id: context.userId,
      provider,
      industry: input.industry,
      location: input.location,
      keywords: input.keywords,
      requested_limit: input.limit,
      status: "running",
    })
    .select("id")
    .single();
  if (!run) redirect(`${base(slug)}/find?error=database`);
  try {
    const businesses = await discoverBusinesses(input);
    let created = 0;
    let duplicates = 0;
    let qualified = 0;
    let needsContact = 0;
    let failed = 0;
    for (const business of businesses) {
      try {
        const candidate = buildGrowthCandidate({
          business_name: business.name,
          website: business.website,
          industry: business.industry,
          city: business.city,
          region: business.region,
          country: business.country,
          phone: business.phone,
        });
        if (!candidate) {
          failed += 1;
          continue;
        }
        let query = db
          .from("growth_prospects")
          .select(
            "id,domain_normalized,business_name_normalized,city,region,phone_normalized,email_normalized",
          )
          .eq("organization_id", context.organizationId)
          .eq("status", "active");
        query = candidate.domain_normalized
          ? query.eq("domain_normalized", candidate.domain_normalized)
          : query.eq(
              "business_name_normalized",
              candidate.business_name_normalized,
            );
        const { data: existing } = await query.limit(10);
        const duplicate = (existing ?? []).find((item) =>
          isStrongDuplicate(candidate, item),
        );
        if (duplicate) {
          duplicates += 1;
          await db.from("growth_activities").insert({
            organization_id: context.organizationId,
            prospect_id: duplicate.id,
            actor_user_id: context.userId,
            event_type: "discovery.matched_existing",
            metadata: { source: business.provider },
          });
          continue;
        }
        const { data: prospect } = await db
          .from("growth_prospects")
          .insert({
            organization_id: context.organizationId,
            business_name: candidate.business_name,
            business_name_normalized: candidate.business_name_normalized,
            website_url: candidate.website_url,
            domain_normalized: candidate.domain_normalized,
            phone: candidate.phone,
            phone_normalized: candidate.phone_normalized,
            industry: candidate.industry,
            city: candidate.city,
            region: candidate.region,
            country: candidate.country,
            source_type: "provider",
            source_reference: business.providerId,
            pipeline_stage: "review",
            status: "active",
            created_by_user_id: context.userId,
            updated_by_user_id: context.userId,
          })
          .select("id")
          .single();
        if (!prospect) {
          failed += 1;
          continue;
        }
        const contact = await enrichBusinessContact(business).catch(() => null);
        const signals = {
          website: business.website,
          phone: business.phone,
          industry: business.industry,
          city: business.city,
          contactEmail: contact?.email ?? null,
          contactVerified: contact?.verificationStatus === "verified",
        };
        const research = buildResearch(signals);
        const score = scoreLead(signals);
        if (score.priority_score >= 60) qualified += 1;
        await db.from("growth_research").insert({
          organization_id: context.organizationId,
          prospect_id: prospect.id,
          provider: business.provider,
          ...research,
        });
        await db.from("growth_scores").insert({
          organization_id: context.organizationId,
          prospect_id: prospect.id,
          ...score,
        });
        if (contact) {
          const { data: savedContact } = await db
            .from("growth_contacts")
            .insert({
              organization_id: context.organizationId,
              prospect_id: prospect.id,
              name: contact.name,
              title: contact.title,
              email: contact.email,
              email_normalized: contact.email,
              source_type: business.provider,
              source_reference: contact.providerId,
              verification_status: contact.verificationStatus,
              confidence: contact.confidence,
            })
            .select("id")
            .single();
          if (savedContact && score.priority_score >= 60) {
            const draft = buildOutreachDraft(
              business.name,
              contact.name,
              research,
            );
            await db.from("growth_outreach_messages").insert({
              organization_id: context.organizationId,
              prospect_id: prospect.id,
              contact_id: savedContact.id,
              subject: draft.subject,
              body: draft.body,
              status: "review",
              generation_version: draft.generationVersion,
              evidence_references: draft.evidenceReferences,
              idempotency_key: leadIdempotencyKey(
                context.organizationId,
                prospect.id,
                savedContact.id,
              ),
              created_by_user_id: context.userId,
            });
            await db
              .from("growth_prospects")
              .update({
                pipeline_stage: "outreach_ready",
                updated_by_user_id: context.userId,
              })
              .eq("id", prospect.id)
              .eq("organization_id", context.organizationId);
          }
        } else {
          needsContact += 1;
          await db.from("growth_activities").insert({
            organization_id: context.organizationId,
            prospect_id: prospect.id,
            actor_user_id: context.userId,
            event_type: "contact.not_found",
            metadata: { source: business.provider },
          });
          if (score.priority_score >= 60)
            await db
              .from("growth_prospects")
              .update({
                pipeline_stage: "qualified",
                updated_by_user_id: context.userId,
              })
              .eq("id", prospect.id)
              .eq("organization_id", context.organizationId);
        }
        created += 1;
      } catch {
        failed += 1;
      }
    }
    await db
      .from("growth_discovery_runs")
      .update({
        found_count: businesses.length,
        created_count: created,
        duplicate_count: duplicates,
        qualified_count: qualified,
        needs_contact_count: needsContact,
        failed_count: failed,
        status: "succeeded",
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id)
      .eq("organization_id", context.organizationId);
    revalidatePath(base(slug));
    redirect(`${base(slug)}/find?completed=1`);
  } catch (error) {
    await db
      .from("growth_discovery_runs")
      .update({
        status: "failed",
        safe_failure_code:
          error instanceof Error &&
          ["APOLLO_NOT_CONFIGURED", "HUNTER_NOT_CONFIGURED"].includes(
            error.message,
          )
            ? "provider_not_configured"
            : "provider_failed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", run.id)
      .eq("organization_id", context.organizationId);
    redirect(`${base(slug)}/find?error=provider`);
  }
}

export async function updateOutreachAction(form: FormData) {
  const slug = value(form, "organization_slug");
  const id = value(form, "message_id");
  const intent = value(form, "intent");
  const context = await requireCapability(slug, "growth.outreach");
  const db = await database();
  if (intent === "suppress") {
    const { data: target } = await db
      .from("growth_outreach_messages")
      .select("prospect_id,contact_id")
      .eq("id", id)
      .eq("organization_id", context.organizationId)
      .single();
    const { data: contact } = target
      ? await db
          .from("growth_contacts")
          .select("email_normalized")
          .eq("id", target.contact_id)
          .eq("organization_id", context.organizationId)
          .single()
      : { data: null };
    if (target && contact) {
      const { data: existingSuppression } = await db
        .from("growth_suppressions")
        .select("id")
        .eq("organization_id", context.organizationId)
        .eq("email_normalized", contact.email_normalized)
        .maybeSingle();
      if (!existingSuppression)
        await db.from("growth_suppressions").insert({
          organization_id: context.organizationId,
          prospect_id: target.prospect_id,
          email_normalized: contact.email_normalized,
          reason: "manual",
          source: "outreach_review",
          created_by_user_id: context.userId,
        });
    }
  }
  const update =
    intent === "approve"
      ? {
          status: "approved",
          approved_by_user_id: context.userId,
          approved_at: new Date().toISOString(),
        }
      : intent === "reject"
        ? { status: "cancelled" }
        : intent === "suppress"
          ? { status: "suppressed" }
          : {
              subject: value(form, "subject").slice(0, 200),
              body: value(form, "body").slice(0, 5000),
              status: "review",
            };
  await db
    .from("growth_outreach_messages")
    .update(update)
    .eq("id", id)
    .eq("organization_id", context.organizationId)
    .neq("status", "sent");
  if (intent === "research") {
    const { data: target } = await db
      .from("growth_outreach_messages")
      .select("prospect_id")
      .eq("id", id)
      .eq("organization_id", context.organizationId)
      .single();
    if (target)
      await db
        .from("growth_prospects")
        .update({
          pipeline_stage: "review",
          updated_by_user_id: context.userId,
        })
        .eq("id", target.prospect_id)
        .eq("organization_id", context.organizationId);
  }
  revalidatePath(`${base(slug)}/outreach`);
  redirect(`${base(slug)}/outreach`);
}

export async function sendApprovedOutreachAction(form: FormData) {
  const slug = value(form, "organization_slug");
  const id = value(form, "message_id");
  const context = await requireCapability(slug, "growth.outreach");
  if (!["owner", "admin"].includes(context.role))
    redirect(`${base(slug)}/outreach?error=authorization`);
  const db = await database();
  const since = new Date(Date.now() - 86_400_000).toISOString();
  const { count: sentToday } = await db
    .from("growth_outreach_messages")
    .select("id", { count: "exact", head: true })
    .eq("organization_id", context.organizationId)
    .eq("status", "sent")
    .gte("sent_at", since);
  if ((sentToday ?? 0) >= 10)
    redirect(`${base(slug)}/outreach?error=daily-limit`);
  const { data: message } = await db
    .from("growth_outreach_messages")
    .update({ status: "sending" })
    .eq("id", id)
    .eq("organization_id", context.organizationId)
    .eq("status", "approved")
    .select("id,prospect_id,contact_id,subject,body,idempotency_key")
    .maybeSingle();
  if (!message) redirect(`${base(slug)}/outreach?error=not-approved`);
  const { data: contact } = await db
    .from("growth_contacts")
    .select("email,email_normalized")
    .eq("id", message.contact_id)
    .eq("organization_id", context.organizationId)
    .single();
  const { data: suppression } = contact
    ? await db
        .from("growth_suppressions")
        .select("id")
        .eq("organization_id", context.organizationId)
        .or(
          `email_normalized.eq.${contact.email_normalized},prospect_id.eq.${message.prospect_id}`,
        )
        .limit(1)
        .maybeSingle()
    : { data: null };
  if (!contact || suppression) {
    await db
      .from("growth_outreach_messages")
      .update({
        status: "suppressed",
        safe_failure_code: "recipient_suppressed",
      })
      .eq("id", id);
    redirect(`${base(slug)}/outreach?error=suppressed`);
  }
  try {
    const sent = await sendGrowthEmail({
      to: contact.email,
      subject: message.subject,
      text: message.body,
      idempotencyKey: message.idempotency_key,
    });
    await db
      .from("growth_outreach_messages")
      .update({
        status: "sent",
        provider_message_id: sent.providerMessageId,
        sent_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("status", "sending");
    await db
      .from("growth_prospects")
      .update({
        pipeline_stage: "contacted",
        updated_by_user_id: context.userId,
      })
      .eq("id", message.prospect_id)
      .eq("organization_id", context.organizationId);
  } catch {
    await db
      .from("growth_outreach_messages")
      .update({ status: "failed", safe_failure_code: "provider_failed" })
      .eq("id", id)
      .eq("status", "sending");
  }
  revalidatePath(`${base(slug)}/outreach`);
  redirect(`${base(slug)}/outreach`);
}
