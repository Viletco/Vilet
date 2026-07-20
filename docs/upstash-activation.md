# Upstash activation plan

The contact endpoint supports an Upstash Redis REST fixed-window limiter. No database or credentials are created by this plan.

1. The owner approves Upstash and selects the hosting region and account.
2. Create a Redis database appropriate for production. Use a separate preview database where practical.
3. Obtain its REST URL and token through the Upstash console.
4. Generate a unique high-entropy `CONTACT_RATE_LIMIT_SALT` for each environment using an approved password manager or secret generator.
5. Configure `CONTACT_RATE_LIMIT_MODE=upstash`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `CONTACT_RATE_LIMIT_SALT` in Vercel for the correct environment.
6. Redeploy and test that repeated requests receive the documented rate-limit response while ordinary submissions succeed.
7. Confirm logs and stored keys contain only salted hashes, not raw IP addresses or email addresses.

If a token or salt is exposed, rotate it and redeploy. Memory mode is suitable for local development but is not shared across production instances.
