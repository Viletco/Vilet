"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { ServiceRecord } from "@/content";
import type { ContactActionState, ContactField } from "@/lib/contact";
import { Button, Heading, Text } from "@/components/ui";
import { cn } from "@/lib/cn";

const initialState: ContactActionState = { status: "idle" };
const controlClasses =
  "border-border bg-surface text-text-primary focus-visible:ring-focus-ring min-h-11 w-full rounded-md border px-(--ds-space-md) py-(--ds-space-sm) outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      loading={pending}
      disabled={pending}
      loadingLabel="Submitting project details"
    >
      Submit project details
    </Button>
  );
}

export function ContactForm({
  action,
  services,
}: {
  readonly action: (
    state: ContactActionState,
    formData: FormData,
  ) => Promise<ContactActionState>;
  readonly services: readonly ServiceRecord[];
}) {
  const [state, formAction] = useActionState(action, initialState);
  const startedAtRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
    const handoff = sessionStorage.getItem("vilet-ai-handoff");
    if (!handoff || !formRef.current) return;
    sessionStorage.removeItem("vilet-ai-handoff");
    try {
      const values = JSON.parse(handoff) as {
        projectSummary?: string;
        goals?: string;
      };
      for (const name of ["projectSummary", "goals"] as const) {
        const control = formRef.current.elements.namedItem(name);
        if (control instanceof HTMLTextAreaElement && values[name])
          control.value = values[name];
      }
    } catch {
      // Invalid or stale handoff data is discarded without interrupting the form.
    }
  }, []);
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);
  useEffect(() => {
    if (state.code === "delivered" && state.clearForm) {
      formRef.current?.reset();
      if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
      return;
    }
    if (!state.values || !formRef.current) return;
    for (const [name, value] of Object.entries(state.values)) {
      const control = formRef.current.elements.namedItem(name);
      if (
        control instanceof HTMLInputElement ||
        control instanceof HTMLTextAreaElement ||
        control instanceof HTMLSelectElement
      )
        control.value = value;
    }
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, [state]);
  const errors = state.fieldErrors ?? {};
  const describedBy = (field: ContactField, hint?: string) =>
    [hint, errors[field]?.length ? `${field}-error` : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  const error = (field: ContactField) =>
    errors[field]?.length ? (
      <Text id={`${field}-error`} variant="body-sm" className="text-danger">
        {errors[field]?.join(" ")}
      </Text>
    ) : null;
  return (
    <form ref={formRef} action={formAction} className="space-y-(--ds-space-xl)">
      <input
        ref={startedAtRef}
        type="hidden"
        name="startedAt"
        defaultValue="0"
      />
      <div hidden aria-hidden="true">
        <label htmlFor="confirmation">Leave this field empty</label>
        <input
          id="confirmation"
          name="confirmation"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {state.status !== "idle" && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role={state.status === "error" ? "alert" : "status"}
          className={cn(
            "rounded-md border p-(--ds-space-lg) outline-none",
            state.status === "error"
              ? "border-danger/60 bg-danger/10"
              : state.status === "success"
                ? "border-success/60 bg-success/10"
                : "border-accent/60 bg-accent/10",
          )}
        >
          <Heading level={2} variant="heading-4">
            {state.status === "error"
              ? "Please review your submission"
              : state.status === "success"
                ? "Inquiry sent"
                : "Delivery is not active"}
          </Heading>
          <Text className="mt-(--ds-space-sm)">{state.message}</Text>
          {errors.form?.length && (
            <ul className="type-body-sm text-text-secondary mt-(--ds-space-sm) list-disc pl-(--ds-space-xl)">
              {errors.form.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {state.status === "error" &&
        Object.entries(errors).some(([field]) => field !== "form") && (
          <nav aria-label="Form errors">
            <Text strong>Fields requiring attention</Text>
            <ul className="type-body-sm mt-(--ds-space-sm) list-disc pl-(--ds-space-xl)">
              {Object.entries(errors)
                .filter(([field]) => field !== "form")
                .map(([field, messages]) => (
                  <li key={field}>
                    <a className="text-accent underline" href={`#${field}`}>
                      {messages?.[0]}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        )}
      <div className="tablet:grid-cols-2 grid gap-(--ds-space-xl)">
        <div className="space-y-(--ds-space-sm)">
          <label className="type-body text-text-primary" htmlFor="name">
            Name
          </label>
          <input
            className={controlClasses}
            id="name"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
          />
          {error("name")}
        </div>
        <div className="space-y-(--ds-space-sm)">
          <label className="type-body text-text-primary" htmlFor="company">
            Company
          </label>
          <input
            className={controlClasses}
            id="company"
            name="company"
            required
            maxLength={160}
            autoComplete="organization"
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy("company")}
          />
          {error("company")}
        </div>
        <div className="space-y-(--ds-space-sm)">
          <label className="type-body text-text-primary" htmlFor="email">
            Email
          </label>
          <input
            className={controlClasses}
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
          />
          {error("email")}
        </div>
        <div className="space-y-(--ds-space-sm)">
          <label className="type-body text-text-primary" htmlFor="website">
            Website <span className="text-text-muted">(optional)</span>
          </label>
          <input
            className={controlClasses}
            id="website"
            name="website"
            type="url"
            maxLength={300}
            autoComplete="url"
            aria-invalid={Boolean(errors.website)}
            aria-describedby={describedBy("website")}
          />
          {error("website")}
        </div>
        <div className="tablet:col-span-2 space-y-(--ds-space-sm)">
          <label className="type-body text-text-primary" htmlFor="serviceId">
            Service interested in
          </label>
          <select
            className={controlClasses}
            id="serviceId"
            name="serviceId"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.serviceId)}
            aria-describedby={describedBy("serviceId")}
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
            <option value="not-sure">Not sure yet</option>
          </select>
          {error("serviceId")}
        </div>
        <div className="tablet:col-span-2 space-y-(--ds-space-sm)">
          <label
            className="type-body text-text-primary"
            htmlFor="projectSummary"
          >
            Project summary
          </label>
          <Text id="projectSummary-hint" variant="body-sm">
            What are you looking to create or improve?
          </Text>
          <textarea
            className={controlClasses}
            id="projectSummary"
            name="projectSummary"
            required
            rows={5}
            maxLength={2000}
            aria-invalid={Boolean(errors.projectSummary)}
            aria-describedby={describedBy(
              "projectSummary",
              "projectSummary-hint",
            )}
          />
          {error("projectSummary")}
        </div>
        <div className="tablet:col-span-2 space-y-(--ds-space-sm)">
          <label className="type-body text-text-primary" htmlFor="goals">
            Goals
          </label>
          <Text id="goals-hint" variant="body-sm">
            What would a useful outcome look like?
          </Text>
          <textarea
            className={controlClasses}
            id="goals"
            name="goals"
            required
            rows={4}
            maxLength={1500}
            aria-invalid={Boolean(errors.goals)}
            aria-describedby={describedBy("goals", "goals-hint")}
          />
          {error("goals")}
        </div>
        <div className="space-y-(--ds-space-sm)">
          <label className="type-body text-text-primary" htmlFor="budgetRange">
            Budget range <span className="text-text-muted">(optional)</span>
          </label>
          <select
            className={controlClasses}
            id="budgetRange"
            name="budgetRange"
            defaultValue=""
          >
            <option value="">Prefer to discuss</option>
            <option value="under-10k">Under $10,000</option>
            <option value="10k-25k">$10,000–$25,000</option>
            <option value="25k-50k">$25,000–$50,000</option>
            <option value="50k-plus">$50,000+</option>
          </select>
          {error("budgetRange")}
        </div>
        <div className="space-y-(--ds-space-sm)">
          <label className="type-body text-text-primary" htmlFor="timeline">
            Timeline <span className="text-text-muted">(optional)</span>
          </label>
          <select
            className={controlClasses}
            id="timeline"
            name="timeline"
            defaultValue=""
          >
            <option value="">Not specified</option>
            <option value="as-soon-as-practical">As soon as practical</option>
            <option value="one-to-three-months">1–3 months</option>
            <option value="three-to-six-months">3–6 months</option>
            <option value="six-months-plus">6+ months</option>
          </select>
          {error("timeline")}
        </div>
        <div className="tablet:col-span-2 space-y-(--ds-space-sm)">
          <label
            className="type-body text-text-primary"
            htmlFor="preferredContactMethod"
          >
            Preferred contact method
          </label>
          <select
            className={controlClasses}
            id="preferredContactMethod"
            name="preferredContactMethod"
            required
            defaultValue="email"
          >
            <option value="email">Email</option>
            <option value="video-call">Video call arranged by email</option>
          </select>
          {error("preferredContactMethod")}
        </div>
      </div>
      <Text variant="body-sm">
        Share only information relevant to the project. Do not include
        passwords, credentials, or other sensitive access details.
      </Text>
      <SubmitButton />
    </form>
  );
}
