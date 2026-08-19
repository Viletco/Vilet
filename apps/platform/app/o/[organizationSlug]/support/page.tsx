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
      <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-medium">Contact Vilét</h2>
        <p className="mt-3 text-[var(--muted)]">
          Support tickets are not yet enabled.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-[var(--accent)] px-4 font-semibold"
          href="https://vilet.co/contact"
        >
          Open contact page
        </Link>
      </section>
    </>
  );
}
