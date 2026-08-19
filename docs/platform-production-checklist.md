# Vilét Platform Production Checklist

Status date: 2026-08-19. This is the canonical launch gate for `app.vilet.co`. Evidence, not intent, determines completion.

## Infrastructure

- [x] Separate production Supabase project `detqlxrismxlbgsgeafx`
- [x] Phase A, policy-hardening, and owner-bootstrap migrations applied in order
- [x] Production RLS suite passed and fixtures removed
- [x] Vercel Production uses production Supabase; Preview uses staging `lzohhfmfdqivnjqqwmqu`
- [x] `app.vilet.co` DNS, domain verification, managed HTTPS, and routing verified
- [x] CSP, HSTS, frame denial, content-type, referrer, permissions, and cross-origin headers verified
- [x] `X-Robots-Tag: noindex, nofollow` and disallow-all `robots.txt` verified
- [ ] Establish and test a scheduled off-site logical backup; Free projects have no automatic backup entitlement

## Authentication

- [x] Production login form loads
- [ ] **PENDING — production magic-link delivery after provider rate limit resets**
- [ ] Production `/auth/callback` exchanges the code
- [ ] Authenticated user reaches `/o/vilet`
- [ ] Owner membership is visible
- [ ] Independent platform-administrator access is visible
- [ ] Session persists across refresh and navigation
- [ ] Authenticated `/login` returns to the organization
- [ ] `/logout` ends the application session
- [ ] Protected routes are denied after logout
- [ ] Confirm host-only cookie isolation; no shared `.vilet.co` auth cookie

## Environment separation and mutation safety

- [x] Preview is protected by Vercel Authentication and uses staging
- [x] Production is public at the application boundary and uses production
- [x] Privileged credential files are limited to `.env.local` and `.env.production.local`
- [x] Bootstrap requires environment, matching project ref, dry-run/apply intent, and exact production confirmation
- [x] Production RLS fixtures require exact project confirmation
- [x] Staging test identities cannot be created in production
- [x] Connectivity checks require environment/project consistency
- [x] Service-role credential is absent from the deployed Vercel runtime

## Security and quality

- [x] Cross-tenant isolation verified live in staging and production
- [x] Privilege-escalation and entitlement protections verified live
- [x] Owner bootstrap verified idempotent and transactional
- [x] Temporary security fixtures removed
- [ ] Run final repository secret scan immediately before promotion
- [ ] Scan production browser bundles for privileged credentials
- [ ] Review dependency audit immediately before promotion
- [ ] Verify safe structured auth events in Vercel logs during the final login test

## Visual QA

- [ ] Production desktop login and organization shell
- [ ] Production medium-width layout
- [ ] Production mobile layout and navigation
- [ ] Branded expired/invalid-link, no-organization, unknown-organization, and insufficient-access states

## Marketing

- [x] Account integration exists on `codex/preview-qa-670fca8`
- [x] Marketing remains outside the platform authentication boundary
- [ ] Final QA of marketing account links against `app.vilet.co`
- [ ] Production marketing deployment intentionally approved
- [ ] Merge/push to `main` intentionally approved

## Customer-rollout gates

- [ ] Custom SMTP configured and deliverability tested
- [ ] Automated/off-site backup or paid provider backup capability established
- [ ] Account privacy disclosures, retention, deletion, processor list, and support procedure approved
- [ ] Monitoring ownership, incident response, and alert thresholds assigned
- [ ] Customer onboarding/offboarding and entitlement-reconciliation procedures tested
