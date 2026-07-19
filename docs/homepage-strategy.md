# Vilét Homepage Strategy

## Status and scope

This document is the implementation blueprint for the Vilét homepage. It defines information architecture, content responsibilities, conversion logic, component usage, accessibility, responsive behavior, and future data requirements.

It does **not** contain approved final marketing copy. Text in square brackets is a structured content slot that must be replaced or explicitly approved before publication. Provisional section and process labels describe function, not finished brand language.

The homepage must continue to use the existing `SiteShell`, design tokens, typed navigation, and reusable components. It should remain server-rendered unless a specific interaction requires client state.

## Strategic foundation

### Primary audience

The homepage should serve qualified decision-makers who need one or more of the following:

- A modern website or substantial website improvement
- Automation of a repeatable business workflow using AI
- Purpose-built software for a business need
- Connected digital systems that reduce fragmented work

Before implementation, validate the priority audience, typical organization size, buying role, geography, engagement size, and most common trigger event. These decisions affect the hero language and proof hierarchy but not the section architecture below.

### Primary message

`[Vilét creates high-quality digital systems that move a business from its current constraint toward a defined operational or customer outcome.]`

The final message should connect business value to technical capability. It should not lead with a list of tools, vague innovation language, or unsupported superiority claims.

### Secondary message

`[Vilét combines design, engineering, automation, and ongoing support in one accountable delivery relationship.]`

This message should help visitors understand why the four service areas belong together without implying capabilities or engagement terms that have not been approved.

### Primary conversion

Start a qualified conversation through the Contact route. Until the final contact flow is defined, all primary homepage CTAs should point to `/contact` and use one consistent, approved label.

### Secondary conversions

- Understand the service fit through `/services`
- Evaluate demonstrated work through `/work`
- Understand the delivery model through `/process`

Avoid competing downloads, newsletter prompts, or multiple equal-priority actions at launch.

## Homepage section order

1. Hero
2. Value proposition
3. Services
4. Featured work — conditional on approved project evidence
5. Process
6. Technical approach
7. Why Vilét
8. Trust evidence — conditional on verified assets
9. FAQ
10. Final CTA
11. Global footer

### Why this order

The sequence follows the questions a qualified visitor is likely to ask:

1. **What does Vilét help create, and is it relevant to me?** The hero establishes relevance and offers a direct next action.
2. **What business value connects these capabilities?** The value proposition turns a broad service list into a coherent reason to continue.
3. **Can Vilét address my type of need?** Services provide self-selection without forcing visitors into detail pages immediately.
4. **Has this been demonstrated?** Featured work supplies evidence only when real case-study material exists.
5. **How would an engagement work?** Process reduces uncertainty after interest and evidence have been established.
6. **Is the technical approach credible and durable?** Technical approach explains principles without turning the homepage into a tool inventory.
7. **Why choose this studio model?** Why Vilét differentiates the working relationship using approved, supportable statements.
8. **What third-party or measurable evidence supports the claims?** Trust evidence reinforces confidence but never substitutes for a clear offer.
9. **What objections remain?** FAQ addresses practical buying questions near the decision point.
10. **What should I do next?** The final CTA provides one focused path after the visitor has enough context.

If approved work or trust evidence is unavailable, omit those sections cleanly. Do not insert empty shells, invented metrics, generic stock logos, or fictional testimonials. The surrounding order remains valid without them.

## Section blueprint

### 1. Hero

#### Purpose

Establish Vilét's category, connect its capabilities to a meaningful outcome, and give qualified visitors an immediate next step.

#### Content hierarchy

1. Optional eyebrow: `[Short category or positioning label; no claim that requires proof]`
2. H1: `[Outcome-led statement describing what Vilét builds and why it matters]`
3. Supporting copy: `[One or two concise sentences identifying the audience, capability range, and practical value]`
4. Primary CTA: `[Approved conversation-starting label]` → `/contact`
5. Secondary CTA: `[Approved work-exploration label]` → `/work`
6. Optional supporting note: `[Low-emphasis expectation such as engagement scope or response context, only if operationally confirmed]`

#### Headline rules

