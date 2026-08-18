# Vilét company architecture

## Positioning

Vilét is the parent technology company. The public site distinguishes what can be engaged today from future product directions:

- **Vilét Studio** is available now through the established `/services` route. Keeping this URL avoids unnecessary link and search churn while the page and navigation use the clearer Studio label.
- **Vilét Insights** has a first-class `/insights` product-vision page and is explicitly labeled in development.
- **Vilét Studio Partners** has a `/partners` page that explains the intended referral model without presenting a live portal, fixed terms, or unapproved commission details.

## Content model

Static company divisions live in `src/content/company`. Each division has a category, status, availability label, descriptions, capabilities, and CTA. Supported statuses are `available`, `private`, `in-development`, and `planned`.

Future product names are recorded as internal architecture context but are not rendered into primary navigation. A future product can be introduced by adding a validated division record and an intentional route when its positioning is approved.

## Implementation principles

- Server Components and static content remain the default.
- No database or partner portal is implied by the marketing architecture.
- Future capabilities are described as planned concepts, not current features.
- Existing contact, legal, privacy, environment, rate-limit, deployment, and portfolio-evidence safeguards remain unchanged.
- The `/services` route remains canonical for Studio until a URL migration provides measurable value.
