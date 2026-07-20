# Final launch sequence

## Owner actions

1. Complete `docs/owner-launch-decisions.md` and legal/brand approvals.
2. Grant provider and DNS access through their native account controls.
3. Enter approved secrets directly in Vercel; never send them through Git or documentation.
4. Give explicit production and indexing authorization after QA.

## Assistant or engineer actions after authorization

1. Update `config/launch-decisions.json` with the approved non-secret selections/statuses.
2. Apply approved content, legal, footer, or brand changes only where required.
3. Follow the Resend, Upstash, domain, and optional Search Console plans.
4. Run `npm run format`, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run check:launch` in the configured environment.
5. Deploy to preview and repeat route, accessibility, responsive, metadata, contact, header, and secret-leak QA.
6. Connect the domain, verify HTTPS and redirects, then promote the reviewed commit.
7. Verify production again before authorizing indexing.

## Production gate

Production is blocked while any required registry item is not `approved` or `not-required`, any enabled provider lacks configuration, validation fails, preview QA regresses, or explicit authorization is absent. Optional portfolio/trust evidence, analytics, social profiles, and Search Console do not independently block launch.
