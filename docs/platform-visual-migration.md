# Vilét Platform visual migration

## Scope

This is a controlled presentation-layer migration from the supplied Base44 visual reference into the existing Next.js platform. The Codex implementation remains authoritative for authentication, authorization, Supabase access, RLS, tenancy, environment separation, security headers, deployment, and infrastructure.

No Base44 SDK, authentication, entity, or runtime dependency is used.

## Migration plan

1. Preserve the server organization layout, verified-user lookup, capability-derived destinations, and every route-local authorization check.
2. Replace platform presentation tokens with the approved dark HSL palette, subtle overlay depth, typography scale, motion, focus, and scrollbar behavior.
3. Keep authorization on the server, then pass only already-authorized destination metadata to a small client shell for active-route styling and mobile drawer state.
4. Adapt shared page, status, statistics, empty, skeleton, stage, and tab components instead of duplicating patterns.
5. Restyle the existing organization, Studio, Insights, Billing, Support, Settings, Admin, login, and existing Growth presentation without creating fake records or new business functionality.
6. Validate authentication, authorization, environment isolation, tests, build output, dependency health, credentials, and responsive behavior before any Preview decision.

## Security boundaries preserved

- Supabase SSR passwordless authentication and callback behavior are unchanged.
- Organization membership and capability checks remain server-side.
- Platform administration remains independent of organization ownership.
- The client shell receives visible destinations only after server authorization; hiding navigation is not treated as authorization.
- Session cookie scope, RLS, CSP, security headers, noindex behavior, and staging/production separation are unchanged.
- No service-role credential is added to application runtime or browser code.

## Intentional boundaries

- No public marketing source is changed.
- No production database or deployment is changed.
- No fake customers, projects, analytics, integrations, subscriptions, invoices, support history, or Growth metrics are introduced.
- Phase E1 staging rollout remains a separate gate. Existing local E1 code is preserved and visually integrated, but this migration adds no new E1 business capability.
