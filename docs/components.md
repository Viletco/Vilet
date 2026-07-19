# Vilét Component Library

## Philosophy

Vilét components are small, semantic building blocks. They compose the design tokens from `src/styles/` without redefining color, spacing, typography, radius, shadow, gradient, or motion values. Server components are the default; add `"use client"` only when a component genuinely needs browser state, effects, or event-driven behavior.

Prefer semantic components over copied class strings. A visual heading variant never determines document heading order, interactive behavior belongs on native links and buttons, and decorative icons must not create noise for assistive technology.

## Organization

- `src/components/ui/` contains typography, links, buttons, cards, badges, icons, and the wordmark.
- `src/components/layout/` contains containers, sections, stacks, grids, and dividers.
- `src/lib/cn.ts` contains the shared class-name helper.
- `src/app/dev/components/` contains the development-only component preview.

The UI and layout folders provide focused barrel exports. Component implementation files import direct siblings where needed, avoiding circular barrel imports.

## Design-token usage

Use semantic Tailwind utilities such as `bg-surface`, `text-text-secondary`, `border-border`, and `shadow-md`. For scales that are intentionally expressed as CSS variables, use the token directly—for example `gap-(--ds-space-lg)`. Do not add raw color values or arbitrary pixel spacing inside a component.

When a recurring requirement cannot be represented by an existing token, add and document a semantic token before using it in components.

## Variant conventions

Components with meaningful visual variants use `class-variance-authority`. Variant names describe semantic intent (`primary`, `destructive`, `reading`, `interactive`) rather than a raw color or measurement. Defaults should cover the most common use without requiring props.

## The `cn()` helper

`cn()` combines conditional classes through `clsx` and resolves Tailwind conflicts through `tailwind-merge`:

```tsx
import { cn } from "@/lib/cn";

<div
  className={cn("type-body text-text-secondary", active && "text-accent")}
/>;
```

Use it instead of manually joining class strings.

## Typography

`Heading` separates semantic level from visual treatment:

```tsx
import { Heading, Text } from "@/components/ui";

<Heading level={2} variant="display-lg">
  A semantic h2 with display styling
</Heading>
<Text variant="body-lg" muted>
  Supporting copy
</Text>
```

`Eyebrow` centralizes uppercase treatment, tracking, icon/marker spacing, and muted or accent tones. `GradientText` provides the documented restrained accent gradient. `SectionHeading` composes `Eyebrow`, `Heading`, and `Text` for consistent section introductions.

## Buttons and links

`Button` supports primary, secondary, outline, ghost, text, and destructive variants plus small, medium, large, and icon sizes. It supports native button props, icons, full width, disabled state, and a layout-stable loading state.

```tsx
import { Button, ButtonLink } from "@/components/ui";

<Button loading={isSaving} loadingLabel="Saving changes">
  Save changes
</Button>
<ButtonLink href="/contact" variant="secondary">
  Contact Vilét
</ButtonLink>
```

`ButtonLink`, `TextLink`, and `ArrowLink` use Next.js `Link` for paths beginning with `/` or `#`, and native anchors for external URLs. External links opened in a new tab automatically receive `noopener noreferrer`. Never nest a link inside a button or a button inside a link.

## Layout

- `Container` provides default, wide, reading, and full widths with responsive gutters.
- `Section` provides default, compact, or spacious rhythm; semantic backgrounds; and optional dividers.
- `Stack` handles token-based vertical, horizontal, and responsive flex composition.
- `Grid` provides simple responsive one- through four-column layouts.
- `Divider` provides horizontal or vertical standard, muted, and gradient separators.

Use Stack and Grid for component spacing instead of inserting arbitrary spacer elements.

## Cards

`Card` supports default, elevated, glass, interactive, and highlight variants, token-based padding, optional borders, restrained glow, and hover treatment. `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter` provide composition without enforcing a page-specific card model.

An interactive card should contain a semantic link or button. Do not attach click handlers or keyboard roles to a non-interactive `div`.

`ProjectCard` is the reusable portfolio summary card. It receives a normalized `ProjectSummary` plus service labels resolved by selectors. Development demonstration records must never be imported into production content; the production project registry remains evidence-only.

`ServiceDetail` and `ProcessStage` are typed, server-rendered domain compositions. They receive complete published records and resolve content-owned icons through the central registry. `FaqList` renders ordered `FaqRecord` collections through the native `Disclosure` primitive without client state.

## Badges and icons

`Badge` provides default, outline, accent, status, AI, and featured treatments with optional icons or dots. Status variants must include meaningful visible text; color alone must not communicate state.

`IconWrapper` provides token-driven size, tone, and shape. Its default mode is decorative and hidden from assistive technology. For a meaningful standalone icon, set `decorative={false}` and provide `label`.

## Wordmark

`Wordmark` renders the accented text “Vilét” in small, medium, or large sizes. Set `linked` to create an accessible Next.js link to the homepage. It intentionally does not invent an image or symbol mark.

## Accessibility expectations

`Disclosure` composes native `details` and `summary` elements for FAQ-style content. It requires a stable answer `id`, retains built-in keyboard behavior, permits multiple open items, and uses no client-side state.

`SectionHeading` accepts an optional `titleId`. Pair it with a section's `aria-labelledby` attribute so composed page sections expose useful landmark names without duplicating visible headings.

- Use native semantic elements and preserve keyboard behavior.
- All interactive primitives receive a visible token-driven focus ring.
- Loading buttons are disabled, expose `aria-busy`, and require a useful loading label.
- Icon-only buttons require an accessible label.
- Decorative icons are hidden from assistive technology.
- Reduced-motion preferences disable component transitions through the existing global rule and motion utility variants.
- Disabled controls must remain visibly and programmatically disabled.

## Component preview

Run `npm run dev` and visit `/dev/components`. The route displays all current primitives and variants for visual QA, is marked `noindex`, is absent from site navigation, and calls `notFound()` in production. Remove or replace this guard only if a future authenticated internal preview environment is introduced.

## Adding future components

1. Confirm that the component represents a reusable semantic role rather than a single page section.
2. Compose existing primitives and tokens before adding styles.
3. Keep it a server component unless client behavior is necessary.
4. Use CVA only when variants are meaningful.
5. Include keyboard, focus, disabled, loading, naming, and reduced-motion behavior as applicable.
6. Export it from the relevant barrel when that improves discoverability.
7. Add it to `/dev/components` and document any non-obvious usage contract.
