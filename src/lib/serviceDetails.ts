// Long-form content for each service page. Keep claims to what Moksh AI
// actually delivers; every statement here should be defensible on a call.
export const serviceDetails = {
  'ai-consulting': {
    title: 'AI strategy & consulting',
    seoTitle: 'AI Strategy & Consulting for MSPs and Operations Teams',
    serviceType: 'AI strategy consulting',
    lede: 'Find the work worth automating, rank it by payback, and leave with a roadmap your own team can follow. No platform to buy at the end of it.',
    description: 'AI strategy consulting that maps your workflows, ranks automation candidates by payback and risk, and produces a roadmap with the metric each pilot will be judged on.',
    answer: 'AI strategy consulting from Moksh AI starts with how your work runs today, not with a tool. We map one or more workflows, measure where the time goes, and rank what is worth automating by payback, risk and effort. You get a roadmap and a pilot plan with the metric it will be judged on.',
    includes: [
      'Workflow mapping with the people who do the work',
      'A baseline: volumes, handling time and error rates from your own systems',
      'Ranked automation candidates with expected effort, risk and payback',
      'Risk and compliance review: data access, client data, approvals',
      'A pilot plan with a clear success metric and a stop rule',
    ],
    outcomes: [
      ['Roadmap', 'What to automate first, what to leave alone, and why'],
      ['Business case', 'Value, cost and payback in your own numbers'],
      ['Pilot brief', 'Scope, systems, approvals and the metric that decides'],
    ],
    fit: 'Teams that know AI could help but do not want to buy a platform or start a large project on a guess.',
    faqs: [
      { q: 'How long does discovery take?', a: 'It depends on the number of workflows and how quickly we can get access to data and people. For a single workflow it is usually a matter of weeks, not months. We agree the timeline before we start.' },
      { q: 'Do we have to build with you afterwards?', a: 'No. The roadmap and pilot brief are yours. Many teams do continue with us, but the output is written so your own team or another partner can act on it.' },
      { q: 'What do you need from us?', a: 'Read access to the relevant reports or exports from your systems, an hour or two with the people who do the work, and one person who can make decisions.' },
    ],
  },
  'custom-ai-development': {
    title: 'Custom AI agents & development',
    seoTitle: 'Custom AI Agent Development for MSPs & Operations',
    serviceType: 'Custom AI agent development',
    lede: 'Agents built around the systems you already run, with escalation rules you set. They do the repetitive layer of the work and hand everything else to a person.',
    description: 'Custom AI agents built on your PSA, RMM, Microsoft 365 and business systems, with scoped access, audit logs and human approval for anything sensitive.',
    answer: 'Moksh AI builds custom AI agents that work inside your existing tools, such as your PSA or ITSM, RMM, Microsoft 365 and line-of-business systems. Each agent has the minimum access it needs, logs every action, and routes anything outside its limits to a person with the context attached.',
    includes: [
      'Ticket triage, routing and routine resolution agents',
      'NOC alert correlation that groups noise into single incidents',
      'Document intake: emails, PDFs, drawings, purchase orders',
      'Drafting: ticket notes, documentation, quotes and status updates',
      'Copilots that pull history and next steps while a person works a case',
      'White-label agents MSPs can offer to their own clients',
    ],
    outcomes: [
      ['Working agent', 'Running on live work, with approvals on'],
      ['Audit trail', 'Every action logged and reviewable'],
      ['Runbook', 'How it works, how to change it, how to switch it off'],
    ],
    fit: 'Teams with a clear, repetitive workflow and the systems access to automate it.',
    faqs: [
      { q: 'Which models do you use?', a: 'Whichever fits the job and your data rules. That can be a commercial model through an enterprise API, or an open-source model hosted where you need it. We explain the trade-off in cost, quality and data handling before the build.' },
      { q: 'Can the agent act without approval?', a: 'Only where you decide it can, and only after the pilot data shows it gets that task right. Security-sensitive actions always go to a person.' },
      { q: 'Who owns the agent?', a: 'You do. We hand over the configuration, prompts, integrations and runbooks, and we can keep running and improving it for you if you prefer.' },
    ],
  },
  'ai-implementation-training': {
    title: 'Implementation & training',
    seoTitle: 'AI Implementation & Team Training',
    serviceType: 'AI implementation and training',
    lede: 'An agent nobody trusts does not get used. We roll out in stages, train the people who work alongside it, and measure adoption as carefully as accuracy.',
    description: 'AI implementation and hands-on training: staged rollout, integration with your systems, role-based training and adoption tracking, so your team trusts and uses the agent.',
    answer: 'Moksh AI handles AI implementation in stages: integration with your systems, a pilot with human approval, then a wider rollout. Alongside it we train the people who will work with the agent, by role, and track both accuracy and adoption so problems show up early.',
    includes: [
      'Integration with your PSA, RMM, Microsoft 365 or business systems',
      'Staged rollout: one queue or team first, then wider',
      'Role-based training for technicians, coordinators and managers',
      'Approval and escalation rules agreed with team leads',
      'Adoption and accuracy reporting in the first months',
      'Practical AI training for staff using general AI tools safely',
    ],
    outcomes: [
      ['Adoption', 'People using the agent in their daily work'],
      ['Confidence', 'Clear rules on what it does and when it asks'],
      ['Ownership', 'Internal champions who can manage it after handover'],
    ],
    fit: 'Teams that have chosen what to automate and want it to land well with the people affected.',
    faqs: [
      { q: 'Can you train our staff on general AI tools too?', a: 'Yes. Alongside agent rollouts we run practical sessions on using general AI assistants safely: what data not to paste, how to check output, and where they save real time.' },
      { q: 'Is training remote?', a: 'Usually, yes. Sessions are recorded and backed by short written guides so new starters can catch up.' },
    ],
  },
  'ai-cost-optimization': {
    title: 'AI cost optimisation',
    seoTitle: 'AI Cost Optimization: Cut AI Subscription & Usage Spend',
    serviceType: 'AI cost optimization',
    lede: 'Many teams pay for overlapping AI subscriptions and seats nobody uses. We find the waste and replace what makes sense with open-source models, low-code tools or a small automation.',
    description: 'AI cost optimization: audit AI subscriptions and model usage, remove unused and overlapping seats, and replace per-seat tools with open-source models or targeted automation where it pays.',
    answer: 'AI cost optimisation from Moksh AI audits what you pay for AI tools and model usage, removes unused and overlapping seats, and replaces per-seat tools with open-source models, low-code tools or targeted automation where that is cheaper and good enough.',
    includes: [
      'Inventory of AI subscriptions, seats and actual usage',
      'Overlap review: tools that do the same job',
      'Model usage review for teams calling AI APIs directly',
      'Open-source and low-code alternatives where quality allows',
      'A savings plan with contract dates and switching effort',
    ],
    outcomes: [
      ['Lower spend', 'Unused and duplicate seats removed'],
      ['Clear ownership', 'Who approves AI tools from now on'],
      ['Funding', 'Savings that can pay for the first automation pilot'],
    ],
    fit: 'Companies where AI tools were adopted team by team and nobody has the full picture of spend.',
    faqs: [
      { q: 'Can I check this myself first?', a: 'Yes. Our free AI subscription audit calculator gives you a first estimate from your own tool list. We go deeper: usage logs, contract terms and replacement options.' },
      { q: 'Will people lose tools they rely on?', a: 'Not without a replacement they accept. We look at actual usage first and agree changes with team leads.' },
    ],
  },
} as const;

export type ServiceSlug = keyof typeof serviceDetails;
