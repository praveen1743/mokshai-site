---
title: "What Is Shadow AI? Risks, Examples and How to Bring It Under Control"
description: "Shadow AI is staff using AI tools the business has not approved. What it looks like, why it raises breach costs, and a five-step plan to find and govern it."
published: 2026-11-06
updated: 2026-11-06
audience: general
topic: security-and-governance
summary: "Shadow AI is the use of AI tools, features or agents at work without the knowledge or approval of the business: a personal ChatGPT account, a free transcription bot in meetings, an AI browser extension, or an AI feature someone switched on inside a SaaS tool. The risk is not the tool itself but the data that goes into it and the decisions that come out of it. You bring it under control by finding what is in use, approving a short list of tools, publishing a one-page policy, and giving people an easy way to ask for new tools."
services: [ai-consulting, ai-cost-optimization]
tools: [ai-spend-audit, ai-readiness-scorecard]
takeaways:
  - "Shadow AI is any AI tool, feature or agent used for work without the business knowing or approving it."
  - "IBM's 2025 breach study found breaches involving shadow AI cost more and exposed more personal data."
  - "Banning AI rarely works. Approving good tools and making the rules clear reduces the reason to go around them."
  - "Start with discovery: expense reports, single sign-on logs, browser extensions and a short staff survey."
faqs:
  - q: "Is shadow AI the same as shadow IT?"
    a: "It is a type of shadow IT, with two differences. AI tools are often free and need nothing installed, so they spread faster. And the risk sits in what people paste in and what they do with the answer, so blocking a website does not cover it."
  - q: "Should we block ChatGPT and similar tools?"
    a: "Blocking without an approved alternative usually moves the use to personal phones, where you have no visibility at all. Approve at least one business-grade assistant with a company account, block the rest for company data, and explain why."
  - q: "Do AI features inside our existing software count?"
    a: "Yes. Meeting recorders, writing assistants in CRMs and help desks, and AI connectors in productivity suites can all be switched on by a user and start reading company data. Include them in your inventory and in your policy."
  - q: "Who should own shadow AI governance in a small business?"
    a: "One named person, usually the operations lead or whoever owns IT, often supported by the managed service provider. They keep the list of approved tools, answer requests and review it each quarter."
---

Shadow AI is the use of AI tools, features or agents at work without the knowledge or approval of the business. A sales rep pasting a client's pricing into a personal ChatGPT account is shadow AI. So is a free meeting bot that joins calls and stores transcripts on its own servers, a browser extension that reads every page an employee opens, or an AI feature someone switched on inside the help desk. The risk is the data that goes in and the decisions that come out, with nobody accountable for either.

You bring it under control in five steps: find what is in use, decide what is approved, publish a short policy, make it easy to ask for new tools, and review the list every quarter.

## Why shadow AI matters

The cost is measurable. IBM's [Cost of a Data Breach Report 2025](https://www.ibm.com/reports/data-breach) found that one in five organisations studied had a breach involving shadow AI, and that organisations with high levels of shadow AI paid on average about USD 670,000 more per breach than those with little or none. The same study found 63% of breached organisations had no AI governance policy, or were still writing one.

The well-known example is from 2023, when Samsung restricted staff use of generative AI after engineers pasted internal source code into ChatGPT, as [reported by Bloomberg](https://www.bloomberg.com/news/articles/2023-05-02/samsung-bans-chatgpt-and-other-generative-ai-use-by-staff-after-leak). Nothing was hacked. People were trying to work faster with a tool nobody had told them not to use.

For a smaller business the risks are the same, with less room to absorb them:

- **Data leaves your control.** Free and personal accounts may keep prompts, use them to improve models, or store them in another country. Your client contracts may forbid exactly that.
- **Wrong answers get used.** A confident but wrong summary of a contract, or an invented figure in a client report, goes out under your name.
- **Nobody knows what was shared.** If a client asks whether their data went into an AI tool, you cannot answer.
- **Money leaks.** Individual subscriptions expensed on cards overlap with tools you already pay for. Our [AI subscription audit](/tools/ai-spend-audit/) shows how quickly that adds up.

## Common examples of shadow AI

| Example | What makes it risky |
|---|---|
| Personal ChatGPT, Claude or Gemini accounts used for work | Prompts sit outside company control and may be used for training, depending on the account type and settings |
| Free meeting note-takers that join calls | Recordings and transcripts of client conversations stored by a third party |
| AI browser extensions (writing, summarising, "copilots") | Can read every page and form the browser opens, including internal systems |
| AI features switched on inside SaaS tools | Start reading CRM, help desk or document data without a review |
| Staff building their own automations with AI steps | Run with a personal account's access, with no log and no owner |
| Uploading spreadsheets to AI "analysis" sites | Whole customer or financial datasets leave the business in one step |

## How to find shadow AI

You do not need special software to get a useful first picture. Use four sources:

1. **Expense reports and card statements.** Search for AI vendors and anything with "AI", "GPT" or "copilot" in the name.
2. **Single sign-on and OAuth logs.** In Microsoft 365 or Google Workspace, review which third-party apps users have granted access to company data. AI note-takers and assistants show up here.
3. **Browser extensions.** Your device management tool or MSP can list installed extensions across company machines.
4. **A short, no-blame survey.** Ask staff which AI tools they use, for what, and what they would need if those tools were taken away. People answer honestly when the message is "we want to approve good tools", not "we are looking for offenders".

Write the results into one list: tool, who uses it, what for, what data it sees, account type, cost.

## How to bring it under control

**1. Decide what is approved.** For most businesses that means one business-grade assistant with company accounts and data-use terms you have read, plus the AI features inside tools you already pay for. Business tiers of the major assistants offer terms that exclude your data from model training; check the current terms of the plan you choose.

**2. Publish a one-page policy.** Approved tools, data that must never go in, the rule that a person checks AI output before it is used, and who to ask. Our [AI acceptable use policy template](/ai-acceptable-use-policy-template/) is a ready starting point.

**3. Make asking easy.** A shared mailbox or Teams channel, and a promise to answer within a few days. Shadow AI grows when the official route is slow.

**4. Close the obvious gaps.** Restrict users from granting new apps access to company data without approval, remove unapproved meeting bots, and consolidate overlapping subscriptions.

**5. Review every quarter.** Walk the list, retire what nobody uses, re-check vendor terms, and add anything new. The [AI governance framework](/ai-governance-framework-small-business/) guide shows how to keep that list as a simple register.

## Where an MSP fits

Managed service providers are well placed to run this for clients: they already see sign-in logs, devices and licences. A common package is a discovery review, a policy based on the template, app-consent controls in Microsoft 365, and a quarterly check. If you are an MSP and want the discovery step to feed into a readiness review, our [AI readiness scorecard](/tools/ai-readiness-scorecard/) covers the policy and inventory questions in two minutes.

If you would like an outside view of what is in use across your business and what to approve, that is the first part of our [AI strategy and consulting](/services/ai-consulting/) discovery.
