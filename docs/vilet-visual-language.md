# Vilét visual language

## Owner-approved source of truth

The supplied Vilét social identity is the primary reference: the angular two-part mark, near-black field, silver-white left plane, violet-to-blue right plane, and restrained flowing violet energy. Repository implementations must use the supplied raster mark or a technically faithful derivative; a generic letter V is not an acceptable substitute.

The target feeling is a premium technology operating system: cinematic, precise, connected, credible, and unmistakably Vilét. Purple communicates energy, direction, active data, automation, and intelligence; it does not coat every surface.

## System principles

- Deep blue-black canvases and cool white hierarchy.
- Modern technical display typography; editorial serif styling is not part of the final direction.
- Diagonal cuts, forward motion, asymmetry, and overlap derived from the mark.
- Thin luminous trajectories and data paths, not decorative neon blobs.
- Open planes, rails, timelines, maps, and flows before nested rounded cards.
- One brand language with distinct product behavior for Studio, Growth, Insights, AI, and Sales Partners.
- Motion explains state and relationships and always respects reduced-motion preferences.
- Truthful empty/internal/beta states; never fabricate product metrics or integrations.

## Phase 1 audit

Vilét is polished, legible, and internally consistent, but the current visual
system is assembled from conventions shared by many dark SaaS products. The
result is competent without being unmistakably Vilét.

### Generic patterns found

- Inter/system sans is used for every role, so headlines, navigation, product
  labels, data, and body copy share one voice.
- Purple is carrying too much brand responsibility. It appears as the primary
  action, active navigation, icon color, glow, chart treatment, badge, and
  decorative atmosphere.
- Rounded dark containers are the default composition. Content that needs a
  rule, rail, sequence, or editorial grouping is frequently placed in another
  card instead.
- Icon-in-square and icon-with-heading patterns recur across marketing and the
  platform. Lucide remains useful for controls, but currently doubles as the
  product identity.
- Dashboard pages rely on equal KPI tiles followed by equal content panels.
  This makes unrelated products inherit the same information rhythm.
- The platform sidebar is clear but visually conventional: logo tile,
  organization block, grouped icon links, and account menu.
- Motion is generic fade, slide-up, and scale-in. It does not communicate the
  directional or assembled character of the Vilét brand.
- Grid backgrounds, violet glows, gradient bars, uppercase mono eyebrows, and
  low-contrast dark surfaces collectively signal “AI SaaS” more strongly than
  they signal Vilét.
- Marketing and platform use separate token implementations with similar
  outcomes. They look related by palette, not by a shared formal language.
- Copy labels such as “Organization overview,” “Product access,” “Next up,” and
  “Recommended actions” are useful but interchangeable with other products.

### What should be preserved

- Existing information architecture, content, conversion paths, and semantic
  heading structure.
- Strong dark-mode contrast, focus treatment, reduced-motion handling, and
  responsive foundations.
- Server-side authorization, capability-derived navigation, RLS, authentication,
  environment separation, security headers, and noindex behavior.
- Lucide for familiar utility actions where custom symbolism would reduce
  comprehension.
- The recent Partner Hub functionality and its truthful empty states.

## Design principles

### 1. Direction over decoration

Vilét builds movement into systems. Direction is expressed through precise
diagonal cuts, converging rules, and anchored offsets—not glow, noise, or a
large repeated logo.

### 2. Editorial clarity, operational precision

Public storytelling uses an editorial display voice. Product interfaces use a
compact, highly legible sans voice with tabular data and disciplined labels.
The contrast between the two is intentional and recognizable.

### 3. Containment must earn its place

Use cards for independent, interactive, or movable objects. Use rules, rails,
bands, tables, and open layouts for narrative, sequence, status, and data.

### 4. One family, four instruments

Studio, Growth, Insights, and AI share the same geometry and typography. Their
identity comes from how the geometry behaves, not from unrelated colors:

- **Studio — Compose:** two aligned planes and a registration point.
- **Growth — Advance:** an ascending directional rail.
- **Insights — Resolve:** a signal crossing a reference line.
- **AI — Synthesize:** converging paths forming one output.

### 5. Quiet confidence

Most surfaces remain neutral. Accent appears at decisions, live state, current
location, and meaningful data. Decorative accent is sparse enough to retain
authority.

## Typography system

### Families

- **Vilét Display:** an editorial serif stack (`Iowan Old Style`, `Palatino
Linotype`, `Book Antiqua`, `Palatino`, `Georgia`, serif) for public hero and
  major narrative statements. It is available without a network dependency and
  creates immediate separation from Inter-only SaaS.
- **Vilét Interface:** a neutral sans stack (`Arial`, `Helvetica Neue`, system
  sans) for navigation, controls, product headings, and body copy.
