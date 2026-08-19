import Link from "next/link";
import { requireCapability } from "@vilet/auth";
import { PageHeader } from "../../../../components/page-frame";
export default async function SupportPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  await requireCapability(organizationSlug, "support.access");
  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Help from Vilét."
        description="Use the established Vilét contact channel for account or platform assistance."
      />
      <section className="border-border bg-card/40 hover:border-primary/30 hover:bg-card/70 mt-8 rounded-2xl border p-5 transition-all duration-200">
        <p className="text-primary/80 text-[10.5px] font-semibold tracking-[0.08em] uppercase">
          Support option
        </p>
        <h2 className="mt-2 text-[15px] font-semibold">Contact Vilét</h2>
        <p className="text-muted-foreground mt-2 text-[13px]">
          Support tickets are not yet enabled.
        </p>
        <Link
          className="bg-primary text-primary-foreground mt-5 inline-flex min-h-10 items-center rounded-lg px-4 text-[12.5px] font-semibold"
          href="https://vilet.co/contact"
        >
          Open contact page
        </Link>
      </section>
      <section className="mt-10">
        <h2 className="text-muted-foreground text-[13px] font-semibold tracking-[0.08em] uppercase">
          Support activity
        </h2>
        <p className="border-border/70 bg-card/20 text-muted-foreground mt-4 rounded-2xl border border-dashed px-6 py-10 text-center text-[13px]">
          No support history is available.
        </p>
      </section>
    </>
  );
}
