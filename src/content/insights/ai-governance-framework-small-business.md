---
title: "AI Governance Framework for Small and Mid-Sized Businesses (One-Page Template)"
description: "A practical AI governance framework for smaller businesses: owners, an AI register, three risk levels, rules and reviews, mapped to NIST AI RMF. Free template."
published: 2026-11-06
updated: 2026-11-06
audience: general
topic: security-and-governance
summary: "An AI governance framework is the set of owners, rules and records that decides which AI tools and agents a business uses, what data they can see, who approves their output and how they are reviewed. A small or mid-sized business can run one on a single page: name an AI owner, keep a register of every AI tool and agent, sort each into low, medium or high risk, apply a few fixed rules to all of them, and review the register every quarter."
services: [ai-consulting, custom-ai-development]
tools: [ai-readiness-scorecard, ai-spend-audit]
takeaways:
  - "Governance for a smaller business is five things: an owner, a register, risk levels, a few fixed rules and a quarterly review."
  - "The register is the core. If a tool or agent is not on it, nobody is accountable for it."
  - "Match controls to risk: drafting internal text needs far less than an agent that changes records."
  - "NIST AI RMF and ISO/IEC 42001 are useful references; you do not need certification to follow their structure."
faqs:
  - q: "What is the NIST AI Risk Management Framework?"
    a: "A free, voluntary framework published by the US National Institute of Standards and Technology in January 2023. It organises AI risk work into four functions: Govern, Map, Measure and Manage. NIST later added a Generative AI Profile (NIST AI 600-1) with risks specific to generative models."
  - q: "Do we need ISO/IEC 42001 certification?"
    a: "Only if clients or regulators ask for it. ISO/IEC 42001:2023 is the international standard for an AI management system. Most smaller businesses get most of the value by following its structure, owners, a risk process, records and reviews, without the audit."
  - q: "Does the EU AI Act apply to us?"
    a: "It can apply to businesses outside the EU whose AI systems are used in the EU. Its obligations are being phased in, and in 2026 the EU adopted an amendment that moved the main high-risk deadlines to December 2027 and August 2028. Check the current text with a lawyer if you build or deploy AI used in the EU, especially in hiring, credit or education."
  - q: "How is this different from an AI acceptable use policy?"
    a: "The acceptable use policy tells staff how to behave. The governance framework is how the business decides and records which tools are allowed, who owns them and how they are checked. You need both; the policy is one of the rules inside the framework."
---

An AI governance framework is the set of owners, rules and records that decides which AI tools and agents a business uses, what data they can see, who approves their output and how they are reviewed. A small or mid-sized business can run one on a single page:

1. Name one **AI owner**.
2. Keep an **AI register** of every tool, feature and agent that touches company data.
3. Give each a **risk level**: low, medium or high.
4. Apply a few **fixed rules** to everything.
5. **Review** the register every quarter.

You can download our [one-page AI governance template (Word)](/templates/ai-governance-one-page-template.docx), which follows this structure. The rest of this guide explains each part.

## 1. Owners

Governance fails when it belongs to everyone. Name:

- **An AI owner.** Keeps the register, approves new tools, runs the quarterly review. In a 30-person business this is often the operations lead or the person who owns IT.
- **System owners.** The person responsible for each workflow that uses AI, such as the service desk lead for a ticket triage agent.
- **Security support.** Internal IT or your managed service provider, who checks accounts, access and logging.

## 2. The AI register

The register is the core of the framework. If a tool or agent is not on it, nobody is accountable for it. Keep it as a shared spreadsheet with these columns:

| Column | Example |
|---|---|
| Tool or agent | Ticket triage agent |
| Owner | Service desk lead |
| Purpose | Categorise and route incoming tickets |
| Data it can see | PSA tickets, client names and contacts |
| Risk level | Medium |
| Who approves its output | Technician confirms borderline categories |
| Next review | End of next quarter |

Fill it from the discovery steps in our [shadow AI guide](/what-is-shadow-ai/): expense reports, app-consent logs, browser extensions and a staff survey. Include AI features inside software you already pay for, not just standalone tools.

## 3. Three risk levels

Match the controls to the risk, or governance becomes paperwork nobody follows.

| Level | What it covers | Controls |
|---|---|---|
| Low | No confidential or personal data, a person reviews output before use (drafting internal text, brainstorming) | Approved tool and company account |
| Medium | Reads company or client data, or its output reaches a client (summarising tickets, drafting client replies) | Named owner, a defined approval step, logs kept |
| High | Acts in systems, affects money, access or decisions about people (changing records, provisioning accounts, pricing) | Pilot with a stop rule, least-privilege account, human approval on every action until signed off, written switch-off route |

Decisions about individual people, such as hiring, credit or discipline, should stay with a person whatever the tool. Our guide to [human-in-the-loop AI](/human-in-the-loop-ai-approval-design/) covers how to design those approval points.

## 4. Rules for every AI use

Five rules cover most of the risk:

1. Staff follow the [AI acceptable use policy](/ai-acceptable-use-policy-template/).
2. Each integration or agent has its own least-privilege account. No shared admin credentials.
3. There is a record of what each agent read, decided and changed.
4. You know where each vendor processes your data and whether it is used to train models.
5. Anyone can pause an agent, and the way to do it is written down.

Our [AI agent security checklist](/ai-agent-security-checklist/) turns rules 2 to 5 into questions to put to any vendor or builder.

## 5. Quarterly review

Once a quarter, the AI owner walks the register with each system owner:

- Is the tool still used? Retire it if not, and cancel the licence. The [AI subscription audit](/tools/ai-spend-audit/) helps here.
- Has accuracy or quality changed? Look at the approval and correction records.
- Were there incidents or near misses? What changed as a result?
- Have the vendor's terms, data location or pricing changed?
- Does anything new need adding?

Keep the notes. They are your evidence if a client, insurer or auditor asks how you manage AI.

## How this maps to recognised frameworks

The one-page approach follows the structure of the [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework), which groups the work into four functions:

| NIST AI RMF function | Where it sits in the one-page framework |
|---|---|
| Govern | Owners, fixed rules, quarterly review |
| Map | The AI register: what each tool does and what data it sees |
| Measure | Accuracy, correction and incident checks in the review |
| Manage | Risk levels and the controls attached to each |

If a client asks for a formal standard, [ISO/IEC 42001:2023](https://www.iso.org/standard/42001) is the management-system standard for AI, and the register, risk levels and reviews above are a sound starting point for it.

## Getting started this month

1. Name the AI owner.
2. Run discovery and fill the register.
3. Assign a risk level to each line.
4. Publish the acceptable use policy.
5. Book the first quarterly review.

To see how ready your business is before an AI pilot, take the two-minute [AI readiness scorecard](/tools/ai-readiness-scorecard/). If you want help setting up the register and controls around a specific agent, that is part of our [AI strategy and consulting](/services/ai-consulting/) work.
