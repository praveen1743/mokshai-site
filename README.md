# mokshai.net

The website for **Moksh AI**, the AI practice of Moksh Infotech Pvt Ltd (Moksh Group). Moksh AI designs, builds and runs AI agents for managed service providers and operations-heavy businesses.

It is a fully static site built with [Astro](https://astro.build) and deployed on [Vercel](https://vercel.com). There is no UI framework, only a little TypeScript for the interactive parts (calculators, booking form, mobile menu).

| | |
| --- | --- |
| Pages | 19 content pages, 4 calculators + 1 readiness scorecard, 4 topic hubs, 18 articles, 2 Word templates, 3 legacy redirects |
| Lighthouse (mobile, lab) | Performance 98–99 · Accessibility 100 · Best practices 100 · SEO 100 |
| Core Web Vitals (lab) | LCP 2.1–2.3 s · CLS 0 · TBT 0 ms |
| Accessibility | 0 axe-core violations (WCAG 2.2 AA rules) at 390 px and 1440 px |
| Tests | 14 unit tests on calculator and scorecard formulas |

## Documentation

| Document | What it covers |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the site is put together: rendering, routing, data flow, scripts, SEO plumbing |
| [docs/COMPONENTS.md](docs/COMPONENTS.md) | Every component and layout, with props and where it is used |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Colour, type, spacing, motion, the hexagon motif, accessibility rules |
| [docs/CONTENT-AND-SEO.md](docs/CONTENT-AND-SEO.md) | Editing content, writing rules, structured data, AI-search readiness |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel setup, environment variables, domain cut-over, go-live checklist |
| [CLAUDE.md](CLAUDE.md) | Rules for AI-assisted edits to this repository |

## Quick start

Requires Node 22.23.4 or newer (Astro 7). On Vercel, set Project → Settings → Node.js Version to 22.x or 24.x.

```bash
npm install
npm run dev        # http://localhost:4321
npm test           # calculator formula tests
npm run build      # build into .vercel/output/ (static pages + the CMS function)
# open http://localhost:4321/keystatic during `npm run dev` to edit content in the CMS
```

`npm run dev` and `npm run build` first copy the font files out of the installed `@fontsource` packages into `public/fonts/` (see `scripts/copy-fonts.mjs`). The copies are git-ignored.

## Project structure

```
mokshai-site/
├── astro.config.mjs          Astro config: site URL, redirects, sitemap, Markdown table plugin, CSP, Vercel adapter
├── keystatic.config.ts       CMS fields for articles and case studies
├── vercel.json               Vercel build settings, redirects, security + cache headers, noindex on *.vercel.app
├── package.json
├── scripts/
│   ├── copy-fonts.mjs        Copies self-hosted fonts from node_modules before dev/build
│   ├── vercel-csp-routes.mjs Post-build fix so the CSP header reaches every URL
│   └── build-templates.py    Regenerates the Word templates in public/templates/ (needs python-docx)
├── public/                   Served as-is
│   ├── favicon.svg, apple-touch-icon.png, logo-wordmark.svg, logo.svg
│   ├── og/default.jpg        Social share image (1200×630)
│   ├── templates/*.docx      Downloadable AI policy and governance templates
│   ├── robots.txt, llms.txt
│   └── .htaccess, _redirects, _headers   Equivalents of vercel.json for Apache / Netlify / Cloudflare
├── src/
│   ├── site.config.ts        Single source of truth: company facts, nav, services, tag IDs, env-driven URLs
│   ├── content.config.ts     Content collection schemas (insights, case studies, pages)
│   ├── content/
│   │   ├── insights/*.md     Articles (served at the site root to keep old WordPress URLs)
│   │   └── pages/privacy-policy.md
│   ├── layouts/
│   │   ├── Base.astro        <head>, SEO meta, JSON-LD graph, Google tag, header + footer
│   │   └── ToolPage.astro    Shared shell for calculator pages
│   ├── components/           UI building blocks (see docs/COMPONENTS.md)
│   │   └── scenes/           Hero illustrations, one per page topic
│   ├── lib/
│   │   ├── calc.ts           Pure calculator formulas (unit-tested)
│   │   ├── handoff.ts        Calculator → booking-form handoff, analytics event helper
│   │   ├── schema.ts         JSON-LD builders (Organization, Service, FAQPage, BlogPosting…)
│   │   ├── serviceDetails.ts Long-form copy for the four service pages
│   │   └── tools.ts          Calculator metadata
│   ├── pages/                File-based routes (see table below)
│   └── styles/global.css     Design tokens and all shared styles
└── tests/calc.test.ts        Vitest unit tests for the formulas
```

## Routes

| URL | Source | Purpose |
| --- | --- | --- |
| `/` | `pages/index.astro` | Home: integration-map hero with the systems agents build on, buyer paths, operating model, services, process, calculator, insights, FAQ |
| `/msp/` | `pages/msp.astro` | AI agents for managed service providers |
| `/operations/` | `pages/operations.astro` | Back-office automation for operations-heavy businesses |
| `/services/` | `pages/services/index.astro` | Services overview |
| `/services/ai-consulting/` etc. | `pages/services/[slug].astro` | Four service pages generated from `lib/serviceDetails.ts` |
| `/how-we-work/` | `pages/how-we-work.astro` | Discovery → pilot → scale → run |
| `/pricing/` | `pages/pricing.astro` | How engagements are priced |
| `/security/` | `pages/security.astro` | Agent controls and vendor due-diligence questions |
| `/about/` | `pages/about.astro` | Company facts and Moksh Group |
| `/tools/` + 5 tools | `pages/tools/*.astro` | MSP ticket ROI, back-office time, AI spend audit, AI budget planner, AI readiness scorecard |
| `/insights/` | `pages/insights/index.astro` | Article index with topic navigation and featured article |
| `/insights/<topic>/` | `pages/insights/[topic].astro` | Four topic hubs: MSP automation, strategy and ROI, security and governance, operations |
| `/<article-slug>/` | `pages/[slug].astro` | Articles at their original WordPress URLs |
| `/book/` | `pages/book.astro` | Booking form with calculator handoff |
| `/privacy-policy/` | `pages/privacy-policy.astro` | Privacy policy (Markdown) |
| `/rss.xml`, `/sitemap-index.xml` | `pages/rss.xml.ts`, sitemap integration | Feeds for readers and crawlers |
| `/about-us/`, `/contact-us/`, `/blog/` | redirects | 301 to `/about/`, `/book/`, `/insights/` |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PUBLIC_FORM_ENDPOINT` | **Yes, for production** | URL the booking form POSTs JSON to (Formspree, Web3Forms, HubSpot Forms API, or your own). Without it the form falls back to opening the visitor's email app. |
| `PUBLIC_BOOKING_URL` | No | Scheduling link (Cal.com, Calendly, HubSpot meetings) shown after the form is sent |

Copy `.env.example` to `.env` for local development. On Vercel, set them under Project → Settings → Environment Variables.

## Deploying

Pushes to `main` deploy to production once the repository is connected to a Vercel project. Full steps, including the domain cut-over from the old WordPress site, are in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

**Do not delete the old WordPress site until the go-live checklist in that document passes.** Keep a full backup.

## Commitments written on Moksh AI's behalf

The copy avoids invented numbers, clients and testimonials. It does describe how Moksh AI works, and buyers may hold the company to these statements. Confirm them before launch:

- "We reply within one business day" (`/book/`)
- Engagements are quoted as a fixed scope; discovery is a fixed fee, the pilot is fixed scope and price, scale is monthly (`/pricing/`, `/how-we-work/`)
- Every pilot has a baseline, a target and a stop rule; human approval is on by default
- Running cost and accuracy are reviewed monthly
- Security controls on `/security/` (least-privilege service accounts, audit logs, client data separation, switch-off, written answers before any build)
- Configuration, prompts and runbooks are handed over with no lock-in
- Sister-company descriptions in `src/site.config.ts`
- "15 years supporting the manufacturing and fabrication industry" (`/operations/`, `/about/`, CEO video), confirmed by the company

Two facts conflicted on the old site and need confirming in `src/site.config.ts`: the contact email (`info@mokshtech.net` is used) and the US phone number (`+1-301-960-4037` is used; the privacy policy lists `+1-301-252-2673`).

## What is deliberately missing

These are the biggest remaining levers for trust and AI-search citations. Add them as soon as real material exists:

- Case studies with an industry, baseline, result and timeframe
- Founder and team bios with photos and LinkedIn links (then add a `Person` author in `src/lib/schema.ts`)
- Testimonials with name, role and company type
- An integrations page listing systems agents have actually been connected to
- A recorded screen demo of an agent working a (sanitised) queue

## Licence

Proprietary. © Moksh Infotech Pvt Ltd. All rights reserved.
