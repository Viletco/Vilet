# Phase E Architecture — Vilét Growth Internal MVP

## Decision

Do not start with automated discovery or outreach. The fastest useful and safest sequence is:

1. **E1 — Prospect and pipeline foundation:** manual entry plus CSV import, deterministic identity/deduplication, prospect detail, review state, pipeline, notes/activity, RLS, and internal metrics.
2. **E2 — Research and explainable qualification:** queued website checks, evidence, opportunity hypotheses, versioned scores, and human review.
3. **E3 — Provider-neutral discovery:** source adapters, scheduled ingestion, provenance, duplicate suggestions, and cost budgets.
4. **E4 — Contact enrichment and outreach:** business-contact providers, suppression, approved templates/sequences, sending/reply processing, compliance controls, and analytics.

E1 gives Vilét an immediately useful lightweight CRM and creates the clean data required to evaluate research quality. E2 before E3 prevents paying to discover large volumes that cannot yet be evaluated. E4 is intentionally isolated because it adds the greatest legal, reputation, deliverability, and idempotency risk.

## Tenant and authorization model

Every tenant-owned table contains non-null `organization_id` with indexed foreign keys and RLS derived from active membership. Never trust an organization ID from the client without membership verification.

Use the existing capabilities initially:

- `growth.access`: enter the product and read allowed Growth data.
- `growth.prospecting`: create/update/import prospects, research, scores, review decisions, and notes.
- `growth.pipeline`: change stages, assignment, value, and next actions.
- `growth.outreach`: reserved for E4 send/campaign operations; it grants nothing in E1–E3.

Do not add capabilities in E1. Consider `growth.manage` later only if settings/provider/budget administration must be separated from day-to-day work. Avoid `growth.campaigns` until campaigns exist.

## Data model

### `growth_prospects`

Tenant-owned current business record: ID, organization, display name, normalized domain, website URL, normalized phone, category/industry, locality/region/country, source summary, lifecycle stage, review status, assignee, estimated value/currency, next action/text/date, duplicate/merged reference, created/updated timestamps and actors. Do not store a public email in the core company identity; later contacts are separate records.

Strong uniqueness is `(organization_id, normalized_domain)` where domain exists and the record is not merged. Businesses without domains use candidate matching, not an unsafe hard unique name.

### `growth_sources`

One prospect can have many provenance records: source type, adapter key/version, external identifier, source URL, discovered time, imported-by actor/job, a hash of normalized reference metadata, and narrowly scoped JSON metadata. Unique provider identities use `(organization_id, source_type, external_identifier)` when present. Do not retain full scraped pages by default.

### `growth_research_runs` and `growth_research_findings`

A run records prospect, status, trigger/actor/job, research version, start/end times, cost/usage, and safe failure code. Findings record category, finding type (`observed`, `deterministic`, `ai_inference`, `recommendation`), concise value, source/evidence references, confidence, provider/model/prompt version when applicable, and observed time. Objective evidence and AI interpretation must never share an indistinguishable field.

### `growth_scorecards`

Immutable scoring snapshots: model key/version, fit, need, potential value, reachability, timing, confidence, derived priority, component explanations/evidence references, created time and actor/run. Preserve historical versions. The current prospect points to the selected scorecard; changing weights produces a new snapshot.

Priority should be a documented deterministic function of components and confidence. Start with configurable weights only after Vilét labels enough prospects to compare outcomes. Never let an unexplained LLM number directly become priority.

### `growth_activities`

Append meaningful timeline events: discovered/imported, research completed/failed, scored, review decision, stage change, assignment, note, merge, and later outreach/reply/suppression. Store actor type/ID, event key, subject IDs, timestamp, and minimal non-secret metadata. This is an audit-friendly activity stream, not full event sourcing; current prospect state remains authoritative.

### Later tables

E4 may add `growth_contacts`, `growth_suppressions`, `growth_campaigns`, `growth_sequence_steps`, `growth_outreach_messages`, and `growth_replies`. Contacts retain business purpose, source/provenance, validation/staleness, and confidence. Suppression is durable and checked before every send.

## Lifecycle and review

Keep current stage on `growth_prospects` for efficient filtering, and record every transition in `growth_activities`. Initial stages:

