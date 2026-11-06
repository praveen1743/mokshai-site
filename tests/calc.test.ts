import { describe, it, expect } from 'vitest';
import { ticketRoi, backOffice, spendAudit, budgetPlan, readinessScore, readinessQuestions, usd } from '../src/lib/calc';

describe('ticketRoi', () => {
  const base = { ticketsPerMonth: 1500, tier1Share: 0.45, agentShare: 0.4, minutesPerTicket: 15, hourlyCost: 42, buildCost: 15000, runCostPerMonth: 700 };

  it('computes hours, value, payback and FTE', () => {
    const r = ticketRoi(base);
    expect(r.ticketsHandled).toBeCloseTo(270);
    expect(r.hoursPerMonth).toBeCloseTo(67.5);
    expect(r.valuePerMonth).toBeCloseTo(2835);
    expect(r.netPerMonth).toBeCloseTo(2135);
    expect(r.paybackMonths).toBeCloseTo(15000 / 2135);
    expect(r.firstYearNet).toBeCloseTo(2135 * 12 - 15000);
    expect(r.fte).toBeCloseTo(67.5 / 140);
  });

  it('returns null payback when run cost exceeds value', () => {
    const r = ticketRoi({ ...base, runCostPerMonth: 5000 });
    expect(r.netPerMonth).toBeLessThan(0);
    expect(r.paybackMonths).toBeNull();
  });

  it('clamps nonsense input instead of producing NaN', () => {
    const r = ticketRoi({ ...base, ticketsPerMonth: Number.NaN, tier1Share: 3, agentShare: -1 });
    expect(r.hoursPerMonth).toBe(0);
    expect(Number.isNaN(r.valuePerMonth)).toBe(false);
  });
});

describe('backOffice', () => {
  it('computes saved hours and freed capacity', () => {
    const r = backOffice({ requestsPerWeek: 40, minutesPerRequest: 90, automatableShare: 0.5, hourlyCost: 45, workingWeeks: 48 });
    expect(r.hoursPerWeek).toBeCloseTo(30);
    expect(r.hoursPerYear).toBeCloseTo(1440);
    expect(r.valuePerYear).toBeCloseTo(64800);
    expect(r.minutesLeftPerRequest).toBeCloseTo(45);
    expect(r.extraRequestsPerWeek).toBeCloseTo(40);
  });

  it('reports infinite capacity when everything is automated', () => {
    const r = backOffice({ requestsPerWeek: 10, minutesPerRequest: 30, automatableShare: 1, hourlyCost: 40, workingWeeks: 48 });
    expect(r.extraRequestsPerWeek).toBe(Infinity);
  });
});

describe('spendAudit', () => {
  it('counts unused seats and overlapping tools without double counting', () => {
    const r = spendAudit([
      { tool: 'Chat A', category: 'Chat assistant', seats: 50, pricePerSeat: 30, activeUsers: 30 },
      { tool: 'Chat B', category: 'chat assistant', seats: 20, pricePerSeat: 20, activeUsers: 20 },
      { tool: 'Notes', category: 'Meeting notes', seats: 10, pricePerSeat: 10, activeUsers: 10 },
    ]);
    expect(r.monthlySpend).toBe(1500 + 400 + 100);
    expect(r.unusedSeatCost).toBe(20 * 30);
    expect(r.overlapCategories).toEqual(['chat assistant']);
    expect(r.overlapCost).toBe(20 * 20); // Chat B's used seats
    expect(r.potentialAnnualSavings).toBe((600 + 400) * 12);
  });

  it('ignores empty rows and caps active users at seats', () => {
    const r = spendAudit([
      { tool: '', category: '', seats: 0, pricePerSeat: 0, activeUsers: 0 },
      { tool: 'X', category: 'x', seats: 5, pricePerSeat: 10, activeUsers: 9 },
    ]);
    expect(r.monthlySpend).toBe(50);
    expect(r.unusedSeatCost).toBe(0);
  });
});

describe('budgetPlan', () => {
  it('derives the investment ceiling and phase split', () => {
    const r = budgetPlan({ monthlyBenefit: 3000, runCostPerMonth: 600, targetPaybackMonths: 12, contingencyShare: 0.15, split: { discovery: 10, pilot: 30, scale: 60 } });
    expect(r.netPerMonth).toBe(2400);
    expect(r.maxInvestment).toBe(28800);
    expect(r.contingency).toBeCloseTo(4320);
    expect(r.workingBudget).toBeCloseTo(24480);
    expect(r.phases.discovery + r.phases.pilot + r.phases.scale).toBeCloseTo(24480);
    expect(r.phases.pilot).toBeCloseTo(24480 * 0.3);
  });

  it('returns zero budget when run cost exceeds benefit', () => {
    const r = budgetPlan({ monthlyBenefit: 500, runCostPerMonth: 600, targetPaybackMonths: 12, contingencyShare: 0.1, split: { discovery: 1, pilot: 1, scale: 1 } });
    expect(r.maxInvestment).toBe(0);
  });
});

describe('usd', () => {
  it('formats negatives with a real minus sign', () => {
    expect(usd(-1234)).toBe('−$1,234');
    expect(usd(1234.5, 0)).toBe('$1,235');
  });
});

describe('readinessScore', () => {
  const all = (v: number) => Object.fromEntries(readinessQuestions.map((q) => [q.id, v]));

  it('scores a fully ready business as ready with no next steps', () => {
    const r = readinessScore(all(2));
    expect(r.score).toBe(16);
    expect(r.percent).toBe(100);
    expect(r.band).toBe('ready');
    expect(r.nextSteps).toHaveLength(0);
  });

  it('bands by percentage and lists the lowest answers first', () => {
    const r = readinessScore({ ...all(1), policy: 0 });
    expect(r.score).toBe(7);
    expect(r.band).toBe('conditional');
    expect(r.nextSteps[0]).toMatch(/acceptable-use policy/);
    expect(r.nextSteps).toHaveLength(3);
    expect(readinessScore(all(0)).band).toBe('foundations');
  });

  it('caps the band when a whole area scores zero', () => {
    const r = readinessScore({ ...all(2), apis: 0, accounts: 0 });
    expect(r.percent).toBe(75);
    expect(r.band).toBe('conditional');
    expect(r.areas.find((a) => a.area === 'Systems')!.score).toBe(0);
  });

  it('treats missing and out-of-range answers safely', () => {
    const r = readinessScore({ access: 9, sensitive: -3 });
    expect(r.score).toBe(2);
    expect(Number.isNaN(r.percent)).toBe(false);
  });
});
