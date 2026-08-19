"use server";

import { createPlatformServerClient, requireCapability } from "@vilet/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { recordPlatformEvent } from "../../../../lib/safe-events";
import {
  buildGrowthCandidate,
  cleanOptional,
  growthPipelineStages,
  isStrongDuplicate,
} from "../../../../lib/growth-domain";

function string(form: FormData, key: string) {
  return typeof form.get(key) === "string" ? String(form.get(key)).trim() : "";
}
function growthBase(slug: string) {
  return `/o/${slug}/growth`;
}
async function database() {
  const db = await createPlatformServerClient();
  if (!db) throw new Error("Growth database unavailable.");
  return db;
}
function validUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(
    value,
  );
}
function candidateFields(
  candidate: NonNullable<ReturnType<typeof buildGrowthCandidate>>,
) {
  const {
    fingerprint: _fingerprint,
    initial_note: _initialNote,
    ...fields
  } = candidate;
  void _fingerprint;
  void _initialNote;
  return fields;
}

export async function createProspectAction(form: FormData) {
  const slug = string(form, "organization_slug");
  const context = await requireCapability(slug, "growth.prospecting");
  const candidate = buildGrowthCandidate(Object.fromEntries(form));
  if (!candidate) redirect(`${growthBase(slug)}/prospects?error=business-name`);
  const db = await database();
  let duplicateQuery = db
    .from("growth_prospects")
    .select(
      "domain_normalized, business_name_normalized, city, region, phone_normalized, email_normalized",
    )
    .eq("organization_id", context.organizationId)
    .eq("status", "active");
  duplicateQuery = candidate.domain_normalized
    ? duplicateQuery.eq("domain_normalized", candidate.domain_normalized)
    : duplicateQuery.eq(
        "business_name_normalized",
        candidate.business_name_normalized,
      );
  const { data: duplicateCandidates } = await duplicateQuery.limit(25);
  if (
    (duplicateCandidates ?? []).some((existing) =>
      isStrongDuplicate(candidate, existing),
    )
  )
    redirect(`${growthBase(slug)}/prospects?error=duplicate`);
  const assigned = string(form, "assigned_user_id");
  const value = string(form, "estimated_value");
  const numericValue = value ? Number(value) : null;
  if (
    numericValue !== null &&
    (!Number.isFinite(numericValue) || numericValue < 0)
  )
    redirect(`${growthBase(slug)}/prospects?error=value`);
  const { data, error } = await db
    .from("growth_prospects")
    .insert({
      organization_id: context.organizationId,
      ...candidateFields(candidate),
      source_type: "manual",
      pipeline_stage: "review",
      status: "active",
      assigned_user_id: validUuid(assigned) ? assigned : null,
      estimated_value_minor:
        numericValue === null ? null : Math.round(numericValue * 100),
      currency: (string(form, "currency") || "USD").toUpperCase(),
      next_action: cleanOptional(form.get("next_action"), 240),
      next_action_at: string(form, "next_action_at") || null,
      created_by_user_id: context.userId,
      updated_by_user_id: context.userId,
    })
    .select("id")
    .single();
  if (error || !data) {
    recordPlatformEvent("warn", "growth.prospect.create_failed", {
      route: `${growthBase(slug)}/prospects`,
      reason: error?.code === "23505" ? "duplicate" : "database",
    });
    redirect(
      `${growthBase(slug)}/prospects?error=${error?.code === "23505" ? "duplicate" : "create"}`,
    );
  }
  const note = cleanOptional(form.get("note"), 4000);
  if (note) {
    const { error: noteError } = await db.from("growth_prospect_notes").insert({
      organization_id: context.organizationId,
      prospect_id: data.id,
      author_user_id: context.userId,
      body: note,
    });
    if (noteError) {
      recordPlatformEvent("warn", "growth.prospect.initial_note_failed", {
        route: `${growthBase(slug)}/prospects`,
        reason: "database",
      });
      redirect(`${growthBase(slug)}/prospects/${data.id}?error=note`);
    }
  }
  revalidatePath(growthBase(slug));
  redirect(`${growthBase(slug)}/prospects/${data.id}`);
}

export async function updateProspectAction(form: FormData) {
  const slug = string(form, "organization_slug");
  const prospectId = string(form, "prospect_id");
  const context = await requireCapability(slug, "growth.prospecting");
  if (!validUuid(prospectId)) redirect(`${growthBase(slug)}/prospects`);
  const candidate = buildGrowthCandidate(Object.fromEntries(form));
  if (!candidate)
    redirect(`${growthBase(slug)}/prospects/${prospectId}?error=business-name`);
  const db = await database();
  const { error } = await db
    .from("growth_prospects")
    .update({
      ...candidateFields(candidate),
      updated_by_user_id: context.userId,
    })
    .eq("organization_id", context.organizationId)
    .eq("id", prospectId);
  if (error)
    redirect(
      `${growthBase(slug)}/prospects/${prospectId}?error=${error.code === "23505" ? "duplicate" : "update"}`,
    );
  revalidatePath(`${growthBase(slug)}/prospects/${prospectId}`);
  redirect(`${growthBase(slug)}/prospects/${prospectId}?saved=business`);
}

