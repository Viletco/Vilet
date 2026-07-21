# Google Search Console plan

Search Console is recommended but can be deferred without blocking a technically safe launch.

1. Obtain owner approval and access to the appropriate Google account.
2. After the canonical production domain resolves, add a Domain property for the approved domain.
3. Use the exact DNS TXT value Google provides; do not commit it to the repository.
4. Verify ownership, then submit `https://<approved-host>/sitemap.xml`.
5. Inspect the homepage and representative service, work, about, contact, and privacy URLs.
6. Confirm the production site is indexable and preview deployments remain `noindex`.
7. Review indexing and enhancement reports after crawling; do not request indexing before launch authorization.