- Use one H1 only.
- Keep the core meaning understandable without the accent gradient.
- Prefer a concrete outcome and capability relationship over “future,” “innovation,” or “digital transformation” abstractions.
- Do not enumerate every service in the H1.
- Do not make speed, revenue, performance, or market-leadership claims without evidence.

#### Layout and visual direction

- Use a two-column desktop composition only if an approved product, system, or abstract capability visual adds information. Otherwise use a focused single-column reading hierarchy.
- Keep the copy column within reading width even when the section uses a wide container.
- Use the existing subtle hero background treatment, restrained gradient text on at most one meaningful phrase, and no decorative continuous animation.
- The visual slot should represent systems, interfaces, or connected workflows. It must not imitate a client deliverable or imply an unverified product.

#### Component mapping

`Section`, `Container`, `Stack`, `Eyebrow`, `Heading`, `GradientText`, `Text`, `ButtonLink`, and optionally `IconWrapper`.

#### Accessibility

- Preserve a logical H1-first document outline.
- Ensure any visual is decorative with empty alternative text or has concise alternative text that communicates its actual information.
- Keep CTA labels meaningful out of context.
- Avoid placing essential words only inside a visual or animation.

### 2. Value proposition

#### Purpose

Explain the unifying value behind websites, automation, software, and digital systems before presenting them as separate services.

#### Content hierarchy

1. Section heading: `[Concise statement of the operational or customer value Vilét creates]`
2. Supporting paragraph: `[How strategy, design, engineering, and automation work together]`
3. Three value pillars:
   - `[Business clarity or strategic alignment]`
   - `[High-quality execution or integrated delivery]`
   - `[Durable operation, iteration, or support]`

Pillar labels and descriptions remain placeholders until their accuracy and differentiation are approved.

#### Layout

- Introductory copy followed by a three-column grid on desktop.
- Two columns or asymmetric wrap on tablet.
- Single vertical stack on mobile.
- Use typography and quiet dividers before defaulting to cards; this section should feel lighter than Services.

#### Component mapping

`Section`, `Container`, `SectionHeading`, `Grid`, `Stack`, `Heading`, `Text`, `Divider`, and optionally `IconWrapper`.

#### Accessibility

- Use an H2 for the section and H3s for pillar labels.
- Icons must be decorative when the adjacent heading carries the same meaning.
- Do not rely on column position or color to communicate sequence.

### 3. Services

#### Purpose

Let visitors identify the capability that matches their need and understand the boundaries between service areas.

#### Primary services

1. **Modern websites** — `[Scope, audience, and outcome placeholder]`
2. **AI automation** — `[Workflow, integration, and responsible-use placeholder]`
3. **Custom software** — `[Purpose-built application and operational-fit placeholder]`
4. **Digital systems** — `[Connected tools, data flows, and ongoing support placeholder]`

These four names are the approved structural categories for this blueprint. Final labels may be refined only if navigation, service pages, metadata, and structured data are updated together.

#### Card content hierarchy

1. Decorative category icon
2. Service title
3. One-sentence fit statement
4. Two or three representative capability labels, not an exhaustive deliverable checklist
5. Text link to the relevant Services-page anchor or future detail route

#### Layout

- Four-card grid: four columns only at large desktop widths, two columns on tablet/laptop, and one column on mobile.
- Keep card heights naturally content-driven unless final copy lengths are controlled.
- Use one quiet shared card variant. Do not give every service a unique glow or color.

#### Icon strategy

Use Lucide icons with one consistent stroke weight and `IconWrapper`. Icons should clarify categories without becoming invented brand marks. Final icon choices should be checked for distinct silhouettes and cultural ambiguity.

#### Future scalability

Store services as typed content with stable IDs and optional `href`, `icon`, `capabilities`, and `featured` fields. The homepage should select four primary services; the Services page may expand them without changing the homepage component API.

#### Component mapping

`Section`, `Container`, `SectionHeading`, `Grid`, `Card`, card subcomponents, `IconWrapper`, `Badge` where a meaningful approved label exists, and `ArrowLink`.

#### Accessibility

- Maintain H2/H3 hierarchy.
- Hide decorative icons from assistive technology.
- Make links specific, for example `[Explore modern websites]`, rather than repeating “Learn more.”
- Do not make the whole card clickable unless it becomes one valid semantic link with no nested controls.

