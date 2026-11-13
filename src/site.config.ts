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
    'Moksh AI builds AI agents and automation for businesses worldwide, inside the tools they already use, with a person checking the work before anything goes out.',
  // Confirmed by the company (13 Nov 2026): support is staffed around the clock.
  supportHours: '24/7',
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

export const services = [
  {
    slug: 'ai-consulting',
    name: 'AI strategy & consulting',
    short: 'Find the work worth automating, rank it by payback, and leave with a roadmap your team can run.',
  },
  {
    slug: 'custom-ai-development',
    name: 'Custom AI agents & development',
    short: 'Agents built around the tools you already run (email, CRM, helpdesk, ERP, PSA), with escalation rules you set.',
  },
  {
    slug: 'ai-voice-agents',
    name: 'AI voice agents & assistants',
    short: 'Phone and voice assistants that answer routine calls, look things up in your systems and hand the caller to a person with a summary.',
  },
  {
    slug: 'llm-ai-integration',
    name: 'LLM & AI integration',
    short: 'Add AI features such as summaries, document Q&A, search and chat to the product or tools you already have, without a rewrite.',
  },
  {
    slug: 'ai-prototype-to-production',
    name: 'AI prototype to production',
    short: 'Take an AI demo or app-builder prototype and make it ready for real users: login, data security, payments, hosting and monitoring.',
  },
  {
    slug: 'ai-implementation-training',
    name: 'Implementation & training',
    short: 'Rollout, integration, and hands-on training so the people who use the agent trust it.',
  },
  {
    slug: 'ai-cost-optimization',
    name: 'AI cost optimisation',
    short: 'Cut overlapping AI subscriptions with open-source models, low-code tools and targeted automation.',
  },
] as const;
export type ServiceSlug = (typeof services)[number]['slug'];

// "We support" lists an industry only when it has its own page behind it (src/lib/industries.ts).
export const nav: NavItem[] = [
  {
    label: 'We support',
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
