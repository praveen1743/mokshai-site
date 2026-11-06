// Pure formula functions for every calculator. No DOM access, so they can be
// unit-tested (tests/calc.test.ts) and reused in the UI scripts.

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : 0));

/** Productive hours per technician per month used for FTE equivalents. */
export const PRODUCTIVE_HOURS_PER_MONTH = 140;

export interface TicketInput {
  ticketsPerMonth: number;
  tier1Share: number;      // 0..1
  agentShare: number;      // 0..1 of tier-1 the agent resolves or fully prepares
  minutesPerTicket: number;
  hourlyCost: number;      // loaded technician cost, USD
  buildCost: number;       // one-time, USD
  runCostPerMonth: number; // USD
}

export interface TicketResult {
  hoursPerMonth: number;
  valuePerMonth: number;
  netPerMonth: number;
  paybackMonths: number | null; // null = never pays back
  firstYearNet: number;
  fte: number;
  ticketsHandled: number;
}

export function ticketRoi(i: TicketInput): TicketResult {
  const tickets = clamp(i.ticketsPerMonth, 0, 1e7);
  const handled = tickets * clamp(i.tier1Share, 0, 1) * clamp(i.agentShare, 0, 1);
  const hoursPerMonth = (handled * clamp(i.minutesPerTicket, 0, 600)) / 60;
  const valuePerMonth = hoursPerMonth * clamp(i.hourlyCost, 0, 1e4);
  const run = clamp(i.runCostPerMonth, 0, 1e8);
  const build = clamp(i.buildCost, 0, 1e9);
  const netPerMonth = valuePerMonth - run;
  return {
    hoursPerMonth,
    valuePerMonth,
    netPerMonth,
    paybackMonths: netPerMonth > 0 ? build / netPerMonth : null,
    firstYearNet: netPerMonth * 12 - build,
    fte: hoursPerMonth / PRODUCTIVE_HOURS_PER_MONTH,
    ticketsHandled: handled,
  };
}

export interface BackOfficeInput {
  requestsPerWeek: number;
  minutesPerRequest: number;
  automatableShare: number; // 0..1 of the prep time an agent can draft or do
  hourlyCost: number;
  workingWeeks: number;
}

export interface BackOfficeResult {
  hoursPerWeek: number;
  hoursPerYear: number;
  valuePerYear: number;
  minutesLeftPerRequest: number;
  extraRequestsPerWeek: number; // capacity freed at the same headcount
}

export function backOffice(i: BackOfficeInput): BackOfficeResult {
  const req = clamp(i.requestsPerWeek, 0, 1e6);
  const mins = clamp(i.minutesPerRequest, 0, 6000);
  const share = clamp(i.automatableShare, 0, 1);
  const weeks = clamp(i.workingWeeks, 0, 52);
  const savedMinutes = req * mins * share;
  const hoursPerWeek = savedMinutes / 60;
  const minutesLeftPerRequest = mins * (1 - share);
  return {
    hoursPerWeek,
    hoursPerYear: hoursPerWeek * weeks,
    valuePerYear: hoursPerWeek * weeks * clamp(i.hourlyCost, 0, 1e4),
    minutesLeftPerRequest,
    extraRequestsPerWeek: minutesLeftPerRequest > 0 ? savedMinutes / minutesLeftPerRequest : Infinity,
  };
}

export interface SpendRow {
  tool: string;
  category: string;
  seats: number;
  pricePerSeat: number; // USD per seat per month
  activeUsers: number;
}

export interface SpendResult {
  monthlySpend: number;
  unusedSeatCost: number;     // per month
  overlapCost: number;        // per month: every tool except the largest in a duplicated category
  overlapCategories: string[];
  potentialAnnualSavings: number; // unused + overlap, without double counting
}

