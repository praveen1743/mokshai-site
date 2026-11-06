---
title: "AI Readiness Assessment: What to Check Before You Spend on AI or Copilot"
description: "An AI readiness assessment checklist for smaller businesses and MSP clients: data access, process, governance and systems, with a free two-minute scorecard."
published: 2026-11-06
updated: 2026-11-06
audience: general
topic: strategy-and-roi
summary: "An AI readiness assessment checks four things before you buy AI tools or fund an AI project: whether data access is tidy enough that AI will not surface what people should not see, whether there is a measured workflow with an owner, whether you have a policy and know which AI tools are already in use, and whether your systems can be connected safely. Fix the weakest of the four first; a pilot stalls on its weakest part."
services: [ai-consulting, ai-implementation-training]
tools: [ai-readiness-scorecard, ai-budget-planner]
takeaways:
  - "Readiness comes down to four areas: data and access, process, governance, and systems."
  - "For Microsoft 365 Copilot, the biggest risk is oversharing: Copilot can show a user anything their account can open."
  - "A workflow without a measured baseline cannot prove an AI project worked."
  - "Fix the weakest area first. A high score elsewhere does not rescue a pilot that cannot connect to its systems."
faqs:
  - q: "What is an AI readiness assessment?"
    a: "A structured check of whether a business can adopt AI safely and measure the result. It looks at data access and quality, the workflows AI would support, policies and governance, and the systems and accounts an AI tool or agent would need."
  - q: "How long does an AI readiness assessment take?"
    a: "A self-assessment like our scorecard takes a few minutes. A reviewed assessment, where someone checks permissions, licences and systems directly, typically takes days to a few weeks depending on the size of the environment."
  - q: "What is a Copilot readiness assessment?"
    a: "A readiness check focused on Microsoft 365 Copilot. It concentrates on oversharing in SharePoint, OneDrive and Teams, sensitivity labels, retention, licensing and a rollout plan by team, because Copilot works with whatever content each user can already access."
  - q: "Can an MSP run an AI readiness assessment for clients?"
    a: "Yes, and many do: they already manage the identity, devices and Microsoft 365 tenant involved. It often leads to permission clean-up, a policy, and a phased rollout of AI tools."
---

An AI readiness assessment checks four things before you buy AI tools or fund an AI project:

1. **Data and access.** Will AI surface files and messages people should not see?
2. **Process.** Is there a measured workflow with a named owner?
3. **Governance.** Do you have a policy, and do you know which AI tools are already in use?
4. **Systems.** Can the tools and agents connect safely, with their own accounts and logs?

Fix the weakest area first. A pilot stalls on its weakest part, whatever the overall score. You can score your business in two minutes with our free [AI readiness scorecard](/tools/ai-readiness-scorecard/); this guide explains what each question is checking and what to do about it.

## 1. Data and access

**What to check**

- Are SharePoint sites, Teams, shared drives and mailboxes shared only with the people who need them?
- Are there old "everyone" or "anyone with the link" shares?
- Do you know where sensitive client, financial and personal data is stored?
- Is any of it labelled, or kept in separate locations with tighter access?

**Why it matters.** AI assistants work with the access each user already has. Microsoft's [Copilot privacy documentation](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy) says Microsoft 365 Copilot only surfaces organisational data that the individual user has at least view permission for. That protects you from Copilot inventing access, but it also means years of oversharing become easy to find. A question like "summarise salary discussions" returns whatever the user can technically open.

**What to do.** Review sharing on the sites and drives with the most sensitive content, remove broad shares, and agree which data types must never go into an AI tool.

## 2. Process

**What to check**

- Is there one workflow you want AI to help with, such as tier-1 tickets, quote preparation or invoice intake?
- Do you know its monthly volume and the time each item takes, from your systems rather than memory?
- Does it have one named owner who can approve changes?

**Why it matters.** Without a baseline, nobody can say whether the project worked. Without an owner, rules never get agreed and the pilot drifts.

**What to do.** Pull two to four weeks of data from your PSA, ERP or shared inbox: items per week, minutes per item, and how many follow a standard pattern. Our guide to [what a 30-day AI agent pilot should measure](/ai-agent-pilot-metrics/) lists the baseline figures to capture.

## 3. Governance

**What to check**

- Is there an AI acceptable use policy that staff have read?
- Do you know which AI tools staff use today, including free ones and AI features inside existing software?
- Is someone accountable for approving new tools?

**Why it matters.** Most businesses already have [shadow AI](/what-is-shadow-ai/): personal accounts, meeting bots and browser extensions used with company data. Adding approved tools without a policy or an inventory leaves those in place.

**What to do.** Publish a short policy using our [AI acceptable use policy template](/ai-acceptable-use-policy-template/), build an inventory, and record both in a simple [AI governance framework](/ai-governance-framework-small-business/).

## 4. Systems

**What to check**

- Do the systems in the workflow have an API, a ready connector or at least a reliable export?
- Can each system give an integration its own limited account rather than a shared admin login?
- Does each system keep an audit log of what that account does?

**Why it matters.** An agent that cannot read or write the systems involved cannot do the work. One that runs on a shared admin account is a security problem from day one.

**What to do.** List every system the workflow touches and check each for an API and account options before you scope a build. The [AI agent security checklist](/ai-agent-security-checklist/) covers the account, logging and switch-off questions in more detail.

## What your result means

| Result | What to do next |
|---|---|
| Fix the foundations first | Work on the lowest-scoring area. Policy and tool inventory are usually the quickest wins. |
| Ready for a narrow pilot, with conditions | Choose a workflow that avoids the weak area, or fix it in parallel with discovery. |
| Ready to pilot | Choose the workflow, set a baseline, a target and a stop rule, and set a budget ceiling with the [AI project budget planner](/tools/ai-budget-planner/). |

## For MSPs: readiness as a service

Readiness reviews are a natural service for managed service providers, who already manage the tenant, identities and devices. A typical sequence is a scorecard or discovery call, a permissions and sharing review, a policy, a phased rollout of AI tools by team, and an ongoing quarterly review. The work that follows the assessment, clean-up, rollout and training, is usually worth more to the client than the assessment itself.

If you would like an assessment reviewed by someone who checks the systems directly, that is the first stage of our [AI strategy and consulting](/services/ai-consulting/) work, and our [implementation and training](/services/ai-implementation-training/) service covers the rollout.
