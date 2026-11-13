# Site plan: Moksh AI, global and open to all

**Founder decision (13 Nov 2026):** Moksh AI launches globally and takes work from anyone looking for AI services, not only manufacturing or MSPs. This plan carries that out. The board's warning still applies to *how* it is said: being **open to** everyone is fine; a homepage that **speaks to** no one in particular is the risk. Everything below is built to keep the door open while giving each visitor a specific page within one click.

Nothing here is built yet.

## Phase 0: fix the live site (this week)

The live mokshai.net shows another business's content: $50/$80/$150 "financial management" plans, an "Advisora Template" testimonial, finance stats (95%, 10+, $10m, 50m), and /pricing/ returns a 404. A global launch sends more strangers to that page. Deploy the repo build to production first.

## Phase 1: navigation for a general audience

A visitor from anywhere arrives with a *task* ("answer customer emails", "read these invoices"), not an industry label. Lindy organises its menu by job role for this reason; Simform and Hatz add industry or use-case menus. Use both, with the task column first.

```
We support ▾                                   Services ▾   Calculators   Insights   Pricing   About   [Book a call]
  BY TASK                       BY INDUSTRY
  Customer support & inbox      Managed service providers   (/msp/)
  Documents & data entry        Manufacturing & fabrication (new, CEO video + /operations/ content)
  Sales & lead follow-up        Operations & back office    (/operations/)
  Internal knowledge & search   + more as each gets a page
  AI adoption & governance
  ─────────────
  Not sure where AI fits? Take the AI readiness scorecard →
```

- Task pages are cross-industry, so one page serves a dentist in Dubai and an accountant in Ohio. Each needs: the problem, what the agent does, what a person still checks, one calculator or demo, one booking CTA.
- Industry entries go live only with a page behind them (demo, calculator or two articles). Next candidates follow the group's existing know-how: construction estimating, accounting practices, recruiting.
- Build: the header needs a dropdown component (none exists). It must work by keyboard and touch, not hover alone. Add it to `docs/COMPONENTS.md`; nav lives in `src/site.config.ts`.

## Phase 2: homepage

- **H1 (draft):** "AI agents and automation for any business, built into the tools you already use and checked by a person." One idea, no contrast. `.grad-text` on one phrase only.
- **Sub-line names the global part plainly:** "We work with teams worldwide, contracting from the US with a delivery team in India." No vague "global leader" wording.
- **Hero systems list:** categories, not MSP brands: email, documents, accounting, CRM, ERP, ticketing, Microsoft 365, Google Workspace.
- **Hub illustration:** generic sources, keeping the human approver node.
- **Sections:** hero → "Pick the work you want off your plate" (the five task tiles, linking into We support) → CEO video ("AI plus human") → how an engagement runs → industries strip → readiness scorecard teaser → FAQ → CtaBand.
- `SplitTable` stays on the homepage and audience pages only.
- `<title>`, meta description and `site.description` (JSON-LD) drop "for MSPs and operations-heavy businesses".

## Phase 3: what going global needs (often missed)

1. **Prices in one stated currency.** Publish discovery "from $X USD". Visitors outside the US will otherwise assume a quote request means "expensive". Set X with `/founder-pricing`.
2. **Time zones as a selling point.** US + India coverage spans most business hours. State the hours that are actually staffed; do not claim 24/7 unless it is true.
3. **Data and privacy for non-US buyers.** EU/UK buyers will ask about GDPR, data location and which AI models see their data. Add a short section to `/security/` and the privacy policy; only state what the company actually does.
4. **Booking form:** add country and "what do you want help with" (the five tasks + Other). This is also how you measure which audiences arrive.
5. **Schema:** set `areaServed` to worldwide on the Organization node in `src/lib/schema.ts`.
6. **English only for now.** Translate later, if one region shows real demand; hreflang without translated pages is pointless.
7. **Remove "U.S.-based" wording** carried over from the old site.

## Phase 4: proof, which matters more when you go general

A generalist competes with Morningside, RaftLabs, Leanware and Fiverr freelancers, all of whom show proof. Ranked by payoff ÷ effort:

1. **One real case study** of an agent the company has run, anonymised if needed ("a [size] [type] business in [region]") with a measured before/after. The CMS collection exists (`src/content/case-studies/`).
2. **A demo library:** two-minute recordings of agents that exist, one per task tile. The CEO video already promises demos.
3. **A pilot guarantee** (defined result by a defined date, or the fee is credited forward). None of the competitors reviewed offers one. Needs business sign-off.
4. **A fixed-price "AI setup" session for small teams anywhere:** set up and govern ChatGPT/Copilot/Claude, an acceptable-use policy, a shadow-AI check and two automations. It is the most direct product for "anyone who needs AI help", works remotely across time zones, and is backed by existing articles.
5. **Group referrals:** links from the sister-company sites into the matching pages, with UTM tags.
6. **Reviews on Clutch/G2/Google** from real clients once work is delivered; these are what overseas buyers check first.

## Phase 5: measure

Tag every booking by country, task and source. After a set period, put more effort into the tasks and regions that both arrive and convert. Threshold to be set with `/founder-cfo`.

## Open questions for the founder

- Which agents can be demoed tomorrow? They decide which task pages launch first.
- Is there any client work (any industry) that can become the first case study?
- What discovery price, in USD, will the business accept?
- Which hours are staffed, in which time zones?
- Who handles an MSP lead: Moksh AI or Moksh Tech?