`discovered → researching → qualified → review → approved → outreach_ready → contacted → replied → opportunity → won/lost`

`disqualified` is terminal but reversible by an authorized human. E1 uses discovered, review, approved, opportunity, won, lost, and disqualified; research/outreach stages become active only with their subphases.

Review actions: approve, reject/disqualify with reason, research more, mark duplicate, add note, override priority with attribution, assign, and move stage. No E1–E3 action sends communication.

## Identity, normalization, and merging

1. Normalize URLs with IDNA-aware lowercase host, remove `www`, default ports, fragments and tracking parameters; store registrable domain where reliable.
2. Normalize phone to E.164 only when country context supports it; otherwise retain a cleaned display value without treating it as unique.
3. Normalize business name for matching but retain original display name.
4. Exact tenant-domain or exact provider ID is a strong match. Name + locality + phone/website similarities generate duplicate suggestions with component confidence.
5. Never silently merge uncertain records. Human merge selects a survivor, reattaches sources/research/scores/activity, records the decision, and tombstones the duplicate with `merged_into_id`.
6. Imports are idempotent via import ID plus row fingerprint; retries cannot create duplicates.

## Provider-neutral discovery

Define a discovery adapter contract returning normalized candidates plus source identity/reference metadata. Adapters must not write directly; an ingestion service validates, normalizes, matches, creates/suggests duplicates, and records provenance. Manual and CSV are first-class adapters in E1. Search, maps/directories, referrals, and external APIs arrive in E3 only after terms and permitted use are reviewed.

## Research pipeline

Process progressively:

1. Validate URL, robots/provider terms, HTTPS, response, canonical host, and existing cache.
2. Run cheap deterministic checks: availability, mobile metadata, basic performance/accessibility signals, visible conversion/contact paths, and technology hints.
3. Stop or defer low-confidence/duplicate/ineligible candidates.
4. For qualified candidates, use AI to summarize the business, classify service opportunities, connect claims to evidence, express uncertainty, and suggest review questions.
5. Generate a versioned scorecard and enqueue human review.

Research answers “could Vilét materially help?” using evidence about web experience, digital maturity, workflows, analytics, integrations, and plausible Vilét services. It must not claim private business facts, revenue, intent, or technical failures without evidence.

## UI and routes

E1 routes only:

- `/o/[organizationSlug]/growth` — overview with real counts, review queue, stage summary, priority prospects, and next actions.
- `/o/[organizationSlug]/growth/prospects` — searchable/filterable list and manual/CSV import.
- `/o/[organizationSlug]/growth/prospects/[prospectId]` — business, provenance, notes, score/research placeholders only when records exist, activity, stage, assignment and next action.
- `/o/[organizationSlug]/growth/review` — fast human decision queue.
- `/o/[organizationSlug]/growth/pipeline` — compact stage workflow, not a general CRM builder.

Do not add separate activity/settings navigation in E1. Activity belongs on overview/detail; settings wait until providers/budgets exist.

Information hierarchy: identity and next action first; why Vilét should care second; evidence and score explanation third; history last. Tables support keyboard navigation, accessible labels, stable pagination, saved URL filters, empty/error/loading states, and responsive card fallback.

## APIs and mutations

Prefer typed Server Actions for first-party UI mutations and route handlers for CSV import/export or future providers. Every mutation validates input, resolves organization membership server-side, checks the relevant capability, uses a transaction for state plus activity, returns a stable safe error, and accepts an idempotency key for imports/jobs/outreach.

E1 actions: create/update prospect, import/preview/commit CSV, add note, assign, set next action, decide review, change stage, suggest/confirm merge. No public ingestion API and no email action.

## Jobs and cost controls

E1 needs no external queue: CSV import may use bounded batches with resumable import records. E2 introduces a database-backed `growth_jobs` table with organization, type, dedupe key, payload reference, status, attempt/max attempts, scheduled/started/completed time, lease owner/expiry, safe failure code, and cost/usage counters. A scheduled worker can claim with `FOR UPDATE SKIP LOCKED`; this remains provider-neutral and can later move to a managed queue.

