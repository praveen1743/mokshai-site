import { industries } from './lib/industries';
// Single source of truth for company facts. Every page, the footer and the
// JSON-LD read from here, so the entity stays consistent everywhere.
// Values marked CONFIRM came from conflicting sources on the old site.

export const site = {
  url: 'https://mokshai.net',
  name: 'Moksh AI',
  legalName: 'Moksh Infotech Pvt Ltd',
  cin: 'U72501GJ2022PTC131216',
  description:
    'Moksh AI is an AI implementation and automation services company. We build AI into the systems businesses already run: AI features in existing apps, RAG knowledge assistants, enterprise integrations, workflow automation and custom agents, with people in control.',
  // Confirmed by the company (13 Nov 2026): support is staffed around the clock.
  supportHours: '24/7',
  // Confirmed by the company (17 Nov 2026); stated on mokshai.net/about-us/.
  teamSize: '500+ people from 12+ countries',
  email: 'info@mokshtech.net', // CONFIRM: old schema used info@mokshai.net
  offices: [
    {
      label: 'United States',
      phone: '+1-301-960-4037', // CONFIRM: privacy policy lists +1-301-252-2673
      street: '11 Roosevelt Ave',
      locality: 'Lake Hiawatha',
      region: 'NJ',
      postalCode: '07034',
      country: 'US',
      countryName: 'United States',
    },
    {
      label: 'India (delivery team)',
      phone: '+91-99786-02779',
      street: '1203, Pushpak Landmark, Anand Nagar Road, Prahlad Nagar',
      locality: 'Ahmedabad',
      region: 'Gujarat',
      postalCode: '380015',
      country: 'IN',
      countryName: 'India',
    },
  ],
  social: {
    linkedin: 'https://www.linkedin.com/company/mokshai',
    facebook: 'https://www.facebook.com/people/Moksh-AI/61580863746149/',
    instagram: 'https://www.instagram.com/mokshai_',
  },
  group: [
    { name: 'Moksh Tech', url: 'https://www.mokshtech.net/', what: 'MSP outsourcing and dedicated engineers' },
    { name: 'Moksh CAD', url: 'https://www.mokshcad.com/', what: 'CAD drafting' },
    { name: 'Moksh Estimating', url: 'https://mokshestimating.com/', what: 'Construction estimating' },
    { name: 'Moksh Signs', url: 'https://www.mokshsigns.com/', what: 'Sign design' },
    { name: 'Moksh Digital', url: 'https://mokshdigital.net/', what: 'Digital marketing' },
    { name: 'Moksh Recruiting', url: 'https://mokshrecruiting.com/', what: 'Recruiting' },
    { name: 'Moksh Accountants', url: 'https://mokshaccountants.com/', what: 'Accounting' },
    { name: 'Moksh Group', url: 'https://moksh-group.com/', what: 'Group home' },
  ],
  // People shown on the site. Name, role and LinkedIn confirmed by the company.
  leadership: [
    { name: 'Mick Shah', role: 'CEO, Moksh Group', linkedin: 'https://www.linkedin.com/in/mick-shah-22a9a76/', photo: '/media/mick-shah.v1.jpg', portrait: '/media/mick-shah-portrait.v1.jpg' },
  ],
  // Google tag IDs carried over from the old site (Site Kit + Google Ads).
  googleTagIds: ['GT-PLWBBHHT', 'AW-17581749958'],
  // Set PUBLIC_FORM_ENDPOINT at build time (Formspree, Web3Forms, HubSpot, your own API).
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT ?? '',
  // Optional scheduling link (Cal.com, Calendly, HubSpot meetings).
  bookingUrl: import.meta.env.PUBLIC_BOOKING_URL ?? '',
};

export type NavLink = { label: string; href: string; note?: string };
export type NavItem = NavLink | { label: string; children: NavLink[] };

// Ten services in three groups: Plan (decide what is worth doing), Build (put AI
// into the business) and Run (adopt it and keep it affordable).
export const services = [
  {
    slug: 'ai-consulting',
    group: 'Plan',
    name: 'AI strategy, readiness & governance',
    short: 'Find where AI creates real value, check your data and risks, and leave with a ranked roadmap and the rules AI will run under.',
  },
  {
    slug: 'llm-ai-integration',
    group: 'Build',
    name: 'AI in your existing apps',
    short: 'Add copilots, summaries, document Q&A, search and chat to the applications and SaaS products you already run, without a rewrite.',
  },
  {
    slug: 'rag-knowledge-systems',
    group: 'Build',
    name: 'RAG & knowledge systems',
    short: 'Assistants that answer from your own documents, policies and records, cite their sources and respect who is allowed to see what.',
  },
  {
    slug: 'enterprise-ai-integration',
    group: 'Build',
    name: 'Enterprise AI integration',
    short: 'Connect AI to your ERP, CRM, helpdesk and data platforms through secure APIs, so it reads and updates the systems of record.',
  },
  {
    slug: 'ai-workflow-automation',
    group: 'Build',
    name: 'AI workflow & document automation',
    short: 'Automate multi-step processes end to end, from reading invoices and forms to routing approvals across your systems.',
  },
  {
    slug: 'custom-ai-development',
    group: 'Build',
    name: 'Custom AI agents',
    short: 'Agents designed around your processes that take actions in your systems, with approval and escalation rules you set.',
  },
  {
    slug: 'ai-voice-agents',
    group: 'Build',
    name: 'AI voice agents & assistants',
    short: 'Voice assistants that handle routine calls, look up information and pass complex requests to your staff with the context attached.',
  },
  {
    slug: 'ai-prototype-to-production',
    group: 'Build',
    name: 'AI prototype to production',
    short: 'Turn a promising AI prototype into a production application with proper login, data security, deployment and monitoring.',
  },
  {
    slug: 'ai-implementation-training',
    group: 'Run',
    name: 'Implementation, training & support',
    short: 'Deploy AI into daily work, train the people who use it, and monitor accuracy and cost once it is live.',
  },
  {
    slug: 'ai-cost-optimization',
    group: 'Run',
    name: 'AI cost optimisation',
    short: 'Cut unnecessary AI spend with the right mix of models, open-source options, low-code tools and targeted automation.',
  },
] as const;
export type ServiceSlug = (typeof services)[number]['slug'];

// "Industries" lists an industry only when it has its own page behind it (src/lib/industries.ts).
export const nav: NavItem[] = [
  {
    label: 'Industries',
    children: [
      ...industries.map((i) => ({ label: i.name, href: i.href, note: i.note })),
      { label: 'All industries', href: '/industries/', note: 'Every industry we support' },
      { label: 'Not sure where AI fits?', href: '/tools/ai-readiness-scorecard/', note: 'Take the readiness scorecard' },
    ],
  },
  {
    label: 'Services',
    children: [
      ...services.map((s) => ({ label: s.name, href: `/services/${s.slug}/` })),
      { label: 'All services and how we work', href: '/services/' },
    ],
  },
  { label: 'AI agents', href: '/agents/' },
  { label: 'Calculators', href: '/tools/' },
  { label: 'Insights', href: '/insights/' },
  { label: 'About', href: '/about/' },
];
/** Tuple of service slugs for z.enum() in content.config.ts and the Keystatic config. */
export const serviceSlugs = services.map((s) => s.slug) as [ServiceSlug, ...ServiceSlug[]];
