# Vilét Growth — Automatic Lead Engine MVP

## Status and scope

The repository contains a staging-first vertical slice from provider discovery through human-approved, single-message delivery. It is not enabled by default, has not been applied to Production, and does not authorize bulk campaigns or unattended outreach.

The flow is deliberately bounded:

1. An authenticated operator with `growth.prospecting` requests at most 25 businesses.
2. The selected server-side provider adapter returns organization metadata and, when available, one business contact.
3. Existing tenant-local normalization and duplicate checks run before insertion.
4. Deterministic research stores provider evidence separately from inferences and recommendations.
5. Versioned deterministic scoring decides whether to create a draft for review.
6. An operator with `growth.outreach` may edit, approve, reject, or suppress the draft.
7. Only an Owner or Admin may explicitly send an approved message.
8. Database and Resend idempotency, durable suppression, and a ten-message daily organization cap constrain delivery.

There is no scraper, crawler, browser automation, AI model, background campaign, sequence, reply parser, or automatic send loop in this MVP.

## Providers

- Hunter is the default MVP discovery and business-contact provider. Its API key is server-only. Discover supplies bounded company/domain results; Domain Search supplies professional-email confidence, verification, and public-source provenance. Provider IDs are retained, while arbitrary profiles and raw provider responses are not stored.
- Apollo remains an optional adapter selected with `GROWTH_DISCOVERY_PROVIDER=apollo`; it is not a hard dependency. Manual import remains fallback-only.
- Resend is the delivery provider. The API key is server-only and every call includes the database message idempotency key.

### Provider decision (2026-08-19)

| Option                 | Entry API access                                                                            | Discovery and US/local coverage                                                                      | Contact enrichment                                                                                                          | Cost and limits                                                                                                          | Decision                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Hunter                 | Free API key; Discover is documented as free                                                | Location (country/state/city), industry, company type, and keyword filters; domain returned          | Domain Search returns professional emails, confidence, verification status, decision-maker metadata, and public source URLs | Discover: 5 requests/second and 50/minute; Domain Search: 15/second and 500/minute; email results consume search credits | **Selected for the MVP:** one adapter, lowest implementation and operating cost, strongest provenance |
| Google Places + Hunter | Google Cloud billing plus Hunter account                                                    | Strongest storefront/local-place coverage and authoritative website fields                           | Hunter provides email layer                                                                                                 | Two providers, two billing/limit systems, and higher implementation effort                                               | Best later fallback if Hunter's local-business recall is insufficient                                 |
| Outscraper             | Pay-as-you-go; its published free Maps tier does not promise API access while paid tiers do | Strong Google Maps/local coverage                                                                    | Separate website contact scraping is available                                                                              | Low unit cost, but asynchronous scraping and web-derived contact provenance require more operational/compliance review   | Not selected for the first vertical slice                                                             |
| People Data Labs       | Free testing API, up to 100 records/month                                                   | Company Search is broad but oriented toward company/person datasets rather than storefront discovery | Contact fields are obfuscated on Free; Pro starts at published self-serve pricing                                           | At least two paid datasets may be needed for full company + person coverage                                              | Not cost-effective for this MVP                                                                       |
| Apollo                 | Required endpoints unavailable on the Free key observed during setup                        | Strong B2B discovery                                                                                 | Strong people enrichment on eligible plans                                                                                  | Upgrade required before the required endpoints can be scoped                                                             | Retained as an optional future adapter                                                                |

Sources: [Hunter API reference](https://hunter.io/api-documentation/v2), [Hunter API help](https://help.hunter.io/en/articles/1970956-hunter-api), [Outscraper pricing](https://outscraper.com/pricing/), and [People Data Labs self-serve plans](https://docs.peopledatalabs.com/docs/create-an-account).

Provider accounts, plans, terms, permitted uses, geographic requirements, retention, and deletion obligations require owner/legal approval before real prospecting. A provider key must never be placed in Git, screenshots, logs, chat, or a `NEXT_PUBLIC_` variable.

## Environment controls

Preview configuration uses the variables documented in `apps/platform/.env.example`.

- `GROWTH_SEND_MODE=disabled` is the safe default and prevents all delivery.
- `GROWTH_SEND_MODE=test` redirects every approved message to `GROWTH_TEST_RECIPIENT`, regardless of the prospect contact. Use this for the first controlled Preview test.
- `GROWTH_SEND_MODE=live` sends to the reviewed contact and must not be enabled until legal, sender reputation, unsubscribe handling, and operational ownership are approved.

The first staging verification must use `test` mode and an address controlled by Vilét. Do not configure these variables in Production during MVP validation.

## Data and authorization

Migration `202608190005_growth_lead_engine_mvp.sql` adds tenant-scoped discovery runs, evidence/research, scores, contacts, suppressions, and outreach messages. Every table enables RLS and derives access from the existing Growth capabilities. Database activity triggers record bounded event metadata without copying email content or provider secrets into activity records.

The send path rechecks capability, Owner/Admin role, approval state, suppression state, daily limit, and message status on the server. The approved-to-sending transition is conditional, and the provider receives a stable idempotency key.

## Staging activation order

1. Apply migration `202608190005_growth_lead_engine_mvp.sql` to staging project `lzohhfmfdqivnjqqwmqu` only.
2. Verify the new tables have RLS and expected policies.
3. Add Preview-scoped `HUNTER_API_KEY`, `GROWTH_DISCOVERY_PROVIDER=hunter`, and Resend variables in Vercel. Start with `GROWTH_SEND_MODE=test` and a controlled recipient.
4. Redeploy the protected platform Preview from the QA branch.
5. Run one bounded discovery, inspect evidence and score explanations, review the draft, approve it, and explicitly send it once.
6. Confirm the controlled recipient receives one message, the provider ID is recorded, a repeated send is rejected, and suppression prevents delivery.

Production Supabase, `app.vilet.co`, `vilet.co`, and `main` remain outside this activation.

## Deferred before real outreach

- Provider terms and privacy/legal approval
- Sender-domain and mailbox ownership review
- Public unsubscribe intake and provider webhook processing
- Bounce, complaint, and reply processing
- Retention/deletion operations and data-subject request handling
- Deliverability monitoring and reputation safeguards
- Larger-volume queueing, retries, budgets, and observability
- Any AI-generated research or copy

Until these are approved and implemented, keep send mode disabled except for controlled Preview tests.
