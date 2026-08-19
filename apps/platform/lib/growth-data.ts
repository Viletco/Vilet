import "server-only";

import { createPlatformServerClient } from "@vilet/auth";
import type { OrganizationContext } from "@vilet/authorization";
import { notFound } from "next/navigation";
import type {
  GrowthPipelineStage,
  GrowthProspectStatus,
  GrowthSourceType,
} from "./growth-domain";

export interface GrowthProspect {
  id: string;
  organization_id: string;
  business_name: string;
  business_name_normalized: string;
  website_url: string | null;
  domain_normalized: string | null;
  phone: string | null;
  phone_normalized: string | null;
  email_public: string | null;
  email_normalized: string | null;
  industry: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  source_type: GrowthSourceType;
  status: GrowthProspectStatus;
  pipeline_stage: GrowthPipelineStage;
  assigned_user_id: string | null;
  estimated_value_minor: number | null;
  currency: string;
  next_action: string | null;
  next_action_at: string | null;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}
export interface GrowthNote {
  id: string;
  body: string;
  author_user_id: string;
  created_at: string;
  updated_at: string;
}
export interface GrowthActivity {
  id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  actor_user_id: string | null;
  occurred_at: string;
}
export interface GrowthMember {
  user_id: string;
  role: string;
  profiles: { display_name: string | null } | null;
}

async function client() {
  const value = await createPlatformServerClient();
  if (!value) throw new Error("Growth database unavailable.");
  return value;
}

export async function listGrowthProspects(
  context: OrganizationContext,
  options: {
    search?: string;
    stage?: string;
    status?: string;
    source?: string;
    assignment?: string;
    nextAction?: string;
    sort?: string;
    page?: number;
    pageSize?: number;
  } = {},
) {
  const db = await client();
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 25));
  let query = db
    .from("growth_prospects")
    .select("*", { count: "exact" })
    .eq("organization_id", context.organizationId);
  if (options.search)
    query = query.or(
      `business_name.ilike.%${options.search.replace(/[%_,()]/gu, "")}%,domain_normalized.ilike.%${options.search.replace(/[%_,()]/gu, "")}%,city.ilike.%${options.search.replace(/[%_,()]/gu, "")}%`,
    );
  if (options.stage) query = query.eq("pipeline_stage", options.stage);
  if (options.status) query = query.eq("status", options.status);
  if (options.source) query = query.eq("source_type", options.source);
  if (options.assignment === "unassigned")
    query = query.is("assigned_user_id", null);
  else if (options.assignment)
    query = query.eq("assigned_user_id", options.assignment);
  if (options.nextAction === "overdue")
    query = query.lt("next_action_at", new Date().toISOString());
  else if (options.nextAction === "upcoming")
    query = query.gte("next_action_at", new Date().toISOString());
  else if (options.nextAction === "none")
    query = query.is("next_action_at", null);
  const sort = options.sort ?? "newest";
  if (sort === "oldest") query = query.order("created_at", { ascending: true });
  else if (sort === "name")
    query = query.order("business_name", { ascending: true });
  else if (sort === "value")
    query = query.order("estimated_value_minor", {
      ascending: false,
      nullsFirst: false,
    });
  else if (sort === "next_action")
    query = query.order("next_action_at", {
      ascending: true,
      nullsFirst: false,
    });
  else if (sort === "stage")
    query = query.order("pipeline_stage", { ascending: true });
  else query = query.order("created_at", { ascending: false });
  const { data, error, count } = await query
    .range((page - 1) * pageSize, page * pageSize - 1)
    .returns<GrowthProspect[]>();
  if (error) throw new Error("Prospects could not be loaded.");
  return { prospects: data ?? [], count: count ?? 0, page, pageSize };
}

export async function getGrowthProspect(
  context: OrganizationContext,
  prospectId: string,
) {
  const db = await client();
  const [{ data: prospect }, { data: notes }, { data: activities }] =
    await Promise.all([
      db
        .from("growth_prospects")
        .select("*")
        .eq("organization_id", context.organizationId)
        .eq("id", prospectId)
        .returns<GrowthProspect[]>()
        .maybeSingle(),
      db
        .from("growth_prospect_notes")
        .select("id, body, author_user_id, created_at, updated_at")
        .eq("organization_id", context.organizationId)
        .eq("prospect_id", prospectId)
        .order("created_at", { ascending: false })
        .limit(50)
        .returns<GrowthNote[]>(),
      db
        .from("growth_activities")
        .select("id, event_type, metadata, actor_user_id, occurred_at")
        .eq("organization_id", context.organizationId)
        .eq("prospect_id", prospectId)
        .order("occurred_at", { ascending: false })
        .limit(50)
        .returns<GrowthActivity[]>(),
    ]);
  if (!prospect) notFound();
  return { prospect, notes: notes ?? [], activities: activities ?? [] };
}

export async function listGrowthMembers(context: OrganizationContext) {
  const db = await client();
  const { data: memberships, error } = await db
    .from("organization_memberships")
    .select("user_id, role")
    .eq("organization_id", context.organizationId)
    .eq("status", "active");
  if (error) throw new Error("Organization members could not be loaded.");
  const userIds = (memberships ?? []).map((membership) => membership.user_id);
  if (!userIds.length) return [];
  const { data: profiles, error: profileError } = await db
    .from("profiles")
    .select("user_id, display_name")
    .in("user_id", userIds);
  if (profileError) throw new Error("Member profiles could not be loaded.");
  const names = new Map(
    (profiles ?? []).map((profile) => [profile.user_id, profile.display_name]),
  );
  return (memberships ?? []).map((membership) => ({
    ...membership,
    profiles: { display_name: names.get(membership.user_id) ?? null },
  })) satisfies GrowthMember[];
}

export async function getGrowthOverview(context: OrganizationContext) {
  const db = await client();
  const now = new Date().toISOString();
  const [active, review, qualified, opportunities, upcoming, recent, activity] =
    await Promise.all([
      db
        .from("growth_prospects")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", context.organizationId)
        .eq("status", "active"),
      db
        .from("growth_prospects")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", context.organizationId)
        .eq("status", "active")
        .eq("pipeline_stage", "review"),
      db
        .from("growth_prospects")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", context.organizationId)
        .eq("status", "active")
        .eq("pipeline_stage", "qualified"),
      db
        .from("growth_prospects")
        .select("estimated_value_minor")
        .eq("organization_id", context.organizationId)
        .eq("status", "active")
        .in("pipeline_stage", ["opportunity", "won"])
        .returns<{ estimated_value_minor: number | null }[]>(),
      db
        .from("growth_prospects")
        .select("id, business_name, next_action, next_action_at")
        .eq("organization_id", context.organizationId)
        .eq("status", "active")
        .not("next_action_at", "is", null)
        .gte("next_action_at", now)
        .order("next_action_at")
        .limit(5),
      db
        .from("growth_prospects")
        .select("id, business_name, pipeline_stage, updated_at")
        .eq("organization_id", context.organizationId)
        .order("created_at", { ascending: false })
        .limit(5),
      db
        .from("growth_activities")
        .select("id, event_type, occurred_at, prospect_id")
        .eq("organization_id", context.organizationId)
        .order("occurred_at", { ascending: false })
        .limit(8),
    ]);
  return {
    active: active.count ?? 0,
    review: review.count ?? 0,
    qualified: qualified.count ?? 0,
    pipelineValue: (opportunities.data ?? []).reduce(
      (sum, item) => sum + (item.estimated_value_minor ?? 0),
      0,
    ),
    upcoming: upcoming.data ?? [],
    recent: recent.data ?? [],
    activity: activity.data ?? [],
  };
}