Retries use exponential backoff and idempotent outputs. Terminal failures require human retry/dead-letter review. Concurrency, daily spend, requests per organization/domain/provider, and maximum pages/tokens are explicit. Cache by normalized domain + research version; run deterministic checks before paid enrichment/AI; never fan out every discovered business into paid work.

## AI boundary

Use deterministic code for normalization, deduplication, HTTP status, timestamps, arithmetic scoring, stage rules, suppression and send idempotency. AI may summarize, classify, connect observed evidence to potential Vilét services, explain qualitative components, and suggest next action. Store model/provider, prompt/research version, evidence IDs, timestamp, confidence, token/cost usage, and human override. Treat output as inference until reviewed.

## Future enrichment and outreach

Enrichment is a provider adapter returning legitimate business-contact candidates with provenance, validation time, confidence, permitted-use metadata, and staleness. Avoid arbitrary personal profiles and sensitive data.

E4 sending requires human approval initially, verified sender/domain, approved templates, accurate evidence-grounded personalization, durable suppression, pre-send policy check, per-organization/domain rate limits, transactional idempotency key for each sequence step, stop-on-reply, bounce/complaint handling, opt-out processing, and immutable send/reply activity. AI cannot directly trigger a send.

U.S. commercial email planning must cover accurate headers/subjects, commercial identification, valid postal address, clear opt-out, prompt suppression, and vendor oversight. Counsel must approve policy and international expansion rules; CAN-SPAM does not exempt B2B mail.

## Metrics

Track funnel and business outcomes, not vanity volume: unique prospects, duplicate rate, research completion/cost, qualification and approval rates, review time, priority calibration, outreach-ready, contacted, replies/positive replies, opportunities, wins, estimated versus actual attributed revenue, cost per approved prospect/opportunity/customer, and suppression/bounce/complaint rates once outreach exists.

## Implementation plan and completion criteria

### E1 — Foundation

- Schema/RLS for prospects, sources, activities and imports; typed database types.
- Manual CRUD, CSV preview/commit, normalization/dedupe/merge, review, pipeline, assignment/value/next action.
- Five routes above, capability enforcement, accessible/responsive states.
- Tests: RLS tenant matrix, role/capability denial, normalization fixtures, import idempotency, merge transaction, stage rules, activity attribution, validation and UI route gates.
- No external provider/background worker beyond bounded import.
- Complete when Vilét can safely import/manage real prospects and answer target, reason, value, review, stage, owner and next action.

### E2 — Research and scoring

- Research runs/findings, scorecards, jobs, budgets and usage.
- Deterministic website adapter, evidence UI, AI inference adapter, versioned explainable score, review calibration.
- Tests: SSRF/URL safety, evidence classification, job leases/retries, budget limits, deterministic score/version history, AI schema validation and tenant isolation.
- Complete when Vilét can research selected prospects, inspect evidence/inference separately, and approve calibrated recommendations.

### E3 — Discovery

- Adapter registry, scheduled discovery jobs, ingestion provenance, provider identity, duplicate suggestions and source-health metrics.
- Provider chosen only after terms/cost/privacy review.
- Complete when approved sources add deduplicated candidates within explicit budgets without auto-contacting anyone.

### E4 — Enrichment and outreach

- Contacts, validation/staleness, suppression, campaigns/sequences/messages/replies, approval, idempotent sender, stop-on-reply and analytics.
- SMTP/sending and reply providers selected after compliance/deliverability decisions.
- Tests: suppression race, duplicate send prevention, limits, approval, bounce/reply stop, template evidence and complete audit trail.
- Complete only after policy/counsel approval and a tightly limited internal pilot.

## First implementation prompt

Production authentication passed on 2026-08-19. Phase E1 has not begun automatically. Before it is cleared, remove the unnecessary service-role credential from Vercel Preview, redeploy Preview, and reconfirm that Preview targets the staging Supabase project.

Build **Phase E1 only**: multi-tenant Growth prospect/pipeline foundation with migrations and RLS, typed data access, deterministic normalization and deduplication, manual prospect CRUD, CSV preview/commit with idempotency, review decisions, stage/assignment/value/next-action management, meaningful activity records, the five E1 routes, and full tenant/authorization/transaction/UI tests. Do not implement AI, automated discovery, enrichment, contact storage, email, campaigns, or outreach.
