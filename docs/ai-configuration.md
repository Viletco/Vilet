# AI configuration

Safe defaults require no credentials:

```text
AI_ASSISTANT_MODE=disabled
AI_PROVIDER=none
AI_CHAT_RATE_LIMIT_MODE=memory
AI_INSIGHTS_MODE=disabled
AI_WEBSITE_ANALYZER_MODE=disabled
```

Provider activation additionally requires `AI_PROVIDER_API_KEY`, an owner-approved `AI_PROVIDER_MODEL`, bounded timeout/output settings, and approved shared rate limiting. Production should use the AI-specific Upstash URL, token, and salt. Preview and production credentials must be scoped separately where possible.

Unknown modes, incomplete provider configuration, non-HTTPS Upstash URLs, unsupported insights activation, and analyzer activation without provider mode fail the build. Credentials are server-only and must be entered through Vercel—not Git, documentation, chat, screenshots, or client-prefixed variables.

Activation requires every AI decision in `config/launch-decisions.json` to be approved, a configured preview, safety/abuse QA, legal review, cost limits, and an emergency-disable owner. Disabled AI remains optional and does not block the non-AI website launch.
