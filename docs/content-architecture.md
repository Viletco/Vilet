# Vilét Content Architecture

## Purpose

The content architecture provides a strongly typed, validated boundary between authored homepage content and future presentation components, APIs, or a CMS. Step 7 does not render this content. The visible homepage remains the foundation placeholder.

All current copy values in square brackets are descriptive authoring slots, not approved marketing copy. Proof-dependent collections are intentionally empty.

## Folder structure

```text
src/
├── content/
│   ├── content-types.ts       # Reusable content contracts and unions
│   ├── content-validation.ts  # Runtime validation and section selectors
│   ├── homepage.ts            # Typed homepage authoring data
│   ├── icons.ts               # Allowed content icon names
│   ├── navigation.ts          # Existing typed public navigation
│   └── routes.ts              # Existing typed placeholder routes
└── lib/
    └── icon-registry.ts       # Icon-name to Lucide-component resolution
```

`next.config.ts` imports the validated homepage module. Because `homepageContent` is created through `assertValidHomepageContent()`, malformed content stops a production build before it can ship.

## Content flow

```text
Authoring data or CMS response
        ↓
HomepageContent-compatible adapter
        ↓
Compile-time `satisfies` checks
        ↓
Runtime structural validation
        ↓
Visibility and publication selectors
        ↓
Future server-rendered homepage sections
```

The presentation layer should consume selectors and section objects. It should not query raw CMS documents, duplicate filtering rules, or decide publication state independently.

## Type relationships

`HomepageContent` is the root contract. It contains typed objects for Hero, Value Proposition, Services, Featured Work, Process, Technical Approach, Why Vilét, Trust, FAQ, Final CTA, and SEO/JSON-LD.

Reusable supporting contracts include:

- `ContentLink` for internal, external, email, and scheduling destinations
- `CallToActionContent` for labeled actions with required destinations
- `ContentImage` and discriminated `ImageSource` variants for local, remote, and CMS assets
- `HeroVisual` variants for no media, images, video, and future CMS media
- `PublicationState` for draft, scheduled, and published work
- `TrustEvidenceContent` variants for testimonials, logos, metrics, awards, certifications, and partners
- `FAQAnswerContent` variants for plain text, Markdown, and future rich-text documents
- `JsonLdPlaceholder` variants for Organization, WebSite, Service, and FAQ schemas

Types are readonly by default. There are no `any` values. CMS-shaped unknown data must be validated before being mapped into these contracts.

## Icon architecture

Content stores controlled icon names instead of importing React components. `src/content/icons.ts` defines the allowed names, and `src/lib/icon-registry.ts` is the single presentation-layer mapping to Lucide components.

This keeps content serializable for CMS/API delivery, prevents arbitrary component references in data, and makes missing mappings a compile-time error.

## Link and route strategy

Internal links use a constrained `InternalHref` type based on the existing `SitePath`, optional valid section fragments, and future `/work/[slug]` case-study paths. Runtime validation also checks the path and fragment format.

External and scheduling links require HTTPS. Email destinations require a valid `mailto:` value. Every CTA requires a link, preventing label-only actions.

When new public routes are introduced, update the typed navigation or intentionally extend the reusable content-route union. Do not weaken content links to arbitrary strings.

## Image strategy

Every `ContentImage` supports a stable ID; local, remote, or CMS source; alternative text; intrinsic dimensions; priority; blur data; caption; normalized focal point; and future CDN/CMS metadata.

Validation rejects traversal-style local paths, unsupported extensions, non-HTTPS remote sources, missing CMS IDs, invalid dimensions, and out-of-range focal points. Remote delivery domains must also be approved in Next.js image configuration when images become rendered.

## Conditional rendering

Three homepage sections are proof- or content-dependent:

- Featured Work
- Trust
- FAQ

`getHomepageSectionVisibility()` is the single visibility policy:

- Featured Work is visible only when a project is featured and published.
- Trust is visible only when at least one item has approved status.
- FAQ is visible only when at least one item exists.

The initial exports resolve all three flags to `false`. Step 8 should conditionally render entire sections from these flags. It must not create placeholder cards, fallback testimonials, fake projects, or empty section headings.

`getPublishedFeaturedProjects()` centralizes project publication filtering so the Work page and homepage can use the same rule later.

