# Vilét

Official website repository for **Vilét**, a premium digital studio building modern websites, AI automation, custom software, and digital products.

**Tagline:** Building what's next.

**Domain:** [vilet.co](https://vilet.co)

## Project overview

The Vilét website uses Next.js with the App Router, TypeScript, Tailwind CSS, and ESLint. The repository contains production core pages, a typed content architecture, provider-gated Resend and Upstash contact infrastructure, technical SEO routes, launch-safe provisional assets, and reusable design-system components.

## Installation

Requirements:

- A current Node.js LTS release
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
- [Launch checklist](docs/launch-checklist.md)
- [Initial commit review](docs/initial-commit-review.md)
