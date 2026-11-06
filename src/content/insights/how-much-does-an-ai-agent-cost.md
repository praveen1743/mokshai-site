---
title: "How Much Does an AI Agent Cost? Build, Running and Hidden Costs"
description: "What an AI agent costs: discovery, build, running and support, the hidden costs most quotes leave out, the common pricing models and how to set a budget ceiling."
published: 2026-11-06
updated: 2026-11-06
audience: general
topic: strategy-and-roi
summary: "An AI agent's cost has four parts: discovery to define the workflow, a one-time build covering integrations, configuration, testing and approval screens, a monthly running cost made up of model usage, hosting and monitoring, and ongoing support as your systems and the models change. The build is usually the largest single figure, but over a few years the running and support costs can match it. Set the budget backwards from the value the agent returns, and compare every quote on a twelve-month total."
services: [ai-consulting, ai-cost-optimization, custom-ai-development]
tools: [ai-budget-planner, msp-ticket-roi, back-office-hours]
takeaways:
  - "Cost has four parts: discovery, build, running and support."
  - "Integration work with your own systems is the biggest driver of build cost, more than the AI itself."
  - "Running cost follows usage: items per month, how much each item asks of the model, and the provider's price."
  - "Work out the most the agent can cost from the value it returns, before you see a quote."
faqs:
  - q: "How much does it cost to build an AI agent?"
    a: "It depends mostly on how many systems the agent connects to, how clean their APIs are, and how many types of work it handles. A narrow agent on one well-documented system costs far less than one that spans email, files and an older ERP. Ask for a fixed-scope quote for a pilot rather than an hourly estimate for the whole thing."
  - q: "What does an AI agent cost to run each month?"
    a: "Model usage (charged by the provider per amount of text processed), hosting, monitoring and any platform licences. Model usage scales with volume, so estimate it from your monthly item count and test it during the pilot."
  - q: "Is a per-seat AI tool cheaper than a custom agent?"
    a: "For light, broad use across many people, often yes. For a narrow, high-volume workflow, per-seat pricing can cost more than a custom agent whose running cost follows usage. Compare both on a twelve-month total."
  - q: "What is outcome-based or per-resolution pricing?"
    a: "Some vendors charge per completed outcome, such as each ticket resolved without a person. It aligns cost with value but can become expensive at high volume, and depends on how the vendor defines a resolution. Read that definition carefully."
---

An AI agent's cost has four parts:

1. **Discovery**: defining the workflow, the rules, the systems and the success measure.
2. **Build**: integrations, configuration and prompts, testing, and the approval screens people use.
3. **Running**: model usage, hosting, monitoring and any platform licences, every month.
4. **Support**: keeping it working as your systems, processes and the AI models change.

The build is usually the largest single figure, but over a few years the running and support costs can match it. That is why quotes should be compared on a twelve-month total, and why the budget should be set from the value the agent returns, before you see a price. Our [AI project budget planner](/tools/ai-budget-planner/) does that calculation.

## 1. Discovery

Discovery maps the workflow as it really runs: volumes, time per item, the rules people follow, the exceptions, and the systems involved. Its output is a ranked list of what to automate, a business case and a pilot brief. It is the cheapest phase and the one that prevents the most expensive mistakes. A provider who wants to skip it is pricing a guess.

## 2. Build

What drives the build cost, roughly from largest to smallest:

| Driver | Why it costs |
|---|---|
| Integrations | Each system needs its own connection, account and error handling. Older systems without good APIs take longest. |
| Number of work types | An agent that handles three request types needs rules, tests and approval paths for each. |
| Input variety | Free-text emails, PDFs and drawings need more testing than structured forms. |
| Approval and audit design | Screens for review, logs of every decision, and a switch-off route. |
| Testing against real data | Building a test set from your history and measuring accuracy before go-live. |

The AI model is rarely the main cost. Connecting it safely to your systems is.

## 3. Running cost

Running cost has a usage part and a fixed part:

| Part | How to estimate it |
|---|---|
| Model usage | Items per month × model usage per item × provider price. Providers charge by the amount of text processed (tokens); check the current price list for the model used. |
| Hosting and storage | Usually a modest fixed monthly amount for the agent's runtime, queue and logs. |
| Monitoring | Alerts, accuracy dashboards and log retention. |
| Platform licences | If the agent runs on a commercial automation or agent platform, its licence. |

Model usage per item varies a lot: a short ticket is cheap; a long contract or a multi-page drawing with several lookups costs more. Measure it on real items during the pilot rather than relying on an estimate. Model prices also change, often downwards, so revisit the figure every few months.

## 4. Support

Systems change their APIs, your processes change, and AI providers retire models. Budget for:

- Monitoring accuracy and fixing drift.
- Updating rules when your process changes.
- Moving to newer models when older ones are retired.
- A monthly review of cost and accuracy.

## Hidden costs most quotes leave out

- **Your team's time.** Workflow owners need to define rules, review results and approve changes, especially in the first months.
- **Data clean-up.** Messy categories, duplicate records or overshared files often need fixing first. The [AI readiness scorecard](/tools/ai-readiness-scorecard/) flags where.
- **Change and training.** People need to know how to work with the agent and its approval screens.
- **Overlapping tools.** You may already pay for AI features that do part of the job. Run the [AI subscription audit](/tools/ai-spend-audit/) before you buy anything new.
- **Lock-in.** If you stop paying, what do you keep? Configuration, prompts and integrations should be handed over.

## Common pricing models

| Model | How it works | Watch for |
|---|---|---|
| Fixed-scope project plus monthly run | Agreed price for a defined build, then a monthly fee for running and support | Clear scope and change process |
| Per seat | Monthly fee per user | Cost grows with headcount, not with value |
| Per outcome or per resolution | Fee per item completed | The definition of "resolved", and cost at high volume |
| Time and materials | Billed by the hour or day | No ceiling unless you set one |

We quote engagements as a fixed scope: discovery at a fixed fee, the pilot at a fixed scope and price, and scale and run monthly. Our [pricing page](/pricing/) explains how.

## How to set the budget

1. Estimate the monthly value from your own data with the [MSP ticket automation ROI](/tools/msp-ticket-roi/) or [back-office time savings](/tools/back-office-hours/) calculator.
2. Estimate the monthly running cost.
3. Choose a payback target.
4. Put all three into the [AI project budget planner](/tools/ai-budget-planner/) to get the investment ceiling.
5. Compare quotes against that ceiling on a twelve-month total.

For the full method behind those numbers, see [how to calculate the ROI of an AI agent](/how-to-calculate-ai-agent-roi/). If you are already paying for AI and suspect waste, our [AI cost optimisation](/services/ai-cost-optimization/) review is a good place to start.
