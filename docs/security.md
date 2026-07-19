# Security preparation

## Browser headers

All routes receive a Content Security Policy limited to same-origin content, data/blob images, no plugins, same-origin forms and base URLs, and `frame-ancestors 'none'`. Inline scripts and styles remain allowed because the current Next.js shell and generated styles require them; development additionally permits evaluation for framework tooling. Tightening this requires nonce-based framework testing.

The site also sends `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, a restrictive Permissions Policy, Cross-Origin Opener Policy, and Cross-Origin Resource Policy. HSTS is emitted only in production builds. Resend and Upstash are server-side connections and require no browser CSP destination.

Vercel preview deployments are detected server-side through the platform-provided
`VERCEL_ENV=preview` value and receive `X-Robots-Tag: noindex, nofollow`. The
same header is added at request time for Vercel-owned `.vercel.app` hostnames so
the temporary production alias created during import is also protected. The host
guard does not match the eventual `vilet.co` production hostname.

## Application boundaries

Contact secrets remain server-only. Configuration validation fails enabled modes with missing or invalid values. Email HTML is escaped, sender/recipient are configuration-controlled, fetches have timeouts, provider details are normalized, request bodies are limited to 64 KB, and no personal submission data is logged. Next.js owns Server Action transport and origin enforcement; application validation remains mandatory.

IP-derived rate limiting is only an abuse signal. Proxy trust must be reviewed against the selected deployment platform before launch. Memory limiting is not production-safe across multiple instances.

Environment classes are: `NEXT_PUBLIC_SITE_URL` as client-safe canonical configuration; delivery-mode variables as server-only and required only for Resend; rate-limit variables as server-only and required only for Upstash; and disabled/memory modes as credential-free local defaults.

## Current audit

No authentication, database, CMS, analytics, tracking pixels, third-party embeds, external images, or browser storage APIs are present. No custom CSRF framework was added. Structured data remains disabled because complete verified organization facts are unavailable.
