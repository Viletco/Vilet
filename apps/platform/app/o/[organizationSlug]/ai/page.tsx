import { requireCapability } from "@vilet/auth";
import { PageHeader } from "../../../../components/page-frame";
export default async function AiPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireCapability(organizationSlug, "ai.access");
  return (
    <>
      <PageHeader
        eyebrow="Vilét AI"
        title="Organization-aware assistance."
        description="A secure product shell for future approved workflows. It currently has no access to organization documents, systems, or private business data."
      />
      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="command-surface min-h-[26rem] p-6 sm:p-8">
          <p className="vilet-coordinate text-primary">Intelligence layer</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
            No organization knowledge connected
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-[13px] leading-6">
            Vilét AI remains inactive until specific sources, permissions, and
            operating boundaries are approved.
          </p>
          <div className="absolute inset-x-8 bottom-8">
            <div className="signal-line" />
            <p className="vilet-coordinate text-muted-foreground mt-3">
              Context boundary · locked
            </p>
          </div>
        </div>
        <aside className="border-border border-l pl-6">
          <p className="vilet-coordinate text-muted-foreground">
            Connected context
          </p>
          {["Studio", "Growth", "Insights"].map((item) => (
            <div
              key={item}
              className="border-border flex items-center justify-between border-b py-5"
            >
              <span>{item}</span>
              <span className="vilet-coordinate text-muted-foreground">
                Not connected
              </span>
            </div>
          ))}
        </aside>
      </section>
    </>
  );
}
