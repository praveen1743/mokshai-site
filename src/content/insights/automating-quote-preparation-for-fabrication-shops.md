---
title: "Automating Quote Preparation in Fabrication and Manufacturing Shops"
description: "How an AI agent can prepare quotes from incoming RFQs and drawings in fabrication shops: what it reads, what it drafts, what estimators keep, and how to start."
published: 2026-11-05
updated: 2026-11-05
audience: operations
topic: operations
summary: "An AI agent can read an incoming request for quote and its attachments, match the customer and similar past jobs, extract part, quantity, material and due date, flag what is missing, and fill a draft in your quoting template. The estimator still sets the price, checks the technical judgement and sends the quote."
services: [custom-ai-development, ai-consulting]
tools: [back-office-hours, ai-budget-planner]
takeaways:
  - "Automate the preparation of a quote, not the pricing decision."
  - "The agent's value comes from reading the request, pulling history and spotting missing information before an estimator opens it."
  - "Measure turnaround time as well as hours saved; faster quotes often matter more than the labour."
  - "Start with repeat customers and repeat part types, where past jobs give the agent the most context."
faqs:
  - q: "Can an AI agent read engineering drawings?"
    a: "It can extract text-based information reliably, such as title blocks, part numbers, revision, material callouts and notes. Interpreting geometry for manufacturability is a job for your estimators and engineers. Treat anything the agent extracts from a drawing as a draft to be checked."
  - q: "Will it work with our ERP or estimating software?"
    a: "It works through whatever your systems support: an API, a database export, or creating a draft in a shared template. On the first call, look at your quoting flow and systems to see where an agent can connect and where a person still needs to step in."
  - q: "Does the agent set prices?"
    a: "No. It can pull the prices you charged on similar past jobs and current material costs into the draft so the estimator has them in front of them, but the price is the estimator's decision."
---

An AI agent can take most of the preparation out of quoting in a fabrication or manufacturing shop. It reads the incoming request and attachments, matches the customer and similar past jobs, pulls out part, quantity, material and due date, flags what is missing, and fills a draft in your quoting template. Your estimator then checks the technical judgement, sets the price and sends it. The agent prepares the quote; it does not decide it.

If your team spends the first part of every quote opening emails, searching old jobs and retyping details into a spreadsheet or ERP, that is the part an agent handles well.

## Where quoting time goes

Ask an estimator to describe the last ten quotes. The steps usually look like this:

| Step | Who does it today | Can an agent prepare it? |
|---|---|---|
| Read the email and open attachments | Estimator | Yes |
| Identify the customer and their history | Estimator | Yes |
| Find similar past jobs and what was charged | Estimator | Yes |
| Extract part, revision, quantity, material, finish, due date | Estimator | Yes, from text and title blocks |
| Spot missing or conflicting information | Estimator | Yes, and draft the question to the customer |
| Judge manufacturability and routing | Estimator or engineer | No |
| Set the price and lead time | Estimator | No |
| Send the quote and log it | Estimator or coordinator | Partly: drafting and logging |

The first five rows are preparation. On many quotes they take as long as the judgement does, and they are the rows an agent can take on.

## What the agent does, step by step

1. **Reads the request.** It watches the quote inbox or portal, opens the email and attachments (PDF drawings, spreadsheets, purchase requisitions) and identifies it as a quote request.
2. **Matches the customer.** It finds the customer record and recent jobs, so the estimator sees the relationship at a glance.
3. **Pulls similar jobs.** It searches past quotes and jobs for the same part number, a similar description or the same material, and attaches what was quoted and what was actually produced.
4. **Extracts the details.** Part number, revision, quantity, material, finish, tolerances called out in notes, delivery address and requested date go into the fields of your template.
5. **Flags gaps.** If the finish is not specified, the revision on the drawing does not match the email, or the requested date is shorter than your usual lead time, it says so and drafts a question to the customer.
6. **Prepares the draft.** The estimator opens a quote that is already filled in, with sources linked, and spends their time on the judgement.

## What stays with the estimator

- Manufacturability, routing and which machines or subcontractors are involved.
- Price, margin and lead time.
- Anything unusual about the customer relationship.
- Sending the quote.

Keeping these with a person is the reason the approach works. The agent removes the clerical part of the job; it does not ask anyone to trust it with a commercial decision.

## How to start

**Pick a slice.** Repeat customers and repeat part types give the agent the most history to work from. Leave one-off, complex assemblies for later.

**Measure the baseline.** For two normal weeks, record quotes received, time from request to quote sent, and estimator time per quote. Our [back-office time savings calculator](/tools/back-office-hours/) turns those numbers into hours per week and the extra quoting capacity the same team would have.

**Agree the template and the gaps.** List the fields every quote needs and the conditions that should always be flagged. This list becomes the agent's specification.

**Run supervised.** For the first weeks, estimators review every draft and correct it. Track how often a draft needed no corrections and how much faster quotes went out. [What a 30-day AI agent pilot should measure](/ai-agent-pilot-metrics/) has the full scorecard.

**Then extend.** Once quoting runs well, the same building blocks (inbox reading, customer matching, document extraction) carry over to order entry, drawing logs and status updates.

## Measure turnaround, not only hours

Hours saved are easy to count. Turnaround time is often worth more. A shop that replies to a request for quote in a day instead of a week wins work it never knew it was losing. Track the median time from request to quote sent before and after, alongside estimator hours.

## Common pitfalls

- **Automating a quoting process nobody agrees on.** If two estimators fill the template differently, settle the template first. Our older piece, [Why automation isn't about robots](/why-automation-isnt-about-robots-its-about-profit-margins/), covers why redesigning the process comes before automating it.
- **Trusting extracted numbers without a check.** Anything the agent reads from a drawing is a draft. Show the source next to every extracted value so checking takes seconds.
- **Ignoring the customer's side.** If many requests arrive incomplete, the drafted questions to customers can save more time than the extraction.

Moksh Group's sister companies work with drawings and takeoffs every day through [Moksh CAD](https://www.mokshcad.com/) and [Moksh Estimating](https://mokshestimating.com/). To scope an agent for your quoting flow, start with [AI strategy and consulting](/services/ai-consulting/) or go straight to [custom AI agent development](/services/custom-ai-development/).
