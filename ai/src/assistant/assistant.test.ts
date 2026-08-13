import test from 'node:test';
import assert from 'node:assert/strict';
import { processAssistantMessage } from './assistant-engine.js';
import { detectAssistantIntent } from './intent.js';
import { FinancialContext } from './types.js';
import { MockLLMProvider } from '../llm/provider.js';

const sampleContext: FinancialContext = {
  currency: 'INR',
  summary: {
    income: 65000,
    expenses: 48200,
    savings: 16800,
    savingsRate: 25.85,
  },
  categories: [
    { category: 'Food', amount: 8400, percentage: 17.43 },
    { category: 'Rent', amount: 15000, percentage: 31.12 },
    { category: 'Transport', amount: 4200, percentage: 8.71 },
  ],
  budgets: [
    { category: 'Food', limitAmount: 8000, spent: 8400, remaining: -400, progress: 105.0 },
    { category: 'Transport', limitAmount: 5000, spent: 4200, remaining: 800, progress: 84.0 },
  ],
  recurring: [
    { description: 'Netflix Premium', category: 'Subscriptions', type: 'debit', count: 6, amount: 649 },
    { description: 'Spotify Duo', category: 'Subscriptions', type: 'debit', count: 12, amount: 199 },
  ],
  anomalies: [
    { category: 'Food', amount: 8400, average: 5500, reason: 'above 1.5x category average' },
  ],
  healthScore: {
    score: 72,
    insights: ['Savings rate is healthy at 25.85%.'],
  },
};

test('Intent Detection: Correctly classifies user intents', () => {
  assert.equal(detectAssistantIntent('How much did I spend on food?'), 'category_spending');
  assert.equal(detectAssistantIntent('Am I over budget this month?'), 'budget_status');
  assert.equal(detectAssistantIntent('Why did I save less?'), 'savings_status');
  assert.equal(detectAssistantIntent('What recurring subscriptions do I have?'), 'recurring_expenses');
  assert.equal(detectAssistantIntent('Why is my spending high?'), 'anomaly_explanation');
  assert.equal(detectAssistantIntent('What is my financial health score?'), 'financial_health');
  assert.equal(detectAssistantIntent('How can I save more money?'), 'recommendations');
  assert.equal(detectAssistantIntent('Show me my spending summary'), 'spending_summary');
});

test('Assistant Engine: Answers category spending question deterministically', async () => {
  const result = await processAssistantMessage(
    {
      message: 'How much did I spend on food?',
      context: sampleContext,
    },
    { provider: null }
  );

  assert.equal(result.intent, 'category_spending');
  assert.ok(result.answer.includes('8,400') || result.answer.includes('8400'));
  assert.equal(result.facts[0].label, 'Food spending');
  assert.equal(result.facts[0].value, 8400);
});

test('Assistant Engine: Evaluates over-budget status deterministically', async () => {
  const result = await processAssistantMessage(
    {
      message: 'Am I over budget?',
      context: sampleContext,
    },
    { provider: null }
  );

  assert.equal(result.intent, 'budget_status');
  assert.ok(result.answer.includes('Food'));
  assert.ok(result.recommendations.length > 0);
});

test('Assistant Engine: Evaluates savings status', async () => {
  const result = await processAssistantMessage(
    {
      message: 'How much am I saving?',
      context: sampleContext,
    },
    { provider: null }
  );

  assert.equal(result.intent, 'savings_status');
  assert.equal(result.facts.find((f) => f.label === 'Net Savings')?.value, 16800);
});

test('Assistant Engine: Evaluates financial health score', async () => {
  const result = await processAssistantMessage(
    {
      message: 'What is my financial health score?',
      context: sampleContext,
    },
    { provider: null }
  );

  assert.equal(result.intent, 'financial_health');
  assert.equal(result.facts[0].value, '72 / 100');
});

test('Assistant Engine: Handles missing context gracefully without crashing', async () => {
  const result = await processAssistantMessage(
    {
      message: 'How much did I spend on food?',
      context: { currency: 'INR' }, // Empty context
    },
    { provider: null }
  );

  assert.equal(result.intent, 'category_spending');
  assert.ok(result.answer.includes("don't have category spending data"));
  assert.equal(result.facts.length, 0);
  assert.equal(result.confidence, 0.40);
});

test('Assistant Engine: Uses LLM provider when available and preserves facts', async () => {
  const mockProvider = new MockLLMProvider();

  const result = await processAssistantMessage(
    {
      message: 'How much did I spend on food?',
      context: sampleContext,
    },
    { provider: mockProvider }
  );

  assert.equal(result.intent, 'category_spending');
  assert.ok(result.facts.length > 0);
  assert.equal(result.facts[0].value, 8400);
});
