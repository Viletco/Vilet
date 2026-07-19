# Vilét Homepage

The production homepage is a server-rendered composition backed by `src/content/homepage.ts`. Approved content renders in this order: hero, value proposition, services, process, technical approach, why Vilét, FAQ, and final call to action.

Featured Work and Trust remain omitted until their exported visibility selectors find approved, publishable evidence. The page fails loudly if either becomes visible before its renderer exists.

## Contracts

- Homepage sections remain server components.
- Content icons resolve through `getIcon()`.
- FAQs use the reusable native `Disclosure`; multiple answers may stay open without client JavaScript.
- Metadata comes from approved SEO content. JSON-LD remains disabled; root file-based metadata supplies a real, provisional code-generated social image.
- Approved production copy rejects placeholders and editorial markers.

## Step 9 visual audit and refinements

The initial rendered audit covered 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, and 1920×1080. It found that semantic typography classes were being removed when merged with text-color classes, leaving headings at browser-default sizing. It also identified an overly tall mobile hero, repetitive card treatment in the value proposition, uneven service CTA alignment, a cramped four-column process near the laptop breakpoint, understated FAQ open states, and unresolved footer destinations.

The typography contract now uses conflict-safe `type-*` utility names. The hero uses a narrower display scale, editorial column proportions, compact mobile spacing, a shallower mobile visual, and an attached supporting note. The value proposition is an ordered editorial list rather than another card grid. Service cards retain equal-height composition and align CTAs consistently. The process holds two columns until the desktop breakpoint and gives each step a clear top rule. FAQ disclosures gain clearer hover, focus, open-state, and reduced-motion styling. The final CTA uses a contained, non-interactive accent treatment and a stronger closing rhythm.

## Responsive behavior

The homepage remains fluid across all required viewports. The hero stacks before the laptop breakpoint, its decorative visual changes from a shallow landscape treatment to a square desktop composition, services use one or two columns, process steps use one, two, then four columns, and editorial sections stack before their two-column layouts become useful. The mobile navigation overlay remains clipped to prevent off-canvas overflow.

## Accessibility QA

- Exactly one H1 and a logical H2/H3 hierarchy are preserved.
- Every homepage section has an accessible name through `aria-labelledby`.
- The skip link targets the main content region and remains keyboard-visible.
- FAQ answers remain native, server-rendered `details`/`summary` elements with 56px minimum summary targets, visible focus, independent open states, and reduced-motion support.
- Decorative hero and content icons remain hidden from assistive technology.
- The mobile menu retains its focus trap, Escape behavior, scroll lock, and trigger-focus restoration.
- Footer contact and social destinations were omitted because they are not launch-approved; no dead or misleading controls remain.

## Performance observations

All homepage sections and FAQ content remain server-rendered. Mobile navigation is still the only homepage client boundary. The hero uses CSS only, no external images or runtime animation were added, icons continue through the registry, and the route remains statically generated.

## Remaining launch blockers

- Featured Work requires approved, published project evidence.
- A future Featured Work project must be published, featured, evidence-approved, media-complete, reference-valid, and metadata-valid. The homepage visibility boundary consumes the project selector and remains the only activation point; approved section-introduction copy and its renderer are still required before launch.
- Trust requires approved testimonials, metrics, logos, awards, certifications, or partners.
- Footer contact and social destinations require launch approval before they can be restored as interactive links.
- The generated social-sharing image is a provisional launch asset and still requires final creative approval.
- The repository has no initial commit; this is repository infrastructure rather than an application defect.
