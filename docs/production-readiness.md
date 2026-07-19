# Production-readiness review

## Scope

This release gate reviews the repository structure, dependencies, TypeScript and
ESLint configuration, App Router organization, server/client boundaries, content
validation, metadata, accessibility, security, static rendering, and deployment
documentation. It does not approve business evidence, legal language, brand
assets, provider credentials, or the production domain.

## Engineering findings

- The App Router, typed content registries, server-first page composition, and
  provider-gated contact infrastructure are appropriate for the current site.
- Client JavaScript is limited to mobile navigation and the contact form.
- Public pages remain statically rendered; the empty project registry generates
  no case-study paths.
- `framer-motion` was installed but unused and has been removed.
- `server-only` is directly imported by contact infrastructure and is now a
  declared direct dependency instead of relying on transitive resolution.
- Vercel alias protection remains server-side, while Proxy excludes static
  framework assets and generated metadata that do not need request-time host
  inspection.
- Empty architecture markers were removed from populated or unused directories.
- Historical content-architecture guidance was corrected to describe the current
  production renderer and metadata state.

## Release gate

Use Node.js 20.9 or newer and run:

```bash
npm ci
npm run check
npm audit
```

The `check` script runs formatting verification, ESLint, strict TypeScript, and a
production Next.js build. Also perform a committed-history secret scan and hosted
route, keyboard, responsive, header, and contact-mode smoke test before a domain
or provider change.

## Intentional architecture

Broad type exports and content repository adapter contracts support the validated
content boundary and a future CMS migration. They add no client bundle and are
retained intentionally. Development-only component examples remain guarded by a
production `notFound()` boundary. Provisional social and icon assets remain
documented blockers, not approved brand evidence.

## Remaining launch decisions

Production launch still requires owner decisions for contact delivery and shared
rate limiting, approved sender and recipient details, privacy/legal review, final
brand and social assets, footer contact destination, `vilet.co` and `www` DNS,
and Search Console ownership. Do not weaken disabled-mode honesty or evidence
validation to work around those external decisions.
