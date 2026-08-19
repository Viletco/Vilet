"use server";

import { createPlatformServerClient } from "@vilet/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSalesPartner } from "../../../../lib/partner-auth";

const text = (form: FormData, key: string, limit = 500) =>
  String(form.get(key) ?? "")
    .trim()
    .slice(0, limit);

export async function completeLesson(
  organizationSlug: string,
  moduleKey: string,
  form: FormData,
) {
  const { context, partner } = await requireSalesPartner(organizationSlug);
  const client = await createPlatformServerClient();
  if (!client) redirect("/login");
  const lessonKey = text(form, "lessonKey", 80) || "core";
  const { error } = await client.from("sales_training_progress").upsert(
    {
      organization_id: context.organizationId,
      partner_id: partner.id,
      module_key: moduleKey,
      lesson_key: lessonKey,
      completed_at: new Date().toISOString(),
      last_viewed_at: new Date().toISOString(),
    },
    { onConflict: "partner_id,module_key,lesson_key" },
  );
  if (error) redirect(`/o/${organizationSlug}/partner/training?error=progress`);
  revalidatePath(`/o/${organizationSlug}/partner`);
  revalidatePath(`/o/${organizationSlug}/partner/training`);
}

export async function submitPartnerLead(
  organizationSlug: string,
  form: FormData,
) {
  const { context } = await requireSalesPartner(organizationSlug);
  const client = await createPlatformServerClient();
  if (!client) redirect("/login");
  const relationship = text(form, "relationship", 800);
  const noticed = text(form, "noticed", 800);
  const need = text(form, "need", 500);
  const services = text(form, "services", 300);
  const publicContact = text(form, "publicContact", 300);
  const source = text(form, "source", 80) || "partner";
  const contextSummary = [
    `Relationship: ${relationship}`,
    noticed && `Observed: ${noticed}`,
    need && `Potential need: ${need}`,
    services && `Services of interest: ${services}`,
    publicContact && `Public business contact: ${publicContact}`,
    `Submission source: ${source}`,
  ]
    .filter(Boolean)
    .join("\n");
  const { data, error } = await client.rpc("submit_partner_lead", {
    target_organization_id: context.organizationId,
    submitted_business_name: text(form, "businessName", 200),
    submitted_website_url: text(form, "website", 500) || null,
    submitted_industry: text(form, "industry", 160) || null,
    submitted_city: text(form, "city", 120) || null,
    submitted_region: text(form, "region", 120) || null,
    submitted_relationship_context: contextSummary,
    submission_key: crypto.randomUUID(),
  });
  if (error) redirect(`/o/${organizationSlug}/partner/leads?error=submission`);
  const state = data?.status === "conflict" ? "review" : "submitted";
  revalidatePath(`/o/${organizationSlug}/partner/leads`);
  redirect(`/o/${organizationSlug}/partner/leads?result=${state}`);
}
