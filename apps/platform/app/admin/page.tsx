import {
  createPlatformServerClient,
  requirePlatformAdministrator,
} from "@vilet/auth";
import { PageHeader } from "../../components/page-frame";
export default async function AdminPage() {
  await requirePlatformAdministrator();
  const client = await createPlatformServerClient();
  const [{ count: organizations }, { count: capabilities }] = client
    ? await Promise.all([
        client
          .from("organizations")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        client
          .from("capabilities")
          .select("key", { count: "exact", head: true }),
      ])
    : [{ count: null }, { count: null }];
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-12">
      <PageHeader
        eyebrow="Internal administration"
        title="Platform status."
        description="Restricted operational visibility. Administrative mutation controls are not enabled in this phase."
        status="internal"
      />
      <dl className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <dt className="text-sm text-[var(--quiet)]">Active organizations</dt>
          <dd className="mt-2 text-2xl">{organizations ?? "Unavailable"}</dd>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <dt className="text-sm text-[var(--quiet)]">
            Capability definitions
          </dt>
          <dd className="mt-2 text-2xl">{capabilities ?? "Unavailable"}</dd>
        </div>
      </dl>
    </main>
  );
}
