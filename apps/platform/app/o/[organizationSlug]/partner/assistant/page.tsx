import { PageHeader } from "../../../../../components/page-frame";
import { PartnerNav, partnerCard } from "../../../../../components/partner-nav";
import { requireSalesPartner } from "../../../../../lib/partner-auth";
import { deterministicSalesAssistant } from "../../../../../lib/sales-assistant";

const prompts = [
  "What should I sell this business?",
  "How should I respond to we already have a website?",
  "What questions should I ask during discovery?",
  "Explain Vilét Insights simply.",
  "Can I offer a discount?",
  "How do commissions work?",
];

export default async function Assistant({
  params,
  searchParams,
}: {
  params: Promise<{ organizationSlug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { organizationSlug } = await params;
  const { q = "" } = await searchParams;
  await requireSalesPartner(organizationSlug);
  const answer = q ? await deterministicSalesAssistant.answer(q) : null;
  return (
    <>
      <PartnerNav slug={organizationSlug} current="assistant" />
      <PageHeader
        eyebrow="Grounded sales support"
        title="Vilét Sales Assistant"
        description="A provider-neutral, deterministic staging assistant grounded in approved Vilét knowledge. It makes no external model calls."
        status="internal"
      />
      <section className={`${partnerCard} mt-8`}>
        <form method="get">
          <label className="text-sm font-medium" htmlFor="q">
            Ask an approved sales question
          </label>
          <textarea
            id="q"
            name="q"
            defaultValue={q}
            className="border-border bg-background mt-2 min-h-28 w-full rounded-md border px-3 py-2"
            placeholder="What should I ask a business with an outdated website?"
          />
          <button className="bg-primary text-primary-foreground mt-3 rounded-md px-4 py-2 text-sm font-semibold">
            Get grounded guidance
          </button>
        </form>
      </section>
      <div className="mt-4 flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <a
            key={prompt}
            href={`?q=${encodeURIComponent(prompt)}`}
            className="border-border hover:border-primary rounded-full border px-3 py-2 text-xs"
          >
            {prompt}
          </a>
        ))}
      </div>
      {answer && (
        <section className={`${partnerCard} mt-6`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Guidance</h2>
            <span className="text-primary text-[10px] uppercase">
              Deterministic staging mode
            </span>
          </div>
          <p className="text-muted-foreground mt-4 text-sm leading-6">
            {answer.answer}
          </p>
          <div className="border-border mt-5 border-t pt-4">
            <p className="text-[10px] uppercase">Knowledge source</p>
            {answer.sources.map((source) => (
              <p key={source} className="text-muted-foreground mt-1 text-xs">
                · {source}
              </p>
            ))}
            {answer.escalationRequired && (
              <p className="mt-3 text-xs font-semibold">
                Owner escalation required
              </p>
            )}
          </div>
        </section>
      )}
      <section className={`${partnerCard} mt-6`}>
        <h2 className="font-semibold">Authorization boundary</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          This mode uses repository knowledge only. Future lead context must
          pass authentication, organization membership, active partner
          lifecycle, capability, and own-lead authorization before retrieval.
        </p>
      </section>
    </>
  );
}
