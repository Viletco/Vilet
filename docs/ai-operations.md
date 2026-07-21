# AI operations

## Emergency disable

Set `AI_ASSISTANT_MODE=disabled` and `AI_PROVIDER=none` in the affected Vercel environment, ensure `AI_WEBSITE_ANALYZER_MODE=disabled`, and redeploy. Verify `/ai` shows the unavailable state and provider dashboard request counts stop increasing. This is the fastest supported response.

## Routine controls

- Rotate a key in OpenAI, replace only the scoped Vercel secret, redeploy, verify, then revoke the old key.
- Change `AI_PROVIDER_MODEL` only after model/cost evaluation and owner approval.
- Lower `AI_MAX_OUTPUT_TOKENS`, timeout, or code-owned rate policies, validate, and redeploy.
- Review aggregate provider usage and billing without exporting prompts or responses.
- Investigate unexpected cost by disabling first, comparing deployment time/request aggregates, checking abuse-rate categories, and rotating credentials if compromise is possible.
- Handle hallucination reports by capturing a synthetic reproduction without personal data, disabling if evidence or safety is affected, adding a regression test, and re-evaluating.
- Handle abuse by preserving hashed/aggregate operational evidence only, lowering limits, and disabling if controls are insufficient.
- Roll back through a known-good Vercel deployment or a normal Git revert; never rewrite history.
- If a navigation entry is later approved, remove it through the typed navigation registry and redeploy. No entry exists today.

To confirm shutdown, inspect the disabled page, server logs for result categories only, and provider usage totals. Do not add prompt logging for diagnosis.
