# Vilét Design System

## Design philosophy

The Vilét design language is quiet, precise, and premium. It uses deep neutral surfaces, clear white typography, restrained purple accents, generous space, and subtle depth. Future interfaces should prioritize hierarchy, legibility, and calm interaction over decorative effects.

Tokens are centralized in `src/styles/tokens.css`. Typography roles live in `src/styles/typography.css`, shared composition helpers live in `src/styles/utilities.css`, and global browser defaults live in `src/styles/globals.css`.

Future components should use semantic tokens or the mapped Tailwind utilities—such as `bg-background`, `text-text-secondary`, `border-border`, and `shadow-md`—instead of defining raw color, spacing, radius, shadow, or motion values.

## Color palette

| Role             | Token                         | Purpose                                |
| ---------------- | ----------------------------- | -------------------------------------- |
| Background       | `--ds-color-background`       | Primary page canvas                    |
| Surface          | `--ds-color-surface`          | Grouped content regions                |
| Surface elevated | `--ds-color-surface-elevated` | Raised interface layers                |
| Card             | `--ds-color-card`             | Contained content surfaces             |
| Border           | `--ds-color-border`           | Visible control and surface boundaries |
| Divider          | `--ds-color-divider`          | Quiet content separation               |
| Primary text     | `--ds-color-text-primary`     | Headlines and important copy           |
| Secondary text   | `--ds-color-text-secondary`   | Supporting copy                        |
| Muted text       | `--ds-color-text-muted`       | Metadata and low-emphasis labels       |
| Accent           | `--ds-color-accent`           | Brand emphasis and primary actions     |
| Accent hover     | `--ds-color-accent-hover`     | Interactive accent state               |
| Success          | `--ds-color-success`          | Positive status                        |
| Warning          | `--ds-color-warning`          | Cautionary status                      |
| Danger           | `--ds-color-danger`           | Destructive or error status            |
| Selection        | `--ds-color-selection`        | Selected text background               |
| Focus ring       | `--ds-color-focus-ring`       | Keyboard focus visibility              |
| Overlay          | `--ds-color-overlay`          | Modal and dialog backdrops             |

The palette is intentionally dark and low-chroma. Purple is reserved for meaningful emphasis; status colors should only communicate state. Translucent surfaces use the dedicated `--ds-color-glass` token.

## Typography

The sans-serif stack favors Inter when available and falls back to native system fonts. Code uses a platform-aware monospace stack. Type roles are exposed as conflict-safe reusable classes. The `type-*` prefix prevents class merging from treating typography roles as text-color utilities:

- `type-display-xl` and `type-display-lg`
- `type-heading-1` through `type-heading-4`
- `type-body-lg`, `type-body`, and `type-body-sm`
- `type-caption`, `type-button`, and `type-code`

Display and heading roles use fluid `clamp()` sizing to scale between mobile and large screens without abrupt jumps. Choose roles by content hierarchy, not by appearance. Keep document headings in semantic order regardless of the visual class applied.

## Spacing

The spacing scale is `xs` (4px), `sm` (8px), `md` (12px), `lg` (16px), `xl` (24px), `2xl` (32px), `3xl` (48px), `4xl` (64px), and `5xl` (96px). Use `--ds-space-*` tokens for internal component rhythm.

Page-level rhythm uses separate semantic values:

- `--ds-section-space` for vertical section spacing
- `--ds-grid-gap` for responsive grids
- `--ds-page-padding` for viewport gutters

## Containers

- Content width: `--ds-container-content` (1280px)
- Reading width: `--ds-container-reading` (720px)
- Mobile padding: 20px
- Tablet padding: 32px
- Desktop padding: 40px

Use `.section`, `.container`, `.container-reading`, and `.grid-layout` rather than rebuilding these rules in individual components.

## Radius and borders

Radius tokens include `sm`, `md`, `lg`, `xl`, and `full`. The standard border width is `--ds-border-width`; use the semantic border or divider color depending on required emphasis.

## Shadows and gradients

The depth system includes small, medium, and large shadows plus glow and soft-glow treatments. Gradients are limited to hero background, accent text, card glow, and section-divider roles. They should remain supporting treatments, never the primary source of contrast.

## Motion

| Role   | Token                | Duration |
| ------ | -------------------- | -------- |
| Fast   | `--ds-motion-fast`   | 120ms    |
| Hover  | `--ds-motion-hover`  | 180ms    |
| Normal | `--ds-motion-normal` | 220ms    |
| Modal  | `--ds-motion-modal`  | 280ms    |
| Slow   | `--ds-motion-slow`   | 420ms    |
| Page   | `--ds-motion-page`   | 500ms    |

Use standard easing for routine state changes, emphasized easing for entrances and spatial movement, and exit easing for departures. The global reduced-motion rule collapses animation and transition durations when the user requests reduced motion.

## Responsive breakpoints

| Name    | Width  | Intended use                            |
| ------- | ------ | --------------------------------------- |
| Mobile  | 480px  | Large mobile layouts                    |
| Tablet  | 768px  | Tablet and compact multi-column layouts |
| Laptop  | 1024px | Standard desktop composition            |
| Desktop | 1280px | Full content container                  |
| Wide    | 1536px | Large desktop refinement                |

Tailwind exposes these as `mobile:`, `tablet:`, `laptop:`, `desktop:`, and `wide:` variants. Build mobile-first and add breakpoint changes only when content requires them.

## Utilities

Available utilities include containers, section rhythm, grid gap, accent text gradient, glass surface, hero background, card glow, and section divider. Utilities provide composition and token application only; they are not finished components.

Avoid one-off values. If a future design requirement cannot be expressed with the existing system and will recur, add a documented semantic token before using it in components.

## Component layer

The reusable components in `src/components/ui/` and `src/components/layout/` are the supported interface to these tokens. See [Component Library](components.md) for their variants, composition patterns, and accessibility contracts.
