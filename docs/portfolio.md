# Vilét Portfolio and Case Studies

## Current state

The approved project collection in `src/content/projects/content.ts` is intentionally empty. `/work` therefore renders a production-quality empty state and no filters, grid, cards, claims, structured data, or hidden project markup. `/work/[slug]` generates no static pages and unknown slugs return 404.

## Project lifecycle

- Draft records never render publicly.
- Scheduled records render only after their valid publication time.
- Published records require meaningful challenge, strategy, solution, and outcome content; approval metadata; hero and supporting media; useful alt text; valid service references; and approved SEO.
- Featured projects must also be published and pass every project validation rule.

Metrics require a numeric value, unit, context, evidence source, and approval. Testimonials require an approved quote and named attribution. Optional evidence, galleries, related work, and project navigation render only when their selectors return valid content.

## Model and references

Projects support confidentiality-safe client labels, project type, industry, narrative sections, service IDs, technologies, capabilities, timeline/year, approved links, responsive media, credits, attribution, related records, publication/approval metadata, SEO, metrics, and testimonials. Service names are resolved from stable IDs in the shared service registry; broken references fail validation.

## Media and SEO

Media supports local, approved remote, and future CMS sources with intrinsic dimensions, alt text, optional captions, and responsive `next/image` rendering. Before publishing a remote source, configure only its approved host. No broad remote allowlist exists. Project metadata and Open Graph assets come only from the published record. Project structured data remains disabled.

## Components and accessibility

`ProjectCard` is a typed server component with semantic article structure, an accessible case-study link, visible focus, stable media ratio, and reduced-motion-safe hover treatment. `CaseStudyLayout` provides one H1, named sections, reading-width narrative content, semantic figures/captions, conditional evidence, and a final CTA. Neither component adds client state.

## Adding the first approved project

1. Obtain approved case-study narrative, confidentiality-safe client naming, evidence sources, media rights, alt text, service references, and SEO.
2. Add a draft record and resolve every validation issue.
3. Review the rendered case study and approval metadata.
4. Change publication to published only after approval.
5. Set `featured: true` only when the project is also eligible for homepage use.
6. Confirm `/work`, `/work/[slug]`, metadata, media, responsive behavior, and accessibility in a production build.

Homepage Featured Work remains absent while the collection is empty. Future eligibility requires published state, featured status, approved evidence, required media, valid references, and valid metadata. Trust Evidence is a separate approval domain and is not inferred from a project.

The homepage visibility boundary reads the project platform's featured selector. An eligible record therefore activates that boundary, but approved Featured Work introduction copy and a renderer must exist before it can ship; the homepage fails safely instead of rendering legacy placeholder copy.

Future CMS migration follows the adapter strategy in `content-platform.md`; provider records must normalize into the same project contract before validation and selection.