export async function updatePipelineAction(form: FormData) {
  const slug = string(form, "organization_slug");
  const prospectId = string(form, "prospect_id");
  const context = await requireCapability(slug, "growth.pipeline");
  const stage = string(form, "pipeline_stage");
  if (!validUuid(prospectId) || !growthPipelineStages.includes(stage as never))
    redirect(growthBase(slug));
  const assigned = string(form, "assigned_user_id");
  const value = string(form, "estimated_value");
  const numericValue = value ? Number(value) : null;
  if (
    numericValue !== null &&
    (!Number.isFinite(numericValue) || numericValue < 0)
  )
    redirect(`${growthBase(slug)}/prospects/${prospectId}?error=value`);
  const db = await database();
  const { error } = await db
    .from("growth_prospects")
    .update({
      pipeline_stage: stage,
      assigned_user_id: validUuid(assigned) ? assigned : null,
      estimated_value_minor:
        numericValue === null ? null : Math.round(numericValue * 100),
      currency: (string(form, "currency") || "USD").toUpperCase(),
      next_action: cleanOptional(form.get("next_action"), 240),
      next_action_at: string(form, "next_action_at") || null,
      updated_by_user_id: context.userId,
    })
    .eq("organization_id", context.organizationId)
    .eq("id", prospectId);
  if (error)
    redirect(`${growthBase(slug)}/prospects/${prospectId}?error=pipeline`);
  revalidatePath(growthBase(slug));
  redirect(`${growthBase(slug)}/prospects/${prospectId}?saved=pipeline`);
}

export async function changeStageAction(form: FormData) {
  const slug = string(form, "organization_slug");
  const prospectId = string(form, "prospect_id");
  const stage = string(form, "pipeline_stage");
  const context = await requireCapability(slug, "growth.pipeline");
  if (!validUuid(prospectId) || !growthPipelineStages.includes(stage as never))
    redirect(growthBase(slug));
  const db = await database();
  const { error } = await db
    .from("growth_prospects")
    .update({ pipeline_stage: stage, updated_by_user_id: context.userId })
    .eq("organization_id", context.organizationId)
    .eq("id", prospectId);
  if (error)
    redirect(`${growthBase(slug)}/prospects/${prospectId}?error=stage`);
  revalidatePath(growthBase(slug));
  redirect(`${growthBase(slug)}/prospects/${prospectId}?saved=stage`);
}

export async function addNoteAction(form: FormData) {
  const slug = string(form, "organization_slug");
  const prospectId = string(form, "prospect_id");
  const body = cleanOptional(form.get("body"), 4000);
  const context = await requireCapability(slug, "growth.prospecting");
  if (!validUuid(prospectId) || !body)
    redirect(`${growthBase(slug)}/prospects/${prospectId}?error=note`);
  const db = await database();
  const { error } = await db.from("growth_prospect_notes").insert({
    organization_id: context.organizationId,
    prospect_id: prospectId,
    author_user_id: context.userId,
    body,
  });
  if (error) redirect(`${growthBase(slug)}/prospects/${prospectId}?error=note`);
  revalidatePath(`${growthBase(slug)}/prospects/${prospectId}`);
  redirect(`${growthBase(slug)}/prospects/${prospectId}?saved=note`);
}

export async function setRecordStatusAction(form: FormData) {
  const slug = string(form, "organization_slug");
  const prospectId = string(form, "prospect_id");
  const intent = string(form, "intent");
  const context = await requireCapability(
    slug,
    intent === "disqualify" ? "growth.pipeline" : "growth.prospecting",
  );
  if (!validUuid(prospectId)) redirect(growthBase(slug));
  const db = await database();
  let update: Record<string, unknown>;
  if (intent === "archive")
    update = {
      status: "archived",
      archived_at: new Date().toISOString(),
      duplicate_of_id: null,
    };
  else if (intent === "restore")
    update = { status: "active", archived_at: null, duplicate_of_id: null };
  else if (
    intent === "duplicate" &&
    validUuid(string(form, "duplicate_of_id"))
  ) {
    const duplicateTarget = string(form, "duplicate_of_id");
    const { data: target } = await db
      .from("growth_prospects")
      .select("id")
      .eq("organization_id", context.organizationId)
      .eq("id", duplicateTarget)
      .neq("id", prospectId)
      .maybeSingle();
    if (!target)
      redirect(`${growthBase(slug)}/prospects/${prospectId}?error=status`);
    update = {
      status: "duplicate",
      archived_at: null,
      duplicate_of_id: duplicateTarget,
    };
  } else if (intent === "disqualify")
    update = { status: "active", pipeline_stage: "disqualified" };
  else redirect(`${growthBase(slug)}/prospects/${prospectId}?error=status`);
  const { error } = await db
    .from("growth_prospects")
    .update({ ...update, updated_by_user_id: context.userId })
    .eq("organization_id", context.organizationId)
    .eq("id", prospectId);
  if (error)
    redirect(`${growthBase(slug)}/prospects/${prospectId}?error=status`);
  revalidatePath(growthBase(slug));
  redirect(
    intent === "archive" || intent === "duplicate"
      ? `${growthBase(slug)}/prospects`
      : `${growthBase(slug)}/prospects/${prospectId}`,
  );
}
