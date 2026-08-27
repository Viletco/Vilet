"use server";

import { redirect } from "next/navigation";
import {
  createPlatformServerClient,
  requireOrganizationMembership,
} from "@vilet/auth";
import { recordPlatformEvent } from "../../../../../lib/safe-events";

const MINIMUM_PASSWORD_LENGTH = 12;

export async function setAccountPassword(
  organizationSlug: string,
  formData: FormData,
) {
  await requireOrganizationMembership(organizationSlug);

  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("passwordConfirmation") ?? "");
  const destination = `/o/${organizationSlug}/settings/security`;

  if (password.length < MINIMUM_PASSWORD_LENGTH)
    redirect(`${destination}?passwordError=too-short`);
  if (password !== confirmation)
    redirect(`${destination}?passwordError=mismatch`);

  const client = await createPlatformServerClient();
  if (!client) redirect(`${destination}?passwordError=unavailable`);

  const { error } = await client.auth.updateUser({ password });
  if (error) {
    recordPlatformEvent("warn", "auth.password.update_failed", {
      reason: "provider_rejected",
      route: destination,
      status: error.status,
    });
    redirect(`${destination}?passwordError=provider-rejected`);
  }

  recordPlatformEvent("info", "auth.password.update_accepted", {
    route: destination,
  });
  redirect(`${destination}?passwordUpdated=1`);
}