export function spendAudit(rows: SpendRow[]): SpendResult {
  const clean = rows
    .map((r) => {
      const seats = clamp(r.seats, 0, 1e6);
      return {
        tool: r.tool.trim(),
        category: r.category.trim().toLowerCase(),
        seats,
        price: clamp(r.pricePerSeat, 0, 1e6),
        active: clamp(r.activeUsers, 0, seats),
      };
    })
    .filter((r) => r.seats > 0 && r.price > 0);

  const monthlySpend = clean.reduce((s, r) => s + r.seats * r.price, 0);
  const unusedSeatCost = clean.reduce((s, r) => s + (r.seats - r.active) * r.price, 0);

  // Overlap: in a category with 2+ tools, everything except the tool with the
  // largest active spend is a consolidation candidate. Only its *used* seats
  // count here, since unused seats are already counted above.
  const byCat = new Map<string, typeof clean>();
  for (const r of clean) {
    if (!r.category) continue;
    byCat.set(r.category, [...(byCat.get(r.category) ?? []), r]);
  }
  let overlapCost = 0;
  const overlapCategories: string[] = [];
  for (const [cat, list] of byCat) {
    if (list.length < 2) continue;
    overlapCategories.push(cat);
    const sorted = [...list].sort((a, b) => b.active * b.price - a.active * a.price);
    for (const r of sorted.slice(1)) overlapCost += r.active * r.price;
  }
  return {
    monthlySpend,
    unusedSeatCost,
    overlapCost,
    overlapCategories,
    potentialAnnualSavings: (unusedSeatCost + overlapCost) * 12,
  };
}

export interface BudgetInput {
  monthlyBenefit: number;     // gross value per month, e.g. from a calculator
  runCostPerMonth: number;
  targetPaybackMonths: number;
  contingencyShare: number;   // 0..1, reserved out of the total
  split: { discovery: number; pilot: number; scale: number }; // relative weights
}

export interface BudgetResult {
  netPerMonth: number;
  maxInvestment: number;   // largest one-time spend that still pays back in time
  contingency: number;
  workingBudget: number;
  phases: { discovery: number; pilot: number; scale: number };
}

export function budgetPlan(i: BudgetInput): BudgetResult {
  const netPerMonth = clamp(i.monthlyBenefit, 0, 1e9) - clamp(i.runCostPerMonth, 0, 1e9);
  const maxInvestment = Math.max(0, netPerMonth) * clamp(i.targetPaybackMonths, 0, 120);
  const c = clamp(i.contingencyShare, 0, 0.9);
  const contingency = maxInvestment * c;
  const workingBudget = maxInvestment - contingency;
  const w = { d: clamp(i.split.discovery, 0, 100), p: clamp(i.split.pilot, 0, 100), s: clamp(i.split.scale, 0, 100) };
  const total = w.d + w.p + w.s || 1;
  return {
    netPerMonth,
    maxInvestment,
    contingency,
    workingBudget,
    phases: {
      discovery: (workingBudget * w.d) / total,
      pilot: (workingBudget * w.p) / total,
      scale: (workingBudget * w.s) / total,
    },
  };
}

// ---------------------------------------------------------------------------
// AI readiness scorecard. Eight questions in four areas, each answered 0, 1 or
// 2. The bands are Moksh AI's own rule of thumb for "what to do next", not an
// industry benchmark, and the page says so.

export const READINESS_AREAS = ['Data and access', 'Process', 'Governance', 'Systems'] as const;
export type ReadinessArea = (typeof READINESS_AREAS)[number];

export interface ReadinessQuestion {
  id: string;
  area: ReadinessArea;
  text: string;
  options: [string, string, string]; // scores 0, 1, 2
  fix: string;                         // next step when the answer is below 2
}

