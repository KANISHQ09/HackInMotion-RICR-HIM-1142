import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSavingsSimulation } from './calculator.js';
import { runSavingsSimulation } from './simulator.js';
import { validateSimulationRequest } from './types.js';

test('Simulator: 30% category reduction calculates exact arithmetic', () => {
  const req = validateSimulationRequest({
    currency: 'INR',
    monthlyIncome: 65000,
    currentMonthlyExpenses: 48200,
    currentMonthlySavings: 16800,
    scenario: {
      type: 'category_reduction',
      category: 'Food',
      currentMonthlySpend: 8400,
      reductionPercent: 30,
    },
    months: 12,
  });

  const res = calculateSavingsSimulation(req);

  // 30% of 8400 = 2520
  assert.equal(res.impact.monthlySavingsIncrease, 2520);
  assert.equal(res.projected.monthlyExpenses, 45680);
  assert.equal(res.projected.monthlySavings, 19320);
  assert.equal(res.impact.annualSavingsIncrease, 30240); // 2520 * 12
  assert.equal(res.impact.totalPeriodImpact, 30240);
  assert.equal(res.projected.savingsRate, 29.72); // (19320 / 65000) * 100
});

test('Simulator: Fixed amount category reduction', () => {
  const req = validateSimulationRequest({
    currency: 'INR',
    monthlyIncome: 50000,
    currentMonthlyExpenses: 40000,
    scenario: {
      type: 'category_reduction',
      category: 'Shopping',
      currentMonthlySpend: 5000,
      reductionAmount: 2000,
    },
    months: 6,
  });

  const res = calculateSavingsSimulation(req);

  assert.equal(res.impact.monthlySavingsIncrease, 2000);
  assert.equal(res.projected.monthlyExpenses, 38000);
  assert.equal(res.projected.monthlySavings, 12000);
  assert.equal(res.impact.totalPeriodImpact, 12000); // 2000 * 6
});

test('Simulator: Recurring expense cancellation', () => {
  const req = validateSimulationRequest({
    currency: 'INR',
    monthlyIncome: 80000,
    currentMonthlyExpenses: 50000,
    scenario: {
      type: 'recurring_cancellation',
      description: 'Gym Membership',
      monthlyAmount: 1500,
    },
    months: 12,
  });

  const res = calculateSavingsSimulation(req);

  assert.equal(res.impact.monthlySavingsIncrease, 1500);
  assert.equal(res.impact.annualSavingsIncrease, 18000);
});

test('Simulator: Target savings rate scenario', () => {
  const req = validateSimulationRequest({
    currency: 'INR',
    monthlyIncome: 100000,
    currentMonthlyExpenses: 80000, // current savings = 20000 (20%)
    scenario: {
      type: 'savings_rate_target',
      targetSavingsRate: 35, // target savings = 35000 (35%)
    },
    months: 12,
  });

  const res = calculateSavingsSimulation(req);

  assert.equal(res.impact.monthlySavingsIncrease, 15000); // 35000 - 20000
  assert.equal(res.projected.monthlySavings, 35000);
  assert.equal(res.projected.savingsRate, 35.0);
  assert.equal(res.impact.annualSavingsIncrease, 180000);
});

test('Simulator: Rejects invalid payloads', () => {
  assert.throws(
    () =>
      validateSimulationRequest({
        monthlyIncome: -500, // Invalid negative income
        currentMonthlyExpenses: 1000,
        scenario: { type: 'recurring_cancellation', description: 'Test', monthlyAmount: 100 },
      }),
    /Monthly income must be a positive number/
  );
});

test('Simulator Pipeline: Generates explanation narrative without altering numbers', async () => {
  const res = await runSavingsSimulation({
    currency: 'INR',
    monthlyIncome: 65000,
    currentMonthlyExpenses: 48200,
    scenario: {
      type: 'category_reduction',
      category: 'Food',
      currentMonthlySpend: 8400,
      reductionPercent: 30,
    },
    months: 12,
  });

  assert.equal(res.impact.monthlySavingsIncrease, 2520);
  assert.ok(res.explanation.length > 20);
  assert.ok(res.explanation.includes('2,520') || res.explanation.includes('2520'));
});
