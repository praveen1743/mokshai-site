# CLAUDE.md

Marketing site for Moksh AI (mokshai.net). Astro 7 with the Vercel adapter: every public page is prerendered static HTML; only the Keystatic CMS (`/keystatic`, `/api/keystatic`, React) runs on demand. No UI framework on public pages. Vanilla TypeScript in `<script>` tags for interactivity.

## Commands
- `npm run dev`: dev server on :4321
- `npm run test`: Vitest, calculator formulas (`tests/calc.test.ts`)
- `npm run check`: `astro check` (TypeScript for .ts, .tsx and .astro). `npm run lint`: ESLint (`eslint.config.js`)
- `npm run build`: build to `.vercel/output/` (then `scripts/vercel-csp-routes.mjs` fixes the CSP routes). Node 22.23.4+. Needs `PUBLIC_FORM_ENDPOINT` for a working booking form; optional `PUBLIC_BOOKING_URL`
- `dev` and `build` first run `scripts/copy-fonts.mjs`, which copies fonts from `node_modules` into `public/fonts/` (git-ignored)

## Docs
`docs/ARCHITECTURE.md`, `docs/COMPONENTS.md`, `docs/DESIGN-SYSTEM.md`, `docs/CONTENT-AND-SEO.md`, `docs/DEPLOYMENT.md`. Update the relevant doc in the same change when you add a component, route or token.

## Deployment
Vercel, from `main`. Settings live in `vercel.json`; keep `public/.htaccess` and `public/_redirects` in sync with its redirects.

## Structure
- `src/site.config.ts`: single source of truth for company facts, nav, services (ten, grouped Plan/Build/Run; copy in `src/lib/serviceDetails.ts`), Google tag IDs. Never hard-code an email, phone or address elsewhere.
- `src/lib/schema.ts`: JSON-LD builders. `Base.astro` always emits Organization + WebSite; pages pass extra nodes via the `schema` prop.
- `src/lib/calc.ts`: pure calculator formulas. Any change needs a test in `tests/calc.test.ts`.
- `src/lib/handoff.ts`: sessionStorage handoff from calculators to `/book/`, plus the `track()` wrapper for gtag events.
- `src/content/insights/*.md`: articles, served at the site root (`/[slug]/`) so old WordPress URLs keep working. Frontmatter (`topic`, `services`, `tools`, `takeaways`, `faqs`) drives internal links and schema; see `docs/CONTENT-AND-SEO.md`.
- `src/lib/topics.ts`, `src/lib/insights.ts`: Insights topics and helpers (related posts, posts per service/tool/audience).
- `src/layouts/ToolPage.astro`: shared calculator page shell (method + FAQ + related tools).
- `keystatic.config.ts`: CMS fields. A new frontmatter field must be added here and in `src/content.config.ts`.
- `src/content/case-studies/*.md`: case studies, created by the team in the CMS; `draft: true` until reviewed.
- `src/components/scenes/`: hero illustrations, one per page topic. Pass them to `PageHero` via `slot="visual"`.
- `src/lib/agents.ts`: demo agents shown on `/agents/`, the homepage and industry pages. Only agents the company can demo live; previews (`components/agents/AgentPreview.astro`) are labelled illustrations with no result figures.
- `src/lib/industries.ts`: the "Industries" menu and `/industries/[slug]/` pages. An industry is listed only when it has its own page.

