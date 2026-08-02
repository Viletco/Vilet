# Privacy policy review

This worksheet supports owner and qualified legal review. It is not legal
advice, and no approval is recorded by creating this document.

## Public sections added

- Information We Collect
- How We Use Information
- Contact Form and Email Delivery
- Communication Preferences
- Spam and Abuse Prevention
- Cookies, Browser Storage, Analytics, and Advertising
- Vilét AI
- Website Analyzer
- Service Providers
- Data Retention
- Your Choices and Privacy Requests
- Security
- Children’s Privacy
- Changes to This Policy
- Contact Vilét About Privacy

## Verified technical facts

- Contact collects name, company, email, optional website, service interest,
  project summary, goals, optional budget and timeline, and an email or
  email-arranged video-call preference. It does not collect a phone number.
- Server validation, a honeypot, minimum completion time, duplicate detection,
  rate limiting, and salted one-way hashing are implemented.
- The rate limiter does not store full inquiry content.
- Contact delivery fails honestly when disabled.
- Contact rate-limit identifiers expire after 15 minutes and duplicate
  fingerprints after 5 minutes.
- No analytics, advertising pixel, mailing-list enrollment, or
  targeted-advertising system is implemented.
- Explicit AI-to-Contact handoff uses `sessionStorage`; Contact removes the
  value after reading it.
- Complete AI transcripts are not persistently stored by Vilét by default.
- Website Analyzer blocks private/internal destinations and is disabled unless
  explicitly configured.

## Configuration-aware statements

The published Contact delivery, Vilét AI, and Website Analyzer paragraphs use
validated server configuration. They do not render environment values. Review
the deployed policy after every mode change.

## Unresolved legal questions

- Does the legal reviewer approve “Caiden Sloan, doing business as Vilét” as
  the operator description while Vilét remains unregistered?
- Is the verified `privacy@vilet.co` forwarding address approved for public
  privacy requests by the legal reviewer?
- Are Terms, a cookie notice, consent controls, or jurisdiction-specific
  disclosures required?
- Does the retention wording match actual mailbox and provider settings?
- Should the policy include international-processing language?
- Which state or other privacy rights apply?
- Is the children’s privacy wording appropriate for the intended audience?

## Provider-dependent updates

Before activating a provider, confirm its identity, processing role, retention
and training settings where applicable, and whether it should be named publicly.
Re-review email delivery, shared rate limiting, AI processing, and Website
Analyzer language after configuration changes.

## Launch approval

- Owner reviewer: ____________________
- Owner review date: ____________________
- Owner approval: [ ] Approved [ ] Changes required
- Legal reviewer: Qualified attorney (name and firm not recorded publicly)
- Legal review date: August 2, 2026
- Legal approval: [x] Approved [ ] Changes required
- Approved public privacy contact: `privacy@vilet.co`
- Privacy mailbox/forwarding verified: Vilét owner, August 2, 2026
- Confirmed Vilét legal operator: Caiden Sloan, doing business as Vilét
- Terms-page decision: Required and approved for public footer navigation

The policy effective date remains July 28, 2026. Substantive draft wording was
updated on August 2, 2026, so the Last updated date changed while the original
effective date was preserved. Keep `/privacy` noindexed until owner and legal
approval are recorded. Then remove the page-level `robots` noindex directive in
a separately reviewed change.

The approved `/terms` route is linked in the footer. It remains absent from
sitemap output, has page-level noindex metadata, and is disallowed by
`robots.txt` until public indexing authorization is recorded.
