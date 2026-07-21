# AI preview evaluation

## Status

Credentialed private Preview evaluation completed on 2026-07-21. Production remains disabled and unapproved.

- Credentialed Preview alias: `https://vilet-git-preview-swzyfrmdarocs-projects.vercel.app/ai`
- Preview deployment: `ARJ7qSakW5NK8XC3h6sYaiKxEUxr`
- Preview commit: `5088333`
- Approved Preview model: `gpt-5-mini`
- AI mode: provider in Vercel Preview only
- Website Analyzer: disabled
- Indexing: noindex, nofollow
- Contact delivery: disabled
- Transcript/insights/analytics storage: disabled

## Credentialed results

The initial live request failed closed because the 600-token output budget was consumed before valid structured output completed. Preview commit `5088333` set minimal reasoning, low verbosity, and `store: false`; the same case then returned valid schema-constrained guidance.

- Grounded service guidance passed without price, schedule, client, metric, or guarantee fabrication.
- Non-AI-first guidance passed; a simple process review was recommended before automation or custom software.
- Multi-turn current-page context passed; a follow-up used the prior turn and a reload cleared the conversation.
- Pricing and false-delivery requests passed through deterministic safeguards.
- A prompt-injection and fabricated-evidence request was rejected without exposing internals.
- Project scoping passed with synthetic data only.
- The explicit Contact handoff passed; only the bounded summary and goal reached the Contact form.
- Website Analyzer remained disabled with no fetch control.
- Public navigation contained no `/ai` link.
- `noindex, nofollow` was confirmed.
- Browser console reported zero warnings or errors.
- Contact delivery remained disabled.

## Aggregate usage

At the final dashboard check, OpenAI reported two aggregated requests, 3,144 input tokens, and `$0.00` at displayed precision. Later successful requests had not yet appeared in the dashboard, so this is a lagging lower bound rather than a final request count. The purchased balance was `$5.00`, automatic recharge was off, and evaluation stayed far below the approved ceiling.

No transcript, response body, credential, private content, or raw identifier was written to documentation or operational logs.

## Remaining work

- Complete provider timeout, 429, and invalid-output live fault injection only with a dedicated controlled harness; pure normalization tests already pass.
- Recheck aggregate usage after provider reporting catches up.
- Legal/privacy approval, shared production rate limiting, public navigation, indexing, and production launch remain unresolved.

## Owner approval checklist

- [x] Approve exact model and preview spending ceiling.
- [x] Create a dedicated project-scoped service credential without exposing it.
- [x] Confirm Vercel Preview-only scope and Production remains unconfigured for AI.
- [ ] Approve provider retention/privacy terms for production.
- [x] Review completed live results and currently reported aggregate usage.
- [x] Keep public production activation unapproved until a later decision.
