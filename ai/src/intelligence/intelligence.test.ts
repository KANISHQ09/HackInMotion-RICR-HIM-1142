import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateUnifiedContext,
  detectFinancialInsights,
  prioritizeInsights,
  generateRecommendations,
  explainFinancialHealth,
  analyzeFinancialIntelligence,
} from './index.js';
import { MockLLMProvider } from '../llm/provider.js';

const mockContextPayload = {
  currency: 'INR',
  summary: {
    income: 65000,
    expenses: 48200,
    savings: 16800,
    savingsRate: 25.85,
  },
  categories: [
    { category: 'Food', amount: 8400, percentage: 17.43, changePercent: 42.37, previousAmount: 5900 },
    { category: 'Rent', amount: 15000, percentage: 31.12, changePercent: 0 },
    { category: 'Shopping', amount: 9500, percentage: 19.71, changePercent: 25.0 },
  ],
  trends: [
    { month: '2026-06', totalIncome: 65000, totalExpense: 42000, netSavings: 23000, savingsRate: 35.38 },
    { month: '2026-07', totalIncome: 65000, totalExpense: 48200, netSavings: 16800, savingsRate: 25.85 },
  ],
  recurring: [
    { description: 'Netflix Premium', category: 'Subscriptions', count: 6, amount: 649 },
    { description: 'Spotify Duo', category: 'Subscriptions', count: 12, amount: 199 },
    { description: 'Cloud VPS', category: 'Subscriptions', count: 4, amount: 2500 },
  ],
  anomalies: [
    { category: 'Food', amount: 8400, average: 5500, reason: 'above 1.5x category average' },
  ],
  healthScore: {
    score: 68,
    insights: ['Savings rate is 25.85%'],
  },
  budgets: [
    { category: 'Food', limitAmount: 8000, spent: 8400, remaining: -400, progress: 105.0 },
    { category: 'Shopping', limitAmount: 10000, spent: 9500, remaining: 500, progress: 95.0 },
  ],
  goals: [
    { name: 'Emergency Fund', targetAmount: 100000, currentProgress: 60000, progress: 60.0 },
    { name: 'Vacation Trip', targetAmount: 50000, currentProgress: 8000, progress: 16.0 },
  ],
};

test('Intelligence Context Validation: Coerces and normalizes context correctly', () => {
  const context = validateUnifiedContext(mockContextPayload);
  assert.equal(context.currency, 'INR');
  assert.equal(context.summary?.income, 65000);
  assert.equal(context.categories.length, 3);
  assert.equal(context.budgets.length, 2);
});

test('Insight Engine: Detects spending increase, budget overspending, and concentration', () => {
  const context = validateUnifiedContext(mockContextPayload);
  const insights = detectFinancialInsights(context);

  const budgetOver = insights.find((i) => i.type === 'budget_overspending');
  assert.ok(budgetOver);
  assert.equal(budgetOver?.severity, 'critical');
  assert.equal(budgetOver?.metrics.spent, 8400);

  const spendInc = insights.find((i) => i.type === 'category_spending_increase');
  assert.ok(spendInc);
  assert.equal(spendInc?.metrics.changePercent, 42.4);

  const conc = insights.find((i) => i.type === 'spending_concentration');
  assert.ok(conc);
  assert.equal(conc?.metrics.percentageShare, 31.1); // Rent concentration
});

test('Insight Engine: Detects goal progress and goal risk', () => {
  const context = validateUnifiedContext(mockContextPayload);
  const insights = detectFinancialInsights(context);

  const goalProg = insights.find((i) => i.type === 'goal_progress');
  assert.ok(goalProg);
  assert.ok(goalProg?.title.includes('Emergency Fund'));

  const goalRisk = insights.find((i) => i.type === 'goal_risk');
  assert.ok(goalRisk);
  assert.ok(goalRisk?.title.includes('Vacation Trip'));
});

test('Insight Prioritization: Orders critical budget breaches above positive observations', () => {
  const context = validateUnifiedContext(mockContextPayload);
  const insights = detectFinancialInsights(context);
  const ranked = prioritizeInsights(insights);

  assert.ok(ranked.length >= 4);
  assert.equal(ranked[0].severity, 'critical');
  assert.equal(ranked[0].type, 'budget_overspending');
});

test('Recommendations Engine: Generates evidence-backed recommendations', () => {
  const context = validateUnifiedContext(mockContextPayload);
  const insights = detectFinancialInsights(context);
  const prioritized = prioritizeInsights(insights);
  const recs = generateRecommendations(prioritized, context);

  assert.ok(recs.length > 0);
  const budgetRec = recs.find((r) => r.title.includes('Food'));
  assert.ok(budgetRec);
  assert.equal(budgetRec?.priority, 'high');
  assert.ok(budgetRec?.reason.includes('over budget'));
});

test('Health Explanation: Explains score grounded strictly in context values', () => {
  const context = validateUnifiedContext(mockContextPayload);
  const insights = detectFinancialInsights(context);
  const healthDetails = explainFinancialHealth(context, insights);

  assert.equal(healthDetails.score, 68);
  assert.equal(healthDetails.rating, 'Good');
  assert.ok(healthDetails.explanation.includes('68/100'));
});

test('Unified Intelligence API: Runs full pipeline deterministically with null provider', async () => {
  const result = await analyzeFinancialIntelligence(mockContextPayload, { provider: null });

  assert.equal(result.summary.healthScore, 68);
  assert.ok(result.summary.topIssue.includes('Food') || result.summary.topIssue.includes('Over budget'));
  assert.ok(result.insights.length >= 5);
  assert.ok(result.recommendations.length >= 3);
  assert.ok(result.healthExplanation.length > 20);
  assert.ok(result.assistantReadyContext.currency === 'INR');
});

test('Unified Intelligence API: Operates safely with partial context', async () => {
  const partialPayload = {
    currency: 'INR',
    summary: { income: 50000, expenses: 30000 },
  };

  const result = await analyzeFinancialIntelligence(partialPayload, { provider: null });
  assert.equal(result.summary.healthScore, 70);
  assert.ok(result.insights.length >= 1); // strong savings performance
});

test('Unified Intelligence API: Synthesizes natural language summary with Mock LLM Provider', async () => {
  const mockProvider = new MockLLMProvider();
  const result = await analyzeFinancialIntelligence(mockContextPayload, { provider: mockProvider });

  assert.equal(result.summary.healthScore, 68);
  assert.ok(result.insights.length > 0);
  assert.ok(result.recommendations.length > 0);
});
