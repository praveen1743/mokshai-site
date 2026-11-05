// Insights topics. Each topic gets a hub page at /insights/<slug>/.
export const topics = [
  {
    slug: 'msp-automation',
    name: 'MSP automation',
    description: 'Guides for managed service providers on using AI agents for ticket triage, tier-1 resolution, NOC alerts and documentation.',
    intro: 'How managed service providers can take routine tickets, alert noise and documentation off their technicians with AI agents, while engineers keep every decision that matters.',
  },
  {
    slug: 'strategy-and-roi',
    name: 'Strategy and ROI',
    description: 'How to choose what to automate, compare build options, measure a pilot and work out whether an AI project pays back.',
    intro: 'Choosing what to automate, comparing the ways to build it, and measuring whether it pays back, before and after a pilot.',
  },
  {
    slug: 'security-and-governance',
    name: 'Security and governance',
    description: 'Permissions, approvals, audit logs and data handling for AI agents that work inside business systems.',
    intro: 'What an AI agent should be allowed to touch, who approves what, and how to keep a complete record of everything it does.',
  },
  {
    slug: 'operations',
    name: 'Operations automation',
    description: 'Automating quoting, estimating, document intake and back-office handoffs in operations-heavy businesses.',
    intro: 'Automating the preparation work in quoting, estimating, document intake and reporting, so skilled people spend their time on decisions.',
  },
] as const;

export type TopicSlug = (typeof topics)[number]['slug'];
export const topicSlugs = topics.map((t) => t.slug) as [TopicSlug, ...TopicSlug[]];
export const topicBySlug = (slug: string) => topics.find((t) => t.slug === slug)!;
