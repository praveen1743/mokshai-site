// Industries listed under "We support". MSPs and manufacturing & operations
// have their own hand-built pages; the rest share /industries/[slug]/.
// No figures here: every claim must be one the company can stand behind.
import type { ServiceSlug } from './serviceDetails';

export interface IndustryTask { t: string; d: string }
export interface Industry {
  slug: string;
  name: string;
  nav: string;          // short label for menus
  note: string;         // one line under the menu label
  href: string;
  icon: string;         // Icon.astro name
  title?: string;       // page H1
  seoTitle?: string;
  description?: string;
  lede?: string;
  answer?: string;
  tasks?: IndustryTask[];
  agents?: string[];    // agent slugs from agents.ts
  services?: ServiceSlug[];
  faqs?: { q: string; a: string }[];
}

export const industries: Industry[] = [
  {
    slug: 'msp', name: 'Managed service providers', nav: 'MSPs', note: 'Tickets, alerts and help desk', href: '/msp/', icon: 'ticket',
  },
  {
    slug: 'small-business',
    name: 'Small & mid-sized businesses',
    nav: 'SMBs & MSP clients',
    note: 'Inbox, documents and admin',
    href: '/industries/small-business/',
    icon: 'people',
    title: 'AI agents for small and mid-sized businesses',
    seoTitle: 'AI Agents & Automation for Small and Mid-Sized Businesses',
    description: 'AI agents and automation for small and mid-sized businesses, including the clients of managed service providers: inbox, documents, scheduling, follow-up and safe use of AI tools.',
    lede: 'Take the inbox, document and admin work off a small team, safely, inside the Microsoft 365 or Google Workspace you already pay for.',
    answer: 'Small and mid-sized businesses get the most from AI on the work that eats a few hours of every person\'s week: answering routine emails, filing documents, chasing follow-ups, booking meetings and writing first drafts. We set up agents on the tools you already use, agree what they may do on their own and what a person approves, and put a simple AI usage policy in place so staff use AI tools safely. If an MSP manages your IT, we work alongside them.',
    tasks: [
      { t: 'Inbox and replies', d: 'Draft replies to routine emails from past answers and your documents, for a person to review and send.' },
      { t: 'Meetings and follow-up', d: 'Find a time, book the meeting, write the agenda and send the follow-up notes.' },
      { t: 'Document intake', d: 'Read invoices, forms and PDFs, pull out the fields and file them in the right system.' },
      { t: 'Customer questions', d: 'A chat or voice assistant that answers common questions and passes the rest to your team.' },
      { t: 'Safe AI at work', d: 'An acceptable-use policy, approved tools and a check for AI apps staff already use without approval.' },
    ],
    agents: ['email-meeting-assistant', 'ecommerce-personal-shopper'],
    services: ['ai-consulting', 'custom-ai-development', 'ai-implementation-training'],
    faqs: [
      { q: 'We are a small team. Is this worth it for us?', a: 'Often yes, because a few hours saved per person each week is a large share of a small team\'s capacity. The first call tells you plainly whether one workflow is worth automating, and we say so if it is not.' },
      { q: 'Our IT is managed by an MSP. Does that matter?', a: 'No. We work with your MSP on access and security, and agree who supports what before anything goes live.' },
    ],
  },
  {
    slug: 'manufacturing', name: 'Manufacturing & operations', nav: 'Manufacturing & operations', note: 'Quoting, intake and back office', href: '/operations/', icon: 'layers',
  },
  {
    slug: 'fintech',
    name: 'Fintech & insurance',
    nav: 'Fintech & insurance',
    note: 'Claims, research and compliance',
    href: '/industries/fintech/',
    icon: 'coins',
    title: 'AI agents for fintech and insurance',
    seoTitle: 'AI Agents for Fintech & Insurance: Claims, Research, Compliance',
    description: 'AI agents for fintech and insurance teams: claims intake and validation, financial research and reasoning, document checks, compliance monitoring and customer support, with every decision reviewed by a person.',
    lede: 'Agents that read the documents, check them against your rules and prepare the decision, so analysts, underwriters and claims handlers spend their time deciding.',
    answer: 'In fintech and insurance the strongest early use of AI is preparing the decisions people make: extracting data from claims and applications, checking it against policy and compliance rules, gathering market data and news for an analyst, and routing each case to the right person with the evidence attached. Every agent we build here logs what it read and why it flagged something, and a person approves anything that moves money or changes a customer\'s position.',
    tasks: [
      { t: 'Claims intake and validation', d: 'Extract data from claim documents, check it against policy rules, and route to approval or review.' },
      { t: 'Financial research', d: 'Collect market data, filings and news for a ticker or company and write structured notes for an analyst.' },
      { t: 'KYC and document checks', d: 'Read identity and business documents, compare them with the application and flag mismatches.' },
      { t: 'Compliance monitoring', d: 'Watch communications or transactions for rule breaches and raise alerts with the source attached.' },
      { t: 'Customer support', d: 'Answer balance, status and policy questions by chat or phone, and hand anything sensitive to a person.' },
    ],
    agents: ['claims-automation', 'financial-reasoning', 'legal-document-review'],
    services: ['custom-ai-development', 'ai-voice-agents', 'llm-ai-integration'],
    faqs: [
      { q: 'Can the agent approve a claim or a transaction on its own?', a: 'Only where you decide it may, and only within limits you set. By default, anything that moves money or changes a customer\'s position goes to a person for approval.' },
      { q: 'How is customer data protected?', a: 'Each agent gets the minimum access it needs, every action is logged, and we agree where data is stored and which models may process it before the build starts. See our security page for the questions we answer first.' },
    ],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    nav: 'Healthcare',
    note: 'Reports, claims and patient admin',
    href: '/industries/healthcare/',
    icon: 'shield',
    title: 'AI agents for healthcare teams',
    seoTitle: 'AI Agents for Healthcare: Medical Reports, Claims & Patient Admin',
    description: 'AI agents for healthcare providers and health businesses: medical report summaries, insurance claims processing, patient intake, scheduling and front-desk calls, with clinicians and staff keeping every decision.',
    lede: 'Agents that take on the reading, form-filling and phone work around care, while clinicians and staff keep every clinical and billing decision.',
    answer: 'Healthcare teams lose hours to work around care rather than care itself: reading reports, completing claims, entering intake forms and answering the same phone questions. AI agents can prepare that work: summarise a lab report in plain language and flag values outside the reference range, extract and validate claim data, or book and reschedule appointments by phone. A clinician or staff member reviews anything clinical or financial, and we agree data handling and privacy requirements with you before any build.',
    tasks: [
      { t: 'Medical report summaries', d: 'Read lab reports and medical PDFs, flag out-of-range values and track trends across visits.' },
      { t: 'Insurance claims', d: 'Extract claim data, check it against payer and policy rules, and route for approval or review.' },
      { t: 'Patient intake', d: 'Turn intake forms and referral letters into structured records in your system.' },
      { t: 'Scheduling and front desk', d: 'A voice or chat assistant that books, reschedules and answers routine questions, and transfers the rest.' },
    ],
    agents: ['medical-report-insights', 'claims-automation'],
    services: ['custom-ai-development', 'ai-voice-agents', 'llm-ai-integration'],
    faqs: [
      { q: 'Does the agent give medical advice?', a: 'No. It summarises and flags what is in a report for a clinician or the patient\'s care team to review. Clinical decisions stay with qualified people.' },
      { q: 'How do you handle patient data?', a: 'We agree with you where data is stored, who can see it, which models may process it and what is logged, and build to your privacy and regulatory requirements. Nothing goes live until that is signed off.' },
    ],
  },
  {
    slug: 'real-estate',
    name: 'Real estate',
    nav: 'Real estate',
    note: 'Leads, leases and tenant requests',
    href: '/industries/real-estate/',
    icon: 'route',
    title: 'AI agents for real estate and property management',
    seoTitle: 'AI Agents for Real Estate & Property Management',
    description: 'AI agents for brokers, agents and property managers: lead follow-up, viewing scheduling, lease and contract review, tenant maintenance requests and listing descriptions, inside the CRM and tools you already use.',
    lede: 'Answer every enquiry, book viewings, read leases and log tenant requests without adding staff, and keep people on the conversations that close deals.',
    answer: 'Real estate teams win or lose on response time and lose hours to paperwork. AI agents can reply to new enquiries as they arrive, qualify them and book viewings in your calendar, read leases and contracts to pull out dates and obligations, and turn tenant emails and calls into maintenance tickets. Brokers, agents and property managers keep negotiations, pricing and anything that needs judgement.',
    tasks: [
      { t: 'Lead response and follow-up', d: 'Reply to portal and website enquiries, ask qualifying questions and log them in your CRM.' },
      { t: 'Viewing scheduling', d: 'Offer times, book viewings and send reminders and directions.' },
      { t: 'Lease and contract review', d: 'Extract key dates, rent terms, renewal options and obligations, with the source clause cited.' },
      { t: 'Tenant requests', d: 'Turn tenant emails and calls into maintenance tickets with the details your contractor needs.' },
      { t: 'Listing drafts', d: 'Draft listing descriptions from property details and photos for an agent to edit.' },
    ],
    agents: ['email-meeting-assistant', 'legal-document-review'],
    services: ['custom-ai-development', 'ai-voice-agents', 'llm-ai-integration'],
    faqs: [
      { q: 'Will it work with our CRM?', a: 'Agents are built on the APIs of the systems you already use. On the first call we review your CRM and tell you plainly whether an agent can work with it.' },
      { q: 'Can it answer the phone after hours?', a: 'Yes. A voice assistant can answer enquiries and tenant calls around the clock and pass anything urgent to the person on call.' },
    ],
  },
  {
    slug: 'legal',
    name: 'Legal & professional services',
    nav: 'Legal & professional',
    note: 'Contracts, research and intake',
    href: '/industries/legal/',
    icon: 'doc',
    title: 'AI agents for legal and professional services',
    seoTitle: 'AI Agents for Legal & Professional Services: Contract Review & Intake',
    description: 'AI agents for law firms, in-house legal and professional services: contract review with cited sources, clause extraction, client intake, document Q&A and drafting support, reviewed by your professionals.',
    lede: 'Agents that read the contract, find the clause and cite the page, so your professionals start from a prepared review instead of a blank page.',
    answer: 'Legal and professional services firms bill for judgement but spend hours on reading and finding. AI agents can review contracts and extract key clauses, rate each finding by risk and link it to the exact source passage, answer questions across a document set, and turn client enquiries into structured intake. Every output is a draft for a qualified person to check; the agent never sends advice to a client on its own.',
    tasks: [
      { t: 'Contract review', d: 'Extract key clauses, dates and obligations, flag risk levels and cite the source text.' },
      { t: 'Document Q&A', d: 'Ask questions across a matter\'s documents and get answers with references.' },
      { t: 'Client intake', d: 'Turn enquiries into structured intake records and conflict-check inputs.' },
      { t: 'Drafting support', d: 'First drafts of routine letters and summaries for a professional to edit.' },
    ],
    agents: ['legal-document-review', 'email-meeting-assistant'],
    services: ['custom-ai-development', 'llm-ai-integration', 'ai-consulting'],
    faqs: [
      { q: 'Can we trust what the agent finds?', a: 'Every finding links to the passage it came from, so a reviewer can check it in seconds. The agent prepares the review; a qualified person signs it off.' },
      { q: 'Is client material kept confidential?', a: 'We agree storage, access and model processing with you before the build, keep each client\'s documents separated, and log every action the agent takes.' },
    ],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce & retail',
    nav: 'E-commerce & retail',
    note: 'Shopping help, orders and support',
    href: '/industries/ecommerce/',
    icon: 'target',
    title: 'AI agents for e-commerce and retail',
    seoTitle: 'AI Agents for E-commerce & Retail: Shopping Assistants & Support',
    description: 'AI agents for online stores and retailers: personal shopping assistants, order status and returns support, product content and catalogue clean-up, connected to your store platform.',
    lede: 'Help shoppers find the right product, answer "where is my order?" instantly, and keep your catalogue tidy, with your team handling the exceptions.',
    answer: 'For online stores, AI pays off fastest on two fronts: helping shoppers find the right product, and answering the order and returns questions that fill the support inbox. A shopping assistant can understand a request in plain language, search your catalogue by meaning and explain why each product fits. A support agent can look up an order, start a return within your policy and hand anything unusual to your team.',
    tasks: [
      { t: 'Personal shopping assistant', d: 'Understands requests in plain language and returns ranked products with reasons.' },
      { t: 'Order status and returns', d: 'Looks up orders, explains delivery status and starts returns within your policy.' },
      { t: 'Product content', d: 'Drafts descriptions, attributes and alt text from supplier data for review.' },
      { t: 'Catalogue clean-up', d: 'Finds duplicates, missing attributes and inconsistent categories.' },
    ],
    agents: ['ecommerce-personal-shopper', 'email-meeting-assistant'],
    services: ['custom-ai-development', 'llm-ai-integration', 'ai-prototype-to-production'],
    faqs: [
      { q: 'Which store platforms do you work with?', a: 'We build on the APIs of the platform you use. On the first call we review your store and tell you plainly what an agent can connect to.' },
      { q: 'Can the assistant make up products or prices?', a: 'It only recommends products returned by a search of your catalogue, with live prices from your store, and it says so when nothing matches.' },
    ],
  },
];

export const industryPages = industries.filter((i) => i.href.startsWith('/industries/'));
export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
