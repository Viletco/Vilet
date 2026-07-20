# Domain connection plan

No domain or DNS change is authorized until the owner completes the hostname decisions.

## Decisions

- Primary hostname: __________
- `www` behavior: redirect to primary / primary itself / not connected
- DNS administrator: __________
- Approved maintenance window, if needed: __________

## Procedure after approval

1. Confirm the selected domain is controlled by Vilét and review existing DNS records before editing anything.
2. Add the approved apex and/or `www` domain to the Vercel project.
3. Use only the current record values Vercel displays for this project. Record types and targets can differ by DNS provider and must not be guessed.
4. Add or update the minimum required DNS records in the authoritative DNS provider. Preserve unrelated mail and verification records.
5. Wait for Vercel to report valid configuration and certificate issuance.
6. Configure the non-primary host to redirect permanently to the approved primary host.
7. Verify HTTPS, apex/`www` redirects, canonical metadata, sitemap URLs, robots behavior, security headers, contact behavior, and all public routes.
8. Only then authorize indexing and Search Console submission.

Rollback consists of restoring the recorded prior DNS values and removing only the newly added Vercel aliases. Never bulk-delete DNS records.
