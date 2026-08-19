import type { GrowthMember, GrowthProspect } from "../lib/growth-data";
import { fieldClass, primaryButton } from "./growth-nav";
import {
  createProspectAction,
  updateProspectAction,
} from "../app/o/[organizationSlug]/growth/actions";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      <span>
        {label}
        {required && (
          <span aria-hidden="true" className="text-[var(--accent)]">
            {" "}
            *
          </span>
        )}
      </span>
      <input
        className={fieldClass}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
      />
    </label>
  );
}

export function ProspectForm({
  slug,
  members,
  prospect,
}: {
  slug: string;
  members: GrowthMember[];
  prospect?: GrowthProspect;
}) {
  return (
    <form
      action={prospect ? updateProspectAction : createProspectAction}
      className="grid gap-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-2 sm:p-7"
    >
      <input type="hidden" name="organization_slug" value={slug} />
      {prospect && (
        <input type="hidden" name="prospect_id" value={prospect.id} />
      )}
      <Field
        label="Business name"
        name="business_name"
        required
        defaultValue={prospect?.business_name}
        placeholder="Acme Studio"
      />
      <Field
        label="Website"
        name="website"
        defaultValue={prospect?.website_url}
        placeholder="example.com"
      />
      <Field
        label="Public business email"
        name="email"
        type="email"
        defaultValue={prospect?.email_public}
      />
      <Field
        label="Business phone"
        name="phone"
        type="tel"
        defaultValue={prospect?.phone}
      />
      <Field
        label="Industry"
        name="industry"
        defaultValue={prospect?.industry}
      />
      <Field label="City" name="city" defaultValue={prospect?.city} />
      <Field
        label="State or region"
        name="region"
        defaultValue={prospect?.region}
      />
      <Field label="Country" name="country" defaultValue={prospect?.country} />
      {!prospect && (
        <>
          <label className="grid gap-2 text-sm font-medium">
            <span>Assigned owner</span>
            <select
              className={fieldClass}
              name="assigned_user_id"
              defaultValue=""
            >
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.user_id} value={member.user_id}>
                  {member.profiles?.display_name ?? member.role}
                </option>
              ))}
            </select>
          </label>
          <Field
            label="Estimated value"
            name="estimated_value"
            type="number"
            placeholder="0.00"
          />
          <Field label="Currency" name="currency" defaultValue="USD" />
          <Field
            label="Next action"
            name="next_action"
            placeholder="Review website"
          />
          <Field
            label="Next action date"
            name="next_action_at"
            type="datetime-local"
          />
        </>
      )}
      {!prospect && (
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">
          <span>Initial note</span>
          <textarea
            className={`${fieldClass} min-h-24 resize-y`}
            name="note"
            maxLength={4000}
            placeholder="Optional context for the review queue"
          />
        </label>
      )}
      <div className="sm:col-span-2">
        <button className={primaryButton} type="submit">
          {prospect ? "Save business details" : "Add prospect"}
        </button>
      </div>
    </form>
  );
}
