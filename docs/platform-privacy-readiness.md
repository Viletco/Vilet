# Vilét Platform Privacy and Legal Readiness

This is an engineering readiness list, not legal advice. Counsel and the business owner must approve policy choices. No marketing-site legal text is changed by this document.

## Required before public customer accounts

- Identify the controller/business entity and a working privacy contact.
- Disclose account identifiers, authentication events, organization membership, roles, entitlements, security/audit records, support data, and customer-provided business data.
- Document purposes, legal bases where applicable, retention periods, deletion/anonymization behavior, and security-log exceptions.
- Define account closure, organization offboarding, member removal, export, correction, and deletion workflows with identity verification and audit evidence.
- Inventory processors and transfers: Vercel, Supabase, transactional email/SMTP, monitoring, support, and any AI provider actually enabled.
- Execute appropriate processor terms/data-processing agreements and document regions/subprocessors.
- Establish retention limits for auth logs, application audit events, support records, database backups, and deleted-tenant recovery copies.
- Separate customer tenant data through tested RLS and restrict service-role access to approved operations.
- Establish breach/incident response, access-review cadence, backup/restore testing, and customer notification responsibilities.
- Ensure privacy and terms language matches actual platform behavior; do not promise deletion that backups or mandatory security retention cannot satisfy immediately.
- Decide whether minors, sensitive data, regulated data, or special-category data are prohibited and enforce that decision in onboarding.

## Required before Growth prospecting or outreach

- Define the allowed business-prospect sources and record provenance, collection time, source URL/provider ID, and confidence.
- Minimize collection to legitimate business-contact information; prohibit arbitrary sensitive/personal-data harvesting.
- Define retention and refresh periods for stale prospect/contact data.
- Maintain organization-scoped suppression for unsubscribed, do-not-contact, bounced, replied, and manually suppressed recipients.
- Require human approval before initial outreach while quality and policy are calibrated.
- Approve sender identity, accurate headers/subjects, commercial identification, valid physical mailing address, clear opt-out, and a process to honor U.S. opt-outs within the required window.
- Ensure suppression survives campaign deletion and is checked transactionally before every send.
- Review each discovery/enrichment/email provider's terms, permitted use, deletion requirements, and geographic coverage.
- Distinguish observed evidence, deterministic findings, AI inference, and recommendations so unverified claims are not presented as facts.
- Define data-subject/contact request handling and a lawful-basis/legitimate-interest assessment where applicable.
- Obtain counsel review before automated or international outreach.

## Later international expansion

- Determine target countries before collecting or contacting prospects.
- Obtain jurisdiction-specific advice for consent, legitimate interests, direct-marketing rules, local suppression requirements, and business-contact treatment.
- Implement country/region eligibility and policy-version controls; do not assume U.S. CAN-SPAM compliance is sufficient elsewhere.
- Assess international data transfers, residency, processor contracts, and representative/registration obligations.
- Add configurable retention, deletion, consent/objection evidence, and regional sending rules before enabling each market.

## Data-design requirements

- Every customer or Growth record is scoped by `organization_id`.
- Access and mutations are authorized server-side and enforced by RLS.
- Audit metadata excludes secrets and unnecessary content.
- AI inputs/outputs record provenance, model/prompt version where useful, evidence references, timestamp, and uncertainty.
- Raw scraped pages are not retained by default; keep source references and narrowly necessary evidence.
- Deletion workflows preserve only justified security/suppression records and document why.
