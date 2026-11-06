---
title: "AI Agent ROI: How to Calculate It, Step by Step"
description: "A step-by-step method to calculate AI agent ROI: hours returned, labour value, running cost, build cost, payback period and the effects that are hard to price."
published: 2026-11-05
updated: 2026-11-06
audience: general
topic: strategy-and-roi
summary: "Multiply the items the agent handles by the minutes it saves per item to get hours returned, value those hours at the loaded cost of the people who did the work, subtract the agent's monthly running cost, and divide the one-time build cost by that net monthly value to get the payback period. Use your own baseline numbers, not a vendor's averages."
services: [ai-consulting, ai-cost-optimization]
tools: [msp-ticket-roi, back-office-hours, ai-budget-planner, ai-spend-audit]
takeaways:
  - "Hours returned = items handled by the agent × minutes saved per item ÷ 60."
  - "Net monthly value = hours returned × loaded hourly cost − running cost."
  - "Payback period = one-time build cost ÷ net monthly value."
  - "Use conservative inputs from your own systems, then confirm them in a supervised pilot."
faqs:
  - q: "What is a loaded hourly cost?"
    a: "Salary or contractor rate plus benefits, payroll taxes, tools and a share of management overhead, divided by paid hours. If you only know the base rate, multiplying it by 1.25 to 1.4 is a common rough estimate; your finance team can give a better number."
  - q: "Should the ROI assume we reduce headcount?"
    a: "Usually not. Most teams use returned hours to absorb growth without hiring, move people to higher-value work or improve response times. Value the hours at loaded cost to compare options, and be explicit about how the time will actually be used."
  - q: "What payback period is acceptable?"
    a: "That is a business decision, often tied to how you budget other tooling. Many teams look for payback within a year on a first project. Decide your target before you see a quote, then use it to set a budget ceiling."
---

To calculate the ROI of an AI agent, start with the work it will take on. Multiply the items it handles each month by the minutes it saves on each to get hours returned. Value those hours at the loaded cost of the people who did the work, and subtract the agent's running cost to get net monthly value. Divide the one-time build cost by the net monthly value to get the payback period. Every input should come from your own systems.

This guide walks through each input, shows a worked example with clearly hypothetical numbers, and covers the effects that do not fit neatly into the formula.

## The formula

| Step | Formula |
|---|---|
| Items handled per month | items in the workflow × share the agent handles |
| Hours returned per month | items handled × minutes saved per item ÷ 60 |
| Labour value per month | hours returned × loaded hourly cost |
| Net value per month | labour value − running cost per month |
| Payback period (months) | one-time build cost ÷ net value per month |
| Net after twelve months | net value × 12 − build cost |

All four of our calculators use these formulas and show them on the page: [MSP ticket automation ROI](/tools/msp-ticket-roi/), [back-office time savings](/tools/back-office-hours/), [AI subscription audit](/tools/ai-spend-audit/) and [AI project budget planner](/tools/ai-budget-planner/).

## The inputs, and where to find them

**Items in the workflow.** Monthly volume for the one workflow in scope, from your PSA, ERP or inbox reports. Use a normal month, not a peak.

**Share the agent handles.** The share of those items the agent resolves, or prepares so fully that a person only approves. This is the most uncertain input. Start low, and treat the pilot as the way to find the real number.

**Minutes saved per item.** Current handling time minus the time a person still spends reviewing the agent's work. If handling time is not tracked, time a sample of items for a week.

**Loaded hourly cost.** Pay plus benefits, taxes, tools and overhead, divided by paid hours. Ask finance for the figure they use.

**Running cost.** Model usage, hosting, monitoring and any licences, per month. Ask the builder for an estimate at your volume, and ask how it changes if volume doubles.

**Build cost.** The one-time cost of discovery, build, integration and the supervised pilot.

## A worked example

The numbers below are **hypothetical**, chosen only to show the arithmetic.

An MSP receives 1,500 tickets a month. 45% are tier-1. In the pilot, the agent handles 35% of tier-1 tickets. Each saves 15 minutes of technician time. The loaded cost is $42 an hour. Running cost is $700 a month and the build costs $15,000.

| Step | Calculation | Result |
|---|---|---|
| Items handled | 1,500 × 45% × 35% | 236 tickets |
| Hours returned | 236 × 15 ÷ 60 | 59 hours |
| Labour value | 59 × $42 | $2,481 |
| Net value | $2,481 − $700 | $1,781 a month |
| Payback | $15,000 ÷ $1,781 | about 8.4 months |
| Net after twelve months | $1,781 × 12 − $15,000 | about $6,370 |

You can change every one of these inputs in the [MSP ticket automation ROI calculator](/tools/msp-ticket-roi/).

## Work backwards to a budget

Before you ask for a quote, decide how quickly the project must pay back. Multiply the expected net monthly value by that target to get the most the project should cost. Hold some of it back for contingency. The [AI project budget planner](/tools/ai-budget-planner/) does this and splits the result across discovery, pilot and scale.

If a quote comes in above the ceiling, narrow the scope, raise the expected value with evidence, or accept a longer payback, and make that choice before the project starts.

## What the formula leaves out

Some effects are real but hard to price. List them next to the ROI instead of folding guesses into it:

- **Faster response and turnaround.** Shorter first-response times on tickets, or faster quotes, affect renewals and win rates.
- **Coverage outside business hours.** Routine requests handled at 2 a.m. without an on-call call-out.
- **Consistency.** Fewer differences between how two people handle the same item, and fewer errors from retyping.
- **Documentation as a by-product.** Notes and knowledge-base entries written as the work happens.
- **Capacity.** The same team handling more volume as the business grows.

## Do not forget the costs you already have

Before building anything new, check what AI tools the business already pays for. Overlapping subscriptions and unused seats can fund a first pilot. The [AI subscription audit](/tools/ai-spend-audit/) is a quick way to find them, and our [AI cost optimisation](/services/ai-cost-optimization/) service goes deeper.

## Confirm it with a pilot

Every number above is an estimate until the agent runs on your own work. A supervised pilot replaces the uncertain inputs, especially the share the agent handles and the minutes saved, with measured ones. [What a 30-day AI agent pilot should measure](/ai-agent-pilot-metrics/) explains how to set that up so the result is clear. For the cost side in more detail, including the costs most quotes leave out, see [how much an AI agent costs](/how-much-does-an-ai-agent-cost/).
