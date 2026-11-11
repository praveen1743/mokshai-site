# Full Spectrum Audit: mokshai.net rebuild (Astro, Vercel preview)

**Date**: 2026-11-11
**Mode**: Repo Health
**Source**: `main` at `fd73b7a`, live preview https://mokshai-site.vercel.app
**Lenses Run**: 9/10
**Lenses Skipped**: Backend Engineer (static site, no server code, no Rust/Tauri)

**Evidence gathered for this audit**: `npm test` (14/14 pass), `npm run build` (46 pages, no warnings), `tsc --noEmit` (0 errors in `.ts`), `npm audit`, `npm outdated`, full-page screenshots of 7 interior page types at 1440px, homepage and article screenshots from the previous review, phrase-frequency and eyebrow counts across `dist/`, Lighthouse mobile (home 95–97, articles 99; accessibility, best practices and SEO 100), axe-core (0 violations, 19 page types × 390/1440px) from the last change set, and a check of the live `/book/` markup.

---

## Master Verdict: APPROVE WITH CHANGES

The code is in good shape: fast, accessible, tested where it matters, and well documented. Three things stop it from being launch-ready: the booking form has no backend in production, the privacy policy shows a different US phone number from the rest of the site, and nothing tests or type-checks a change before Vercel deploys it. The bigger problem is not code. Every page is built from the same kit (eyebrow label, gradient hero, an "Illustrative" mock UI, FAQ, related guides, dark CTA), and the site shows no real work. That sameness, not any single colour or font, is what reads as AI-made.

## Verdict by Lens

| # | Lens | Verdict | Critical | Recommendations |
|---|------|---------|----------|-----------------|
| 1 | Design Engineer | APPROVE WITH CHANGES | 1 | 5 |
| 2 | UX Engineer | APPROVE WITH CHANGES | 2 | 4 |
| 3 | Frontend Engineer | APPROVE WITH CHANGES | 0 | 4 |
| 4 | Backend Engineer | Skipped | – | – |
| 5 | Structural Engineer | APPROVE | 0 | 3 |
| 6 | Repo Maintainer | APPROVE WITH CHANGES | 1 | 4 |
| 7 | Production Readiness | APPROVE WITH CHANGES | 2 | 6 |
| 8 | DX Engineer | APPROVE WITH CHANGES | 0 | 4 |
| 9 | Performance Engineer | APPROVE | 0 | 3 |
| 10 | Accessibility Engineer | APPROVE | 0 | 3 |

## All Critical Issues (Must Fix)

| # | Issue | Lens(es) | File(s) | Impact | Fix |
|---|-------|----------|---------|--------|-----|
| 1 | The booking form has no backend in production. `PUBLIC_FORM_ENDPOINT` is not set on Vercel, so "Request a call" opens the visitor's email app (`mailto:`). Visitors without a configured mail client, which includes most people on work laptops using webmail, cannot send it. No `generate_lead` event fires. | UX, Production, DX | `src/pages/book.astro:146-154`, Vercel env | The only conversion path on the site silently fails for a large share of visitors, and leads are not measured | Create a Formspree / HubSpot / Web3Forms form, set `PUBLIC_FORM_ENDPOINT` (and `PUBLIC_BOOKING_URL` for Cal.com or Calendly) in Vercel, redeploy, submit a test lead end to end |
| 2 | Two different US phone numbers. The footer, About and Book pages use +1-301-960-4037 (`site.config.ts`); the privacy policy hard-codes +1-301-252-2673 in five places, plus the email and both addresses. | Repo Maintainer, Production | `src/content/pages/privacy-policy.md:300-366`, `src/site.config.ts:16` | A buyer or regulator sees conflicting contact details on the legal page; breaks the "single source of truth" rule in CLAUDE.md | Confirm the right number; render the privacy-policy contact block from `site.config.ts` (move it into `privacy-policy.astro`) and remove the hard-coded copies |
| 3 | Nothing gates a deploy. Vercel runs `npm run build` only; tests never run in the pipeline, there is no CI, and the TypeScript inside `.astro` `<script>` blocks (all calculator and form logic) is never type-checked. | Frontend, Production, Repo Maintainer | `vercel.json` (`buildCommand`), `package.json` scripts, no `.github/workflows/` | A broken formula or a typo in a calculator script ships straight to production | Set `buildCommand` to `npm test && npm run build`; add `@astrojs/check` and a `check` script; add a GitHub Action that runs test + check + build on every push and PR |
| 4 | The site reads as template-made. Every interior page uses the same sequence: eyebrow, wash-gradient hero with a mock UI labelled "Illustrative" (9 pages), FAQ accordion, related guides, dark CTA, glass footer. 5–7 mono uppercase eyebrows per page. 16 articles dated within two days with the same scaffolding. No real screenshots, photos of work, clients, case studies or named authors, except the CEO. | Design, UX, Repo Maintainer (content) | All `src/pages/*.astro`, `src/components/scenes/*`, `src/content/insights/*` | The thing a skeptical MSP owner is checking for ("is this real?") is the thing the site cannot show. See the dedicated section below | See "How to stop looking like an AI-made site" |

