# Vilét Content Platform

## Ownership and organization

`src/content/index.ts` is the public application registry and build-validation boundary. Application code should import domain content and selectors from `@/content`; deep imports are reserved for implementation files inside the content platform.

- `shared/` owns serializable cross-domain contracts and lightweight validation helpers.
- `about/`, `services/`, `process/`, `faq/`, `projects/`, and `settings/` own domain records and selectors.
- The existing homepage module remains the approved homepage source. Domain services, process records, and FAQs normalize its approved records without rewriting the copy.
- `repository.ts` defines the future provider boundary without changing the current local-file workflow.

Homepage-only presentation contracts remain in the existing homepage types. Shared contracts cover links, calls to action, media, SEO, rich content, content identity, taxonomy, publication lifecycle, approval, and attribution.

## Validation flow

`next.config.ts` imports the public registry. Registry initialization validates About content, settings, services, projects, and the existing homepage, causing invalid authored data to fail a production build. Validation covers duplicate IDs/slugs, authoring markers, icon references, relationships, publication contradictions, media dimensions and alt text, evidence attribution, HTTPS canonicals, and SEO lengths where applicable.

TypeScript provides the first boundary; local validation handles relationships and authored values. A runtime schema library is intentionally absent. Add one at an external CMS/API adapter boundary if untrusted runtime payloads are introduced.

## Publication and approval

Records are draft, scheduled, or published. Selectors accept an `asOf` date, exclude drafts, and prevent scheduled content from appearing early. Published projects additionally require approval metadata, meaningful case-study content, approved media, and SEO. Featured status never overrides publication or approval requirements.

Empty collections remain empty. Never add sample evidence, fallback projects, hidden seeds, or fabricated approval metadata.

## Local workflow

1. Add or update a record in its domain `content.ts`.
2. Use stable IDs and slugs and reference services/projects by ID.
3. Add approval and source metadata only from real business records.
4. Run formatting, type checking, linting, and a production build.
5. Confirm selectors expose only the intended records.

## Future CMS adapters

`ContentSourceAdapter` loads a `ContentRepository` of normalized internal records. A future Sanity, Payload, Contentful, Supabase, or API integration should own provider queries, asset normalization, runtime payload validation, and mapping into these internal contracts. Components and domain selectors must not depend on provider-specific fields. Local modules remain authoritative until a provider is explicitly selected.

Add future domains only when they have clear ownership: create types, local content, selectors where filtering is needed, validation, a focused barrel, and an intentional export from the public registry. Do not fragment single-purpose fields into extra modules.

The production About, Services, and Process pages now consume domain records and ordered FAQ subsets exclusively through this public registry. Page components do not repeat publication filtering or FAQ lookup rules. Contact service choices use the same published service selector, while submission handling remains in a separate typed provider boundary under `src/lib/contact`.
