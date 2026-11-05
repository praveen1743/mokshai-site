---
title: "What a 30-Day AI Agent Pilot Should Measure"
description: "The scorecard for an AI agent pilot: baseline, coverage, accuracy, time saved, running cost, user trust and the stop rule to agree before you start."
published: 2026-11-05
updated: 2026-11-05
audience: general
topic: strategy-and-roi
summary: "Measure five things against a baseline recorded before the build: how much of the workflow the agent handles, how often its work is accepted without edits, the time saved per item, the net monthly value after running cost, and whether the people working with it trust it. Agree the targets and a stop rule before day one."
services: [ai-consulting, custom-ai-development]
tools: [msp-ticket-roi, ai-budget-planner]
takeaways:
  - "Record the baseline before the build, from your own systems, for the one workflow in scope."
  - "Track coverage, accuracy, time saved, net value and user trust every week."
  - "Agree the targets and a stop rule in writing before the pilot starts, so the decision at the end is not a negotiation."
  - "Report corrections, not just successes; the pattern of corrections tells you what to fix."
faqs:
  - q: "Why 30 days?"
    a: "Long enough to see a full month of normal volume, including a month-end or reporting cycle, and short enough to stop cheaply if the agent is not working. For low-volume workflows, run until you have enough items for the accuracy figure to be meaningful."
  - q: "Who should own the scorecard?"
    a: "The person who owns the workflow, usually a service desk lead or operations manager, with the vendor supplying the data. If only the vendor reports the results, the business will not trust them."
  - q: "What is a reasonable accuracy target?"
    a: "It depends on the cost of a mistake. For a reversible, low-risk action a lower bar during supervision is acceptable because a person checks every item. For anything a client sees, set a high bar and keep approvals on until it is met. Agree the number before the pilot, based on your own risk, not on a vendor's claim."
---

A 30-day AI agent pilot should measure five things against a baseline taken before the build: coverage, accuracy, time saved, net value and trust. Agree the target for each, and the condition under which you will stop, before the pilot starts. Then the decision at the end of the month is a reading of the numbers rather than a debate.

This applies whether the agent works on service desk tickets, document intake or quote preparation. The examples below use a service desk, but the scorecard is the same.

## Before day one: the baseline

Pull these figures from your own systems for the one workflow in scope, ideally over the previous three months:

| Baseline measure | Where it usually lives |
|---|---|
| Items per month | PSA, ERP or shared inbox reports |
| Median handling time per item | PSA time entries, or a one-week time sample |
| Error, rework or reopen rate | Reopened tickets, corrected quotes, returned documents |
| Turnaround time | Time from arrival to completion |
| Loaded cost per hour of the people doing the work | Finance |

If handling time is not tracked, ask the team to log it for one normal week. A rough number measured now beats a precise guess made later.

## The five measures

### 1. Coverage

The share of items in the workflow that the agent handled, meaning it resolved them or prepared them fully for a person to approve. Coverage tells you how much of the queue the agent can take. Low coverage usually means the workflow scope is too broad or the agent cannot reach a system it needs.

### 2. Accuracy

The share of the agent's output accepted without edits. During a supervised pilot, every item is reviewed, so you get this number for free. Track it per action type: an agent can be reliable at classification and still weak at drafting replies.

Keep a log of every correction with a one-line reason. The reasons cluster quickly into a few patterns, such as missing data, an unclear rule or a category that should not be in scope, and each pattern has a different fix.

### 3. Time saved

Handling time per item now, compared with the baseline, multiplied by the items the agent covered. Include the time people spend reviewing the agent's work during the pilot; it falls as approvals are loosened, but it is real time today.

### 4. Net value

The labour value of the time saved, minus the agent's running cost for the month (model usage, hosting, monitoring). This is the number that decides whether the agent pays for itself. Our [AI project budget planner](/tools/ai-budget-planner/) works backwards from this figure to the most you should spend on the build.

### 5. Trust

Ask the people who work with the agent two questions each week: would you be comfortable if it handled this without approval, and what would you change? Low trust with high accuracy usually means people cannot see why the agent decided what it did. Showing its reasoning and sources on each item fixes more trust problems than another round of tuning.

## The scorecard

Put the five measures in one table and share it weekly with the team:

| Measure | Baseline | Target | Week 1 | Week 2 | Week 3 | Week 4 |
|---|---|---|---|---|---|---|
| Coverage | 0% | agreed | | | | |
| Accepted without edits | n/a | agreed | | | | |
| Handling time per item | measured | agreed | | | | |
| Net value per month | n/a | agreed | | | | |
| Team says "comfortable without approval" | n/a | agreed | | | | |

Our [How we work](/how-we-work/) page shows the pilot scorecard format we use with clients.

## The stop rule

Write down, before the pilot starts, the condition that ends it. For example: accuracy below the agreed level for two consecutive weeks, or net value still negative at the end of week four with no clear fix. A stop rule protects both sides. The business does not drift into a project that is not working, and the team building the agent knows exactly what it has to prove.

## Reading the result

At the end of the month there are three honest outcomes:

- **Keep and scale.** Targets met. Loosen approvals where accuracy supports it and pick the next workflow.
- **Change and extend.** Close to target with a clear, fixable cause in the correction log. Extend by a defined period with that fix.
- **Stop.** The stop rule was triggered, or the fix would cost more than the value. Keep the baseline data; it is still useful for the next candidate.

All three are good results if the numbers are clear. The bad outcome is a pilot that ends with nobody sure whether it worked.

For the tier-1 service desk version of this process, see [How to automate tier-1 tickets with an AI agent](/how-to-automate-tier-1-tickets-with-an-ai-agent/). To estimate the value before a pilot, use the [MSP ticket automation ROI calculator](/tools/msp-ticket-roi/).