## Validation strategy

### Compile time

- `satisfies HomepageContent` verifies every authored section and discriminated union.
- Template-literal URL types constrain internal, HTTPS, email, and scheduling destinations.
- Icon names are a closed union and the registry must cover every name.
- Process labels and technical-approach categories are closed unions.
- Publication flags cannot contradict their discriminated publication state.
- Trust and FAQ formats narrow required fields by content kind.

### Runtime/build time

`validateHomepageContent()` checks required fields, CTA destinations, duplicate IDs and slugs, required collections, published project images, route references, link protocols, image sources/dimensions/focal points, icon names, FAQ content, metadata URLs and lengths, and duplicate image IDs.

Conditional Work, Trust, and FAQ arrays are allowed to be empty; their visibility becomes false instead of producing a validation error.

The validator returns structured issues for tools and CMS previews. `assertValidHomepageContent()` formats those issues and throws during build configuration loading.

## Publication and approval rules

Project publication uses a discriminated state:

- Draft: `publish: false`, `draftMode: true`
- Scheduled: `publish: false`, `draftMode: false`, with a timestamp
- Published: `publish: true`, `draftMode: false`, with a timestamp

Trust evidence excludes placeholder status and requires source information. Items become homepage-visible only after their status is approved. Future CMS adapters should preserve source, approval, and review dates.

SEO data currently has placeholder status, robots indexing disabled, no social images, and disabled JSON-LD entries. Do not use it to replace the current application metadata until final content and business facts are approved.

## Future CMS migration

The current module can be replaced by a CMS adapter without changing section components:

1. Fetch CMS data in a server-only module.
2. Treat the response as `unknown`.
3. Validate the CMS schema at the boundary.
4. Map provider-specific links, media, rich text, and IDs into the internal contracts.
5. Run `validateHomepageContent()` on the normalized object.
6. Expose the same `homepageContent`, visibility, and selector interface.

Provider IDs and delivery URLs already have optional fields, but internal stable IDs and slugs should remain provider-independent. Do not send preview, draft, unpublished, expired, or unapproved evidence to production selectors.

## Reuse beyond the homepage

The contracts are suitable for Services summaries and pricing, Work listings and case studies, Process steps, About-page trust evidence, FAQ disclosures, blog/CMS media, API responses, and structured data.

As these pages become real, move genuinely shared types into focused domain modules rather than allowing `content-types.ts` to grow indefinitely.

## Accessibility considerations

- Images always carry an explicit alt value.
- CTAs support a separate accessible label.
- Icon content remains name-based so presentation code can mark repeated icons decorative.
- FAQ answers remain server-serializable and suitable for native disclosure markup.
- Rich text stays structured rather than becoming untrusted HTML.
- Published project images require explicit dimensions to reduce layout shift.
- SEO and JSON-LD remain disabled until they match visible verified content.

Step 8 components must preserve heading order, native controls, focus visibility, reduced motion, meaningful link labels, and conditional section removal.

The homepage now consumes `homepageContent` directly for both section rendering and route metadata. Featured Work, Trust, and FAQ decisions use the exported visibility object; no page component repeats the filtering rules.

The broader modular registry is documented in [Content Platform](content-platform.md). `src/content/index.ts` is the application-facing export and validation boundary; domain modules own service, process, FAQ, project, and settings records while the existing homepage module remains its approved source.

## Recommended expansion

1. Add focused unit tests for validator failure cases when a test framework is approved.
2. Extract shared Service, Project, Trust, FAQ, Link, and Image contracts into domain modules as other pages consume them.
3. Add a schema library only when runtime CMS/API data makes it valuable.
4. Add locale-keyed content modules when translated content is approved.
5. Add authenticated, noindex draft-preview tooling.
6. Add remote image domains only for approved providers.
7. Generate metadata and JSON-LD through dedicated approved-content adapters.

## Step 8 implementation rules

- Do not render authoring slots as public copy.
- Replace or approve required placeholder fields before homepage implementation.
- Render conditional sections only through exported visibility selectors.
- Keep the homepage as a server component.
- Resolve icons through `getIcon()` rather than importing icon components in content.
- Use existing components and design tokens before adding abstractions.
- Keep SiteShell and typed navigation unchanged.
