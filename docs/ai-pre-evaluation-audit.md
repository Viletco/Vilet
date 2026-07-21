# AI pre-evaluation audit

Date: 2026-07-20. Scope: Step 22 implementation before any credentialed request.

## Reusable controls confirmed

- Provider calls, keys, knowledge formatting, policy, rate limiting, and connection hashing are server-only.
- Disabled mode is the build default and requires no credential.
- Provider results and errors use a public normalized result union; raw response identifiers and error bodies are not returned.
- Conversation state is current-page memory. The only session storage is an explicit, bounded Contact handoff that is deleted when consumed.
- No analytics, insight collection, transcript database, website fetch UI, background call, automatic retry, or global AI launcher exists.

## Findings corrected in Step 23 preparation

1. Conversation size was bounded per message and by ten messages, but there was no explicit total-character contract. Added eight-message and 10,000-character context limits.
2. Repeated user messages could reach the provider. Added normalized within-conversation duplicate rejection.
3. Provider response/error normalization was embedded in the adapter and difficult to regression test. Extracted pure normalization contracts.
4. Contact handoff serialization/parsing lived in UI effects. Extracted bounded, testable functions that accept only summary and goal fields.
5. Preflight rules covered common prompt/secret attacks but not internal paths, fabricated evidence, false acceptance/delivery, cross-user requests, or high-risk domains. Added explicit rejection categories.
6. Recommended evaluation timeout/output settings differed from Step 23. Defaults are now 15 seconds and 600 output tokens.

## Remaining blockers

- No private Preview-scoped API key was available.
- The owner has not approved an exact model or spending ceiling.
- Vercel environment access and Preview/Production separation were not demonstrated in this run.
- Provider-side retention and legal approval remain unresolved.
- Live grounding, latency, token, cost, 429, timeout, and invalid-output evaluation therefore cannot be claimed.

Website Analyzer remains disabled. Its fetch function is not reachable from the public UI.
