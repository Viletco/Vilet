# AI preview cost review

No provider request was made in this step, so actual requests, tokens, latency, failures, and cost are all zero. Complete this worksheet only with synthetic prompts after owner model approval and private Preview configuration.

## Model recommendation for approval

Recommended evaluation candidate: `gpt-5-mini`. OpenAI describes it as a cost-efficient, low-latency model for well-defined tasks, with Responses API and Structured Outputs support. Published token prices at review time were $0.25 per million input tokens and $2.00 per million output tokens. The current flagship family offers stronger models at materially higher published rates; this short, grounded, schema-constrained workload should establish whether the lower-cost candidate is sufficient before considering an upgrade.

Sources: [OpenAI GPT-5 mini](https://developers.openai.com/api/docs/models/gpt-5-mini), [OpenAI model comparison](https://developers.openai.com/api/docs/models/compare).

This is a recommendation, not approval. Model availability, account tier, pricing, and provider terms must be rechecked at activation.

## Conservative preview configuration

- Timeout: 15,000 ms
- Maximum output: 600 tokens
- User message: 2,000 characters
- Conversation: eight messages and 10,000 characters
- Connection limit: 20 chat requests per 30 minutes
- Automatic retries: zero
- Analyzer calls: zero
- Insights/background calls: zero

Illustrative ceiling using 4,000 uncached input tokens and 600 output tokens on the recommended candidate: approximately $0.0022 per request at the cited rates. This is an assumption, not incurred cost or a provider quote.

## Evaluation worksheet

| Measure                          | Result                       |
| -------------------------------- | ---------------------------- |
| Provider requests                | 0 — credential unavailable   |
| Input/output/total tokens        | 0 / 0 / 0                    |
| Actual provider cost             | $0                           |
| Average/highest interaction cost | Not measured                 |
| Average latency                  | Not measured                 |
| Timeout/failure count            | 0 / 0 because no request ran |

For a credentialed run, record aggregate usage only—test-case ID, latency, token counts, result category, and estimated cost. Never record prompt or response bodies in operational logs. Compare aggregate totals with the provider dashboard and stop immediately at the owner-approved ceiling.
