# Content and SEO

## Where content lives

| Content | File |
| --- | --- |
| Company facts, nav, services list, Moksh Group companies | `src/site.config.ts` |
| Service page copy and FAQs | `src/lib/serviceDetails.ts` |
| Page copy | the page's `.astro` file in `src/pages/` |
| Articles | `src/content/insights/<slug>.md` |
| Privacy policy | `src/content/pages/privacy-policy.md` |
| Calculator names and descriptions | `src/lib/tools.ts` |

### Article frontmatter

```yaml
---
title: "How AI agents triage MSP tickets"
description: "One or two sentences for search results (max 170 characters, enforced)."
summary: "The direct answer to the article's question, shown as 'The short answer'."
published: 2026-11-20
updated: 2026-11-20
audience: msp                 # msp | operations | general
topic: msp-automation         # msp-automation | strategy-and-roi | security-and-governance | operations
services: [custom-ai-development]   # service slugs this article supports
tools: [msp-ticket-roi]             # calculator slugs this article uses
takeaways:                          # 3-4 bullets shown in a "Key takeaways" box
  - "..."
faqs:                               # shown on the page and emitted as FAQPage schema
  - q: "..."
    a: "..."
featured: false                     # true pins it as the featured article
---
```

The file name becomes the URL (`/how-ai-agents-triage-msp-tickets/`). The article is added to `/insights/`, its topic hub, the RSS feed and the sitemap, and gets `BlogPosting`, `BreadcrumbList` and (with `faqs`) `FAQPage` schema automatically.

## Internal linking

Links are generated from the frontmatter, so a new article is linked from the right places without editing any page:

| Where | What links appear | Driven by |
|---|---|---|
| Article page | "Put this into practice" (services + calculators), "Related reading" (3 articles, same topic first), topic breadcrumb, sidebar calculator button | `services`, `tools`, `topic`, `audience` |
| Service pages | "Related guides" | `services` |
| `/msp/`, `/operations/` | "Guides for MSPs" / "Guides for operations teams" | `audience` (`general` appears on both) |
| Calculator pages | "Guides that use this calculator" | `tools` |
| `/insights/<topic>/` | All articles in the topic, plus related services and calculators | `topic` |
| Footer | All topic hubs | `src/lib/topics.ts` |
| Home, `/insights/` | Featured article + latest | `featured`, `published` |

Also link by hand inside the body: each article should link to at least two other pages (a service, a calculator or another guide) where the text naturally refers to them. Use root-relative URLs such as `/tools/msp-ticket-roi/`.

## Articles to review

These articles were drafted for the relaunch and must be read and fact-checked by someone at Moksh AI before the site moves to mokshai.net:

