# Vilét Global Layout

## Overview

The public site shell is composed by `SiteShell` and includes the skip link, sticky header, primary navigation, main landmark, and footer. Public pages receive the shell through App Router route-group layouts; the development component preview remains isolated from the public shell.

All shell styling uses the Step 3 design tokens and Step 4 components. The shell is server-rendered except for `MobileNavigation`, which needs browser state for its accessible menu behavior.

## Header

`Header` is a sticky, dark glass surface with a subtle divider, responsive container, linked `Wordmark`, desktop navigation, “Let's Talk” placeholder CTA, and mobile-menu trigger. Its height is centralized in `--ds-header-height`, which is also used for anchor offsets.

The desktop navigation is rendered on the server. Each route-group layout passes a typed current path so the matching link receives `aria-current="page"` without requiring client-side pathname logic.

## Navigation

Public navigation is defined once in `src/content/navigation.ts`:

- Home
- Services
- Work
- About
- Process
- Contact

Header, mobile-menu, and footer links consume this shared configuration. Internal destinations use Next.js `Link` through the existing link primitives.

## Mobile menu

`MobileNavigation` is the only client-side shell component. It provides:

- A native button with `aria-expanded` and `aria-controls`
- A labeled modal navigation region
- Focus movement into the menu on open
- Tab and Shift+Tab focus trapping
- Escape-key dismissal
- Outside-pointer dismissal
- Close-on-route-change behavior
- Body scroll locking with cleanup
- Trigger focus restoration
- An inert, non-focusable closed state
- A token-sized slide-over with an outside-click dismissal area
- Token-driven transitions with reduced-motion handling

Do not move the entire header or shell behind a client boundary.

## Skip link

`SkipLink` is visually hidden above the viewport until focused. It targets `#main-content`, whose programmatic focus target and scroll offset account for the sticky header. A small root-script enhancement moves programmatic focus reliably after activation while retaining the native anchor fallback and honoring reduced-motion preferences.

## Footer

`Footer` contains the Vilét wordmark, tagline, shared public navigation, current-year copyright, and the factual privacy-draft link. Email and social destinations remain absent until verified and approved.

## Page layout

`SiteShell` owns the document-level flex composition and semantic main landmark. Route pages should compose `Section`, `Container`, and typography primitives inside that landmark rather than creating another `<main>` element.

No public placeholder routes or placeholder layout primitives remain.

## Metadata

The root layout defines:

- A default title and page-title template
- Neutral site description
- Metadata base for `vilet.co`
- File-based Open Graph and Twitter images generated from approved text
- Dark theme color and color scheme
- A provisional original SVG monogram and generated Apple icon

Route metadata supplies approved page titles, descriptions, and canonicals. The current icon and social image are real generated assets but remain provisional pending final creative approval.

## Scrolling

Global CSS enables smooth scrolling and sticky-header anchor offsets. The existing reduced-motion media query restores automatic scrolling for users who request less motion. Next.js handles route scroll behavior, while the root layout explicitly keeps browser history scroll restoration in automatic mode.

## Route strategy

- `(home)` contains `/` and its typed site-shell layout.
- `(pages)` contains the static Services, Work, About, Process, Contact, and noindex Privacy routes.
- `dev/components` remains outside both public shell groups and resolves to not-found in production.

Unknown routes use the branded, noindex 404 experience. Unknown project slugs also return 404, and the project route generates no paths while the approved collection is empty.

## Accessibility requirements

Future shell changes must preserve semantic landmarks, visible focus, current-page indication, keyboard navigation, reduced motion, focus containment, scroll-lock cleanup, accessible menu naming, and native interactive elements. Never introduce clickable non-interactive containers.
