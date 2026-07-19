# Vilét launch checklist

Legend: `[x]` automatically validated or completed in the repository; `[ ]` requires approval, an external account, deployment access, or remains blocked.

## Business approvals

- [ ] **Owner approval:** production branch and launch date
- [ ] **Owner approval:** verified sender, recipient, and public privacy contact
- [ ] **Blocked:** approved legal/business information for any Terms decision

## Content

- [x] Production page copy contains no fabricated proof or destinations
- [x] Work uses the approved evidence-safe empty state
- [ ] **Owner approval:** final content review

## Contact delivery

- [x] Disabled mode is explicit and honest
- [x] Resend adapter and configuration validation exist
- [x] Duplicate, honeypot, timing, validation, and rate-limit controls exist
- [ ] **External account:** approved Resend account and verified sender
- [ ] **External account:** approved Upstash database and production salt
- [ ] **Blocked:** end-to-end real delivery test

## Legal and privacy

- [x] Factual starter privacy route is noindex
- [x] No unsupported compliance or retention claims were added
- [ ] **Owner/legal approval:** privacy notice and contact method
- [ ] **Owner/legal decision:** whether Terms are required

## Brand assets

- [x] Provisional original SVG and Apple icon resolve
- [x] Provisional generated social image exists
- [ ] **Owner approval:** final logo, icon, and social artwork

## SEO

- [x] Canonicals, sitemap, robots, manifest, and social metadata implemented
- [x] Empty portfolio generates no project sitemap entries
- [ ] **External account:** Search Console ownership and sitemap submission
- [ ] **Owner decision:** structured data facts; currently disabled

## Accessibility

- [x] Semantic landmarks, heading hierarchy, skip link, form labeling, and native FAQs
- [x] 320px reflow and required responsive viewports
- [ ] **Post-deployment:** repeat keyboard and assistive-technology review

## Security

- [x] CSP and supporting security headers configured
- [x] Server-only provider secrets and safe public errors
- [x] No personal inquiry logging or local persistence
- [ ] **Deployment review:** proxy identity header and CSP production report

## Performance

- [x] Static rendering remains the default
- [x] No external image, font, analytics, or heavy UI dependency added
- [ ] **Post-deployment:** measure field performance on the production domain

## Environment

- [x] Safe `.env.example` and mode-aware validation
- [ ] **Blocked:** production secrets and strong random rate-limit salt

## Deployment and domain

- [x] Deployment workflow documented
- [ ] **External access:** connect GitHub repository to Vercel
- [ ] **External access:** configure `vilet.co` and `www` redirect
- [ ] **Post-deployment:** verify HTTPS before HSTS reliance

## Post-launch verification

- [ ] Route, link, 404, metadata, image, and header smoke test
- [ ] Approved contact delivery and Reply-To test
- [ ] Sitemap fetch and Search Console submission
- [ ] Production console, responsive, accessibility, and performance review

## Portfolio and trust evidence

- [x] Featured Work remains absent
- [x] Trust Evidence remains absent
- [ ] **Blocked:** approved projects, metrics, testimonials, or other evidence

## Git baseline

- [x] Ignore rules, secrets, lockfile, and documentation reviewed
- [x] **Owner authorization:** create the initial commit
- [x] **Owner authorization:** push `main` normally to the existing official remote
- [ ] **External repository setting:** establish branch protection after the baseline exists
