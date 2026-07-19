# Deployment preparation

## Prerequisites

- Current Node.js LTS compatible with Next.js 16
- npm and the committed lockfile
- Access to the approved GitHub repository and future Vercel project
- Approved `vilet.co` DNS access
- Approved Resend and Upstash accounts when contact delivery is activated

Run `npm ci`, then `npm run format:check`, `npm run lint`, `npm run typecheck`, and `npm run build`. Vercel should use the production branch selected by the owner, `npm run build`, and the standard Next.js output. Preview deployments should use disabled delivery unless specifically configured with approved non-production destinations.

## Environment

`NEXT_PUBLIC_SITE_URL` is the only client-safe variable and is validated against the approved `https://vilet.co` origin; the code uses that approved origin when it is omitted locally. All contact variables are server-only and documented in `.env.example`. Disabled contact modes need no secrets. Resend and Upstash modes must be enabled deliberately and supplied all corresponding values. Never paste secrets into source, logs, screenshots, or documentation.

## Domain and HTTPS

After owner approval, connect `vilet.co` in Vercel and add only the DNS records Vercel verifies. Choose the apex as canonical and redirect `www` to it. Confirm HTTPS before relying on production HSTS. This repository does not modify DNS or connect Vercel.

## Release workflow

1. Create the approved initial commit and protected production branch policy.
2. Connect a preview deployment and validate routes, headers, social images, sitemap, robots, manifest, 404, and contact disabled mode.
3. Add approved provider settings and test a single non-sensitive inquiry.
4. Connect the domain, verify the sitemap at `/sitemap.xml`, and submit it through an approved Search Console property.
5. Repeat responsive, accessibility, console, security-header, and contact-delivery checks on production.

Rollback by redeploying the last known-good commit or using Vercel's previous deployment promotion after reviewing configuration compatibility. Provider modes can be returned to `disabled` without inventing a successful delivery response.

The `Viletco/Vilet` repository is connected to the Vercel project `vilet`; see
`preview-qa.md` for the hosted QA record. Remaining blockers are no approved
provider credentials or destinations, no production-safe shared rate limiter, no
final brand approval, no approved privacy contact/legal review, no domain or DNS
connection, and no published portfolio evidence.