### 4. Featured work — conditional

#### Purpose

Demonstrate credible application of Vilét's capabilities and help visitors judge relevance and quality.

#### Publication gate

Render this section only when at least one project has written approval, accurate scope attribution, approved imagery, accessible alternative text, and a valid destination. If those conditions are unmet, omit it.

#### Project presentation

- Lead with two or three selected projects rather than a large portfolio grid.
- Each project card should include:
  1. Approved project/client name or anonymized approved label
  2. Project category
  3. Concise challenge or context
  4. Vilét's verified scope
  5. Approved outcome statement; quantified only when sourced
  6. Screenshot or representative image
  7. Link to a case study or approved external destination

#### Cards and imagery

- Favor an editorial, image-led card with clear text outside or adjacent to the image.
- Use consistent image aspect ratios and purposeful crops.
- Do not place unreadable full-page screenshots inside small cards.
- Avoid autoplay video in the homepage grid.

#### Filtering

Do not add homepage filtering. With two or three featured projects it creates unnecessary interaction and hides content. Filtering may be considered on `/work` after the portfolio has enough approved items and meaningful categories.

#### Future case studies

Case studies should use stable slugs and structured fields for challenge, approach, scope, outcome, services, media, attribution, and publication permissions. Homepage cards should consume a small summary from the same source rather than duplicate copy.

#### Component mapping

Existing: `Section`, `Container`, `SectionHeading`, `Grid`, `Card`, card subcomponents, `Badge`, `Text`, `Heading`, and `ArrowLink`.

Potential new reusable component: `ProjectCard`, built in Step 7 only after the case-study content shape and image treatment are approved.

#### Accessibility

- Supply informative alt text for screenshots when the image conveys project information; use empty alt text for purely decorative crops.
- Never put text essential to understanding inside the image.
- Use one link destination per card presentation and avoid nested interactive elements.
- Outcomes must not rely on chart color alone.

### 5. Process

#### Purpose

Reduce engagement uncertainty, demonstrate a deliberate working model, and show how a project moves from definition to sustained value.

#### Scalable four-step model

The following labels are provisional:

1. **Discover** — `[Business context, users, constraints, and success criteria]`
2. **Define** — `[Scope, solution direction, plan, and measurable acceptance criteria]`
3. **Build** — `[Iterative design, engineering, integration, review, and quality assurance]`
4. **Launch and evolve** — `[Release, handoff, measurement, maintenance, or ongoing support as applicable]`

Four steps provide enough detail to communicate rigor without turning the homepage into project-management documentation. Detailed service-specific variations belong on `/process`.

#### Content hierarchy

Each step contains a visible step number, short working label, one concise description, and optionally one approved deliverable category. Avoid timelines or duration promises unless operationally verified.

#### Visual presentation

- Desktop: horizontal ordered sequence or balanced four-column grid with a quiet connecting rule.
- Tablet: two-by-two grid with explicit numbering.
- Mobile: single ordered vertical list; do not rely on a horizontal connector.
- Motion is unnecessary. If progressive emphasis is later added, content must remain fully visible without JavaScript.

#### Component mapping

`Section`, `Container`, `SectionHeading`, `Grid`, `Stack`, `Badge` or `Eyebrow` for step numbers, `Heading`, `Text`, and `Divider`.

Potential new reusable component: `ProcessStep` if the same semantic structure will be used on the Process page.

#### Accessibility

- Use an ordered list so sequence is available to assistive technology.
- Keep visible numbers even when decorative connectors disappear.
- Do not reveal required process content only on hover or scroll.

### 6. Technical approach

#### Purpose

Establish technical credibility and maintainability without presenting an unhelpful logo wall or promising a fixed stack for every engagement.

#### Content hierarchy

1. Section heading: `[Principle-led technical statement]`
2. Supporting copy: `[How tools are selected for fit, longevity, performance, security, and maintainability]`
3. Three or four approach areas, such as:
   - `[Modern web engineering]`
   - `[Automation and integration]`
   - `[Custom application architecture]`
   - `[Quality, deployment, and support]`
