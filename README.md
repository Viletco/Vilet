# Vilét

Official website repository for **Vilét**, a premium digital studio building modern websites, AI automation, custom software, and digital products.

**Tagline:** Building what's next.

**Domain:** [vilet.co](https://vilet.co)

## Project overview

The Vilét website uses Next.js with the App Router, TypeScript, Tailwind CSS, and ESLint. The repository contains production core pages, a typed content architecture, provider-gated Resend and Upstash contact infrastructure, technical SEO routes, launch-safe provisional assets, and reusable design-system components.

## Installation

Requirements:

- Node.js 20.9 or newer (use a current LTS release)
- npm

Install dependencies:

```bash
npm install
```

Copy the example environment file when local configuration is needed:

```bash
cp .env.example .env.local
```

The safe local defaults keep contact delivery disabled and use an in-memory abuse-control store. See the contact and deployment documentation before enabling production providers.

## Running locally

Start the development server and open `http://localhost:3000`:

```bash
npm run dev
```

## npm scripts

- `npm run dev` — start the development server.
- `npm run build` — create a production build.
- `npm run start` — serve the production build.
- `npm run lint` — run ESLint.
- `npm run format` — format supported files with Prettier.
- `npm run format:check` — check formatting without modifying files.
- `npm run typecheck` — run strict TypeScript validation without emitting files.
- `npm run check:launch` — report unresolved launch decisions and enabled-provider configuration; an unresolved production plan exits nonzero by design.
- `npm run test:ai` — run lightweight AI configuration, guardrail, workflow, and URL-security tests.
- `npm run check` — run the complete formatting, lint, type, and production-build gate.

## Repository conventions

- Use lowercase kebab-case for new directory and file names unless a chosen framework requires another convention.
- Keep product and engineering documentation in `docs/`.
- Keep secrets in local `.env` files; commit only safe placeholders in `.env.example`.
- Do not commit generated output, dependency directories, editor settings, logs, or operating-system metadata.
- Keep commits focused and use descriptive, imperative commit messages.
- Document new scripts, environment variables, and setup requirements in this README.
- Preserve the Vilét spelling in customer-facing copy; use ASCII-safe names such as `vilet` in code and paths.

## Documentation

- [Repository audit](docs/repository-audit.md)
- [Design system](docs/design-system.md)
- [Component library](docs/components.md)
- [Global layout](docs/layout.md)
- [Homepage strategy](docs/homepage-strategy.md)
- [Content architecture](docs/content-architecture.md)
- [Homepage implementation](docs/homepage.md)
- [Content platform](docs/content-platform.md)
- [Portfolio system](docs/portfolio.md)
- [Services page](docs/services.md)
- [Process page](docs/process.md)
- [About page](docs/about.md)
- [Contact experience](docs/contact.md)
- [Security preparation](docs/security.md)
- [Privacy review](docs/privacy.md)
- [Launch-readiness audit](docs/launch-readiness.md)
- [Deployment preparation](docs/deployment.md)
- [Preview deployment preparation](docs/preview-deployment.md)
- [Vercel preview QA](docs/preview-qa.md)
- [Production-readiness review](docs/production-readiness.md)
- [Launch blocker register](docs/launch-blockers.md)
- [Owner launch decisions](docs/owner-launch-decisions.md)
- [Environment matrix](docs/environment-matrix.md)
- [Final launch sequence](docs/final-launch-sequence.md)
- [Resend activation](docs/resend-activation.md)
- [Upstash activation](docs/upstash-activation.md)
- [Domain connection plan](docs/domain-connection-plan.md)
- [Search Console plan](docs/search-console-plan.md)
- [Legal approval checklist](docs/legal-approval-checklist.md)
- [Brand asset approval](docs/brand-asset-approval.md)
- [Footer and contact plan](docs/footer-contact-plan.md)
- [Launch checklist](docs/launch-checklist.md)
- [Initial commit review](docs/initial-commit-review.md)
- [Vilét AI Consultant](docs/ai-consultant.md)
- [AI configuration](docs/ai-configuration.md)
- [AI safety](docs/ai-safety.md)
- [Website Analyzer](docs/website-analyzer.md)
- [Project scoping](docs/project-scoping.md)
- [AI privacy review](docs/ai-privacy-review.md)
- [AI launch checklist](docs/ai-launch-checklist.md)
- [AI pre-evaluation audit](docs/ai-pre-evaluation-audit.md)
- [AI preview cost review](docs/ai-preview-cost-review.md)
- [AI preview evaluation](docs/ai-preview-evaluation.md)
- [AI production decision](docs/ai-production-decision.md)
- [AI operations](docs/ai-operations.md)
