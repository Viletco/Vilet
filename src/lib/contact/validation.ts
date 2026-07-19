import {
  budgetRanges,
  contactMethods,
  timelineOptions,
  type ContactActionState,
  type ContactField,
  type ContactFormValues,
  type ContactSubmission,
} from "./types";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}
export function validateContactSubmission(formData: FormData):
  | {
      readonly success: true;
      readonly data: ContactSubmission;
      readonly values: ContactFormValues;
    }
  | { readonly success: false; readonly state: ContactActionState } {
  const values: ContactFormValues = {
    name: text(formData, "name"),
    company: text(formData, "company"),
    email: text(formData, "email"),
    website: text(formData, "website"),
    serviceId: text(formData, "serviceId"),
    projectSummary: text(formData, "projectSummary"),
    goals: text(formData, "goals"),
    budgetRange: text(formData, "budgetRange"),
    timeline: text(formData, "timeline"),
    preferredContactMethod: text(formData, "preferredContactMethod"),
  };
  const errors: Partial<Record<ContactField, string[]>> = {};
  const required: Array<[ContactField, string, number]> = [
    ["name", values.name, 120],
    ["company", values.company, 160],
    ["email", values.email, 254],
    ["serviceId", values.serviceId, 100],
    ["projectSummary", values.projectSummary, 2000],
    ["goals", values.goals, 1500],
    ["preferredContactMethod", values.preferredContactMethod, 50],
  ];
  required.forEach(([field, value, max]) => {
    if (!value) errors[field] = ["This field is required."];
    else if (value.length > max)
      errors[field] = [`Use ${max} characters or fewer.`];
  });
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = ["Enter a valid email address."];
  if (values.website) {
    try {
      const url = new URL(values.website);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    } catch {
      errors.website = [
        "Enter a complete website URL beginning with http:// or https://.",
      ];
    }
  }
  if (values.budgetRange && !budgetRanges.includes(values.budgetRange as never))
    errors.budgetRange = ["Choose an available budget range."];
  if (values.timeline && !timelineOptions.includes(values.timeline as never))
    errors.timeline = ["Choose an available timeline."];
  if (!contactMethods.includes(values.preferredContactMethod as never))
    errors.preferredContactMethod = ["Choose an available contact method."];
  if (Object.keys(errors).length > 0)
    return {
      success: false,
      state: {
        status: "error",
        code: "validation-error",
        message: "Review the highlighted fields and submit again.",
        fieldErrors: errors,
        values,
      },
    };
  return {
    success: true,
    data: {
      name: values.name,
      company: values.company,
      email: values.email,
      website: values.website || undefined,
      serviceId: values.serviceId,
      projectSummary: values.projectSummary,
      goals: values.goals,
      budgetRange: values.budgetRange as ContactSubmission["budgetRange"],
      timeline: values.timeline as ContactSubmission["timeline"],
      preferredContactMethod:
        values.preferredContactMethod as ContactSubmission["preferredContactMethod"],
    },
    values,
  };
}
