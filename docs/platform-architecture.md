# Vilét Platform architecture

## Phase A scope

The repository contains two independently deployable Next.js applications:

- The repository root is the existing public `vilet.co` marketing application.
- `apps/platform` is the private `app.vilet.co` application.

Both applications share one npm lockfile. The public application is intentionally not moved during Phase A.

> All tenant-owned resources must be organization scoped and all sensitive authorization must be verified server-side.

## Packages

- `@vilet/shared-config` validates platform mode and public/server environment boundaries.
- `@vilet/database` owns database types and the server-only privileged client.
- `@vilet/authorization` contains pure role, capability, tenant, and entry-decision policies.
- `@vilet/auth` owns Next.js server-session, membership, entitlement, and platform-administrator checks.

Browser code must not import `@vilet/database/admin` or server helpers from `@vilet/auth`.

## Authentication

Supabase Auth is the selected provider. Passwordless email is the only Phase A login method. Session cookies are created for the platform host and are not configured for `.vilet.co`. The platform proxy refreshes sessions; security decisions use `auth.getUser()` on the server rather than trusting unverified cookie claims.

Safe local mode is `PLATFORM_AUTH_MODE=disabled`. It sends no authentication request and exposes no fake user. Supabase mode fails configuration validation unless the URL and publishable key are present.

The service-role key is optional for ordinary application builds and required only by reviewed privileged operations. It must never be sent to the browser.

## Routes

- `/login` requests a passwordless link or reports that authentication is unconfigured.
- `/auth/callback` exchanges a valid PKCE code for the platform-host session.
- `/logout` accepts POST and clears the session.
- `/` requires a verified user, redirects a single membership, shows a chooser for multiple memberships, or displays a controlled private-access state for no memberships.
- `/o/[organizationSlug]` verifies active membership; the slug is never treated as authority.

## Organization and entitlement model

Authentication identity remains in `auth.users`. Application data uses profiles, organizations, memberships, invitations, capabilities, entitlement grants, platform administrators, and immutable audit events. Platform administration is independent from organization roles. Subscription plan names are not authorization inputs.

Entitlements are active only when their start time has passed, they are not revoked, and their optional end time has not passed. Future billing maps plans to these grants rather than embedding plan checks in application pages.

### Internal organization

The first-party Vilét organization uses the immutable slug `vilet`, the display name `Vilét`, `kind=internal`, and `status=active`. Internal kind is classification only: it grants no membership, role, capability, or platform-administrator authority. Authorization continues to require explicit active membership, an allowed organization role, active entitlements, and—where required—a separate platform-administrator record.

Vilét receives non-expiring `source_type=internal` entitlement grants for the canonical Studio, Growth, Insights, AI, Billing, and Support capabilities. These grants represent first-party operation and do not create or imply a Stripe subscription.

### Owner bootstrap

The security-critical owner bootstrap is an explicit CLI backed by the transactional, service-role-only `bootstrap_vilet_owner` database function. It verifies the target provider user, locks concurrent executions, resolves the organization by its unique slug, fails on conflicting protected state, verifies the capability catalog, and writes audit events only for resources actually created. Ordinary authenticated and anonymous roles cannot execute the function. No web route exposes the bootstrap and no personal email or provider user ID is stored in source control.

The command defaults to a read-only dry run. Staging execution requires an explicit environment and Supabase project reference:

```bash
npm run platform:bootstrap-owner -- --environment=staging --project-ref=<project-ref> --user-id=<provider-user-id>
npm run platform:bootstrap-owner -- --environment=staging --project-ref=<project-ref> --user-id=<provider-user-id> --apply
```

The ignored local environment may provide `VILET_SUPABASE_PROJECT_REF` and `VILET_BOOTSTRAP_ADMIN_USER_ID` instead of the matching CLI arguments. Production reuse requires the same source code but additionally requires `--environment=production`, `--apply`, and `--confirm-production=<project-ref>`. The confirmation must exactly match the configured Supabase hostname. The CLI never prints credentials or the target provider ID.

An organization owner is not automatically a platform administrator. The independent platform-administrator grant exists because cross-organization operations require a separate, tightly controlled authority boundary. Organization owners and admins cannot create this grant through RLS.

## Authorization and tenant isolation

Layouts provide navigation protection, but every Server Action and Route Handler must independently call the appropriate authorization helper. Future tenant APIs must accept a verified `OrganizationContext` and scope queries by its `organizationId`.

Preferred:

```ts
getOrganizationResource(context, resourceId);
```

Forbidden:

```ts
getResource(resourceId);
```

The first migration enables RLS on every Phase A table. Security-definer membership functions prevent recursive membership-policy evaluation and use explicit search paths. Authenticated users have no policy permitting entitlement mutation, platform-administrator mutation, invitation mutation, or audit insertion. Those operations require reviewed server workflows using the service role and must append an audit event.

## Local setup

Install once at the repository root:

```bash
npm install
```

