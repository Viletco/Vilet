"use server";

import { revalidatePath } from "next/cache";
import {
  createPlatformServerClient,
  requireCapability,
  requireOrganizationRole,
} from "@vilet/auth";
import { fetchGoogleAnalytics } from "../../../../lib/google-analytics";
import type { InsightsActionState } from "../../../../lib/insights-domain";

function safeMessage(error: unknown) {
  const code =
    error instanceof Error ? error.message : "INSIGHTS_UNKNOWN_FAILURE";
  const known: Record<string, string> = {
    INSIGHTS_NOT_CONFIGURED:
      "Google Analytics credentials are not configured for this environment.",
    INSIGHTS_INVALID_CREDENTIALS:
      "The configured Google credentials are invalid.",
    INSIGHTS_PROVIDER_AUTH_FAILED:
      "Google rejected the configured service account.",
    INSIGHTS_PROPERTY_NOT_ALLOWED:
      "This property is not approved for this environment.",
    INSIGHTS_PROVIDER_REQUEST_FAILED:
      "Google Analytics could not return the requested report.",
  };
  return known[code] ?? "Insights could not complete that request safely.";
}

export async function connectGoogleAnalytics(
  organizationSlug: string,
  _state: InsightsActionState,
  formData: FormData,
): Promise<InsightsActionState> {
  const context = await requireOrganizationRole(organizationSlug, [
    "owner",
    "admin",
  ]);
  await requireCapability(organizationSlug, "insights.analytics");
  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const displayName = String(
    formData.get("displayName") ?? "Vilét website",
  ).trim();
  if (
    !/^\d{4,20}$/.test(propertyId) ||
    !displayName ||
    displayName.length > 120
  )
    return {
      status: "error",
      message: "Enter a valid numeric GA4 property ID and source name.",
    };
  if (propertyId !== process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim())
    return {
      status: "error",
      message:
        "That GA4 property is not approved for this Preview environment.",
    };
  const db = await createPlatformServerClient();
  if (!db)
    return {
      status: "error",
      message: "Insights database configuration is unavailable.",
    };
  const { error } = await db.from("insights_sources").upsert(
    {
      organization_id: context.organizationId,
      provider: "google_analytics",
      display_name: displayName,
      external_property_id: propertyId,
      status: "active",
      last_error_code: null,
      created_by_user_id: context.userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "organization_id,provider,external_property_id" },
  );
  if (error)
    return {
      status: "error",
      message: "The approved source could not be saved.",
    };
  revalidatePath(`/o/${organizationSlug}/insights`);
  return {
    status: "success",
    message:
      "Google Analytics source connected. Run the first synchronization next.",
  };
}

export async function synchronizeInsights(
  organizationSlug: string,
  _state: InsightsActionState,
  formData: FormData,
): Promise<InsightsActionState> {
  const context = await requireOrganizationRole(organizationSlug, [
    "owner",
    "admin",
  ]);
  await requireCapability(organizationSlug, "insights.analytics");
  const sourceId = String(formData.get("sourceId") ?? "");
  const db = await createPlatformServerClient();
  if (!db)
    return {
      status: "error",
      message: "Insights database configuration is unavailable.",
    };
  const { data: source } = await db
    .from("insights_sources")
    .select("id,external_property_id")
    .eq("id", sourceId)
    .eq("organization_id", context.organizationId)
    .eq("status", "active")
    .returns<{ id: string; external_property_id: string }[]>()
    .maybeSingle();
  if (!source)
    return {
      status: "error",
      message: "The active analytics source was not found.",
    };
  const dateTo = new Date();
  dateTo.setUTCDate(dateTo.getUTCDate() - 1);
  const dateFrom = new Date(dateTo);
  dateFrom.setUTCDate(dateFrom.getUTCDate() - 29);
  const from = dateFrom.toISOString().slice(0, 10),
    to = dateTo.toISOString().slice(0, 10);
  const { data: run } = await db
    .from("insights_sync_runs")
    .insert({
      organization_id: context.organizationId,
      source_id: source.id,
      initiated_by_user_id: context.userId,
      status: "running",
      date_from: from,
      date_to: to,
    })
    .select("id")
    .returns<{ id: string }[]>()
    .single();
  if (!run)
    return {
      status: "error",
      message: "The synchronization could not be started.",
    };
  try {
    const rows = await fetchGoogleAnalytics(
      source.external_property_id,
      from,
      to,
    );
    if (rows.length) {
      const { error } = await db.from("insights_metric_snapshots").upsert(
        rows.map((row) => ({
          ...row,
          organization_id: context.organizationId,
          source_id: source.id,
          synced_at: new Date().toISOString(),
        })),
        { onConflict: "source_id,metric_date,scope,dimension_key" },
      );
      if (error) throw new Error("INSIGHTS_STORAGE_FAILED");
    }
    await Promise.all([
      db
        .from("insights_sync_runs")
        .update({
          status: "succeeded",
          rows_written: rows.length,
          completed_at: new Date().toISOString(),
        })
        .eq("id", run.id),
      db
        .from("insights_sources")
        .update({
          last_synced_at: new Date().toISOString(),
          last_error_code: null,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", source.id),
    ]);
    revalidatePath(`/o/${organizationSlug}/insights`);
    return {
      status: "success",
      message: `Synchronized ${rows.length} aggregate metric rows for the last 30 complete days.`,
    };
  } catch (error) {
    const safeCode =
      error instanceof Error && /^INSIGHTS_[A-Z_]+$/.test(error.message)
        ? error.message
        : "INSIGHTS_UNKNOWN_FAILURE";
    await Promise.all([
      db
        .from("insights_sync_runs")
        .update({
          status: "failed",
          safe_failure_code: safeCode,
          completed_at: new Date().toISOString(),
        })
        .eq("id", run.id),
      db
        .from("insights_sources")
        .update({
          status: "error",
          last_error_code: safeCode,
          updated_at: new Date().toISOString(),
        })
        .eq("id", source.id),
    ]);
    revalidatePath(`/o/${organizationSlug}/insights`);
    return { status: "error", message: safeMessage(error) };
  }
}
