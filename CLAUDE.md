# CLAUDE.md

Marketing site for Moksh AI (mokshai.net). Astro 5, fully static output, no UI framework. Vanilla TypeScript in `<script>` tags for interactivity.

## Commands
- `npm run dev`: dev server on :4321
- `npm run test`: Vitest, calculator formulas (`tests/calc.test.ts`)
- `npm run build`: static build to `dist/`. Needs `PUBLIC_FORM_ENDPOINT` for a working booking form; optional `PUBLIC_BOOKING_URL`
- `dev` and `build` first run `scripts/copy-fonts.mjs`, which copies fonts from `node_modules` into `public/fonts/` (git-ignored)

## Docs
`docs/ARCHITECTURE.md`, `docs/COMPONENTS.md`, `docs/DESIGN-SYSTEM.md`, `docs/CONTENT-AND-SEO.md`, `docs/DEPLOYMENT.md`. Update the relevant doc in the same change when you add a component, route or token.

## Deployment
Vercel, from `main`. Settings live in `vercel.json`; keep `public/.htaccess` and `public/_redirects` in sync with its redirects.

## Structure
- `src/site.config.ts`: single source of truth for company facts, nav, services, Google tag IDs. Never hard-code an email, phone or address elsewhere.
- `src/lib/schema.ts`: JSON-LD builders. `Base.astro` always emits Organization + WebSite; pages pass extra nodes via the `schema` prop.
- `src/lib/calc.ts`: pure calculator formulas. Any change needs a test in `tests/calc.test.ts`.
- `src/lib/handoff.ts`: sessionStorage handoff from calculators to `/book/`, plus the `track()` wrapper for gtag events.
- `src/content/insights/*.md`: articles, served at the site root (`/[slug]/`) so old WordPress URLs keep working. Frontmatter (`topic`, `services`, `tools`, `takeaways`, `faqs`) drives internal links and schema; see `docs/CONTENT-AND-SEO.md`.
- `src/lib/topics.ts`, `src/lib/insights.ts`: Insights topics and helpers (related posts, posts per service/tool/audience).
- `src/layouts/ToolPage.astro`: shared calculator page shell (method + FAQ + related tools).
- `src/components/scenes/`: hero illustrations, one per page topic. Pass them to `PageHero` via `slot="visual"`.

## Design rules
- Use the tokens at the top of `src/styles/global.css`. No new hex values in components.
- Palette comes from the logo: `--blue` #2583DB and `--green` #1FA92F, bridged by `--teal`. On light backgrounds use the `-700` text variants; the raw logo colours are for decoration and dark backgrounds only.
- Gradient text (`.grad-text`) appears once on the whole site: the homepage H1. All other headings are solid ink. `--grad-deep` is for primary buttons and the CTA band; `--grad` for small decorative accents.
- Ambient lighting (`.glow`) is used only in the homepage hero. Every other section is a flat tint or flat ink. One exception: the static logo-colour light behind the footer glass panel.
- Glass (frosted `backdrop-filter` panel with a specular rim) is used once: the footer panel in `Footer.astro`. Never stack glass on glass, never put it on content, never set `opacity` below 1 on it or its parents, and keep the `prefers-reduced-transparency` fallback.
- Hexagons do three jobs only: icon badges (`.hexi`, hub node icons), step numbers (`.step-n`) and the hub core. `HexField` appears only in the homepage hero. Bullets, eyebrow markers, FAQ toggles and slider handles are plain. No grid-line backgrounds.
- Sections alternate surfaces: paper, `.sky`, `.mint`, `.wash`, `.dark`. Avoid two of the same tint in a row.
- Vary section layouts. No more than two card grids per page; prefer editorial lists, statements and live components. Not every section needs an eyebrow label.
- Fonts: Archivo (display, `font-stretch` ~86%), IBM Plex Sans (body), IBM Plex Mono (labels, numbers). Self-hosted in `public/fonts/`.
- Content is fully readable at rest: `.reveal` animates movement only, never opacity. No animation may move layout (CLS must stay 0).
- Never give a decorative element a class named `dark`: `.dark` paints the ink background.
- Grid columns that collapse on mobile use `minmax(0, 1fr)`, never bare `1fr`.
- `[hidden]` must stay `display: none !important`; toggle visibility with `el.hidden`.
- One `<h1>` per page. Interior pages use `PageHero`.

## Content rules
- No invented numbers, clients, testimonials or certifications. Every figure on the site needs a source the company can show.
- Calculator defaults are labelled "Example inputs" and must stay labelled.
- Banned phrasing: "unlock the potential", "seamless", "elevate", "empower", "cutting-edge", "in today's competitive market", "game-changer".
- No two-beat or contrast headlines ("The agent prepares. A person decides.", "X, not Y"). Write plain, specific statements.
- Show the operating-model table (`SplitTable`) only on the homepage and audience pages, not on every page.
- Answer-first: the first paragraph of a service page or article answers its main question directly.
- Every article links in its body to at least two other pages (a service, a calculator or another article), and declares `services` and `tools` in frontmatter.

## Checks before shipping a change
`npm run test && npm run build`, then check the changed pages at 390 px and 1440 px for horizontal overflow, and run axe/Lighthouse on any page whose layout changed.