- `how-to-automate-tier-1-tickets-with-an-ai-agent.md`
- `ai-agent-pilot-metrics.md`
- `custom-ai-agents-vs-automation-platforms-vs-built-in-ai.md`
- `ai-agent-security-checklist.md`
- `automating-quote-preparation-for-fabrication-shops.md`
- `how-to-calculate-ai-agent-roi.md`
- `what-is-shadow-ai.md` (cites IBM Cost of a Data Breach 2025 and the 2023 Samsung case)
- `ai-governance-framework-small-business.md` (cites NIST AI RMF, ISO/IEC 42001, EU AI Act amendment of 2026)
- `ai-acceptable-use-policy-template.md` (template text must match `public/templates/ai-acceptable-use-policy-template.docx`)
- `ai-agents-for-business-examples.md`
- `ai-readiness-assessment-checklist.md` (cites Microsoft's Copilot privacy documentation)
- `ai-document-processing-invoices-purchase-orders.md`
- `human-in-the-loop-ai-approval-design.md` (cites EU AI Act Article 14)
- `how-much-does-an-ai-agent-cost.md`
- `ai-for-small-manufacturers.md`
- `model-context-protocol-for-msps.md` (cites Anthropic's donation of MCP to the Agentic AI Foundation)

They contain no client claims. The only statistics are cited to a public source, linked in the text; re-check those sources before launch. The ROI example is labelled hypothetical. Check that the practices they describe match how Moksh AI actually delivers, and add real examples where you have them.

## Writing rules

1. **Answer first.** The first paragraph answers the page's main question directly. Answer engines extract it.
2. **Be specific.** Name systems (HaloPSA, NinjaOne, Microsoft 365), give numbers with their source, say what you do not do.
3. **No invented proof.** No made-up clients, testimonials, statistics or certifications. Every figure needs a source the company can show. Calculator defaults stay labelled "Example inputs".
4. **Human review.** A person fact-checks anything drafted with AI before it is published.
5. **Banned phrasing:** "unlock the potential", "seamless", "elevate", "empower", "cutting-edge", "in today's competitive market", "game-changer", "delve".
6. **No years in evergreen titles or descriptions.** They date the page.

## Structured data (JSON-LD)

Built in `src/lib/schema.ts`. Rules:

- Schema must match visible content. Only add `FAQPage` where the FAQ is on the page.
- One organisation entity (`@id: https://mokshai.net/#organization`), referenced by every other node.
- When real people are added, give articles a `Person` author with a bio page and `sameAs` LinkedIn link.

| Page type | Schema |
| --- | --- |
| Every page | `Organization` + `ProfessionalService`, `WebSite` |
| Service pages, `/msp/`, `/operations/` | `Service`, `BreadcrumbList`, `FAQPage` |
| Calculators | `WebApplication`, `BreadcrumbList`, `FAQPage` |
| Articles | `BlogPosting`, `BreadcrumbList` |
| Home, pricing | `FAQPage` |
| About / Book | `AboutPage` / `ContactPage` |

## AI-search readiness (AEO / GEO)

What the site already does:

- Consistent company facts everywhere (name, legal entity, CIN, addresses, email).
- Answer-first service pages and articles, real `<table>` elements, visible FAQs.
- `robots.txt` welcomes AI crawlers; `llms.txt` lists key pages.
- Fast, static, crawlable HTML with no JavaScript needed to read content.

What moves AI citations most from here (needs company input):

1. Original data, for example anonymised tier-1 ticket mix and resolution rates across pilots.
2. Case studies with numbers.
3. Named authors with real expertise.
4. Third-party presence: founder posts on LinkedIn, MSP podcasts, Clutch reviews, helpful answers in MSP communities.
5. Comparison pages written fairly (for example custom agents vs. MSP automation platforms vs. PSA built-in AI).

Avoid publishing many near-duplicate pages aimed at query variations. Google treats this as scaled content abuse however the pages were written.

## Search Console and measurement

After launch:

1. Verify `mokshai.net` in Google Search Console and Bing Webmaster Tools; submit `https://mokshai.net/sitemap-index.xml`.
2. Request indexing for `/`, `/msp/`, `/operations/` and the four calculators.
3. Track a fixed set of 30–50 buyer prompts monthly across ChatGPT, Perplexity, Google AI Mode and Gemini, and record whether Moksh AI is mentioned or cited.

## Article page layout and authors

- The article header (breadcrumb, title, byline) sits in the same two-column grid as the body, so the title and the body text share one left edge.
- The frontmatter `summary` is not shown on the article page; the first paragraph of the body is the answer (answer-first rule), and showing both repeated it. `summary` is still used on listing cards, the featured panels and topic hubs.
- Optional named author, which also switches the BlogPosting schema author to a `Person`:

```yaml
author:
  name: "Full Name"
  role: "Head of AI delivery"
  url: "https://www.linkedin.com/in/…"   # optional
  photo: "/people/full-name.jpg"          # optional, 72×72 or larger, under public/
```

- Compact article lists no longer show dates. When articles are released, spread their `published` dates to the real release days (for example two a week after review), rather than giving every article the launch date.

## Keyword map

Target keywords per article, from US search volume and keyword difficulty (OpenSEO / DataForSEO, November 2026). Volumes under 100 are rough. One primary keyword per page; do not write a second article for a keyword already listed here.

| Article | Primary keyword (monthly US volume, difficulty) | Secondary |
| --- | --- | --- |
| `what-is-shadow-ai` | shadow ai (3,600, 14) | what is shadow ai (1,900), shadow ai risks |
| `ai-governance-framework-small-business` | ai governance framework (2,900, 10) | ai governance policy, nist ai governance framework |
| `ai-acceptable-use-policy-template` | ai policy template (320, 9) | ai usage policy, ai acceptable use policy (260, 0) |
| `ai-agents-for-business-examples` | ai agents for business (3,600, 14) | ai agent examples (1,600), ai agent use cases |
| `ai-readiness-assessment-checklist` | ai readiness assessment (720, 13) | copilot readiness assessment, ai readiness checklist |
| `ai-document-processing-invoices-purchase-orders` | ai document processing (2,400, 29) | accounts payable automation, invoice processing automation |
| `human-in-the-loop-ai-approval-design` | human in the loop ai (1,000, 25) | |
| `how-much-does-an-ai-agent-cost` | ai agent cost (110, 9) | how much does an ai agent cost, ai implementation cost |
| `ai-for-small-manufacturers` | ai for manufacturing (2,900, 30) | manufacturing quoting software |
| `model-context-protocol-for-msps` | mcp for msps (long tail) | model context protocol |
| `ai-agents-for-msps-…` | ai for msp (390, 5) | ai for msps, msp ai, ai msp |
| `how-to-automate-tier-1-tickets-…` | ai help desk (480, 16) | ai service desk, ai ticketing system, tier 1 support |
| `ai-agent-security-checklist` | ai agent security (480, 21) | ai agent governance |
| `custom-ai-agents-vs-…` | ai agent vs chatbot (320, 12) | ai agents vs automation, rpa vs ai agents |
| `ai-agent-pilot-metrics` | ai proof of concept (170, 0) | |
| `automating-quote-preparation-…` | quote automation (170, 0) | manufacturing quoting software |
| `how-to-calculate-ai-agent-roi` | ai agent roi | ai roi calculator |
| `/tools/ai-readiness-scorecard/` | ai readiness assessment tool | |

Checked and deliberately not targeted: "ai quoting software" (the results suggest most searchers want quotation generators), "copilot vs chatgpt" (consumer traffic), "mcp server" (developers looking for the tool).
