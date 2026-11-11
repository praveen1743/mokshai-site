# Components

All components are `.astro` files under `src/components/`. Styles are either global (`src/styles/global.css`) or scoped inside the component. None of them depend on a UI framework.

## Layouts

### `layouts/Base.astro`
Every page uses it. Renders `<head>` (title, description, canonical, Open Graph, Twitter card, font preloads, favicon), the JSON-LD graph, the Google tag, the skip link, `Header`, the page slot and `Footer`.

| Prop | Type | Notes |
| --- | --- | --- |
| `title` | string | " \| Moksh AI" is appended unless the title already contains it |
| `description` | string | Meta and Open Graph description |
| `schema` | object[] | Extra JSON-LD nodes added to the Organization + WebSite graph |
| `ogType` | `'website' \| 'article'` | Default `website` |
| `noindex` | boolean | Adds `noindex, follow` |
| `published`, `updated` | Date | Article timestamps |

### `layouts/ToolPage.astro`
Shell for calculator pages: page hero, the calculator (named slot `calc`), a method section (named slot `method`), FAQ, related calculators and the CTA band. Emits `WebApplication`, `BreadcrumbList` and `FAQPage` schema.

| Prop | Type |
| --- | --- |
| `slug` | one of the slugs in `lib/tools.ts` |
| `title`, `lede` | string |
| `faqs` | `{ q, a }[]` |

## Site chrome

| Component | Purpose | Notes |
| --- | --- | --- |
| `Header.astro` | Sticky glass header, primary nav, "Book a call" button, mobile menu | Nav items from `site.config.ts`. Mobile menu is a real button with `aria-expanded`; Escape closes it |
| `Footer.astro` | Brand blurb, site and service links, both offices, Moksh Group links, legal line | All facts from `site.config.ts` |
| `FounderVideo.astro` | CEO introduction: vertical video (no preload, poster only), name, role, LinkedIn, two quotes and a transcript. Data in `lib/introVideo.ts` and `site.leadership` | `heading?`, `id?`, `transcriptOpen?`. Used on the homepage (after the hero) and `/about/#leadership` |
| `CtaBand.astro` | Closing call to action on flat ink, directly above the footer so the two read as one dark area | Props: `title`, `text`, `secondaryHref`, `secondaryLabel` |
| `PageHero.astro` | Interior page header on a flat tinted wash (no lighting or background hexagons) | Props: `eyebrow`, `title`, `accent` (gradient words), `lede`, `crumbs`, `tone`. Default slot for buttons; named slot `visual` for a scene, which switches to a two-column layout |

## Content blocks

| Component | Purpose | Props |
| --- | --- | --- |
| `SplitTable.astro` | The operating model: what the agent handles vs. what a person owns. Collapses to labelled rows on mobile | `rows?: { area, agent, human }[]`, `caption?` |
| `PostList.astro` | Editorial list of articles (topic, audience, reading time, title, summary; no date) | `posts`, `showSummary?`, `compact?` |
| `RelatedReading.astro` | "Related reading" band before the CTA; renders nothing when empty | `posts`, `title?`, `moreHref?`, `moreLabel?`, `tone?: 'sky' \| 'mint' \| 'paper'` |
| `Faq.astro` | Accessible accordion built on `<details>`; first item open | `items: { q, a }[]` (pair with `faq()` from `lib/schema.ts` for FAQPage schema) |
| `MiniCalc.astro` | Compact live MSP ticket-savings estimate on the homepage (three sliders, fixed 15 min at $42/h) linking to the full calculator | none |
| `Range.astro` | Labelled slider with live output and gradient fill | `id`, `label`, `min`, `max`, `step`, `value`, `hint?`, `display?` (server-rendered output text) |
| `Icon.astro` | 24 px line-icon set, always `aria-hidden` | `name` (ticket, alert, doc, copilot, layers, quote, inbox, status, chart, compass, code, people, coins, shield, clock, stack, handshake, target, wallet, lock, eye, power, database, route) |
| `Arrow.astro` | Arrow glyph used in buttons | none |
| `HexField.astro` | Decorative cluster of outlined hexagons from the logo, slowly rotating and floating. Carries `data-loop` | `variant: 'dark' \| 'light'`, `class` |

## Hero scenes (`components/scenes/`)

Product-style illustrations that show each page's subject. All are HTML/SVG, labelled "Illustrative" wherever numbers appear, and safe with reduced motion.

