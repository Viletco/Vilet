# Vilét Growth — Phase E1

## Status

Phase E1 implements the organization-scoped prospect and lightweight pipeline foundation. It is intentionally limited to manual entry, bounded CSV import, deterministic normalization and duplicate detection, human review, pipeline management, notes, and activity history.

The E1 schema and corrective import-function migrations were applied to staging project `lzohhfmfdqivnjqqwmqu` and passed the live RLS suite on August 19, 2026. Protected Preview review remains required before a separate production approval. Production rollout is not part of Phase E1 implementation review.

## Data model

Migrations:

- `supabase/migrations/202608190002_growth_e1_foundation.sql`
- `supabase/migrations/202608190003_fix_growth_csv_import.sql`
- `supabase/migrations/202608190004_secure_growth_import_activity.sql`

- `growth_prospects` is the canonical business-prospect record. Record status (`active`, `archived`, `duplicate`) is separate from the typed pipeline stage.
- `growth_sources` retains bounded provenance without raw CSV payloads.
- `growth_import_batches` records file name, counts, status, actor, and idempotency key.
- `growth_prospect_notes` is append-oriented plain text with author and timestamps.
- `growth_activities` records meaningful business events with narrow structured metadata. It remains separate from security audit events.

All Growth records include `organization_id`. Foreign keys, check constraints, targeted indexes, partial domain uniqueness, assignment validation, same-tenant duplicate-target validation, and RLS provide database-level defense in depth.

## Lifecycle

Record status:

- `active`
- `archived`
- `duplicate`

Pipeline stages:

- `review`
- `qualified`
- `outreach_ready`
- `contacted`
- `replied`
- `opportunity`
- `won`
- `lost`
- `disqualified`

The later-stage values are valid manual states only. Phase E1 does not automate outreach or replies.

## Authorization and RLS

- `growth.access` permits tenant-scoped reads and entry to the Growth overview.
- `growth.prospecting` permits manual creation, business-detail edits, imports, notes, archive, and duplicate decisions.
- `growth.pipeline` permits stage, owner, estimated value, and next-action changes.

Every page, Server Action, and route handler resolves authenticated organization context and checks its capability independently. RLS repeats tenant and entitlement checks. Database triggers reject an assignee or duplicate target outside the prospect's organization, and pipeline-field changes require `growth.pipeline` even through direct database API use.

## Normalization and duplicates

Normalization is deterministic and preserves display values:

- website/domain: HTTP(S) only, lowercase host, leading `www.` removed, trailing dot/path/query/fragment excluded from identity;
- business name: Unicode normalization, lowercase, punctuation/whitespace cleanup, and conservative legal-suffix removal;
- email: trimmed and lowercased;
- phone: conservative digit normalization, retaining an optional leading plus;
- location: trimmed display values and normalized comparison inputs.

A same-organization active normalized domain is a hard duplicate and is protected by a partial unique index. Without a domain, a duplicate needs a normalized name plus a supporting location, phone, or public-business-email signal. Ambiguous names are not silently merged. Users can explicitly mark a record as a duplicate; records are retained rather than destroyed.

The architecture originally recommended moving all emails to a later contact model. E1 retains only the request-approved optional public business email on the business prospect. It does not create personal contacts or perform enrichment.

## CSV import

The flow is upload → server parse → validate → normalize → duplicate preview → confirm → transactional RPC commit.

- maximum 512 KB and 500 data rows;
- quoted CSV fields and common header aliases are supported;
- business name is required;
- malformed, empty, duplicate-in-file, and existing-duplicate rows are shown before commit;
- accepted normalized rows, not the raw file, are submitted for commit;
- the confirmation reuses a stable client idempotency key;
- a unique batch key and row fingerprints protect retries and concurrent duplicates;
- prospect, source, initial note, activity, and batch counts are committed in one PostgreSQL transaction.

Future CSV export must neutralize spreadsheet formulas before generating cells. E1 does not export data.

## Routes and UI

- `/o/[organizationSlug]/growth` — real overview counts, pipeline value, next actions, recent prospects, and recent activity.
- `/o/[organizationSlug]/growth/prospects` — server search, filters, sorting, pagination, manual creation, and CSV preview/commit.
- `/o/[organizationSlug]/growth/prospects/[prospectId]` — business details, pipeline fields, notes, activity, archive, and duplicate controls.
- `/o/[organizationSlug]/growth/review` — compact human decision queue.
- `/o/[organizationSlug]/growth/pipeline` — bounded grouped-stage workflow without drag-and-drop hydration.

The UI uses the existing server-first Vilét application shell, responsive cards/lists, semantic forms, visible status feedback, keyboard-operable controls, and real empty states. It contains no fabricated metrics or prospect data.

## Activity

Database triggers record prospect creation, updates, stage changes, assignment, value, next-action, archive/duplicate status, notes, and initial source. CSV commits record aggregate accepted/duplicate counts. Activity metadata does not copy complete records, emails, phone numbers, or raw CSV content.

## Verification and rollout

Local verification:

```text
npm run format:check
npm run lint
npm run typecheck
npm run test:platform
npm run build:platform
```

Staging-only RLS verification:

```text
npm run verify:growth:e1:rls -- --environment=staging --project-ref=<staging-ref> --credential-file=.env.local
```

The verifier refuses production, validates its configured project hostname, creates temporary isolated users/organizations, exercises capability and cross-tenant denials, and removes fixtures in `finally` cleanup.

The August 19, 2026 staging run passed 23 live checks covering capability denials, cross-tenant prospect/note/activity/import isolation, assignment and duplicate-target boundaries, active-domain uniqueness, pipeline mutation, value and next-action updates, notes, archive/restore, CSV idempotency and duplicate counting, revoked access, and suspended membership behavior.

Production requires a separate explicit approval to apply the migration and deploy the platform. Never point Preview at production or apply this migration to production as part of Preview QA.

## Explicit E1 boundaries

Phase E1 does not include AI, research/scoring, automated discovery, web scraping, provider integrations, contact-person storage, enrichment, email, campaigns, sequences, reply processing, or automated outreach. Those remain later, separately approved phases.