4. Optional approved technology labels as supporting evidence, not the main story

#### Layout

Use a compact grid or grouped list on a subtly differentiated surface. Technology badges may wrap naturally, but avoid a dense marquee or continuously moving logo strip.

#### Component mapping

`Section`, `Container`, `SectionHeading`, `Grid`, `Stack`, `Card`, `Badge`, `IconWrapper`, and `Text`.

Potential new reusable component: none unless a shared `CapabilityList` emerges across Services and Process pages.

#### Accessibility

- Tool logos require accessible names if used; decorative repetitions should be hidden.
- Do not communicate competency through icons alone.
- Avoid motion-based marquees and low-contrast brand marks.

### 7. Why Vilét

#### Purpose

Differentiate the studio's working model after visitors understand its capabilities and process.

#### Content slots

1. Section heading: `[Approved differentiation statement]`
2. Three or four verifiable reasons, each with:
   - `[Short benefit-oriented label]`
   - `[Explanation tied to an actual Vilét practice]`
   - Optional link to About or Process

Candidate themes must be validated before copywriting: senior involvement, integrated disciplines, direct communication, maintainable delivery, or ongoing support. Do not publish any theme merely because it sounds favorable.

#### Layout

Use an asymmetric editorial layout: a stable section introduction beside a vertical list of reasons. On mobile, place the introduction first and keep each reason visibly separated.

#### Component mapping

`Section`, `Container`, `Grid`, `SectionHeading`, `Stack`, `Heading`, `Text`, `Divider`, and optionally `ArrowLink`.

#### Accessibility

- Use headings or a semantic list for reasons.
- Keep reading order aligned with visual order.
- Ensure a sticky desktop introduction, if used, does not obscure content or create keyboard traps.

### 8. Trust evidence — conditional

#### Purpose

Provide independently verifiable confidence signals close to the final decision.

#### Eligible evidence

- Approved client or partner logos with permission
- Attributed testimonials approved for publication
- Sourced project outcomes with measurement context
- Current certifications with valid issuer and status
- Accurately calculated experience or delivery figures
- Links to public case studies or products

#### Evidence governance

Every item needs a source, owner, approval status, review date, and expiration or revalidation rule where applicable. Do not use unqualified numbers, anonymous quotes, implied partnerships, or logos found online without permission.

If only project evidence exists, integrate it into Featured Work and omit this separate section. Add a dedicated trust band only when it contributes new evidence.

#### Component mapping

Existing components should cover an initial implementation: `Section`, `Container`, `Grid`, `Card`, `Text`, `Heading`, and `Badge`.

Potential new reusable components only when real data exists: `Testimonial`, `LogoCloud`, or `Metric`. Do not build them speculatively.

#### Accessibility

- Logo images need accurate organization names in alternative text unless the name is repeated visibly.
- Testimonials need clear attribution and correct quotation semantics.
- Metrics need visible labels, units, timeframe, and measurement context.
- Carousels are discouraged; if later required, they need pause, keyboard, and screen-reader controls.

### 9. FAQ

#### Purpose

Resolve high-intent questions that would otherwise block contact, while supporting search intent without keyword stuffing.

#### Initial topic slots

Final questions and answers require operational approval. Plan for five to seven concise topics:

1. `[Types of engagements Vilét accepts]`
2. `[How project scope and estimates are established]`
3. `[Typical collaboration and communication model]`
4. `[How technology choices are made]`
5. `[What happens after launch]`
6. `[How existing systems or teams are supported]`
7. `[What information is useful before an initial conversation]`

Do not state prices, delivery durations, guarantees, availability, or support terms until approved.

#### Layout and behavior

Use a single-column reading-width disclosure list. Native `<details>` and `<summary>` are preferred for a server-rendered, keyboard-accessible baseline. Allow multiple items to remain open unless research establishes a reason to enforce accordion behavior.

#### Component mapping

`Section`, `Container` with reading width, `SectionHeading`, `Stack`, `Divider`, `Heading`, and `Text`.

Potential new reusable component: `Disclosure` or `FAQItem`, built on native details/summary without a dependency.

#### Accessibility

