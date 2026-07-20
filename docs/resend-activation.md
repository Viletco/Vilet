# Resend activation plan

The repository already contains a server-side Resend adapter. This plan does not create an account, verify a domain, or configure secrets.

## Owner inputs

1. Approve Resend as the delivery provider.
2. Choose the real recipient inbox.
3. Choose a sender address on a domain the organization controls.
4. Approve whether replies go to the submitter's validated email. The current implementation supports `submitted-email`.

## Account and domain setup

1. An authorized owner creates or selects the Resend account.
2. Add the approved sending domain in Resend.
3. Copy the exact DNS records shown by Resend into the DNS provider. Do not infer record names or values from this document.
4. Wait for Resend to report the domain as verified.
5. Create a narrowly scoped production API key and a separate preview key only if preview delivery testing is approved.

## Vercel configuration

Set these in the intended environment through Vercel's encrypted variable UI or interactive CLI; do not paste values into commands, issues, chat, or Git:

- `CONTACT_DELIVERY_MODE=resend`
- `RESEND_API_KEY`
- `CONTACT_FORM_RECIPIENT`
- `CONTACT_FROM_EMAIL`
- `CONTACT_REPLY_TO_MODE=submitted-email` after approval

Redeploy after changing variables. Verify one valid message, recipient delivery, reply-to behavior, sender authentication, error behavior, and that logs contain no message body or raw personal data. Revoke test keys that are no longer needed.
