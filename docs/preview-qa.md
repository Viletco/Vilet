# Vercel preview QA

## Deployment record

- **Project:** `vilet`
- **Git repository:** `Viletco/Vilet`
- **Framework:** Next.js
- **Production branch:** `main`
- **Reviewed application commit:** `d0b594506816155569995a1a48dc271bb95a3cee`
- **Preview trigger commit:** `7f08ba552469dd2c4b7827a1e55f38cae18455bd`
- **Preview branch:** `preview`
- **Preview deployment:** `https://vilet-75zge9tgr-swzyfrmdarocs-projects.vercel.app`
- **Public temporary alias used for anonymous route QA:** `https://vilet.vercel.app`
- **Preview build result:** Ready in approximately 30 seconds

The true Preview deployment is protected by Vercel authentication. Anonymous
requests redirect to Vercel SSO and receive `X-Robots-Tag: noindex`. Full
anonymous route and interaction QA therefore used the temporary Vercel alias,
which runs the same reviewed application state. No custom domain was connected.

## Safe environment and disabled features

The following non-secret values are scoped to Preview:

```text
NEXT_PUBLIC_SITE_URL=https://vilet.co
CONTACT_DELIVERY_MODE=disabled
CONTACT_RATE_LIMIT_MODE=memory
```

Resend and Upstash variables are unset. No recipient, sender, provider key,
analytics, tracking, external font, CMS, or other external integration was
configured. The temporary production alias uses the repository's equivalent
safe defaults.

## Indexing protection

Vercel Preview builds receive `X-Robots-Tag: noindex, nofollow` through
`VERCEL_ENV=preview`. Vercel's authentication layer also returns `noindex` before
SSO. A server-side host guard applies `noindex, nofollow` to every `.vercel.app`
alias, including the public temporary alias. The future `vilet.co` hostname does
not match that host guard.

## Hosted results

All public pages (`/`, `/services`, `/process`, `/work`, `/about`, `/contact`, and
`/privacy`) returned `200 text/html`. Sitemap, robots, manifest, Open Graph image,
Twitter image, Apple icon, and SVG icon returned `200` with their expected XML,
text, manifest, PNG, and SVG types. A clearly invalid route,
`/work/unpublished-project`, and `/dev/components` returned `404`.

The sitemap contains only the six approved public canonical URLs and no project,
privacy, draft, or development URL. Robots references
`https://vilet.co/sitemap.xml` and disallows `/dev/`. The privacy page retains its
page-level `noindex, nofollow, nocache` metadata. Canonicals intentionally remain
on the reserved production origin while every Vercel alias is header-protected.

## Contact QA

A synthetic submission used `qa@example.com` and neutral test content. Disabled
delivery returned the focused status “Delivery is not active,” did not claim a
message was sent, and preserved all entered values. The form contains labels,
descriptions, a honeypot, minimum-completion-time field, pending-button behavior,
and typed result states. Empty submission was stopped by native required-field
validation and focused the Name field.

A repeated synthetic submission remained in the honest non-delivery state.
Duplicate and rate-limit behavior could not be demonstrated reliably across
Vercel instances while memory mode is active; this is the documented reason
memory mode is preview-only. No provider was configured, so no provider delivery
or email occurred. Repository source emits no inquiry logs or local persistence.

## Security headers

The hosted response includes CSP, Referrer Policy, `nosniff`, Permissions Policy,
Cross-Origin Opener Policy, Cross-Origin Resource Policy, HSTS, and the preview
indexing header. The CSP uses same-origin scripts, styles, connections, and
forms; permits only the documented inline framework requirements and data/blob
images; and blocks objects and framing. Pages, generated images, and the contact
Server Action remained functional.

## Accessibility and responsive QA

Hosted checks covered the seven public pages at 320×800, 390×844, 430×932,
768×1024, 1024×768, 1280×800, 1440×900, and 1920×1080: 56 route/viewport
combinations. No horizontal overflow, nested controls, empty links, or H1-count
errors were found. Landmarks, skip link, logical headings, native FAQs, labels,
error associations, visible status text, and reduced-motion styles remain in
place. Mobile navigation moved focus into the menu, locked page scrolling, closed
with Escape, hid the closed dialog through `aria-hidden` and `inert`, and restored
focus to its trigger.

Footer text links have 19-pixel text boxes at narrow widths, but they remain
separated list links rather than crowded adjacent controls. This review is not a
formal WCAG certification and did not include Safari, Firefox, or a physical
screen reader.

## Performance and content observations

Next.js reports the public pages as static and project detail as SSG with no
generated project paths. Hosted HTML is cacheable through Vercel and returned
cache hits during repeat checks. The homepage remains server-rendered; client
boundaries are limited to mobile navigation and the contact form. No analytics,
tracking, external font, CMS, Resend, or Upstash browser request was found.

Hosted content contains no Lorem ipsum, initialization message, fake credentials,
fake projects, fake testimonials, fake statistics, Featured Work, or Trust
Evidence. Work retains its approved empty state. Footer links resolve only to
implemented routes. The provisional icon and social artwork remain launch
blockers rather than being represented as approved assets.

## Defects and fixes

The initial import exposed that the automatically created public `.vercel.app`
alias did not receive the Preview-only indexing header. It was corrected through:

- `e3be969` — `chore: protect preview deployments from indexing`
- `d0b5945` — `fix: protect vercel preview aliases from indexing`

The empty `7f08ba5` commit exists only on the `preview` branch because Vercel
deduplicated a branch pointing at an already deployed commit. It triggered the
true Preview without changing application files or rewriting history.

## Production-domain readiness

Stable build, core routes, sitemap, robots, generated assets, security headers,
preview noindex, disabled-contact honesty, responsive layout, and rollback
documentation pass. Connecting `vilet.co` remains blocked on owner decisions for
contact delivery and production rate limiting, privacy/legal review, final brand
and social assets, footer contact destination, Vercel production environment,
DNS access, `www` redirect, and Search Console ownership. Continue to use normal
commits and redeploy an immutable known-good commit for rollback.
