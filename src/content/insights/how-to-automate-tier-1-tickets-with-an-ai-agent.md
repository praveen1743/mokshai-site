---
title: "AI Help Desk for MSPs: How to Automate Tier-1 Tickets with an AI Agent"
description: "A step-by-step plan for an AI help desk at an MSP: pick the tier-1 queue, set a baseline, define the agent's limits, run a supervised pilot and scale."
published: 2026-11-05
updated: 2026-11-06
audience: msp
topic: msp-automation
summary: "Pick one tier-1 category with high volume and a documented fix, measure how it runs today, give the agent the minimum access it needs, keep a technician approving every action for the first weeks, and loosen approvals only where the pilot data shows the agent gets it right."
services: [custom-ai-development, ai-implementation-training]
tools: [msp-ticket-roi]
featured: true
takeaways:
  - "Start with one tier-1 category that has high volume, a documented fix and low risk, such as password resets or new-starter provisioning."
  - "Record a baseline before the build: volume, handling time, reopen rate and first-response time for that category."
  - "Give the agent a dedicated service account with only the permissions the category needs, and log every action."
  - "Run the first weeks with a technician approving each action, then loosen approvals only where accuracy holds up."
faqs:
  - q: "What counts as a tier-1 ticket for automation?"
    a: "A request that follows a known procedure and needs no diagnosis: password resets, account unlocks, access requests that match a policy, new-starter and leaver tasks, known printer or email fixes and how-to questions. If two technicians would resolve it the same way every time, it is a candidate."
  - q: "How long does a tier-1 automation pilot take?"
    a: "It depends on how quickly the agent can be connected to your PSA and identity systems and how much volume the category has. Plan for enough weeks to see a few hundred tickets of that category under supervision, so the accuracy figure means something."
  - q: "Should the agent talk to end users directly?"
    a: "Only for routine status updates and resolutions inside the limits you set, and only after the supervised phase. Anything involving a complaint, an outage or a commercial question goes to a person."
  - q: "What if the agent gets a ticket wrong?"
    a: "During the pilot a technician approves every action, so a wrong classification or draft is corrected before it reaches the client. Track each correction: the pattern tells you whether to fix the agent's instructions, its data or the category boundary."
---

Automating tier-1 tickets with an AI agent works when you narrow the scope first. Choose one ticket category, measure how it runs today, give the agent only the access that category needs, and keep a technician approving its actions until the data shows it can be trusted on its own. The rest of this guide walks through each step in order.

If you have not yet read how agents differ from fixed-rule automation, start with [AI agents for MSPs: what they are and how they reduce workload](/ai-agents-for-msps-what-they-are-how-they-reduce-workload/).

## Step 1: Choose one tier-1 category

Look at the last three months of tickets in your PSA and rank categories on four questions:

| Question | Good sign | Warning sign |
|---|---|---|
| How many arrive each month? | Steady, high volume | A handful a week |
| Is there a written procedure? | A runbook or KB article technicians follow | "It depends who picks it up" |
| What happens if it goes wrong? | Easy to reverse, low client impact | Security, money or data at risk |
| Can the agent reach the systems involved? | API access to PSA, identity, RMM | Manual steps in a portal with no API |

Password resets, account unlocks, policy-based access requests and new-starter provisioning usually score well. Firewall changes, anything involving payment details and anything that needs a judgement about a client relationship do not belong in a first pilot.

Pick one category. A pilot that covers five categories at once produces a result nobody can interpret.

## Step 2: Measure the baseline

Before anything is built, write down how the chosen category runs today. Your PSA usually has most of this:

- tickets per month in the category
- median technician handling time
- first-response time and time to resolution, in and out of business hours
- reopen rate, or tickets that came back within seven days
- how often the ticket was escalated beyond tier 1

These numbers become the yardstick for the pilot. Without them, the only evidence you will have later is a feeling that things are faster. Our [MSP ticket automation ROI calculator](/tools/msp-ticket-roi/) turns the volume and handling-time figures into hours and labour value, which helps decide whether the category is worth piloting at all.

## Step 3: Define what the agent may do

Write the agent's limits down before the build, in plain language, and agree them with the service desk lead:

- **Reads:** the ticket, the requester's identity record, the device record, related KB articles and similar past tickets.
- **Writes:** ticket category, priority, internal notes and, after the supervised phase, the resolution note.
- **Actions it may take:** for a password reset, trigger the reset only after identity has been verified by the method your policy requires.
- **Actions it must never take:** change security groups, firewall rules or anything outside the category.
- **When it must hand off:** low confidence, a VIP or priority client, a request that does not match the category, or any sign of a security incident.

This becomes the agent's specification, and it is also the document you show a client who asks how the automation is controlled. Our [security page](/security/) lists the questions we answer in writing for every agent.

## Step 4: Build inside the tools you already run

The agent should work through the APIs of your PSA, identity platform and RMM, using a dedicated service account. Technicians keep working in the PSA they know. They see the agent's classification, the context it gathered and its proposed action on the ticket itself.

Three build details matter more than the choice of model:

1. **Context retrieval.** The agent's accuracy depends on pulling the right device record, KB article and past fixes. Spend time here.
2. **An audit trail.** Every read, decision and action is logged against the ticket, with the reason.
3. **A switch.** The service desk lead can pause the agent at any time without calling anyone.

## Step 5: Run a supervised pilot

For the first weeks, the agent prepares and a technician approves. Every proposed action, from a category change to a reset, waits for a click. Track three things each week:

| Metric | What it tells you |
|---|---|
| Share of the category the agent handled | Coverage: how much of the queue it can take |
| Share approved without edits | Accuracy: how often the technician agreed |
| Technician time per ticket | The saving, compared with the baseline |

Add the running cost of the agent, so the saving is net. [What a 30-day AI agent pilot should measure](/ai-agent-pilot-metrics/) covers the full scorecard, including the stop rule to agree before you start.

## Step 6: Loosen approvals where the data supports it

When the approved-without-edits rate for a specific action holds steady at the level you agreed, let the agent complete that action without approval, and keep sampling its work. Keep approvals on anything that touches security, permissions or client communication about incidents.

Loosen one action at a time. If accuracy drops, put the approval back and look at the corrections to find out why.

## Step 7: Scale to the next category

Once the first category runs well, pick the next one with the same scoring table. Each new category reuses the connections, logging and approval workflow you have already built, so it costs less than the first.

Two things help adoption as you scale:

- **Show technicians the numbers.** Share the weekly scorecard with the team, including the corrections. People trust an agent whose mistakes they can see.
- **Train by role.** Technicians need to know how to approve and correct; service desk leads need to know how to change limits and pause the agent. Our [implementation and training](/services/ai-implementation-training/) work covers both.

## Common mistakes

- **Starting with the hardest queue.** The category that hurts most is often the one with the least consistent procedure. Prove the approach on an easier one first.
- **No baseline.** Without before-and-after numbers, the pilot ends in opinions.
- **Shared admin credentials.** A dedicated, least-privilege service account is the only safe setup, and the only one a client's security review will accept.
- **Removing approvals too early.** One bad week of unsupervised actions can cost more trust than months of good work earned.

For how to set the approval points so they stay quick, see [human-in-the-loop AI](/human-in-the-loop-ai-approval-design/). If you want help choosing the first category and writing the agent's limits, that is what [custom AI agent development](/services/custom-ai-development/) starts with.
