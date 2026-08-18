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

## Vercel deployment

Create a second Vercel project from the same Git repository with root directory `apps/platform`. Assign `app.vilet.co` only after the application builds with scoped environment variables. Platform pages always emit `noindex, nofollow` and do not expose a sitemap.

Use separate preview/staging credentials. Do not connect arbitrary preview deployments to production customer data.

## Security assumptions

- HTTPS is required outside localhost.
- Production authentication is unavailable unless explicitly enabled.
- The platform CSP allows only same-origin resources and the configured Supabase connection origin.
- Organization membership, roles, entitlements, and platform administration are verified server-side.
- RLS is defense in depth, not a replacement for application authorization.
- Organization owners cannot grant platform administration or entitlements through authenticated table policies.
- Audit records have no authenticated update or delete policy.

## Next phase

Phase B creates the internal Vilét organization and an idempotent, audited administrator bootstrap. Do not implement Growth, Insights product features, external subscriptions, or public login integration before that phase is approved.