export const readinessQuestions: ReadinessQuestion[] = [
  { id: 'access', area: 'Data and access', text: 'Do people only have access to the files, sites and mailboxes their role needs?', options: ['Never reviewed', 'Partly, old shares remain', 'Reviewed in the last year'], fix: 'Review sharing on SharePoint, Teams and file shares before you connect an AI assistant. Assistants can show a person anything their account can already open.' },
  { id: 'sensitive', area: 'Data and access', text: 'Do you know where sensitive client, financial and personal data is kept?', options: ['No', 'Some of it', 'Yes, labelled or kept separately'], fix: 'List where sensitive data lives and mark which kinds must never be pasted into an AI tool.' },
  { id: 'baseline', area: 'Process', text: 'Is there one workflow with a known monthly volume and time per item?', options: ['Not yet', 'A rough idea', 'Yes, measured from our systems'], fix: 'Pick one workflow and pull two to four weeks of volume and handling time from your PSA, ERP or shared inbox.' },
  { id: 'owner', area: 'Process', text: 'Does that workflow have one named owner who can approve changes to it?', options: ['No', 'Shared between people', 'Yes, one person'], fix: 'Name one owner for the pilot workflow. They approve the rules and review the results each week.' },
  { id: 'policy', area: 'Governance', text: 'Do you have an AI acceptable-use policy that staff have read?', options: ['No', 'Draft or informal', 'Yes, published and acknowledged'], fix: 'Publish a short AI acceptable-use policy: approved tools, data that must never be entered, and who to ask.' },
  { id: 'inventory', area: 'Governance', text: 'Do you know which AI tools staff use today, including free ones?', options: ['No idea', 'We know the paid ones', 'Full list, reviewed'], fix: 'Build a list of the AI tools in use, paid and free, from expense reports, SSO logs and a short staff survey.' },
  { id: 'apis', area: 'Systems', text: 'Do the systems in that workflow have an API, a connector or a reliable export?', options: ['No or unsure', 'Some of them', 'All of them'], fix: 'List every system the workflow touches and check each for an API or connector before scoping a build.' },
  { id: 'accounts', area: 'Systems', text: 'Can each system give an integration its own limited account and keep an audit log?', options: ['No', 'Some systems', 'Yes'], fix: 'Check that each system can issue a separate least-privilege account for an integration and log what it does.' },
];

export type ReadinessBand = 'foundations' | 'conditional' | 'ready';

export interface ReadinessResult {
  score: number;        // 0..16
  max: number;          // 16
  percent: number;      // 0..100
  band: ReadinessBand;
  areas: { area: ReadinessArea; score: number; max: number }[];
  nextSteps: string[];  // up to 3 fixes, lowest answers first
}

export const READINESS_BAND_LABEL: Record<ReadinessBand, string> = {
  foundations: 'Fix the foundations first',
  conditional: 'Ready for a narrow pilot, with conditions',
  ready: 'Ready to pilot',
};

/** answers: question id → 0, 1 or 2. Missing or invalid answers count as 0. */
export function readinessScore(answers: Record<string, number>): ReadinessResult {
  const val = (id: string) => Math.round(clamp(answers[id], 0, 2));
  const max = readinessQuestions.length * 2;
  const score = readinessQuestions.reduce((s, q) => s + val(q.id), 0);
  const percent = (score / max) * 100;
  const areas = READINESS_AREAS.map((area) => {
    const qs = readinessQuestions.filter((q) => q.area === area);
    return { area, score: qs.reduce((s, q) => s + val(q.id), 0), max: qs.length * 2 };
  });
  let band: ReadinessBand = percent >= 75 ? 'ready' : percent >= 40 ? 'conditional' : 'foundations';
  // A whole area at zero means a pilot would stall on it, whatever the total.
  if (band === 'ready' && areas.some((a) => a.score === 0)) band = 'conditional';
  const nextSteps = readinessQuestions
    .map((q, i) => ({ q, v: val(q.id), i }))
    .filter((x) => x.v < 2)
    .sort((a, b) => a.v - b.v || a.i - b.i)
    .slice(0, 3)
    .map((x) => x.q.fix);
  return { score, max, percent, band, areas, nextSteps };
}

export const usd = (n: number, digits = 0) =>
  (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
export const num = (n: number, digits = 0) =>
  n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
