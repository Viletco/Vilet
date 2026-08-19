import { requireCapability } from "@vilet/auth";
import { EmptyState, PageHeader } from "../../../../components/page-frame";
export default async function StudioPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireCapability(organizationSlug, "studio.access");
  return (
    <>
      <PageHeader
        eyebrow="Vilét Studio"
        title="Projects and delivery."
        description="A private workspace for approved projects, deliverables, and collaboration."
      />
      <section className="mt-10">
        <h2 className="text-muted-foreground text-[13px] font-semibold tracking-[0.08em] uppercase">
          Offerings
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[
            "Strategy and planning",
            "Design and development",
            "Delivery and support",
          ].map((item) => (
            <div
              key={item}
              className="border-border bg-card/40 rounded-2xl border p-5"
            >
              <h3 className="text-[15px] font-semibold">{item}</h3>
              <p className="text-muted-foreground mt-2 text-[13px]">
                Available through an approved Vilét engagement.
              </p>
            </div>
          ))}
        </div>
      </section>
      <h2 className="text-muted-foreground mt-10 text-[13px] font-semibold tracking-[0.08em] uppercase">
        Projects
      </h2>
      <EmptyState
        title="No projects yet"
        description="Projects will appear here only after they are created for this organization. No demonstration projects have been added."
      />
    </>
  );
}
