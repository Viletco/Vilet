# About page

The production About route is implemented at `/about`. It presents Vilét's approved philosophy, operating principles, collaboration approach, technology standards, working relationship indicators, selected FAQs, and final call to action.

## Content ownership

Approved About copy lives in `src/content/about/content.ts`. Its typed contract and validation live beside it, and the public `@/content` registry validates the record during application initialization. The page should consume that registry rather than duplicate copy in components.

The content intentionally avoids unsupported claims about company history, team size, clients, locations, awards, or measurable results. Add those details only when real, approved evidence is available.

## Rendering and maintenance

The route is server-rendered and uses shared layout, typography, card, CTA, and FAQ components. It does not require page-level client JavaScript. Keep future additions semantic, evidence-based, and consistent with the existing design tokens.
