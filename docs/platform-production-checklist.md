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
- [x] Production magic-link delivery succeeds
- [x] Production `/auth/callback` exchanges the code
- [x] Authenticated user reaches `/o/vilet`
- [x] Owner membership is visible
- [x] Independent platform-administrator access is visible
- [x] Session persists across refresh, browser close, and normal revisit
- [x] Authenticated `/login` returns to the organization
- [x] `/logout` ends the application session
- [x] Protected routes are denied after logout
- [ ] Confirm host-only cookie isolation; no shared `.vilet.co` auth cookie
- [x] Manually verify the new 90-day persistent-cookie policy in protected Preview by closing and reopening the same browser on the exact same deployment hostname

The 90-day persistence policy was implemented on the QA branch and manually verified on 2026-08-19 using the protected staging Preview `https://vilet-platform-preview-d9qrswsyn-swzyfrmdarocs-projects.vercel.app`. The owner completed magic-link authentication, closed the browser, reopened the same browser and deployment hostname, and returned authenticated without another magic link. The owner then approved a selective Production rollout of only these session changes.

The selective Production release revision `9b02ea7` was deployed as Vercel deployment `dpl_DWhtPYoBBCy1DK6HnS3KNHDKgrP6` and aliased to `app.vilet.co` on 2026-08-19. The owner completed a new Production magic-link login, confirmed browser-close persistence on the stable hostname, explicitly logged out, and confirmed protected access remained denied afterward. Live headers continued to target only production Supabase `detqlxrismxlbgsgeafx`; HSTS, CSP, noindex, and disallow-all robots remained active. Production environment variables and browser assets contained no Hunter or staging configuration.

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
- [x] Run final repository secret scan immediately before promotion
- [x] Scan production browser bundles for privileged credentials
- [x] Review dependency audit immediately before promotion
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
