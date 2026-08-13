import test from 'node:test';
import assert from 'node:assert/strict';
import { categorizeTransaction } from './index.js';
import { MockLLMProvider } from '../llm/provider.js';
import { NormalizedTransaction } from '../types/transaction.js';

const knownTx: NormalizedTransaction = {
  id: 'tx-1',
  userId: 'u-1',
  amount: 450,
  type: 'expense',
  date: new Date().toISOString(),
  merchant: 'SWIGGY',
  description: 'Swiggy Instamart Order',
  currency: 'INR',
};

const unknownTx: NormalizedTransaction = {
  id: 'tx-2',
  userId: 'u-1',
  amount: 1200,
  type: 'expense',
  date: new Date().toISOString(),
  merchant: 'Random Tech Vendor LLC',
  description: 'Annual Cloud Software License',
  currency: 'INR',
};

test('Hybrid Pipeline: High-confidence rule prediction returns immediately without LLM call', async () => {
  const mockProvider = new MockLLMProvider();
  
  const result = await categorizeTransaction(knownTx, {
    confidenceThreshold: 0.70,
    provider: mockProvider,
  });

  assert.equal(result.categoryId, 'food');
  assert.equal(result.categoryName, 'Food');
  assert.equal(result.method, 'rule');
  assert.ok(result.confidence >= 0.70);
  assert.deepEqual(result.matchedSignals, ['swiggy']);
});

test('Hybrid Pipeline: Low-confidence prediction calls LLM provider fallback', async () => {
  const mockProvider = new MockLLMProvider({
    categoryId: 'subscriptions',
    categoryName: 'Subscriptions',
    confidence: 0.92,
    reason: 'Identified software subscription from description.',
  });

  const result = await categorizeTransaction(unknownTx, {
    confidenceThreshold: 0.70,
    provider: mockProvider,
  });

  assert.equal(result.categoryId, 'subscriptions');
  assert.equal(result.categoryName, 'Subscriptions');
  assert.equal(result.method, 'llm');
  assert.equal(result.confidence, 0.92);
  assert.equal(result.reason, 'Identified software subscription from description.');
});

test('Hybrid Pipeline: Provider failure triggers safe fallback result', async () => {
  const failingProvider = new MockLLMProvider();
  failingProvider.shouldFail = true;

  const result = await categorizeTransaction(unknownTx, {
    confidenceThreshold: 0.70,
    provider: failingProvider,
  });

  assert.equal(result.method, 'fallback');
  assert.equal(result.categoryId, 'other');
  assert.equal(result.confidence, 0.20);
  assert.ok(result.reason?.includes('No reliable categorization evidence'));
});

test('Hybrid Pipeline: No LLM provider configured works safely', async () => {
  const result = await categorizeTransaction(unknownTx, {
    confidenceThreshold: 0.70,
    provider: null,
  });

  assert.equal(result.method, 'fallback');
  assert.equal(result.categoryId, 'other');
  assert.equal(result.confidence, 0.20);
});

test('Hybrid Pipeline: Custom confidence threshold behavior', async () => {
  // Description keyword match has confidence ~0.70
  const cafeTx: NormalizedTransaction = {
    id: 'tx-3',
    userId: 'u-1',
    amount: 150,
    type: 'expense',
    date: new Date().toISOString(),
    description: 'Corner Cafe Coffee',
    currency: 'INR',
  };

  const mockProvider = new MockLLMProvider({
    categoryId: 'food',
    categoryName: 'Food',
    confidence: 0.95,
    reason: 'LLM verified cafe expense.',
  });

  // With high threshold 0.90, rule prediction (0.70) is insufficient -> calls LLM
  const llmResult = await categorizeTransaction(cafeTx, {
    confidenceThreshold: 0.90,
    provider: mockProvider,
  });

  assert.equal(llmResult.method, 'llm');
  assert.equal(llmResult.confidence, 0.95);

  // With low threshold 0.50, rule prediction (0.70) is sufficient -> uses rule
  const ruleResult = await categorizeTransaction(cafeTx, {
    confidenceThreshold: 0.50,
    provider: mockProvider,
  });

  assert.equal(ruleResult.method, 'rule');
});