| Scene | Used on | Shows |
| --- | --- | --- |
| `Hub.astro` | Home (dark), Services hub, About (light) | An agent core connected to systems or teams, with animated data pulses; hovering a node highlights its wire. Props: `core`, `left`, `right` (`{ label, sub?, icon?, human? }[]`), `compact?` (a smaller node set shown below 560 px so labels never truncate), `tone`, `steps?`, `caption?`. Height adapts to node count |
| `QueueConsole.astro` | `/msp/` | Service-desk queue cycling tickets between agent and engineer. Swaps text in place, so no layout shift; pauses off-screen |
| `IntakeScene.astro` | `/operations/` | RFQ email with a drawing turned into a draft quote, with a missing field flagged |
| `MatrixScene.astro` | AI strategy & consulting | Value-vs-effort matrix with a "start here" quadrant and ranked shortlist |
| `AgentConfigScene.astro` | Custom AI agents | Agent definition (reads, writes, approvals, escalation) and run log |
| `RolloutScene.astro` | Implementation & training | Adoption by team and training sessions |
| `SpendScene.astro` | AI cost optimisation | Subscription spend before and after review |
| `ScorecardScene.astro` | How we work | Pilot scorecard: baseline, target, result, decision, stop rule |
| `PermissionScene.astro` | Security | Agent permissions (allowed / approval / never), audit log, pause switch |
| `CalcPreviewScene.astro` | Calculators hub | Calculator inputs and result |

## Library modules (`src/lib/`)

| Module | Exports |
| --- | --- |
| `calc.ts` | `ticketRoi`, `backOffice`, `spendAudit`, `budgetPlan`, `usd`, `num`, `PRODUCTIVE_HOURS_PER_MONTH`. Pure, input-clamped, unit-tested |
| `handoff.ts` | `saveHandoff`, `readHandoff`, `track` |
| `schema.ts` | `organization`, `website`, `breadcrumbs`, `faq`, `service`, `article`, `webApp`, `orgId` |
| `serviceDetails.ts` | Copy, FAQs and outcomes for each service page |
| `tools.ts` | Calculator names, audiences, questions and descriptions |
| `topics.ts` | Insights topics (slug, name, description, intro) used for hubs, breadcrumbs and the footer |
| `caseStudies.ts` | `publishedCaseStudies()` (newest first, drafts hidden in production; returns `[]` while the folder is empty), `CaseStudy` type |
| `insights.ts` | `isPublished`, `allPosts`, `relatedPosts`, `postsForService`, `postsForTool`, `postsForAudience`, `featuredPost`, `readingMinutes`, `audienceLabel`, `fmtDate` |

## Global style utilities (`styles/global.css`)

Layout: `.container`, `.section`, `.section-tight`, `.grid`, `.g-2/.g-3/.g-4`, `.stack`, `.stack-sm`, `.head`
Surfaces: `.dark`, `.sky`, `.mint`, `.wash`, `.surface`, `.glow`
Type: `.eyebrow`, `.lede`, `.grad-text`, `.mono`, `.tag`, `.prose`
Controls: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-light`, `.link-arrow`, `.input`, `.choice`, `.field`
Blocks: `.card`, `.card.featured`, `.hexi`, `.steps/.step`, `.faq`, `.cta`, `.facts`, `.checks`, `.notes`, `.split`, `.scene*`, `.pill-*`, `.calc*`
Motion: `.reveal` (scroll-driven, movement only); `[data-loop]` on any element with a looping animation pauses it off screen (`.anim-paused`, toggled by `Base.astro`)

## Pages added by the CMS

| Route | File | Notes |
| --- | --- | --- |
| `/case-studies/` | `pages/case-studies/[...index].astro` | Built only when at least one case study is published |
| `/case-studies/<slug>/` | `pages/case-studies/[slug].astro` | Facts row, before/after, cover, body, optional quote, related services and calculators, `BlogPosting` + breadcrumbs schema |
| `/keystatic`, `/api/keystatic` | injected by `@keystatic/astro`; the admin page is swapped for `cms/KeystaticPage.astro` → `cms/KeystaticApp.tsx` (`keystaticCms()` in `astro.config.mjs`) | On-demand (Vercel function), noindex; config in `keystatic.config.ts`. The wrapper strips the trailing slash Vercel adds, which Keystatic's router doesn't match |
