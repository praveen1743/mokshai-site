// Demo agents Moksh AI can show a client on a call. Every agent listed here
// must exist and be demo-ready: confirmed by the company (13 Nov 2026).
// Previews on the site are illustrations, not screenshots, and are labelled so.

export const agentIndustries = [
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'finance', label: 'Finance & insurance' },
  { key: 'ecommerce', label: 'E-commerce' },
  { key: 'operations', label: 'Business operations' },
  { key: 'legal', label: 'Legal' },
] as const;
export type AgentIndustry = (typeof agentIndustries)[number]['key'];

export type AgentPreview = 'report' | 'pipeline' | 'ticker' | 'shop' | 'inbox' | 'contract';

export interface Agent {
  slug: string;
  name: string;
  industry: AgentIndustry;
  summary: string;
  does: string[];
  stack: string[];
  preview: AgentPreview;
}

export const agents: Agent[] = [
  {
    slug: 'medical-report-insights',
    name: 'Medical report insights agent',
    industry: 'healthcare',
    summary: 'Reads uploaded lab reports and medical PDFs, explains results in plain language, flags out-of-range values and tracks trends across visits.',
    does: ['Extracts values from lab PDFs', 'Flags results outside the reference range', 'Shows trends across past reports'],
    stack: ['LangGraph', 'Claude API', 'RAG', 'PDF parsing'],
    preview: 'report',
  },
  {
    slug: 'claims-automation',
    name: 'Claims automation agent',
    industry: 'healthcare',
    summary: 'A multi-agent pipeline that extracts data from insurance claim documents, checks it against policy rules, and routes each claim for approval or review.',
    does: ['Reads claim forms with OCR', 'Validates against policy rules', 'Routes to auto-approve or human review'],
    stack: ['CrewAI', 'Claude API', 'OCR', 'PostgreSQL'],
    preview: 'pipeline',
  },
  {
    slug: 'financial-reasoning',
    name: 'Financial reasoning agent',
    industry: 'finance',
    summary: 'Pulls market data and produces structured reasoning for a ticker, with supporting metrics, news sentiment and risk notes for an analyst to review.',
    does: ['Gathers prices, financials and news', 'Summarises sentiment and key metrics', 'Writes risk notes for a person to check'],
    stack: ['Direct tool-calling', 'Claude API', 'Market data API', 'React'],
    preview: 'ticker',
  },
  {
    slug: 'ecommerce-personal-shopper',
    name: 'E-commerce personal shopper',
    industry: 'ecommerce',
    summary: 'A shopping assistant that understands plain-language requests, searches the product catalogue and returns ranked recommendations with the reasons for each.',
    does: ['Understands requests like "a light laptop under $1,000"', 'Searches the catalogue by what the shopper means', 'Explains why each product matches'],
    stack: ['LangGraph', 'Claude API', 'Vector search', 'Node.js'],
    preview: 'shop',
  },
  {
    slug: 'email-meeting-assistant',
    name: 'Email & meeting assistant',
    industry: 'operations',
    summary: 'Drafts context-aware email replies and schedules meetings with a generated agenda, so the person only reviews and sends.',
    does: ['Drafts replies from thread context', 'Finds a time and books the meeting', 'Writes the agenda from the conversation'],
    stack: ['CrewAI Flows', 'Claude API', 'Gmail API', 'Calendar API'],
    preview: 'inbox',
  },
  {
    slug: 'legal-document-review',
    name: 'Legal document review agent',
    industry: 'legal',
    summary: 'Scans contracts and legal PDFs, extracts key clauses, flags risk levels and cites the exact source passage for every finding.',
    does: ['Extracts key clauses and dates', 'Rates each finding by risk', 'Links every finding to the source text'],
    stack: ['LlamaIndex', 'Claude API', 'Vector embeddings', 'PostgreSQL'],
    preview: 'contract',
  },
];

export const agentIndustryLabel = (key: AgentIndustry) => agentIndustries.find((i) => i.key === key)?.label ?? key;
export const agentBySlug = (slug: string) => agents.find((a) => a.slug === slug);
