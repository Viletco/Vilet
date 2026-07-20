# AI launch checklist

- [x] Disabled mode builds without credentials or provider calls.
- [x] Server-only provider boundary and normalized results exist.
- [x] Approved-content grounding and deterministic price/timeline handling exist.
- [x] Prompt injection and sensitive-data preflight exist.
- [x] No default transcript persistence, analytics, tracking, or raw-content logs exist.
- [x] AI-specific memory/Upstash rate-limit architecture exists.
- [x] Analyzer URL, DNS, redirect, type, timeout, and size controls exist.
- [ ] Owner approves provider, model, cost ceiling, rate policy, disable owner, and public launch.
- [ ] Legal approves privacy, provider terms, session handoff, and analyzer authorization wording.
- [ ] Implement and verify analyzer evidence extraction and authorization UI before enabling it.
- [ ] Configure preview-only credentials and shared rate limiting.
- [ ] Complete adversarial provider, timeout, redirect/DNS, accessibility, keyboard, responsive, and cost QA.
- [ ] Verify no provider key or response is present in client bundles/logs.
- [ ] Decide `/ai` indexing only after activation and legal approval.

Rollback: disable the assistant/provider/analyzer variables and redeploy. The Contact route remains available.
