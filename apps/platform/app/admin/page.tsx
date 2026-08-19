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
    <main className="bg-background mx-auto min-h-screen max-w-[1400px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <PageHeader
        eyebrow="Internal administration"
        title="Platform status."
        description="Restricted operational visibility. Administrative mutation controls are not enabled in this phase."
        status="internal"
      />
      <dl className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="border-border bg-card/40 rounded-xl border p-4">
          <dt className="text-muted-foreground text-[11px] tracking-wide uppercase">
            Active organizations
          </dt>
          <dd className="mt-2 text-[24px] font-semibold tracking-tight">
            {organizations ?? "Unavailable"}
          </dd>
        </div>
        <div className="border-border bg-card/40 rounded-xl border p-4">
          <dt className="text-muted-foreground text-[11px] tracking-wide uppercase">
            Capability definitions
          </dt>
          <dd className="mt-2 text-[24px] font-semibold tracking-tight">
            {capabilities ?? "Unavailable"}
          </dd>
        </div>
      </dl>
    </main>
  );
}
