# Vilét Sales Partner System

## Status

Staging implementation foundation with live RLS verification completed on August 19, 2026 against staging project `lzohhfmfdqivnjqqwmqu`. It is not production-ready, no real partner has been invited, no commission policy is approved, and no external AI provider is enabled.

## Architecture

The Partner Hub reuses the authenticated Vilét Platform, active organization membership, capability checks, and the existing Growth prospect/pipeline model. The access surface intentionally uses only two new capabilities:

- `partner.access`: restricted partner experience, training, own attributed leads, and own ledger records.
- `sales.enablement`: owner/admin management boundary for partner lifecycle, attribution decisions, commission rules, and ledger events.

Partners remain ordinary restricted organization members. They are never made admins merely to access the hub. Active partner access additionally depends on a `sales_partners` lifecycle record. Paused and terminated states are excluded by the database helper without deleting historical attribution or ledger records.

## Data model

Migration `202608190006_sales_partner_foundation.sql` adds:

- partner lifecycle records;
- tenant-scoped lesson progress;
- durable attribution linked to `growth_prospects`;
- versioned commission rules;
- immutable-style commission ledger events in currency minor units;
- payout records for future controlled use;
- a security-invoker partner-safe lead projection.

Corrective migrations `202608190007_fix_partner_tenant_trigger.sql` and `202608190008_secure_partner_tenant_trigger.sql` isolate table-specific trigger validation and allow that private validator to inspect tenant-linked internal records without granting partners direct Growth access.

Duplicate claims, prior internal discovery, and competing attribution are never silently awarded. They enter `pending_review` or `conflict` and require an authorized sales manager decision.

## Canonical knowledge

Repository-backed content in `apps/platform/lib/partner-knowledge.ts` is the initial authoritative source for fourteen training modules, service availability, approved and forbidden claims, target profiles, objections, and owner-controlled policy boundaries. This keeps changes reviewable and versioned without prematurely building a CMS.

The AI Sales Assistant page is a truthful architecture boundary only. A future provider-neutral server service must authenticate, authorize, retrieve only permitted context, ground the answer in approved sources, and return uncertainty when pricing, scope, availability, or commission policy is unknown.

## Required business decisions

- partner agreement and acceptance requirements (legal review required);
- commission eligibility trigger, percentage/fixed amount, exclusions, reversals, disputes, payout timing, and currency;
- approved pricing guidance and discount authority;
- readiness assessment questions and passing standard;
- who may activate, pause, or terminate a partner;
- which beta/future products partners may discuss.

## Staging activation

Migrations `006`, `007`, and `008` are applied to staging only. The automated temporary-fixture verification passes for owner provisioning, own-partner training access, cross-partner isolation, partner-safe lead submission, duplicate attribution conflicts, denial of direct Growth access, owner attribution review, commission-rule and ledger boundaries, commission lifecycle recording, and paused-partner access removal. Test fixtures are deleted after each run.

The current QA branch still requires a protected Preview deployment and manual interface review before this work can be considered staging-approved.

## Manual security test

Using two partner users and one owner in the same staging organization:

1. Confirm each partner can open Partner Hub but cannot open Platform Admin, Growth provider configuration, billing management, or settings reserved for admins.
2. Confirm Partner A cannot select Partner B's progress, attribution, lead projection, ledger, or payout.
3. Confirm neither partner can insert/update a commission rule or ledger event, mark a prospect won, approve attribution, or change their partner lifecycle.
4. Submit the same domain for both partners and confirm the second attribution enters review/conflict rather than receiving commission.
5. Pause Partner A and confirm active Partner Hub data access ends while historical records remain.
6. Confirm AI is disabled and the knowledge page never exposes unauthorized lead context.
7. Re-run platform tests, lint, typecheck, and build.

## Next step

Deploy the QA branch to a protected Preview and complete the manual route/access checks. Do not invite the first real partner or promote the schema to Production until policy, legal, and explicit production-release decisions are approved.