- **Vilét Data:** a monospace stack for section coordinates, metrics, timestamps,
  statuses, and technical values—not every eyebrow.

### Roles

| Role                    | Family               | Treatment                                               |
| ----------------------- | -------------------- | ------------------------------------------------------- |
| Marketing display       | Display              | 400–500 weight, tight leading, modest negative tracking |
| Marketing section title | Display or Interface | Chosen by narrative vs. functional context              |
| Product page title      | Interface            | 600 weight, compact leading                             |
| Navigation              | Interface            | 550–600 weight, sentence case                           |
| Section coordinate      | Data                 | 10–11px, uppercase, generous tracking                   |
| Metric                  | Interface/Data       | Tabular numerals, high contrast, minimal decoration     |
| Body                    | Interface            | 15–18px public, 13–15px product, comfortable leading    |
| Caption/status          | Interface or Data    | Meaning determines family; never decorative by default  |

## Signature motif: the V-cut

The V-cut is a 28-degree directional interruption used as a system, not a logo:

- a short diagonal incision where a horizontal rule changes context;
- two rails converging on a decision or output;
- an offset corner on a primary workspace or overlay;
- a directional tick in charts and loading states;
- a clipped highlight traveling through navigation and hover states.

Only one dominant V-cut should appear within a viewport region. Small rule
incisions may repeat in labels and data visualizations.

## Layout language

- Marketing favors 7/5 and 8/4 splits, anchored side notes, asymmetric product
  moments, and full-width narrative bands.
- Platform pages begin with a contextual rail: product mark, location, title,
  status, and primary action.
- Metrics form a data strip or stepped sequence instead of identical floating
  cards.
- Detail pages pair a stable context rail with a flexible working region.
- Mobile preserves hierarchy through ordered bands and rails, rather than
  converting every region into an isolated card.

## Surface hierarchy

1. **Canvas:** uninterrupted application or marketing background.
2. **Field:** broad contextual region with subtle V-cut geometry; no card shadow.
3. **Workspace:** primary working surface with a directional edge and stronger
   internal rules.
4. **Rail:** narrow context, navigation, annotation, or status region.
5. **Item:** interactive row or independent object; may use restrained radius.
6. **Float:** menus, dialogs, and actions; the only surfaces using pronounced
   elevation.
7. **Data plane:** low-radius or square region with explicit baselines, axes,
   and tabular alignment.

## Icon system

- Lucide remains for conventional utility actions such as close, menu, settings,
  logout, and external link.
- Product navigation uses four custom line marks built from the same 16-unit
  geometry and 1.5-unit stroke.
- Service symbols use geometry first and are not automatically placed inside a
  rounded square.
- Status uses shape plus text: point = available, notch = internal, split point
  = beta, line interruption = warning.

## Motion language

- **Assemble:** related rails or planes settle into alignment (240–360ms).
- **Advance:** active state moves along a directional rule (140–200ms).
- **Resolve:** data or loading signal sharpens from muted to clear (180–280ms).
- **Reveal:** overlays use clipped spatial reveal, not scale-from-center.
- Routine page content does not fade up in sequence.
- Reduced motion removes spatial movement while preserving instant state cues.

## Data visualization

- Charts sit on a visible baseline with sparse reference rules.
- The primary series is a crisp 1.5–2px line; area fills are optional and very
  low opacity.
- The latest or selected point uses a V-cut tick instead of a glowing dot.
- Labels align to the data grid and use tabular numerals.
- Tooltips resemble annotation rails, with a directional leader to the value.
- Empty states show an unfinished baseline plus an explicit next action—not an
  illustration inside another card.

## Product application

- **Studio:** registration marks, paired planes, editorial project composition.
- **Growth:** directional rails, stage progression, momentum deltas.
- **Insights:** baselines, signal traces, annotations, clarity through contrast.
- **AI:** converging inputs, synthesis junctions, calm response workspace.
- **Partner:** a guided operating track combining learning, qualification,
  attribution, and compensation; not a generic CRM or LMS dashboard.

## Implementation phases

1. Audit and specification — this document.
2. Shared foundations — tokens, typography, V-cut motif, product marks, surface,
   navigation, motion, and data primitives.
3. Marketing — header, homepage, services, work, product storytelling, and CTA
   rhythm.
4. Platform core — login, shell, overview, Studio, AI, billing, support,
   settings, and administration.
5. Growth and Insights — data-specific layouts and chart language.
6. Partner — dashboard, training, playbook, services, leads, commissions, and
   assistant.
7. Responsive, accessibility, and screenshot QA.

Production deployment is excluded until each phase passes Preview review.
