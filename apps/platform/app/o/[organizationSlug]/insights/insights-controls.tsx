"use client";

import { useActionState } from "react";
import type { InsightsActionState } from "../../../../lib/insights-domain";

const initial: InsightsActionState = { status: "idle" };
function Notice({ state }: { state: InsightsActionState }) {
  return state.status === "idle" ? null : (
    <p
      role="status"
      className={`mt-3 text-xs ${state.status === "error" ? "text-rose-400" : "text-emerald-400"}`}
    >
      {state.message}
    </p>
  );
}

export function ConnectAnalyticsForm({
  action,
}: {
  action: (
    state: InsightsActionState,
    form: FormData,
  ) => Promise<InsightsActionState>;
}) {
  const [state, submit, pending] = useActionState(action, initial);
  return (
    <form
      action={submit}
      className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
    >
      <label className="text-muted-foreground text-xs">
        Source name
        <input
          name="displayName"
          required
          maxLength={120}
          defaultValue="Vilét website"
          className="border-border bg-background text-foreground mt-2 block w-full border px-3 py-2.5"
        />
      </label>
      <label className="text-muted-foreground text-xs">
        GA4 property ID
        <input
          name="propertyId"
          required
          inputMode="numeric"
          pattern="[0-9]+"
          className="border-border bg-background text-foreground mt-2 block w-full border px-3 py-2.5"
        />
      </label>
      <button
        disabled={pending}
        className="bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
      >
        {pending ? "Connecting…" : "Connect source"}
      </button>
      <div className="sm:col-span-3">
        <Notice state={state} />
      </div>
    </form>
  );
}

export function SyncAnalyticsForm({
  sourceId,
  action,
}: {
  sourceId: string;
  action: (
    state: InsightsActionState,
    form: FormData,
  ) => Promise<InsightsActionState>;
}) {
  const [state, submit, pending] = useActionState(action, initial);
  return (
    <form action={submit}>
      <input type="hidden" name="sourceId" value={sourceId} />
      <button
        disabled={pending}
        className="border-primary/30 bg-primary/10 text-primary border px-4 py-2 text-xs font-semibold disabled:opacity-50"
      >
        {pending ? "Synchronizing…" : "Sync last 30 days"}
      </button>
      <Notice state={state} />
    </form>
  );
}
