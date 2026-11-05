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
description: "One or two sentences for search results (≤ 160 characters)."
summary: "The direct answer to the article's question, shown at the top of the page."
published: 2026-11-20
updated: 2026-11-20
audience: msp            # msp | operations | general
---
```

The file name becomes the URL (`/how-ai-agents-triage-msp-tickets/`). The article is added to `/insights/`, the RSS feed, the sitemap and gets `BlogPosting` schema automatically.

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
