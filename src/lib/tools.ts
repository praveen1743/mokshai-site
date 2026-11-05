export const tools = [
  {
    slug: 'msp-ticket-roi',
    name: 'MSP ticket automation ROI',
    audience: 'For MSPs',
    question: 'How many technician hours an agent could return, and how fast a build pays back.',
    description: 'Estimate the technician hours an AI agent returns from tier-1 tickets, the monthly value, and the payback period on the build. Free, with the formula shown.',
  },
  {
    slug: 'back-office-hours',
    name: 'Back-office time savings',
    audience: 'For operations',
    question: 'How much quoting, intake and admin time you get back, and how much more work the same team can take on.',
    description: 'Estimate the hours an AI agent saves on quotes, estimates and document intake each week, the yearly value, and the extra capacity at the same headcount.',
  },
  {
    slug: 'ai-spend-audit',
    name: 'AI subscription audit',
    audience: 'Any team',
    question: 'How much of your AI tool spend goes to unused seats and tools that do the same job.',
    description: 'List the AI tools you pay for and see unused-seat cost, overlapping tools by category, and potential annual savings.',
  },
  {
    slug: 'ai-budget-planner',
    name: 'AI project budget planner',
    audience: 'Any team',
    question: 'The most you should spend on an AI project for it to pay back on time, split by phase.',
    description: 'Work out the largest AI project budget that still pays back within your target, with contingency and a discovery / pilot / scale split.',
  },
] as const;