## Cross-Cutting Concerns

| Concern | Flagged By | Root Cause | Unified Fix |
|---------|-----------|------------|-------------|
| Lead capture is untested and unmeasured | UX, Production, DX | Form backend left as an env var to set "later"; no end-to-end check; no field analytics | Set the endpoint, add a fetch timeout, add Vercel Web Analytics, run one real test submission before cutover |
| Facts live in more than one place | Repo Maintainer, Structural, Production | Privacy policy pasted from WordPress; slug lists and redirects duplicated | One source per fact: contact details from `site.config.ts`; slugs derived from `tools.ts` / `services`; redirects generated from one list |
| No safety net on change | Frontend, Production, Repo Maintainer, DX | No CI, no `astro check`, tests outside the deploy path, dependency advisories unaddressed | One GitHub Action (test, check, build) plus Dependabot; Vercel build runs tests |
| Everything is described, nothing is shown | Design, UX, Performance (animated mock UIs) | No real artefacts available at build time, so every visual is a drawn illustration | Replace the drawn scenes one by one with real, sanitised screenshots, recordings and photos; see below |

## All Recommendations

| # | Recommendation | Lens | File(s) | Fix |
|---|---------------|------|---------|-----|
| 1 | Upgrade Astro 5.18 → 7.x and Vitest 3 → 5. `npm audit`: 3 critical, 3 high, 1 moderate, 1 low. All are build or dev-time. The Astro `define:vars` XSS advisory does not apply here because the only use passes static config (`Base.astro:55`), and server islands are not used. Still, do not launch on a major version with open criticals. | Production, Repo | `package.json` | Upgrade on a branch, run the full check list, compare screenshots |
| 2 | Escape `<` in JSON-LD. `set:html={JSON.stringify(graph)}` would break the page if any title, FAQ or description ever contained `</script>`. | Frontend | `src/layouts/Base.astro:52` | `JSON.stringify(graph).replace(/</g, '\\u003c')` |
| 3 | Add a timeout to the form submission. A hung endpoint leaves the button on "Sending…" forever. | DX, UX | `src/pages/book.astro:157` | `AbortController` with a 15s timeout, then the existing error message |
| 4 | The mailto-fallback message is shown in the red error style (`#form-error`, `role="alert"`). It is a status, not an error. | UX, A11y | `src/pages/book.astro:152` | Use a neutral status element with `role="status"` (moot once #1 critical is fixed) |
| 5 | Derive `serviceSlugs` / `toolSlugs` instead of repeating them. Adding a tool needs edits in 3 files today. | Structural | `src/content.config.ts:5-6` | Import from `site.config.ts` and `lib/tools.ts` (`as const` tuples) |
| 6 | Redirects live in 4 files (`astro.config.mjs`, `vercel.json`, `public/_redirects`, `public/.htaccess`). | Structural, Repo | those files | Generate the three host files from one list in a prebuild script, or add a test that asserts parity |
| 7 | Add a Content-Security-Policy. All other security headers are present; CSP is not. | Production | `vercel.json`, `public/_headers` | Start with `Content-Security-Policy-Report-Only` allowing self, Google Tag and the form endpoint; enforce after a week |
| 8 | Field performance is unknown; all numbers are lab. Mobile main-thread work is 2.1s (Lighthouse score 0.5 on that audit), mostly from infinite CSS animations (8 hub pulses, core "breathe", HexField) and two `backdrop-filter` surfaces. | Performance | `scenes/Hub.astro`, `HexField.astro`, `Footer.astro`, `QueueConsole.astro` | Pause animations when off screen (IntersectionObserver toggling `animation-play-state`); enable Vercel Speed Insights for real-user Core Web Vitals |
| 9 | Hard-coded hex values in components despite the "no new hex in components" rule: Hub (12), AgentConfigScene (12), PermissionScene (7), MatrixScene (5), QueueConsole (4), book (3), `[slug]` header gradient (3). | Design, Repo | listed files | Move to tokens in `global.css`; SVG gradient stops can use `style="stop-color: var(--blue)"` |
| 10 | Unreferenced 288 KB original photo is publicly served. | Repo, Performance | `public/media/mick-shah-photo.png` | Move to a non-public `assets-src/` folder |
| 11 | Content editing needs git and Markdown. Nobody at Moksh can add a case study or fix a typo without a developer. | DX | `src/content/` | Add a Git-based CMS (Keystatic or Decap) on top of the existing collections, with a "draft" field |
| 12 | Unreviewed articles are live. 16 articles drafted by AI are published with the same date and no reviewer. | Repo (content), UX | `src/content/insights/*`, `content.config.ts` | Add `draft: z.boolean().default(false)`, filter drafts out of production builds, release articles after review on their real dates |
| 13 | Old WordPress media URLs (`/wp-content/uploads/...`) will 404 after cutover. | Production | `vercel.json` | Redirect known image URLs that have backlinks; accept 404 for the rest |
| 14 | Add uptime monitoring for mokshai.net and the form endpoint. | Production | – | Any free uptime checker hitting `/` and `/book/` every 5 minutes |
| 15 | Hero systems list (ConnectWise, Autotask, HaloPSA, NinjaOne) is still awaiting confirmation. | UX (trust) | `src/pages/index.astro:20` | Confirm or reduce to systems Moksh can show work on |

---

## How to stop looking like an AI-made site

**The uncomfortable answer first**: changing colours, fonts or animations will not fix this. A visitor decides "AI-made" from three things: everything looks assembled from the same parts, every picture is a drawing of a product rather than the product, and nobody is named except one person. The current site has all three. The fixes below are in order of impact.

### 1. Show real work instead of drawn mock-ups (biggest single change)

Nine pages use a hand-drawn UI labelled "Illustrative" (queue console, agent config, permission matrix, scorecard, rollout chart and so on). Replace them one at a time:

| Page | Now | Replace with |
|---|---|---|
| Home hero, `/msp/` | Drawn hub diagram, drawn queue | A 20–30s screen recording of an agent triaging tickets in a sandbox PSA, with client data swapped for fake data |
| `/operations/` | Drawn RFQ intake card | A real (redacted) RFQ email and the quote worksheet the agent drafted, side by side; Moksh CAD / Estimating drawings are already in the group |
| `/security/` | Drawn permission list | A real audit-log excerpt and the actual vendor security questionnaire as a PDF download |
| `/pricing/` | Drawn cards | One real, anonymised statement of work: scope, phases, what was fixed price |
| `/about/` | Hub of sister companies | Photos of the Ahmedabad team and the New Jersey office; names and roles |
| `/how-we-work/` | Drawn rollout chart | A real pilot timeline with dates and the go/no-go decision |

If none of these exist yet, build one sandbox agent and record it. One genuine recording outweighs all nine illustrations.

### 2. Add proof modules (the site currently has one: the CEO video)

- One case study with industry, baseline, result and timeframe, even if it is an internal Moksh Group project (Moksh Tech's own service desk is an obvious candidate).
- Named authors on articles with photos (the `author` field already exists).
- A quote from one client or partner, named, with permission.
- Only list integrations Moksh has actually built.

### 3. Break the template

- **Eyebrows**: there are 5–7 per page, a mono uppercase label with a dash above almost every heading. Keep them only in page heroes. This one change removes the strongest visual "generated" tell.
- **Page structure**: each page currently runs hero → mock UI → cards → FAQ → related guides → dark CTA. Give each page one distinctive centrepiece that only it has, and drop the sections that don't serve that page. Not every page needs an FAQ and a related-guides list.
- **Repeated phrases**: "Book a 30-minute call about one workflow" appears on 33 pages; "you already run" 72 times on 43 pages; "human approval" 29 times; "stop rule" 27 times. Write each page's CTA for that page, and say the signature line once or twice on the whole site.

### 4. Tone down the generic "AI company" visual kit

The current kit is the familiar one: blue→green gradient, soft glow, hexagon nodes, glassmorphism, dark navy. It is executed well, but it is what most AI-agency sites look like.
- Introduce real photography (people, offices, shop floors, service desks) as the main visual material on About, Operations and MSP.
- Keep the logo gradient for the logo, primary buttons and one accent; remove it from secondary decoration.
- [Guessing] A more editorial headline face for H1/H2 (a serif or a grotesk with more character than condensed Archivo) would separate the site from dev-tool startups. Worth testing on one page before committing.

### 5. Make the content look written, not generated

- Unpublish unreviewed articles (draft flag), then release them over weeks on their real dates.
- Vary the article shape. Not every article needs "Key takeaways + FAQ + Put this into practice". Some should be short opinion pieces, some long how-tos, some a single worked example.
- Each article needs one thing only Moksh could have written: a number from your own work, a screenshot, a mistake you made.

---

# Lens Reports

---

## 1. Design Engineer

**Verdict**: APPROVE WITH CHANGES

### Files Reviewed
| File | Visual Role | Risk |
|------|-------------|------|
| `src/styles/global.css` | Tokens, shared components, motion | Low |
| `src/components/PageHero.astro`, `scenes/*` | Hero composition and illustrations on 9 pages | High (template sameness) |
| `src/components/Footer.astro`, `CtaBand.astro` | Closing CTA + glass footer | Low |
| `src/pages/*.astro` | Page compositions | Medium |
| `src/components/FounderVideo.astro` | Only real-person content | Low |

### Critical Issues
| # | Issue | File(s) | Impact | Fix |
|---|-------|---------|--------|-----|
| 1 | Template sameness across interior pages: identical hero formula with an "Illustrative" mock UI (9 pages), 5–7 eyebrows per page, the same closing sequence everywhere | `PageHero.astro`, `scenes/*`, pages | Site reads as assembled from a kit; weakens trust for a company selling custom work | See the AI-made section: real artefacts, eyebrows only in heroes, one unique centrepiece per page |

### Recommendations
| # | Issue | File(s) | Why | Fix |
|---|-------|---------|-----|-----|
| 1 | Hard-coded hex values in scene components | Hub, AgentConfigScene, PermissionScene, MatrixScene, QueueConsole, book, `[slug]` | Violates the token rule; palette changes won't propagate | Move to tokens |
| 2 | Radius values are a mix of tokens and magic numbers (999px ×12, 99px ×7, 18px ×6, 12px ×6, and others) | various | Inconsistent corner language | `--radius-pill`, `--radius`, `--radius-sm` tokens only |
| 3 | Generic AI palette (gradient + glow + hex + glass) | global.css | Common to most AI agencies | Restrict the gradient to logo, primary button and one accent; introduce photography |
| 4 | Article header gradient defined inline in `[slug].astro` | `[slug].astro:99` | Duplicates the `.wash` tint | Use `.wash` |
| 5 | Dark mode not provided | – | Acceptable for a marketing site; record it as a decision | Note in DESIGN-SYSTEM.md |

### Nice-to-Haves
| # | Suggestion | Rationale |
|---|------------|-----------|
| 1 | Test an editorial headline face on one page | Differentiation from dev-tool look |
| 2 | Vary section rhythm (one full-bleed photo band per page) | Breaks the card/list cadence |

### Design System Compliance
Tokens are defined and mostly used; the design rules in CLAUDE.md are followed (single gradient H1, glow only in home hero and the documented footer exception, ≤2 card grids per page: verified, no page exceeds 2). Fragmentation is limited to hex values inside illustration components.

### Visual State Coverage
| Component/Element | Hover | Focus | Active | Disabled | Loading | Empty | Error | Dark Mode |
|---|---|---|---|---|---|---|---|---|
| Buttons (`.btn-*`) | ✓ | ✓ 3px outline | – | ✓ (form submit) | ✓ "Sending…" | n/a | n/a | n/a (no dark theme) |
| Nav links / mobile menu | ✓ | ✓ | – | n/a | n/a | n/a | n/a | n/a |
| Calculator inputs (range, number, choice) | ✓ | ✓ | ✓ checked state | n/a | n/a | ✓ zero-value notes | ✓ "no payback" note | n/a |
| Booking form | ✓ | ✓ | – | ✓ | ✓ | n/a | ✓ inline + `aria-invalid` | n/a |
| FAQ details | ✓ | ✓ | ✓ open state | n/a | n/a | n/a | n/a | n/a |
| CEO video | native | ✓ | native | n/a | poster until play | n/a | fallback link | n/a |

### Verdict Details
- Design Token Fidelity: CONCERNS (hex in scenes)
- Visual State Coverage: PASS
- Dark Mode Parity: n/a (light-only by design)
- Animation Quality: PASS (transform/opacity, reduced-motion respected)
- Visual Consistency: CONCERNS (consistent to the point of sameness)

---

## 2. UX Engineer

**Verdict**: APPROVE WITH CHANGES

### User Journey Map
1. Land on home from search or LinkedIn → understand what Moksh AI does: **OK** (answer-first hero, hub)
2. Decide whether it fits (MSP or operations) → **OK** (two routes, audience pages)
3. Look for proof (clients, results, people) → **WARN** (CEO video only; no case study, no client names, mock UIs labelled "Illustrative")
4. Estimate value → **OK** (4 calculators + scorecard, formulas shown, handoff to booking)
5. Book a call → **FAIL** (form opens the email app in production; no scheduler link)
6. Confirmation → **WARN** (success panel exists but is never reached in production)

### Critical Issues
| # | Issue | Step in Journey | Impact on User | Fix |
|---|-------|----------------|----------------|-----|
| 1 | Form falls back to `mailto:` because no endpoint is set | 5 | Visitor without a mail client can't send; those who can leave the site for their email app | Set `PUBLIC_FORM_ENDPOINT` |
| 2 | No way to pick a time | 5 | "Book a call" on 33 pages, but there is no calendar; reply "within one business day" is the only promise | Set `PUBLIC_BOOKING_URL` (Cal.com/Calendly) and show it after submit, or offer it as the primary option |

### Recommendations
| # | Issue | Impact | Fix |
|---|-------|--------|-----|
| 1 | Proof gap at step 3 | Trust stalls before booking | Case study, named people, real screenshots |
| 2 | Mobile homepage still about 12,600px | Long scroll before CTA repeats | Shorten diagram/steps/calculator on mobile, or move the CEO video above the routes |
| 3 | Same CTA wording on 33 pages | CTA becomes invisible | Page-specific CTA copy |
| 4 | Fallback status shown in error style | Visitor thinks something failed | Neutral status |

### Nice-to-Haves
| # | Suggestion | Rationale |
|---|------------|-----------|
| 1 | Persist booking-form draft in sessionStorage | Visitors who leave to check a calculator lose typing |
| 2 | Search on Insights once articles exceed ~25 | Topic chips suffice today |

### Interaction Consistency Check
Consistent: calculators share inputs, outputs, method, FAQ and handoff; FAQ accordions behave the same everywhere; Escape closes the mobile menu and returns focus. Deviation: the scorecard uses radio pills where other tools use sliders, which is appropriate for categorical answers.

### Verdict Details
- Discoverability: PASS
- Flow Completeness: CONCERNS (booking)
- Error Recovery: PASS (form validation messages are specific)
- Feedback & Status: CONCERNS (no timeout; fallback styled as error)
- Consistency: PASS

---

## 3. Frontend Engineer

**Verdict**: APPROVE WITH CHANGES

### Files Reviewed
| File | Frontend Role | Risk |
|------|--------------|------|
| `src/lib/calc.ts` | Pure formulas (tested) | Low |
| `src/lib/handoff.ts` | sessionStorage + gtag wrapper | Low |
| `src/pages/tools/*.astro`, `MiniCalc.astro` | Calculator UI scripts | Medium (not type-checked) |
| `src/pages/book.astro` | Form logic | Medium |
| `src/layouts/Base.astro` | JSON-LD, deferred Google tag | Medium |

### Critical Issues
None.

### Recommendations
| # | Issue | File(s) | Why | Fix |
|---|-------|---------|-----|-----|
| 1 | `.astro` script blocks are not type-checked (`tsc` covers `.ts` only; 0 errors there) | all `.astro` with `<script>` | 29 `as HTML…Element` casts and DOM ids are unchecked | `@astrojs/check` + `npm run check` in CI |
| 2 | JSON-LD not escaped | `Base.astro:52` | `</script>` in any content string breaks the page | Escape `<` |
| 3 | Calculator pages repeat the read-inputs/compute/write/handoff boilerplate (5 copies) | `pages/tools/*.astro` | Fixes must be made five times | Small `bindCalculator()` helper in `lib/` |
| 4 | No fetch timeout | `book.astro:158` | Hangs on a slow endpoint | `AbortController` |

### Render Path Analysis
Static HTML with server-rendered defaults; scripts run once on load and update text nodes on `input`. No framework, no hydration, no re-render cascade. The only continuous work is CSS animation (see Performance).

### Type Safety Assessment
`.ts` modules are strict and pass `tsc`. Content collections are validated by Zod at build. The gap is inline scripts in `.astro` files and the non-null DOM casts in them.

### Verdict Details
- Component Architecture: PASS
- State Management: PASS (sessionStorage only, guarded with try/catch)
- Type Safety: CONCERNS (inline scripts unchecked)
- Rendering Performance: PASS
- Bundle Impact: PASS (no framework JS; ~296 KB total home weight incl. fonts)

---

## 4. Backend Engineer

**Skipped**: fully static site; no server code, API routes, database or Rust/Tauri.

---

## 5. Structural Engineer

**Verdict**: APPROVE

### Critical Issues
None.

### Recommendations
| # | Issue | Why | Fix |
|---|-------|-----|-----|
| 1 | Slug lists duplicated in `content.config.ts` | Adding a tool or service needs 3 edits; drift breaks the build only if someone remembers | Derive from `tools.ts` and `site.config.ts` |
| 2 | Redirects in 4 files | Drift risk between hosts | Generate from one list or test parity |
| 3 | Privacy-policy contact block outside `site.config.ts` | Second source of truth for facts | Render from config |

### Nice-to-Haves
| # | Suggestion | Rationale |
|---|------------|-----------|
| 1 | Move page FAQ arrays into a `content/faqs` collection | Editable without touching page code; reusable on hubs |

### Dependency Map
```
site.config.ts ──► Header, Footer, About, Book, schema.ts, FounderVideo
lib/topics.ts ──► content.config.ts ──► insights collection ──► [slug], insights/*, PostList, RelatedReading, rss
lib/tools.ts  ──► ToolPage, tools/index, index (MiniCalc list), [slug]   (slugs ALSO hard-coded in content.config.ts ⚠)
lib/calc.ts   ──► tools/*.astro, MiniCalc, tests/calc.test.ts
lib/introVideo.ts ──► FounderVideo ──► index, about ; schema.ts (videoObject)
global.css    ──► every page
```
No cycles. Dependencies flow from config/data to components to pages.

### Boundary Crossing Analysis
| Crossing | From → To | Clean? | Notes |
|---|---|---|---|
| Build-time env | Vercel env → `site.config.ts` → book form | Yes | Only `PUBLIC_*` vars, documented |
| Content → schema | frontmatter → `schema.ts` | Yes | Zod-validated |
| Calculator → booking | sessionStorage `moksh_calc` | Yes | Guarded, documented |

### Verdict Details
- Dependency Direction: PASS
- Module Coupling: PASS
- Cohesion: PASS
- Layer Boundaries: PASS
- Change Propagation: CONCERNS (slugs, redirects)

---

## 6. Repo Maintainer

**Verdict**: APPROVE WITH CHANGES

### Critical Issues
| # | Issue | File(s) | Convention Violated | Fix |
|---|-------|---------|-------------------|-----|
| 1 | Contact details hard-coded in the privacy policy, including a conflicting US phone | `content/pages/privacy-policy.md` | "Never hard-code an email, phone or address elsewhere" (CLAUDE.md) | Render from `site.config.ts` after confirming the number |

### Recommendations
| # | Issue | Why | Fix |
|---|-------|-----|-----|
| 1 | Hex values in components | "No new hex values in components" | Tokens |
| 2 | 16 articles drafted for review are live with no draft mechanism | Content rules require human review | `draft` flag |
| 3 | Unreferenced `public/media/mick-shah-photo.png` | Dead public asset | Move out of `public/` |
| 4 | Two `CONFIRM` comments still open in `site.config.ts` | Pre-launch facts unresolved | Resolve before cutover |

### Convention Compliance Checklist
| Convention | Status | Notes |
|-----------|--------|-------|
| File placement | ✓ | components, scenes, lib, content as documented |
| Naming conventions | ✓ | PascalCase components, kebab-case content |
| Barrel exports | n/a | Astro imports by path |
| Import ordering | ✓ | consistent |
| Type imports separated | ✓ | `type Post` imports used |
| Path aliases used | – | relative imports throughout (consistent) |
| No dead code left | ⚠ | unreferenced source photo |
| Structured logging | n/a | no runtime logging |
| No lint suppressions | ✓ | none found |
| CLAUDE.md present | ✓ | up to date with recent rules |
| ≤2 card grids per page | ✓ | verified on every page |
| No two-beat headlines | ✓ | none in H1/H2 |
| Docs updated with components | ✓ | COMPONENTS.md lists FounderVideo |

### Reuse Opportunities
`.wash` instead of the inline article-header gradient; one `bindCalculator()` helper for the five calculator scripts; `site.config.ts` for privacy-policy contacts.

### Verdict Details
- File Organization: PASS
- Naming Consistency: PASS
- Import Hygiene: PASS
- Code Reuse: CONCERNS (minor)
- Lint Compliance: CONCERNS (no lint or check step exists to enforce anything)

---

## 7. Production Readiness

**Verdict**: APPROVE WITH CHANGES

### Critical Issues
| # | Issue | File(s) | Production Failure Mode | Fix |
|---|-------|---------|------------------------|-----|
| 1 | Form endpoint not configured | Vercel env, `book.astro` | Leads lost or unmeasured | Configure and test |
| 2 | Deploys are ungated | `vercel.json`, no CI | Regressions ship on push | Tests + check in build and CI |

### Recommendations
| # | Issue | Why | Fix |
|---|-------|-----|-----|
| 1 | Dependency advisories (3 critical, 3 high) | Build/dev toolchain exposure | Upgrade Astro and Vitest majors |
| 2 | No CSP | Defence in depth for the Google tag and form | Report-Only CSP first |
| 3 | No field metrics or uptime checks | Can't see problems after cutover | Vercel Analytics + Speed Insights + uptime pings |
| 4 | `/media/*` cached for a year | Replacing a file without renaming serves stale media | Already documented (versioned names); keep the rule |
| 5 | WordPress media URLs will 404 | Lost image backlinks | Map the ones with backlinks |
| 6 | Domain cutover still pending | Nothing ranks yet | Follow `docs/DEPLOYMENT.md` checklist |

### Failure Mode Analysis
| Scenario | What Fails | User Impact | Recovery | Handled? |
|---|---|---|---|---|
| Form endpoint unset | Submission | Email app opens or nothing | None | ✗ (current state) |
| Form endpoint slow/down | `fetch` | "Sending…" forever | Manual retry | ⚠ no timeout |
| sessionStorage blocked | Calculator handoff | No prefill | Form still works | ✓ |
| Google tag blocked | Analytics | None visible | – | ✓ (deferred, non-blocking) |
| Video CDN miss | First play slower | Short wait | Edge cache | ✓ (immutable caching) |
| Bad deploy | Site content | Broken page | Vercel instant rollback | ✓ manual |
| `*.vercel.app` indexed | Duplicate content | SEO | – | ✓ host-based noindex |

### Environment Checklist
| Concern | Dev | Prod | Gap? |
|---|---|---|---|
| File paths | `public/fonts` copied by script | same in build | No |
| Network | localhost preview | Vercel edge | No |
| Permissions | – | static | No |
| Config | `.env` optional | `PUBLIC_FORM_ENDPOINT` missing | **Yes** |
| Build output | `dist/` | `dist/` | No |

### Verdict Details
- E2E Flow: CONCERNS (booking)
- Error Recovery: CONCERNS (timeout)
- Data Integrity: PASS (no stored data)
- Environment Parity: CONCERNS (env var)
- Observability: CONCERNS (no field metrics, no uptime)

---

## 8. DX Engineer

**Verdict**: APPROVE WITH CHANGES

### Critical Issues
None.

### Recommendations
| # | Issue | Why | Fix |
|---|-------|-----|-----|
| 1 | Content editing requires git + Markdown | Moksh team can't publish case studies or fix copy themselves | Keystatic or Decap CMS on the existing collections |
| 2 | No `check` / `lint` script | Mistakes surface only in the browser | `astro check` script |
| 3 | `build` silently produces a site with a mailto form when the env var is missing | Easy to ship unknowingly | Fail the production build (or warn loudly) when `VERCEL_ENV=production` and `PUBLIC_FORM_ENDPOINT` is empty |
| 4 | Template regeneration needs python-docx (not in package.json) | Hidden prerequisite | Already documented in the script header; mention in README |

### Error Message Audit
| Error Scenario | Current Message | What the User Needs | Suggested Message |
|---|---|---|---|
| Required field empty | "Please add your name." (focus moved) | ✓ | – |
| Bad email | "Please check the email address. It should look like name@company.com." | ✓ | – |
| No team type | "Please choose what kind of team you are." | ✓ | – |
| Network/endpoint failure | "Something went wrong sending the form. Please try again, or email us at info@…" | ✓, but never shown on a hang | Add timeout so this appears |
| No endpoint configured | "Your email app should open…" (error style) | A status, not an error | Neutral style |
| Calculator: running cost > value | "Running cost is higher than the expected value, so no build budget pays back…" | ✓ | – |

### Developer Journey
First use: `npm install && npm run dev` works; fonts copied automatically; README and five docs are thorough. Daily use: editing Markdown is fine for developers, a blocker for non-developers. Power use: tests cover formulas only; no check, lint or CI to lean on.

### Verdict Details
- Error Quality: PASS
- Defaults & Config: CONCERNS (silent mailto fallback)
- Keyboard Experience: PASS
- Discoverability: PASS (docs)
- Workflow Integration: CONCERNS (no CI, no CMS)

---

## 9. Performance Engineer

**Verdict**: APPROVE

### Critical Issues
None.

### Recommendations
| # | Issue | File(s) | Why | Fix |
|---|-------|---------|-----|-----|
| 1 | Mobile main-thread work 2.1s | Hub, HexField, footer, console | Infinite animations and backdrop blur keep the compositor busy on low-end phones | Pause off-screen animations; one blur surface max |
| 2 | Lab-only metrics; home LCP 2.4–2.9s across runs | – | Field data may differ, especially India/US mobile | Speed Insights after cutover |
| 3 | 288 KB unreferenced PNG under `public/` | `public/media` | Served if linked or crawled | Move out |

### Resource Budget
| Resource | Current | Concern? |
|---|---|---|
| Home page weight (mobile) | 296 KB incl. fonts | No |
| JS per page | small modules only; deferred Google tag | No |
| CLS | 0 | No |
| TBT (lab) | 0 ms | No |
| Main-thread work (lab, mobile) | 2.1 s | Minor |
| CEO video | 0 bytes until on screen or intent; 3.6 MB on play; immutable cache | No |

### Hot Path Analysis
No per-keystroke work except calculator recomputation (pure arithmetic, negligible). The only continuous cost is CSS animation and backdrop-filter painting.

### Verdict Details
- Memory Management: PASS
- Network Efficiency: PASS
- I/O Patterns: PASS
- Startup Impact: PASS
- Long-Session Stability: PASS

---

## 10. Accessibility Engineer

**Verdict**: APPROVE

### Critical Issues
None (axe-core: 0 violations across 19 page types at 390px and 1440px; Lighthouse accessibility 100).

### Recommendations
| # | Issue | WCAG Criterion | Fix |
|---|-------|---------------|-----|
| 1 | Fallback status announced as an alert in error styling | 4.1.3 Status Messages | `role="status"`, neutral style |
| 2 | Illustrative mock UIs (queue rows, configs) are read by screen readers as if they were real data | 1.3.1 Info and Relationships | Keep the "Illustrative" figure label; consider `aria-hidden` on inner fake rows with a one-sentence text alternative |
| 3 | CEO video relies on burned-in (open) captions | 1.2.2 Captions | Open captions + transcript pass; a `<track>` would let users resize/restyle captions |

### Keyboard Navigation Walkthrough
| Step | Action | Expected Focus | Expected Announcement | Handled? |
|---|---|---|---|---|
| 1 | Tab from page load | "Skip to content" link | "Skip to content, link" | ✓ |
| 2 | Tab through header | Logo, nav links, Book a call | Link names | ✓ (3px visible outline) |
| 3 | Mobile: open menu, press Escape | Menu closes, focus returns to button | "Menu, collapsed" | ✓ |
| 4 | Calculator sliders | Range inputs | Label + value; result region `aria-live` | ✓ |
| 5 | Scorecard | Radio pills in fieldsets | Question legend + option | ✓ |
| 6 | Booking form error | Focus moves to invalid field | Error text via `role="alert"` | ✓ |
| 7 | CEO video | Native controls; transcript `<details>` | "Read the transcript, collapsed" | ✓ |

### ARIA Checklist
| Element | Role | Label | States | Keyboard | Notes |
|---|---|---|---|---|---|
| Mobile menu button | button | ✓ | `aria-expanded`, `aria-controls` | Enter/Space/Escape | ✓ |
| FAQ | details/summary | question text | open | Enter | ✓ |
| Calculator output | region | ✓ | `aria-live="polite"` | – | ✓ |
| Prose tables | region | "Table N (scrolls sideways)" | focusable | Arrow scroll | ✓ |
| Footer glass panel | – | – | – | – | reduced-transparency fallback ✓ |

### Verdict Details
- Screen Reader Compatibility: PASS
- Keyboard Navigation: PASS
- Focus Management: PASS
- Color Contrast: PASS (footer measured 4.71:1 at the brightest point)
- Motion Sensitivity: PASS (`prefers-reduced-motion` respected in global and component CSS)