- Preserve native summary keyboard and expanded-state behavior.
- Do not put links or buttons inside `<summary>`.
- Ensure focus treatment is visible.
- Answers must exist in the server-rendered document.

### 10. Final CTA

#### Purpose

Turn accumulated interest into one clear next action without introducing a full form into the homepage.

#### Content hierarchy

1. Optional eyebrow: `[Low-pressure transition label]`
2. Heading: `[Concise invitation connected to the visitor's next step]`
3. Supporting copy: `[What the visitor can expect after choosing the CTA, only if confirmed]`
4. Primary button: `[Approved conversation-starting label]` → `/contact`
5. Optional secondary link: `[Approved process or services label]` → `/process` or `/services`

#### Visual direction

Use a contained elevated or subtly glowing surface with one strong focal point. The section should feel conclusive, not louder than the hero. Avoid embedded calendars, pop-ups, or forms until privacy, validation, spam prevention, routing, and response ownership are defined.

#### Future form integration

The Contact page should own the complete form. If research later supports an inline homepage form, it must reuse a shared validated form system and include consent, privacy, error, success, loading, and no-JavaScript considerations.

#### Component mapping

`Section`, `Container`, `Card`, `Stack`, `Eyebrow`, `Heading`, `Text`, `ButtonLink`, and `TextLink` or `ArrowLink`.

Potential new reusable component: none for the initial CTA; compose existing primitives.

#### Accessibility

- Use a descriptive CTA label.
- Maintain heading hierarchy.
- Do not auto-focus or open a modal on section entry.
- Ensure the background treatment preserves text and focus-ring contrast.

### 11. Footer

The existing global `Footer` completes the conversion path and must not be recreated inside the homepage. Step 7 should begin the homepage content above it and rely on `SiteShell` for the footer, header, skip link, and main landmark.

## Content hierarchy and conversion flow

### Message layers

1. **Immediate relevance:** outcome-led H1 and concise supporting copy
2. **Offer comprehension:** value proposition and service categories
3. **Evidence:** approved work and trust material
4. **Risk reduction:** process, technical approach, differentiation, and FAQ
5. **Action:** consistent contact CTA

### Scrolling experience

- Alternate dense evidence sections with lighter explanatory sections.
- Avoid placing multiple card grids back-to-back without an editorial break.
- Use background changes and dividers to signal chapter changes, not decoration on every section.
- Keep each section understandable from its heading and first paragraph.
- Repeat the primary CTA selectively: hero, possibly after Featured Work, and final CTA. Do not add a button to every section.
- Preserve the sticky header offset for section anchors.

### Content-length constraints

Final copy should be tested in the actual responsive components, but initial drafting should target:

- Hero H1: one clear sentence, ideally two to three visual lines on desktop
- Hero support: one or two short sentences
- Section introduction: one heading and one paragraph
- Service/value/process descriptions: one concise paragraph each
- FAQ answers: enough to resolve the question, with links to detail pages when needed

These are layout constraints, not reasons to remove information visitors need.

## Responsive strategy

### Desktop

- Use the default content container and wide container only for image-led work or justified visual compositions.
- Allow selected two-column editorial sections, but keep primary reading blocks within reading width.
- Services may reach four columns only when card content remains legible.
- Preserve generous section rhythm without increasing empty space solely for dramatic effect.

### Tablet

- Collapse four-column systems to two columns.
- Convert asymmetric layouts to balanced stacks when the secondary column becomes cramped.
- Keep touch targets and text sizes unchanged rather than shrinking desktop UI.
- Maintain the narrative order from the DOM when visual columns reflow.

### Mobile

- Use a single-column narrative with primary content before supporting visuals.
- Stack hero CTAs or allow them to wrap without reducing target size.
- Present process steps vertically and preserve explicit numbering.
- Avoid horizontal carousels for essential content.
- Use existing mobile gutters and tokenized section spacing; compact only sections whose content density requires it.

### Visual density

The page should begin with focused breathing room, become denser through Services and Work, slow down through Process and Why Vilét, then narrow to FAQ and the final action. Density changes should support comprehension rather than create arbitrary visual spectacle.

## SEO strategy

### Homepage H1

