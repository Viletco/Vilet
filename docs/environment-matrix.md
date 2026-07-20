# Environment matrix

Secrets belong in local untracked `.env.local` files or scoped Vercel environment variables, never in Git. `.env.example` documents names only.

| Variable                   | Local              | Vercel preview                    | Vercel production                | Sensitive            | Notes                                                                     |
| -------------------------- | ------------------ | --------------------------------- | -------------------------------- | -------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | `https://vilet.co` | `https://vilet.co`                | `https://vilet.co`               | No                   | Canonical metadata origin; build validation requires this approved origin |
| `CONTACT_DELIVERY_MODE`    | `disabled`         | `disabled` until QA is authorized | `resend` only after activation   | No                   | Allowed: `disabled`, `resend`                                             |
| `RESEND_API_KEY`           | Optional           | Preview-only test key if approved | Production-scoped key            | Yes                  | Required only in Resend mode                                              |
| `CONTACT_FORM_RECIPIENT`   | Optional           | Approved test inbox               | Approved real inbox              | Personal/config data | Never commit a real address                                               |
| `CONTACT_FROM_EMAIL`       | Optional           | Verified test sender              | Verified production sender       | Config data          | Must belong to a verified Resend domain                                   |
| `CONTACT_REPLY_TO_MODE`    | `submitted-email`  | Approved behavior                 | Approved behavior                | No                   | Current allowed mode is `submitted-email`                                 |
| `CONTACT_RATE_LIMIT_MODE`  | `memory`           | `memory` or approved `upstash`    | `upstash` for shared enforcement | No                   | Memory state is per process                                               |
| `UPSTASH_REDIS_REST_URL`   | Optional           | Preview-scoped database           | Production database              | Yes                  | HTTPS REST URL; required in Upstash mode                                  |
| `UPSTASH_REDIS_REST_TOKEN` | Optional           | Preview token                     | Production token                 | Yes                  | Scope and rotate through Upstash                                          |
| `CONTACT_RATE_LIMIT_SALT`  | Optional           | Unique preview value              | Unique production value          | Yes                  | High-entropy value; do not reuse across environments                      |

Use separate preview and production resources or credentials where provider plans permit. After configuration, run `npm run check:launch` in a securely populated environment; it reports presence and modes without printing values.

## Optional Vilét AI

| Variable                                          | Local/preview default | Production                       | Sensitive | Notes                                         |
| ------------------------------------------------- | --------------------- | -------------------------------- | --------- | --------------------------------------------- |
| `AI_ASSISTANT_MODE` / `AI_PROVIDER`               | `disabled` / `none`   | Remain disabled until approval   | No        | Provider mode fails closed                    |
| `AI_PROVIDER_API_KEY`                             | Empty                 | Provider secret                  | Yes       | Server-only                                   |
| `AI_PROVIDER_MODEL`                               | Empty                 | Approved model identifier        | No        | Owner/cost review required                    |
| `AI_PROVIDER_TIMEOUT_MS` / `AI_MAX_OUTPUT_TOKENS` | `12000` / `700`       | Reviewed bounded values          | No        | Enforced ranges                               |
| `AI_CHAT_RATE_LIMIT_MODE`                         | `memory`              | Approved `upstash`               | No        | Separate AI policy                            |
| `AI_CHAT_RATE_LIMIT_SALT`                         | Empty                 | Unique environment secret        | Yes       | Hashes connection identifiers                 |
| `AI_CHAT_UPSTASH_REDIS_REST_URL` / `TOKEN`        | Empty                 | Scoped AI database credentials   | Yes       | Required in Upstash mode                      |
| `AI_INSIGHTS_MODE`                                | `disabled`            | `disabled`                       | No        | Aggregate mode is not implemented or approved |
| `AI_WEBSITE_ANALYZER_MODE`                        | `disabled`            | Disabled until separate approval | No        | No URL fetch occurs while disabled            |
