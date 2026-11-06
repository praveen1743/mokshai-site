---
title: "AI Agent Security and Governance Checklist: Permissions, Approvals and Audit Logs"
description: "An AI agent security and governance checklist for business systems: access, approvals, audit logs, data handling, client separation and switch-off."
published: 2026-11-05
updated: 2026-11-06
audience: general
topic: security-and-governance
summary: "Treat an AI agent like a privileged user. Give it a dedicated account with the minimum permissions its task needs, require human approval for security-sensitive actions, log everything it reads and does, keep each client's data separate, know where your data is processed, and make sure your own team can pause it at any time."
services: [custom-ai-development, ai-consulting]
tools: [ai-readiness-scorecard]
takeaways:
  - "An agent is software with access to your systems; secure it like a privileged account."
  - "Separate actions into three lists: allowed, needs approval, never."
  - "Log every read, decision and action with the reason, and make the log readable by your own team."
  - "Know where data is processed, how long it is kept, and confirm in writing that it is not used to train models."
faqs:
  - q: "Should an AI agent have admin rights?"
    a: "No. Give it a dedicated service account with only the permissions its task needs. If a task needs elevated rights, the agent should prepare the change and a person with those rights should approve and run it."
  - q: "Do we need to tell our clients we use AI agents?"
    a: "Check your contracts and the regulations that apply to your clients. Even where it is not required, telling clients how agents are controlled, and that a person approves security-sensitive actions, tends to build trust rather than lose it."
  - q: "How do we test an agent's security before going live?"
    a: "Run it in a supervised mode where every action needs approval, try requests designed to push it outside its limits, and review the audit log for anything it read or attempted that it should not have. Repeat after every significant change to its instructions or permissions."
---

An AI agent that works inside your PSA, RMM, Microsoft 365 or ERP is a piece of software with access to sensitive systems. Secure it the way you would secure a privileged user: a dedicated account with the minimum permissions, human approval for anything security-sensitive, a complete audit log, separation between clients' data, clear answers on data handling, and an off switch your own team controls.

Use this checklist when you build an agent, and when you assess one from a vendor. It is the same list behind our [security page](/security/).

## 1. Identity and access

- The agent has its **own service account**, never a shared admin or a person's login.
- Permissions are **least privilege**: only the systems, records and actions its task needs.
- Read and write permissions are **listed separately**, and writes are narrower than reads.
- Credentials are stored in a secrets manager and **rotated** on a schedule.
- Access is **reviewed** when the agent's scope changes, as you would for a new role.

## 2. Actions and approvals

Write every action the agent can take into one of three lists:

| List | Examples | Rule |
|---|---|---|
| Allowed | Classify a ticket, add an internal note, look up a device record | The agent may do it, and it is logged |
| Needs approval | Grant access to a shared drive, send a client-facing reply, close a ticket | The agent prepares it, and a named role approves |
| Never | Change firewall rules, alter security groups, touch payment details | The agent cannot do it, even if asked |

- The three lists are **written down** and agreed with whoever owns the workflow.
- Moving an action from "needs approval" to "allowed" requires **evidence from the pilot**, not a request from a user.
- Requests that fall outside all three lists are **handed to a person**.

## 3. Logging and audit

- Every **read, decision and action** is logged with a timestamp, the record involved and the reason.
- Approvals record **who approved** and when.
- Logs are stored where **your team** can search them without asking the vendor.
- Logs are **kept** for a period that matches your compliance obligations.
- Someone **reviews a sample** of the log each week during the first months.

## 4. Data handling

- You know **which model provider** processes the data, and in which region.
- The provider confirms in writing that your data is **not used to train** their models.
- Data sent to the model is **limited to what the task needs**; no full mailbox or database dumps.
- Sensitive fields such as passwords, card numbers and health data are **excluded or masked**.
- Retention of prompts and outputs is **defined and as short as practical**.

Where data rules are strict, a self-hosted open-source model can keep processing inside your environment. That trade-off between quality, cost and data location is worth deciding early. Our [custom AI agent development](/services/custom-ai-development/) page explains how we choose.

## 5. Client separation (for MSPs)

- An agent working one client's ticket **cannot read another client's records**.
- Context retrieval, such as similar past tickets, is **filtered by client**.
- Knowledge-base content is **tagged by client** where it contains client-specific detail.
- Reports and logs can be **produced per client** for their own audits.

## 6. Resilience and control

- Your team can **pause or switch off** the agent immediately, and the runbook says how.
- If the agent or the model provider is unavailable, work **falls back to people** without being lost.
- Prompt and configuration changes go through **review**, like code changes.
- The agent is **tested against requests designed to push it outside its limits** before launch and after major changes.

## 7. Questions to ask a vendor

1. Which systems will the agent read from, and which can it write to?
2. Where is data processed and stored, and for how long?
3. Is any of our data used to train a model?
4. Which actions need human approval, and who approves them?
5. How are errors detected, and how fast can we switch the agent off ourselves?
6. Who has access to the agent's logs and configuration?
7. What happens to our data and access when the engagement ends?

A vendor who cannot answer these clearly, in writing, is telling you something. For how agents and engineers divide the work in practice, see [How to automate tier-1 tickets with an AI agent](/how-to-automate-tier-1-tickets-with-an-ai-agent/). To place these controls inside a wider set of owners, a register and reviews, use the [AI governance framework](/ai-governance-framework-small-business/), and for approval design specifically, [human-in-the-loop AI](/human-in-the-loop-ai-approval-design/).
