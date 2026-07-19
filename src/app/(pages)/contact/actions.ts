"use server";

import { headers } from "next/headers";
import { getPublishedServices, services } from "@/content";
import {
  createAbuseKeys,
  createContactAbuseStore,
  createContactProvider,
  createCorrelationId,
  deriveConnectionIdentifier,
  getContactConfig,
  validateContactSubmission,
  type ContactActionState,
} from "@/lib/contact";

const publicMessages = {
  delivered:
    "Your inquiry was sent successfully. Vilét will review the details and respond using the contact information you provided.",
  "not-configured":
    "This form is currently available for testing, but message delivery has not been activated yet.",
  "rate-limited":
    "Too many submissions were received from this connection. Please wait before trying again.",
  duplicate:
    "This inquiry matches a recent submission. Please wait before submitting it again.",
  "provider-error":
    "Your inquiry could not be sent right now. Please try again later.",
  "unexpected-error":
    "Your inquiry could not be processed right now. Please try again later.",
} as const;

export async function submitContact(
  _previous: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  if (String(formData.get("confirmation") ?? "").trim())
    return {
      status: "error",
      code: "spam-rejected",
      message: "The submission could not be processed.",
    };

  const validation = validateContactSubmission(formData);
  if (!validation.success) return validation.state;

  const startedAt = Number(formData.get("startedAt"));
  if (
    !Number.isFinite(startedAt) ||
    startedAt <= 0 ||
    Date.now() - startedAt < 1500
  )
    return {
      status: "error",
      code: "spam-rejected",
      message: "Please wait a moment, review the form, and submit again.",
      fieldErrors: { form: ["The form was submitted too quickly."] },
      values: validation.values,
    };

  const publishedServices = getPublishedServices(services);
  const selectedService = publishedServices.find(
    (service) => service.id === validation.data.serviceId,
  );
  if (!selectedService && validation.data.serviceId !== "not-sure")
    return {
      status: "error",
      code: "validation-error",
      message: "Review the highlighted fields and submit again.",
      fieldErrors: { serviceId: ["Choose an available service."] },
      values: validation.values,
    };

  try {
    const config = getContactConfig();
    const requestHeaders = await headers();
    const connectionIdentifier = deriveConnectionIdentifier(requestHeaders);
    const keys = createAbuseKeys(
      connectionIdentifier,
      validation.data,
      config.rateLimit.salt,
    );
    const abuse = await createContactAbuseStore(config).check(
      keys.connectionKey,
      keys.duplicateKey,
    );
    if (abuse.duplicate)
      return {
        status: "error",
        code: "duplicate",
        message: publicMessages.duplicate,
        values: validation.values,
      };
    if (!abuse.allowed)
      return {
        status: "error",
        code: "rate-limited",
        message: publicMessages["rate-limited"],
        fieldErrors: {
          form: [
            `Try again in approximately ${abuse.retryAfterSeconds ?? 900} seconds.`,
          ],
        },
        values: validation.values,
      };

    const provider = createContactProvider(config);
    const result = await provider.submit(validation.data, {
      correlationId: createCorrelationId(),
      serviceLabel: selectedService?.title ?? "Not sure yet",
    });
    if (result.delivery === "delivered")
      return {
        status: "success",
        code: "delivered",
        message: publicMessages.delivered,
        clearForm: true,
      };
    if (result.delivery === "not-configured")
      return {
        status: "notice",
        code: "not-configured",
        message: publicMessages["not-configured"],
        values: validation.values,
      };
    return {
      status: "error",
      code: "provider-error",
      message: publicMessages["provider-error"],
      values: validation.values,
    };
  } catch {
    return {
      status: "error",
      code: "unexpected-error",
      message: publicMessages["unexpected-error"],
      values: validation.values,
    };
  }
}
