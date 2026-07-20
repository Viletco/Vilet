# Vilét AI Consultant

Vilét AI is implemented as an optional, noindex `/ai` experience. Its default `disabled` mode displays an honest unavailable state and makes no provider request. The homepage and global shell remain unchanged; no always-loaded launcher or third-party widget was added.

Provider mode exposes four focused surfaces: grounded questions, deterministic project scoping, deterministic growth guidance, and the Website Analyzer status. Chat messages live only in React memory for the current page. Clear conversation removes them. There is no database transcript, local storage, analytics, or public conversation URL.

The server action accepts at most ten messages of 2,000 characters each, performs safety preflight and rate limiting, formats approved repository knowledge, and calls the provider abstraction. Results are normalized before reaching the browser. Price and timeline questions receive deterministic evidence-safe guidance without a provider call.

Rollback is immediate: set `AI_ASSISTANT_MODE=disabled`, `AI_PROVIDER=none`, and `AI_WEBSITE_ANALYZER_MODE=disabled`, then redeploy.