Copy `apps/platform/.env.example` to an ignored `apps/platform/.env.local`. Disabled mode requires no external credentials:

```bash
npm run dev --workspace @vilet/platform
```

To enable Supabase locally, set `PLATFORM_AUTH_MODE=supabase` and provide the app URL, Supabase URL, and publishable key. Keep the service-role key unset unless running a reviewed privileged workflow.

## Supabase setup

1. Create separate staging and production Supabase projects.
2. Apply `supabase/migrations/202608180001_phase_a_account_foundation.sql`.
3. Generate fresh database types before production use and compare them with `packages/database/src/types.ts`.
4. Configure the site URL as `https://app.vilet.co` in production.
5. Add `https://app.vilet.co/auth/callback` as an allowed redirect URL.
6. Configure approved SMTP delivery for passwordless email.
7. Run the SQL integration suite against a disposable local database before production.

The SQL test has not been claimed as executed without a configured Supabase CLI/database.

## Staging activation state

As of August 19, 2026, Phases A and B are connected to a dedicated free Supabase staging project. This environment must not contain production or customer data.

- Project name: `Vilet`
- Project reference: `lzohhfmfdqivnjqqwmqu`
- API origin: `https://lzohhfmfdqivnjqqwmqu.supabase.co`
- Region: Canada Central (`ca-central-1`)
- Phase A migration: applied and schema-verified
- Membership-policy hardening migration: applied
- Local site URL: `http://localhost:3001`
- Local callback: `http://localhost:3001/auth/callback`
- Passwordless email delivery: verified with an approved staging identity
- Callback, session persistence, authenticated-login redirect, and logout: live-verified
- Internal organization: `Vilét` (`vilet`, internal, active)
- Primary membership: active owner
- Platform administrator: active and independently verified
- Internal entitlements: all 13 canonical capabilities active
- Owner bootstrap: applied once and rerun with zero changes
- Bootstrap audit trail: 17 events with no duplicate events on rerun

The read-only schema assertions verified eight Phase A tables, RLS on all eight tables, thirteen RLS policies, three private authorization helpers, and thirteen seeded capabilities. The live RLS suite passed all 24 assertions using two temporary identities and organizations. The Phase B live suite additionally verified owner state, internal entitlements, independent platform administration, audit idempotency, bootstrap denial, cross-tenant slug denial, internal-entitlement denial, and suspension behavior. All temporary fixtures were removed after each run.

The activation review identified and fixed an organization-role escalation path. Migration `202608180002_harden_membership_role_policies.sql` prevents admins from promoting themselves or granting owner/admin roles while preserving owner authority and lower-role administration.

The pgTAP smoke file remains unexecuted because no authenticated Supabase CLI or disposable local Supabase runtime is configured. Its schema checks are superseded for this staging activation by the read-only schema assertions and the stronger live JWT/RLS suite, but it remains available for future local database CI.

Secrets exist only in the ignored `apps/platform/.env.local` file. They are not documented, committed, printed by verification scripts, or exposed through public environment variable names.

## Vercel deployment

As of August 19, 2026, the platform is deployed to the separate `vilet-platform-preview` Vercel project with root directory `apps/platform`. Its Preview environment uses only the dedicated Supabase staging project. Vercel Authentication protects production deployment URLs and every preview, and Git-fork protection is enabled.

The verified preview is `https://vilet-platform-preview-dx9u9vkf2-swzyfrmdarocs-projects.vercel.app`. Its matching `/auth/callback` URL is allowlisted in Supabase. Live verification confirmed Vercel protection, passwordless-link initiation and delivery, callback exchange, session establishment, refresh persistence, logout, and post-logout denial of the protected root route. The staging identity correctly reaches the controlled no-membership state because Phase B has not created an organization or membership.

Platform responses include the configured CSP, HSTS, cross-origin policies, permissions policy, referrer policy, `X-Content-Type-Options`, and `X-Robots-Tag: noindex, nofollow`. `robots.txt` disallows all crawling. The service-role credential was absent from browser assets, and dependency and tracked-secret scans passed. Session cookies use `Path=/`, `SameSite=Lax`, and `Secure` on HTTPS; no cookie domain is configured, so the platform does not create a shared `.vilet.co` authentication cookie.

`app.vilet.co` is intentionally unconfigured. The existing marketing project and `vilet.co` deployment were not changed during Phase A activation.

## Security assumptions

- HTTPS is required outside localhost.
- Production authentication is unavailable unless explicitly enabled.
- The platform CSP allows only same-origin resources and the configured Supabase connection origin.
- Organization membership, roles, entitlements, and platform administration are verified server-side.
- RLS is defense in depth, not a replacement for application authorization.
- Organization owners cannot grant platform administration or entitlements through authenticated table policies.
- Audit records have no authenticated update or delete policy.

## Next phase

Phase C may introduce the Vilét application dashboard and product shells after the committed Phase B preview is verified with the owner account. Do not implement Growth or Insights product functionality, external subscriptions, or public login integration before those later phases are approved.
