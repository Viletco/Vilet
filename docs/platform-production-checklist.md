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
- [x] Active Owner membership is visible
- [x] Independent Platform admin access is visible
- [x] Expected entitled navigation and routes load
- [x] Session persists across refresh and navigation
- [x] Authenticated `/login` returns to the organization
- [x] `/logout` ends the application session
- [x] Protected routes are denied after logout
- [ ] Confirm host-only cookie isolation; no shared `.vilet.co` auth cookie
- [x] Manually verify the new 90-day persistent-cookie policy in protected Preview by closing and reopening the same browser on the exact same deployment hostname

Production authentication was owner-verified end to end on 2026-08-19 at `app.vilet.co`. The remaining cookie item is a separate browser-security inspection, not an authentication-flow failure.

The 90-day persistence policy was implemented on the QA branch and manually verified on 2026-08-19 using the protected staging Preview `https://vilet-platform-preview-d9qrswsyn-swzyfrmdarocs-projects.vercel.app`. The owner completed magic-link authentication, closed the browser, reopened the same browser and deployment hostname, and returned authenticated without another magic link. Production has not received this change and still requires a separate approval.

## Environment separation and mutation safety

- [x] Preview is protected by Vercel Authentication
- [x] Preview CSP independently confirms staging Supabase `lzohhfmfdqivnjqqwmqu`
- [x] Production is public at the application boundary and uses production
- [x] Privileged credential files are limited to `.env.local` and `.env.production.local`
- [x] Bootstrap requires environment, matching project ref, dry-run/apply intent, and exact production confirmation
- [x] Production RLS fixtures require exact project confirmation
- [x] Staging test identities cannot be created in production
- [x] Connectivity checks require environment/project consistency
- [x] Service-role credential is absent from Vercel Production and browser bundles
- [x] Unnecessary `SUPABASE_SERVICE_ROLE_KEY` removed from Vercel Preview and Preview redeployed

Final Preview isolation was verified on 2026-08-19 using deployment `https://vilet-platform-preview-2albdokp1-swzyfrmdarocs-projects.vercel.app`. Vercel Authentication remains active, the protected application CSP targets only staging Supabase, browser assets contain neither the privileged credential nor the production project reference, and Production remains publicly reachable at the Vilét login layer with its production-only Supabase CSP.

## Security and quality

- [x] Cross-tenant isolation verified live in staging and production
- [x] Privilege-escalation and entitlement protections verified live
- [x] Owner bootstrap verified idempotent and transactional
- [x] Temporary security fixtures removed
- [x] Final repository secret scan passed with no suspected tracked credentials
- [x] Production browser bundle contains no service-role credential
- [x] Dependency audit reports zero known vulnerabilities
- [ ] Verify safe structured auth events in Vercel logs during the final login test

## Visual QA

- [x] Production desktop login and organization shell
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