## Design rules
- Use the tokens at the top of `src/styles/global.css`. No new hex values in components.
- The site is warm light by default (`:root`: off-white `--paper`, charcoal `--ink`). `.dark` sections (AI + human, closing CTA, footer, featured panels) re-scope the same tokens to dark values, so components work in both. Write components with tokens only; `--ink` is text, `--paper` the ground, `--surface` a panel, `--ink-deep` the ground of dark sections. The only warm accent is amber (`--amber`, `--amber-on-dark`), and it means "a person does this step". No orange or purple brand accents.
- Palette comes from the logo: `--blue` #2583DB and `--green` #1FA92F, bridged by `--teal`. On light backgrounds use the `-700` text variants; the raw logo colours are for decoration and dark backgrounds only.
- Gradient text (`.grad-text`) appears once on the whole site: the homepage H1. All other headings are solid ink. `--grad-deep` is for primary buttons; `--grad` for small decorative accents. The closing CTA (`CtaBand`) is flat ink and runs straight into the footer; do not put it back in a gradient card.
- The homepage hero visual is `components/hero/HeroRender.astro`: a studio render of the five layers (your systems, knowledge and data, the AI layer, human review, outcomes), made in Blender by `scripts/hero/render_stack.py` and encoded to WebP by `scripts/hero/encode.mjs` into `public/hero/` (48 frames at 900 px for desktop, 480 px for phones). Frame 0 is a plain `<img>`; a bundled script loads the sequence after page load, unfolds the stack once, folds it into the AI layer as the visitor scrolls (eased, blending neighbouring frames), and leans it towards the pointer. Layer labels are a real HTML list placed from `public/hero/labels.json`. The encoder strips the rendered floor shadow (its render noise flickers in motion); the contact shadow is a CSS gradient that follows the stack via `public/hero/track.json`. Transforms only (CLS 0); reduced motion and Save-Data keep the still. To change the look, edit the Blender script and re-render; never hand-edit frames. No 3D or animation libraries on public pages.
- Ambient lighting (`.glow`) is used only in the homepage hero. Every other section is a flat tint or flat ink. One exception: the static logo-colour light behind the footer glass panel.
- Glass (frosted `backdrop-filter` panel with a specular rim) is used once: the footer panel in `Footer.astro`. Never stack glass on glass, never put it on content, never set `opacity` below 1 on it or its parents, and keep the `prefers-reduced-transparency` fallback.
- Hexagons do three jobs only: icon badges (`.hexi`, hub node icons), step numbers (`.step-n`) and the hub core. `HexField` appears only in the homepage hero. Bullets, eyebrow markers, FAQ toggles and slider handles are plain. No grid-line backgrounds.
- Sections alternate surfaces: paper, `.sky`, `.mint`, `.wash`, `.dark`. Avoid two of the same tint in a row.
- Vary section layouts. No more than two card grids per page; prefer editorial lists, statements and live components. Not every section needs an eyebrow label.
- Fonts: Archivo (display, `font-stretch` ~86%), IBM Plex Sans (body), IBM Plex Mono (labels, numbers). Self-hosted in `public/fonts/`.
- Homepage scroll motion uses CSS scroll timelines (`animation-timeline: view()`) inside `@supports` and `prefers-reduced-motion: no-preference`, so other browsers and reduced-motion visitors get the static page. Each section moves differently (slide, deal, grow, draw, rise, tilt); never give two adjacent sections the same motion. The AI + human flow is the peak. The FAQ and closing CTA stay still. Transforms only.
- Content is fully readable at rest: `.reveal` animates movement only, never opacity. Never put `.reveal` on the last block before the footer: the page can end before its scroll animation completes, leaving it offset under the footer. No animation may move layout (CLS must stay 0).
- Never give a decorative element a class named `dark`: `.dark` paints the ink background.
- Grid columns that collapse on mobile use `minmax(0, 1fr)`, never bare `1fr`.
- `[hidden]` must stay `display: none !important`; toggle visibility with `el.hidden`.
- Looping animations get `data-loop` so they pause off screen.
- CSP (`astro.config.mjs`): no `<script is:inline>` or `define:vars`; pass data via `data-`/`<meta>` to a bundled script. Add any new third-party host to the lists at the top of `astro.config.mjs`. CSP is off in dev, so test such changes on a build.
- One `<h1>` per page. Interior pages use `PageHero`.

## Content rules
- No invented numbers, clients, testimonials or certifications. Every figure on the site needs a source the company can show.
- Calculator defaults are labelled "Example inputs" and must stay labelled.
- Banned phrasing: "unlock the potential", "seamless", "elevate", "empower", "cutting-edge", "in today's competitive market", "game-changer".
- No two-beat or contrast headlines ("The agent prepares. A person decides.", "X, not Y"). Write plain, specific statements.
- Show the operating-model table (`SplitTable`) only on the homepage and audience pages, not on every page.
- Never copy another company's copy, prices, case-study figures or screenshots, even when a person shares them as a reference. Use references for structure only.
- Answer-first: the first paragraph of a service page or article answers its main question directly.
- Every article links in its body to at least two other pages (a service, a calculator or another article), and declares `services` and `tools` in frontmatter.

## Checks before shipping a change
`npm run test && npm run check && npm run lint && npm run build`, then check the changed pages at 390 px and 1440 px for horizontal overflow, and run axe/Lighthouse on any page whose layout changed.