The H1 should express the core offer and value in natural language. It should include the concept of building websites, automation, software, or digital systems without becoming a keyword list. “Vilét” and the tagline may appear elsewhere in the hero; the H1 should do more than repeat the company name.

### Heading hierarchy

- One H1 in the hero
- H2 for each top-level homepage section
- H3 for service cards, value pillars, project titles where appropriate, process steps, technical approach areas, and differentiation reasons
- FAQ questions should use native summary semantics; do not force heading levels solely for visual styling
- No skipped levels introduced for appearance

### Metadata direction

Replace the current neutral homepage metadata during Step 7 with approved fields:

- Title: `[Primary service/category phrase] | Vilét`
- Description: `[Audience + core capability + supported value, within search-result length]`
- Canonical URL: `https://vilet.co/`
- Open Graph title and description aligned with approved positioning
- Approved social-sharing image with useful dimensions and alternative text

Do not add geographic, industry, superlative, or performance claims without strategic approval and evidence.

### Structured data opportunities

After business details are verified, consider:

- `Organization` with official name, URL, logo, verified contact points, and same-as profiles
- `WebSite` with name and canonical URL
- `Service` data on service detail pages rather than duplicating broad entries on the homepage
- `FAQPage` only if the FAQ content is visible, stable, and eligible under current search-engine guidelines
- `BreadcrumbList` on internal pages, not the homepage

Structured data must match visible content and verified facts. It should be generated from the same typed source where practical.

## Typed content-system plan

Step 7 should create a server-safe `src/content/homepage.ts` module or equivalent CMS adapter with a shape similar to the following. This is a planning contract, not code to add in Step 6:

```ts
type ContentStatus = "placeholder" | "approved";

interface HomepageContent {
  status: ContentStatus;
  hero: HeroContent;
  valueProposition: ValuePropositionContent;
  services: readonly ServiceSummary[];
  featuredWork: readonly ProjectSummary[];
  process: readonly ProcessStepContent[];
  technicalApproach: readonly ApproachItem[];
  differentiators: readonly DifferentiatorContent[];
  trustEvidence: readonly TrustEvidenceItem[];
  faq: readonly FAQItemContent[];
  finalCta: CallToActionContent;
}
```

Implementation rules:

- Use stable IDs rather than array indexes as React keys.
- Keep icons as a controlled icon-name union mapped to Lucide components in presentation code; do not store arbitrary JSX in content data.
- Keep internal URLs constrained to typed site paths or validated case-study paths.
- Include `status`, source, and approval metadata for projects, testimonials, metrics, and logos.
- Omit conditional sections when approved arrays are empty.
- Keep copy data independent from visual variants where possible.
- If a CMS is introduced later, validate incoming data at the boundary and map it to the same internal types.

## Complete component mapping

| Homepage area      | Existing components                                                                                        | Potential Step 7 addition                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Hero               | `Section`, `Container`, `Stack`, `Eyebrow`, `Heading`, `GradientText`, `Text`, `ButtonLink`                | `HeroVisual` only after visual direction is approved         |
| Value proposition  | `Section`, `Container`, `SectionHeading`, `Grid`, `Stack`, `Heading`, `Text`, `Divider`, `IconWrapper`     | None expected                                                |
| Services           | `Section`, `Container`, `SectionHeading`, `Grid`, `Card` family, `IconWrapper`, `ArrowLink`                | `ServiceCard` only if composition repeats beyond homepage    |
| Featured work      | `Section`, `Container`, `SectionHeading`, `Grid`, `Card` family, `Badge`, `ArrowLink`                      | `ProjectCard` after content and image schema approval        |
| Process            | `Section`, `Container`, `SectionHeading`, `Grid`, `Stack`, `Eyebrow`/`Badge`, `Heading`, `Text`, `Divider` | `ProcessStep` if shared with `/process`                      |
| Technical approach | `Section`, `Container`, `SectionHeading`, `Grid`, `Stack`, `Card`, `Badge`, `IconWrapper`                  | Possibly `CapabilityList` if reused                          |
| Why Vilét          | `Section`, `Container`, `Grid`, `SectionHeading`, `Stack`, `Heading`, `Text`, `Divider`, `ArrowLink`       | None expected                                                |
| Trust evidence     | `Section`, `Container`, `Grid`, `Card`, `Heading`, `Text`, `Badge`                                         | Only evidence-driven `Testimonial`, `LogoCloud`, or `Metric` |
| FAQ                | `Section`, reading `Container`, `SectionHeading`, `Stack`, `Divider`, `Text`                               | Native `Disclosure`/`FAQItem`                                |
| Final CTA          | `Section`, `Container`, `Card`, `Stack`, `Eyebrow`, `Heading`, `Text`, `ButtonLink`, `ArrowLink`           | None expected                                                |
| Footer             | Existing global `Footer` through `SiteShell`                                                               | None                                                         |

