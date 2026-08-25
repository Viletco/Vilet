import { requireCapability } from "@vilet/auth";
import { PageHeader } from "../../../../components/page-frame";
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
      <section className="mt-12 grid gap-8 xl:grid-cols-[1.4fr_.6fr]">
        <div className="command-surface min-h-[24rem] p-6 sm:p-8">
          <p className="vilet-coordinate text-primary">Project canvas</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
            No active production
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-[13px] leading-6">
            Approved projects will open here as working canvases with
            milestones, deliverables, review states, and launch readiness. No
            demonstration client work is shown.
          </p>
          <div className="border-border absolute right-8 bottom-8 left-8 border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-[11px]">
              <span>01 · Discover</span>
              <span>02 · Build</span>
              <span>03 · Launch</span>
            </div>
          </div>
        </div>
        <div className="border-border border-l pl-6">
          <p className="vilet-coordinate text-muted-foreground">
            Studio lifecycle
          </p>
          {[
            "Strategy and planning",
            "Design and development",
            "Delivery and support",
          ].map((item, index) => (
            <div key={item} className="border-border border-b py-5">
              <span className="text-primary vilet-coordinate">
                0{index + 1}
              </span>
              <h3 className="mt-2 font-semibold">{item}</h3>
              <p className="text-muted-foreground mt-1 text-xs">
                Available through an approved Vilét engagement.
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
