# Vilét Platform Operations and Recovery

## Current operating envelope

Production is a Supabase Free project. Supabase does not include automatic backups on Free; create regular logical exports with `supabase db dump` or `pg_dump` and store them encrypted outside Supabase. Before customer data is accepted, either automate and restore-test those exports or move to a plan with an appropriate native backup window. Point-in-time recovery is a separate paid capability. Storage objects, if introduced, need their own backup because database backups cover only Storage metadata.

Current visibility:

- Vercel request/runtime/build logs and deployment rollback
- Supabase Auth, Postgres, and API logs (Free retention is limited)
- Application `audit_events` for durable business-security changes
- Safe structured application events for auth request/callback outcomes

Never log email addresses, magic-link codes, tokens, cookies, authorization headers, database credentials, or service-role keys. Correlate investigations by time, route, event name, safe reason, HTTP status, deployment, and provider request identifiers when available.

## Routine operations

1. Export production before every migration and at a documented schedule.
2. Encrypt the export, record checksum/time/project ref, and store it off-provider with restricted access.
3. Restore the export into a disposable non-production project at least quarterly and verify schema, RLS, capability seed, organization counts, and representative records.
4. Review Vercel errors and Supabase Auth/API/Postgres logs after deployments.
5. Reconcile the canonical Vilét organization, owner membership, administrator grant, and entitlements with the read-only Phase B verifier.
6. Never use production credentials from Preview or staging credentials from Production.

## Database incident

### Migration failure

Stop deployment and writes. Capture the exact migration, project ref, timestamp, and provider error. Determine whether the transaction rolled back; never rerun blindly. If rolled back, correct the migration, validate against a restored staging copy, take a fresh export, and apply intentionally. If partially applied, write a forward recovery migration; do not edit migration history already applied to production.

### Incorrect writes or accidental deletion

Disable the affected mutation path. Preserve logs and take a current export before repair. Identify the smallest affected record set from audit events and timestamps. Prefer a reviewed forward repair transaction. If damage is broad, restore into a separate project first, validate it, then plan a controlled cutover. Free plan does not provide a guaranteed native restore point.

### Database unavailable

Check Supabase status and project health, then Vercel errors. Do not weaken authorization or switch environments. The application should fail closed. Communicate status, preserve the incident timeline, and validate RLS/auth after recovery.

## Authentication incident

### Owner cannot log in

Check `app.vilet.co`, Vercel logs, Supabase Auth logs, redirect allowlist, rate limits, and SMTP delivery. Confirm the auth identity exists without creating duplicates. Do not manually insert into `auth.users`. Use the official Auth admin API/dashboard only.

### Owner identity removed

Create or invite the approved owner through Supabase Auth, confirm identity ownership, run owner bootstrap in dry-run mode using the exact production ref, then apply with exact confirmation. Review audit events and revoke obsolete identities.

### Administrator grant or membership lost

Take an export and inspect audit history. Use the service-role-only idempotent bootstrap for the approved identity; do not grant via client code. Verify exactly one owner membership, one active administrator record, thirteen canonical entitlements, and no duplicate grant events.

### Suspended accidentally

Confirm the actor and reason, then restore only the intended membership status through an approved privileged operation. Verify access and record an audit event. Never bypass suspension in application code.

## Entitlement incident

Compare active grants with the canonical capability set and audit history. Correct grants transactionally, retain grant/revoke attribution, and run Phase B verification. Customer entitlements must be repaired per organization; never copy Vilét internal entitlements to a customer tenant.

## Deployment incident

### Bad deployment

Use Vercel's provider-native rollback/promote controls to return the platform project to the last known-good deployment. Do not deploy the marketing project. After rollback, verify root, login, CSP Supabase origin, headers, robots, and database connectivity.

### `app.vilet.co` errors

Check DNS CNAME, Vercel domain status/certificate, deployment readiness, protection scope, environment variables, and provider status. Keep Preview protected. Never point `app.vilet.co` at the marketing project.

### Incorrect environment variables

Stop promotion, compare variable names/scopes without exposing values, correct Production only, and redeploy the platform. Confirm the CSP `connect-src` names production ref `detqlxrismxlbgsgeafx`. Rotate any credential that was exposed or placed in the wrong scope.

## Audit expectations

Durable events are required for administrator grant/revoke, bootstrap, membership role/status change, entitlement grant/revoke, organization security changes, and future outreach approval/send/suppression actions. Include actor ID when known, organization ID, action, target ID/type, timestamp, and minimal non-secret metadata. Reads and routine page views should not create noisy audit records.

## Auth email recommendation

Supabase's built-in mailer is acceptable only for the current owner verification: it is best-effort, team-address-only, and rate limited. Custom SMTP is mandatory before any customer account rollout. Prefer a dedicated transactional-auth sender such as `auth@` or `no-reply@` on a configured Vilét subdomain, separated operationally and reputationally from future Growth outreach. The application needs no architecture change; configure SMTP in Supabase, approve templates, SPF/DKIM/DMARC, bounce handling, rate limits, and delivery monitoring.
