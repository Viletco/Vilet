import Link from "next/link";
import { createPlatformServerClient } from "@vilet/auth";
import { PageHeader } from "../../../../components/page-frame";
import { PartnerNav, partnerCard } from "../../../../components/partner-nav";
import {
  approvedPolicy,
  trainingModules,
} from "../../../../lib/partner-knowledge";
import { requireSalesPartner } from "../../../../lib/partner-auth";

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ organizationSlug: string }>;
}) {
  const { organizationSlug } = await params;
  const { context, partner } = await requireSalesPartner(organizationSlug);
  const client = await createPlatformServerClient();
  const [
    { data: progress = [] },
    { data: leads = [] },
    { data: commissions = [] },
  ] = client
    ? await Promise.all([
        client
          .from("sales_training_progress")
          .select("module_key,completed_at")
          .eq("organization_id", context.organizationId)
          .eq("partner_id", partner.id),
        client.rpc("list_partner_own_leads", {
          target_organization_id: context.organizationId,
        }),
        client
          .from("commission_ledger")
          .select("status,amount_minor,currency")
          .eq("organization_id", context.organizationId)
          .eq("partner_id", partner.id),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }];
  const modulesComplete = new Set(
    progress?.filter((row) => row.completed_at).map((row) => row.module_key),
  ).size;
  const base = `/o/${organizationSlug}/partner`;
  return (
    <>
      <PartnerNav slug={organizationSlug} current="dashboard" />
      <PageHeader
        eyebrow="Sales partner"
        title="Partner Hub"
        description="Learn Vilét's approved positioning, qualify opportunities responsibly, and track only the leads and commissions you are authorized to see."
        status="internal"
      />
      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["Training", `${modulesComplete}/${trainingModules.length} modules`],
          ["Leads", `${leads?.length ?? 0} submitted`],
          ["Commission records", `${commissions?.length ?? 0} real events`],
        ].map(([label, value]) => (
          <div className={partnerCard} key={label}>
            <p className="text-muted-foreground text-[10px] uppercase">
              {label}
            </p>
            <p className="mt-2 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </section>
      <section className="mt-4 grid gap-3 md:grid-cols-3">
        <Link href={`${base}/training`} className={partnerCard}>
          <p className="text-primary text-[11px] uppercase">Start here</p>
          <h2 className="mt-2 font-semibold">Sales training</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Fourteen focused modules covering positioning, discovery,
            objections, conduct, and readiness.
          </p>
        </Link>
        <Link href={`${base}/playbook`} className={partnerCard}>
          <p className="text-primary text-[11px] uppercase">
            During a conversation
          </p>
          <h2 className="mt-2 font-semibold">Sales playbook</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Fast service, targeting, qualification, objection, and escalation
            guidance.
          </p>
        </Link>
        <Link href={`${base}/leads`} className={partnerCard}>
          <p className="text-primary text-[11px] uppercase">Opportunity</p>
          <h2 className="mt-2 font-semibold">Submit or review a lead</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Use the shared Growth prospect architecture with partner-safe status
            visibility.
          </p>
        </Link>
      </section>
      <section className={`${partnerCard} mt-5`}>
        <h2 className="font-semibold">Current policy guardrails</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {Object.entries(approvedPolicy).map(([key, value]) => (
            <div key={key}>
              <dt className="text-primary text-[10px] uppercase">{key}</dt>
              <dd className="text-muted-foreground mt-1 text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="text-muted-foreground mt-5 text-xs">
        Lifecycle status: {partner.status}. Training completion is provisional
        and does not claim owner certification.
      </p>
    </>
  );
}
