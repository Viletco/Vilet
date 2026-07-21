# AI preview cost review

Private Preview evaluation ran on 2026-07-21 with synthetic prompts only. The owner approved `gpt-5-mini`, a `$5` total evaluation ceiling, and no automatic recharge.

## Approved Preview model

`gpt-5-mini` is approved only for the private Preview evaluation. OpenAI documents Responses API and Structured Outputs support and published prices of $0.25 per million input tokens and $2.00 per million output tokens at review time. Production use remains unapproved.

Sources: [OpenAI GPT-5 mini](https://developers.openai.com/api/docs/models/gpt-5-mini), [OpenAI model comparison](https://developers.openai.com/api/docs/models/compare).

## Evaluated configuration

- Timeout: 15,000 ms
- Maximum output: 600 tokens
- Reasoning effort: minimal
- Text verbosity: low
- Provider response storage: disabled with `store: false`
- User message: 2,000 characters
- Conversation: eight messages and 10,000 characters
- Connection limit: 20 chat requests per 30 minutes
- Automatic retries: zero
- Analyzer calls: zero
- Insights/background calls: zero

## Evaluation worksheet

| Measure                          | Result                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| Provider requests                | 2 shown at final dashboard refresh; later successful requests were still pending aggregation     |
| Input/output/total tokens        | 3,144 input shown; output and final total were not yet reported in the visible dashboard summary |
| Actual provider cost             | `$0.00` at dashboard display precision                                                           |
| Average/highest interaction cost | Below dashboard rounding precision; not claimed more precisely                                   |
| Observed successful latency      | Approximately 3 seconds in browser checks                                                        |
| Timeout/failure count            | 0 timeouts; 1 initial structured-output failure that failed closed and was corrected in Preview  |

The account held a one-time `$5.00` credit balance with automatic recharge off. Dashboard reporting was lagging, so usage must be refreshed before any later evaluation resumes.

Record aggregate usage only. Never record prompt or response bodies, credentials, private content, or raw connection identifiers.
