import "server-only";

import { createPlatformServerClient, requireCapability } from "@vilet/auth";
import { notFound } from "next/navigation";

export type ActivePartnerStatus = "onboarding" | "training" | "active";

export interface PartnerContext {
  id: string;
  organization_id: string;
  user_id: string;
  status: ActivePartnerStatus;
}

export async function requireSalesPartner(organizationSlug: string) {
  const context = await requireCapability(organizationSlug, "partner.access");
  const client = await createPlatformServerClient();
  if (!client) notFound();
  const { data: partner } = await client
    .from("sales_partners")
    .select("id, organization_id, user_id, status")
    .eq("organization_id", context.organizationId)
    .eq("user_id", context.userId)
    .in("status", ["onboarding", "training", "active"])
    .returns<PartnerContext[]>()
    .maybeSingle();
  if (!partner) notFound();
  return { context, partner };
}
