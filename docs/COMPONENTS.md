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

## Site chrome

| Component | Purpose | Notes |
| --- | --- | --- |
| `Header.astro` | Sticky glass header, primary nav, "Book a call" button, mobile menu | Nav items from `site.config.ts` (`NavItem`: a link, or a group with `children`). A group renders on desktop as the "Industries" disclosure: a `<button aria-expanded aria-controls>` toggling a solid (not glass) panel; click, Enter or Space opens it; Escape returns focus to the button; clicking or tabbing away closes it. The trigger shows the current state when any child page is active. On mobile a group is a labelled sub-list, not a second disclosure. Mobile menu is a real button with `aria-expanded`; Escape closes it. Add a segment to "Industries" only when it has its own page |
| `Footer.astro` | Brand blurb, site and service links, both offices, Moksh Group links, legal line | All facts from `site.config.ts` |
| `FounderVideo.astro` | CEO introduction: vertical video (no preload, poster only), name, role, LinkedIn, two quotes and a transcript. Data in `lib/introVideo.ts` and `site.leadership` | `heading?`, `id?`, `transcriptOpen?`. Used on the homepage (after the hero) and `/about/#leadership` |
| `CtaBand.astro` | Closing call to action on flat ink, directly above the footer so the two read as one dark area | Props: `title`, `text`, `primaryLabel`, `secondaryHref`, `secondaryLabel` |
| `PageHero.astro` | Interior page header on a flat tinted wash (no lighting or background hexagons) | Props: `eyebrow`, `title`, `accent` (gradient words), `lede`, `crumbs`, `tone`. Default slot for buttons; named slot `visual` for a scene, which switches to a two-column layout |

## Content blocks

| Component | Purpose | Props |
| --- | --- | --- |
| `SplitTable.astro` | The operating model: what the agent handles vs. what a person owns. Collapses to labelled rows on mobile | `rows?: { area, agent, human }[]`, `caption?` |
| `PostList.astro` | Editorial list of articles (topic, audience, reading time, title, summary; no date) | `posts`, `showSummary?`, `compact?` |
| `RelatedReading.astro` | "Related reading" band before the CTA; renders nothing when empty | `posts`, `title?`, `moreHref?`, `moreLabel?`, `tone?: 'sky' \| 'mint' \| 'paper'` |
| `Faq.astro` | Accessible accordion built on `<details>`; first item open | `items: { q, a }[]` (pair with `faq()` from `lib/schema.ts` for FAQPage schema) |
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
| `CallScene.astro` | AI voice agents | Live call transcript, in-call lookup and the handoff rule |
| `RagScene.astro` | LLM & AI integration | An in-product AI answer grounded in cited sources |
| `LaunchScene.astro` | AI prototype to production | Launch blockers from a prototype review and their status |

## Homepage hero (`components/hero/`)

| File | What it does | Notes |
| --- | --- | --- |
| `HeroRender.astro` | Homepage hero: Blender studio render of the five layers (systems → knowledge and data → AI layer → human review → outcomes) | Frame 0 is an `<img>` (LCP-safe); a bundled script draws the WebP sequence from `public/hero/d/` (desktop) or `public/hero/m/` (phones, 640 px; desktop 1200 px), pre-decoded to `ImageBitmap`; the position eases towards the scroll target and neighbouring frames are cross-blended, so motion is continuous (additive blend, so semi-transparent pixels never thicken mid-blend). The floor shadow is not in the frames: `.hr-shadow` is a CSS gradient moved per frame from `public/hero/track.json` (written by the encoder) on a canvas: one unfold on load, scroll folds it, pointer lean (±6°). Labels are an ordered list placed from `public/hero/labels.json`, written by the render script. Still image under reduced motion or Save-Data. Re-render with `scripts/hero/render_stack.py`, then `node scripts/hero/encode.mjs <dir>`. Layer labels are links to the matching service pages (short titles on phones); hover/focus lights the plate's front rim (the edge never hidden by the plate above) through an SVG overlay that follows the plate per frame (`public/hero/plates.json`, written by the render script with `GEOM_ONLY=1`); the active label gets a full-width colour bar and the others mute; an idle walk lights the layers in turn. Desktop: the page wraps the hero in a sticky grid over `[data-hero-runway]`, and the fold maps to the runway scroll; phones fold as the visual crosses mid-screen |

## Demo agents (`components/agents/`)

| Component | What it does | Notes |
| --- | --- | --- |
| `AgentCard.astro` | One demo agent: preview, name, industry, summary, what it does, stack chips, "Book a demo" | Props: `agent` (from `lib/agents.ts`), `headingLevel`. The card carries `data-industry` for the `/agents/` filter. "Book a demo" links to `/book/?demo=<slug>`, which prefills the request |
| `AgentPreview.astro` | Drawn interface preview for an agent (`report`, `pipeline`, `ticker`, `shop`, `inbox`, `contract`) | Always tagged "Illustrative"; status pills only, no result figures |

## Library modules (`src/lib/`)

| Module | Exports |
| --- | --- |
| `track.ts` | `track(event, params)`: sends a gtag event when the tag is loaded |
| `schema.ts` | `organization`, `website`, `breadcrumbs`, `faq`, `service`, `article`, `webApp`, `orgId` |
| `serviceDetails.ts` | Copy, FAQs and outcomes for each service page |
| `topics.ts` | Insights topics (slug, name, description, intro) used for hubs, breadcrumbs and the footer |
| `caseStudies.ts` | `publishedCaseStudies()` (newest first, drafts hidden in production; returns `[]` while the folder is empty), `CaseStudy` type |
| `insights.ts` | `isPublished`, `allPosts`, `relatedPosts`, `postsForService`, `postsForTool`, `postsForAudience`, `featuredPost`, `readingMinutes`, `audienceLabel`, `fmtDate` |

## Global style utilities (`styles/global.css`)

Layout: `.container`, `.section`, `.section-tight`, `.grid`, `.g-2/.g-3/.g-4`, `.stack`, `.stack-sm`, `.head`
Surfaces: `.dark`, `.sky`, `.mint`, `.wash`, `.surface`, `.glow`
Type: `.eyebrow`, `.lede`, `.grad-text`, `.mono`, `.tag`, `.prose`
Controls: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-light`, `.link-arrow`, `.input`, `.choice`, `.field`
Blocks: `.card`, `.card.featured`, `.hexi`, `.steps/.step`, `.faq`, `.cta`, `.facts`, `.checks`, `.notes`, `.split`, `.scene*`, `.pill-*`
Motion: `.reveal` (scroll-driven, movement only); `[data-loop]` on any element with a looping animation pauses it off screen (`.anim-paused`, toggled by `Base.astro`)

## Pages added by the CMS

| Route | File | Notes |
| --- | --- | --- |
| `/case-studies/` | `pages/case-studies/[...index].astro` | Built only when at least one case study is published |
| `/case-studies/<slug>/` | `pages/case-studies/[slug].astro` | Facts row, before/after, cover, body, optional quote, related services, `BlogPosting` + breadcrumbs schema |
| `/keystatic`, `/api/keystatic` | injected by `@keystatic/astro`; the admin page is swapped for `cms/KeystaticPage.astro` → `cms/KeystaticApp.tsx` (`keystaticCms()` in `astro.config.mjs`) | On-demand (Vercel function), noindex; config in `keystatic.config.ts`. The wrapper strips the trailing slash Vercel adds, which Keystatic's router doesn't match |
