# Contact infrastructure

## Audit findings

The original Server Action had sound field validation and an honest disabled adapter, but its provider result could only represent disabled delivery. It trusted a generic forwarded-IP header, used email as a fallback rate key, kept limits per process for ten minutes, did not detect duplicates, and returned misleading acceptance copy to honeypot submissions. No submission content was persisted or logged.

The implementation now preserves the approved form and service registry while correcting those boundaries.

## Delivery modes

`CONTACT_DELIVERY_MODE` accepts `disabled` (default) or `resend`. Unknown values fail configuration validation. Disabled mode requires no credentials and returns the explicit `not-configured` state; it never claims delivery.

Resend mode requires `RESEND_API_KEY`, `CONTACT_FORM_RECIPIENT`, `CONTACT_FROM_EMAIL`, and `CONTACT_REPLY_TO_MODE=submitted-email`. Recipient and sender are validated server configuration. Submitters cannot alter either value. The adapter sends plain text and escaped, simple HTML, uses the submitted email only as Reply-To, applies a ten-second timeout, and exposes neither provider IDs nor internal error details.

No real delivery was attempted during implementation. To test safely, keep delivery disabled or call the exported adapter with an injected mock `fetch` implementation.

## Result states and form behavior

The typed public states are `delivered`, `not-configured`, `validation-error`, `rate-limited`, `duplicate`, `spam-rejected`, `provider-error`, and `unexpected-error`. Every state uses non-technical public copy and moves focus to an alert, status, or notice region. Values remain present after recoverable errors and disabled delivery. The form resets only after provider-confirmed delivery. Pending submission disables the button.

## Abuse controls

`CONTACT_RATE_LIMIT_MODE` accepts `memory` (default) or `upstash`. The policy is five attempts per fifteen minutes per derived connection key. Memory mode is suitable only for local or single-process use. Upstash mode requires `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `CONTACT_RATE_LIMIT_SALT`; invalid or incomplete configuration fails closed.

The Upstash REST adapter uses a fixed window shared across instances. It stores only salted SHA-256 keys and counters. A separate five-minute `SET NX` fingerprint prevents rapid duplicates without storing the inquiry. The local memory adapter follows the same interface and durations.

On Vercel, identity derivation accepts `x-vercel-forwarded-for` only when the platform sets `VERCEL=1`. Local development uses a fixed development identity. Other production environments use a conservative unavailable identity until a documented trusted header is configured. This is abuse control, not identity verification, and raw IP addresses are neither persisted nor displayed.

## Spam, validation, and action safety

The form retains its inaccessible honeypot and 1.5-second minimum completion time. Server validation normalizes strings; enforces required fields and limits; validates email, HTTP(S) URL, enums, and the published service registry; and restricts the Server Action body to 64 KB. Next.js Server Actions provide the POST/action and same-origin framework boundary; the application owns normalization, injection-safe email rendering, provider configuration, timeouts, and public error normalization.

## Data minimization and logging

The application does not log names, companies, email addresses, websites, summaries, or goals, and does not persist submissions locally. Correlation IDs are random and contain no visitor data. The current code emits no operational logs. If safe operational logging is added later, restrict it to provider type, result category, correlation ID, and timestamp.

When Resend is activated, inquiry content is processed by Resend and the receiving mailbox. Their retention and account behavior require owner/legal review; this documentation makes no legal assurance.

## Activation and troubleshooting

1. Obtain an approved Resend account, verified sender, recipient, and API key.
2. Set the Resend variables in the hosting platform; never commit them.
3. Obtain an Upstash Redis database and a strong random rate-limit salt.
4. Set `CONTACT_RATE_LIMIT_MODE=upstash` and its three required variables.
5. Run the full build; invalid modes, emails, URLs, or missing enabled-mode settings must fail.
6. Test one approved inquiry in preview, verify receipt and Reply-To behavior, then test provider failure and rate limits without personal data in logs.

If the public response says delivery is not active, confirm the delivery mode and complete configuration. If it reports a provider error, inspect only provider-side operational diagnostics. Never expose credentials or inquiry content while troubleshooting.

Remaining blockers are external account access, verified sender/recipient approval, production salt provisioning, and owner/legal approval of privacy and retention language.
