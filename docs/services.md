# Vilét Services Page

`/services` is a statically generated server page backed by the public services and FAQ registries. The four service records reuse approved homepage summaries and features, then add only the approved detailed description, fit guidance, engagement areas, and outcome statement.

## Structure and anchors

The page contains a hero, ordered overview, four `ServiceDetail` sections, engagement-fit guidance, cross-service principles, approved FAQs, and a final CTA. Overview links use stable service slugs as fragment identifiers. Global scroll offset keeps anchored headings clear of the sticky header.

`ServiceDetail` is a typed server component that resolves its content icon through `getIcon()`. Alternating semantic surfaces provide rhythm without changing its data contract. `FaqList` receives the ordered result of `getFaqsBySlugs()` and retains native disclosure behavior.

Metadata uses the approved title, description, canonical URL, and Open Graph text with no image or JSON-LD.

## Accessibility and responsive behavior

The page has one H1, named sections, logical H2/H3 hierarchy, semantic lists, visible anchor focus, and no nested controls. Editorial grids collapse before content becomes cramped, CTA groups stack on narrow screens, and FAQ summaries retain large native targets.

## Adding a service

Add an approved record to the service registry with a unique ID/slug, supported icon, summaries, fit and engagement lists, outcome statement, CTA, and publication state. Update the approved overview order deliberately. Do not add fixed pricing, guaranteed outcomes, evidence, or unsupported scope claims.
