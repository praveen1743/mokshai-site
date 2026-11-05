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

export const usd = (n: number, digits = 0) =>
  (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
export const num = (n: number, digits = 0) =>
  n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
