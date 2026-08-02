# Privacy architecture

> Internal warning: this documentation is not legal advice. The public
> `/privacy` policy remains `noindex` until owner and qualified legal approval
> are recorded.

The public policy describes verified Contact fields, communication preferences,
abuse controls, browser session handoff, and the absence of analytics and
advertising. It avoids a fixed retention period, compliance claims, a physical
address, and unverified legal-entity status.

Contact delivery, Vilét AI, and Website Analyzer statements are generated from
the same validated server configuration used by those features. This prevents a
deployment from publishing “disabled” wording when that feature is active. No
environment value or credential is rendered.

The public privacy contact is centralized in `src/config/legal.ts` as
`privacy@vilet.co`. This is public, non-secret configuration, but its mailbox or
forwarding path was verified by the Vilét owner on August 2, 2026. The Contact page is presented as an
additional privacy-request method only when delivery is enabled. See
`docs/privacy-policy-review.md` and `docs/ai-privacy-review.md`.

To make the page indexable later, obtain and record owner and legal approval,
verify the public privacy mailbox, update the policy if provider behavior has
changed, then remove the `robots` noindex directive from
`src/app/(pages)/privacy/page.tsx` in a separately reviewed change.
