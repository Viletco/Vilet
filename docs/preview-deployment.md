# Preview deployment preparation

The repository is connected to the Vercel project `vilet`. A protected preview and the temporary public Vercel alias have been verified; the custom production domain remains intentionally unconnected. See `docs/preview-qa.md` for the recorded QA evidence.

## Import and framework settings

1. Keep the existing `Viletco/Vilet` GitHub connection and Next.js framework detection.
2. Keep the repository root as the root directory, `npm install` as the install command, and `npm run build` as the build command.
3. Do not override the standard Next.js output directory.
4. Keep production-domain assignment separate from preview QA. Do not connect `vilet.co` or change DNS until the owner completes the launch decisions.

The repository targets a current Node.js LTS release and commits `package-lock.json`. Vercel previews should build from normal Git branches; `main` should remain the production branch unless the owner selects a different protected workflow.

## Safe first-preview environment

Use these non-secret settings initially:

```text
NEXT_PUBLIC_SITE_URL=https://vilet.co
CONTACT_DELIVERY_MODE=disabled
CONTACT_RATE_LIMIT_MODE=memory
```

Leave every Resend and Upstash credential unset. Disabled delivery is intentional for the first preview: it allows validation and accessibility testing without transmitting inquiry data or inventing a recipient. Submit a non-sensitive test inquiry and confirm the form announces that delivery is not active while preserving the entered values.

## Activating providers later

After preview QA and owner approval, configure Resend with an approved API key, verified sender, recipient, and `CONTACT_REPLY_TO_MODE=submitted-email`; then set `CONTACT_DELIVERY_MODE=resend`. Activate Upstash separately with its HTTPS REST URL, token, strong random salt, and `CONTACT_RATE_LIMIT_MODE=upstash`. Preview and Production scopes should be chosen deliberately. Never reuse or expose secrets in source, logs, screenshots, or pull requests.

## Preview verification

When Vercel supplies `VERCEL_ENV=preview`, every response receives
`X-Robots-Tag: noindex, nofollow`. A server-side host guard applies the same
header to Vercel-owned `.vercel.app` aliases, including the temporary production
alias created during project import. The guard does not match the eventual
`vilet.co` hostname. Verify the header on every hosted preview URL before sharing
it or considering a domain connection.

Verify all public routes and the following launch surfaces:

- `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest` return their expected content types;
- `/opengraph-image`, `/twitter-image`, `/apple-icon`, and `/icon.svg` resolve;
- `/privacy` is readable and remains noindex;
- an unknown URL returns the branded 404;
- `/dev/components` returns 404 in the production preview build;
- Contact disabled mode is honest, focus-managed, keyboard-usable, and does not clear values;
- browser console and hydration checks remain clean at the documented responsive sizes;
- security response headers match `docs/security.md`, including production HSTS and CSP without the development-only evaluation allowance.

Inspect the deployment logs only for operational categories and ensure no submitted personal information appears. Confirm Featured Work, Trust Evidence, and case-study routes remain absent while the project registry is empty.

## Promotion, rollback, and domain safety

Do not connect `vilet.co` until the preview passes content, legal, brand, security, accessibility, responsive, and contact-provider review. A failed preview can be replaced by redeploying the last known-good commit. After production begins, prefer promoting or redeploying an immutable known-good commit instead of rewriting Git history. Provider delivery can be returned to disabled mode while an integration issue is investigated.