## Future components for Step 7

Build only components justified by approved content:

1. **`Disclosure` or `FAQItem`** — justified by accessible FAQ behavior; use native details/summary and keep it server-rendered.
2. **`ProjectCard`** — only when at least one approved project establishes the real image, metadata, and linking requirements.
3. **`ProcessStep`** — only if the same structure will be reused on the Process page.
4. **`ServiceCard`** — only if the composition repeats on the Services page; otherwise compose the existing Card primitives locally.
5. **`HeroVisual`** — only after an informative visual concept is approved and cannot be expressed as a simple image or CSS background.
6. **Evidence components** (`Testimonial`, `LogoCloud`, `Metric`) — only after verified content exists.

No homepage carousel, marquee, tab system, filter, modal, or client-side animation wrapper is currently justified.

## Performance strategy

### Rendering

- Keep homepage sections as server components.
- Introduce a client boundary only for a genuine interaction, not for viewport-triggered decoration.
- Source content at build time where possible and preserve static generation.

### Images

- Use `next/image` for raster project imagery with explicit dimensions or stable aspect-ratio containers.
- Provide responsive `sizes` matching the actual grid.
- Prioritize only the true above-the-fold hero image, if one exists.
- Lazy-load below-the-fold project and supporting images through default browser/Next behavior.
- Use modern source formats and avoid exporting text inside images.
- Keep original assets outside the public bundle when they are not used.

### Animation

- Prefer static hierarchy, hover states, and restrained CSS transitions.
- Do not add continuous background animation, autoplay video, parallax, or cursor effects.
- If entrance animation is approved later, animate opacity and transform only, use existing motion tokens, avoid blocking content, and respect reduced motion.
- Framer Motion should not force the whole homepage into a client component.

### Loading and code

- Avoid new dependencies for layouts already supported by CSS and existing primitives.
- Defer third-party embeds until interaction where possible.
- Reserve space for deferred media to prevent layout shift.
- Monitor bundle impact, Core Web Vitals, image weight, font loading, and third-party scripts during Step 7.

## Content approval checklist before Step 7 implementation

Implementation can begin with placeholders only in a non-production branch or preview, but launch-ready content requires:

- Approved audience and positioning statement
- Approved hero H1, supporting copy, and CTA labels
- Approved service labels, descriptions, representative capabilities, and destinations
- Decision to include or omit Featured Work based on approved evidence
- Approved four-step process language
- Approved technical-approach principles and any technology names
- Verified differentiators
- Decision to include or omit a separate trust section
- Approved FAQ questions and operationally accurate answers
- Approved final CTA expectation
- Verified email address, social destinations, icon, and social-sharing asset noted in `docs/layout.md`
- SEO title, description, canonical, Open Graph content, and structured-data facts
- Legal/privacy review for analytics, forms, embeds, and case-study permissions where applicable

## Step 7 implementation acceptance criteria

The homepage implementation should not be considered complete unless:

- Section order follows this blueprint or a documented approved change.
- All rendered sections have approved or clearly preview-only content.
- Conditional proof sections disappear when they have no approved content.
- Existing primitives and tokens are used before adding components.
- The H1 and heading order are semantic.
- The page remains useful without animation or client JavaScript.
- Mobile reading order matches the intended narrative.
- Images have appropriate dimensions, loading priority, and alternative text.
- CTAs have consistent labels and destinations.
- Format, lint, typecheck, build, keyboard, responsive, console, and performance checks pass.
