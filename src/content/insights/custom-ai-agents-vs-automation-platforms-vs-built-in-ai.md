---
title: "AI Agent vs Chatbot vs Automation Platform vs Built-In AI: How to Choose"
description: "AI agent vs chatbot vs RPA and automation platforms vs built-in AI features: what each does, a comparison table and five questions to choose."
published: 2026-11-05
updated: 2026-11-06
audience: general
topic: strategy-and-roi
summary: "Use the AI features already built into your PSA, ERP or Microsoft 365 when they cover the job. Use an automation platform when the work follows fixed rules across several systems. Build a custom agent when the work needs judgement over unstructured input, spans systems the others cannot reach, or has to follow your own approval rules."
services: [ai-consulting, custom-ai-development, ai-cost-optimization]
tools: [ai-budget-planner, ai-spend-audit]
takeaways:
  - "Check what your existing tools already include before buying or building anything."
  - "Automation platforms suit rule-based workflows; agents suit work that needs reading and judgement."
  - "Many good setups combine all three: built-in features for simple tasks, a platform for rules, an agent for the judgement layer."
  - "Compare options on total running cost and on who can change the behaviour later, not only on the build price."
faqs:
  - q: "Is a custom agent always more expensive?"
    a: "It usually costs more to build than switching on a built-in feature, but not always more to run. Built-in AI is often priced per seat, while a custom agent's running cost follows usage. For high-volume, narrow workflows a custom agent can be the cheaper option over a year. Compare both on a twelve-month total."
  - q: "Can a custom agent work alongside an automation platform?"
    a: "Yes, and it often should. The platform runs the fixed-rule steps and the agent handles the steps that need reading and judgement, such as classifying an unstructured request or drafting a reply for approval."
  - q: "What about lock-in?"
    a: "Ask every option the same question: if we stop paying, what do we keep? With built-in features you keep nothing outside the product. With a platform you keep workflows that only run on that platform. With a custom agent you should receive the configuration, prompts, integrations and runbooks."
---

There are three common ways to add AI to a service desk or back office: switch on the AI features built into the tools you already use, build workflows on an automation platform, or have a custom AI agent built for the job. Use built-in features when they already cover the task. Use a platform when the work follows fixed rules. Build a custom agent when the work needs judgement over messy input, spans systems the other two cannot reach, or must follow your own approval rules.

Most mature setups end up using more than one. The decision is which layer each workflow belongs in.

## AI agent vs chatbot vs RPA

The terms get mixed up, so it helps to separate them first:

| | Chatbot | RPA / rule-based automation | AI agent |
|---|---|---|---|
| What it does | Answers questions in a conversation | Repeats fixed steps exactly as recorded or configured | Reads a piece of work, decides what it is, gathers context and acts or prepares the action |
| Input | A person's question | Structured data in a known format | Messy input: emails, tickets, PDFs, drawings |
| Handles the unexpected | Answers or hands over | Stops or fails | Flags it for a person with the reason |
| Typical use | FAQs, self-service | Data entry between fixed screens, scheduled jobs | Triage, intake, drafting, matching |

A chatbot talks, RPA repeats, and an agent works a queue. For real examples of agents in a service desk and back office, see [AI agents for business: 12 examples](/ai-agents-for-business-examples/).

## The three options

**Built-in AI features.** Your PSA, ITSM, ERP or Microsoft 365 subscription may already include AI features: ticket summaries, suggested replies, categorisation, document extraction. They are quick to switch on and need no integration work, but they only see data inside that one product and you cannot change much about how they behave.

**Automation platforms.** Workflow and automation platforms connect systems and run rule-based steps: when a ticket of type X arrives, create a user, assign a licence, update the ticket. Many now include AI steps. They are strong at predictable, repeatable processes across systems, and weaker when the input is unstructured or the next step depends on reading and judging it.

**Custom AI agents.** An agent built for your workflow reads context (the ticket, the email, the attached drawing), decides what kind of work it is, gathers what is needed from several systems and either acts within limits you set or prepares the work for a person to approve. It takes more effort to build, and it follows your rules exactly.

## Comparison

| Compare | Built-in AI features | Automation platform | Custom AI agent |
|---|---|---|---|
| Best at | Simple tasks inside one product | Fixed-rule workflows across systems | Judgement over unstructured input across systems |
| Time to first value | Days | Weeks | Weeks |
| Sees data from | One product | Connected systems | Any system with an API, email or file access |
| Your approval rules | Limited to product settings | Configurable per workflow | Designed in from the start |
| Typical pricing | Per seat or tier | Platform licence plus build time | Build cost plus usage-based running cost |
| Who can change it | The vendor | Your team, if trained | Your team, with the runbooks handed over |
| What you keep if you stop | Nothing | Workflows that need the platform | Configuration, prompts, integrations, runbooks |

## Five questions that decide it

1. **Does a tool you already pay for do this?** Check before anything else. Our [AI subscription audit](/tools/ai-spend-audit/) is a quick way to see what you are already paying for, and where tools overlap.
2. **Is the input structured?** A form with fields suits a platform. A free-text email, a PDF drawing or a messy ticket description usually needs an agent to read it.
3. **How many systems does the work touch?** One system points to built-in features. Several systems with good connectors point to a platform. Systems with no ready connector, or a mix of email, files and APIs, point to an agent.
4. **How much judgement is involved?** If two people could reasonably handle the item differently, you need an agent with clear limits and a person approving the borderline cases.
5. **What will it cost over a year?** Add licences, build time and running cost for twelve months. Our [AI project budget planner](/tools/ai-budget-planner/) shows the most a project should cost to pay back within your target.

## A layered example

An MSP handling new-starter requests might use all three:

- The **PSA's built-in AI** summarises the incoming request for the technician.
- An **automation platform** runs the fixed steps: create the account, assign the licence group, add to distribution lists.
- A **custom agent** reads the free-text request from the client's HR contact, works out the role and the access it implies, flags anything that does not match the client's access policy, and prepares the request for the platform to run once a technician approves.

Each layer does what it is good at, and the approval stays with a person.

## Red flags in any option

- No audit log of what the AI read, decided and changed.
- Shared admin credentials instead of a dedicated, least-privilege account.
- No way to pause it without contacting the vendor.
- Pricing that grows with seats when the value grows with volume.
- Vague answers about where your data is processed and whether it trains anyone's model. Our [AI agent security checklist](/ai-agent-security-checklist/) lists the questions to ask.

If you want an independent view on which layer each of your workflows belongs in, that is the purpose of our [AI strategy and consulting](/services/ai-consulting/) discovery.
