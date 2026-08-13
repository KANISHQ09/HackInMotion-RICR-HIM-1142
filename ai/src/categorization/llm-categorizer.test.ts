import test from 'node:test';
import assert from 'node:assert/strict';
import { categorizeByLLM } from './llm-categorizer.js';
import { MockLLMProvider } from '../llm/provider.js';
import { NormalizedTransaction } from '../types/transaction.js';

const sampleTx: NormalizedTransaction = {
  id: 'tx-llm-1',
  userId: 'usr-1',
  amount: 2500,
  type: 'expense',
  date: '2026-08-13T10:00:00.000Z',
  merchant: 'Coursera Inc',
  description: 'Online Learning Subscription',
  currency: 'INR',
};

test('LLM Categorizer: Returns valid result from LLM provider', async () => {
  const mockProvider = new MockLLMProvider({
    categoryId: 'education',
    categoryName: 'Education',
    confidence: 0.94,
    reason: 'Recognized Coursera online education platform.',
  });

  const res = await categorizeByLLM(sampleTx, mockProvider);
  assert.equal(res.categoryId, 'education');
  assert.equal(res.categoryName, 'Education');
  assert.equal(res.confidence, 0.94);
  assert.equal(res.method, 'llm');
  assert.equal(res.reason, 'Recognized Coursera online education platform.');
});

test('LLM Categorizer: Throws error when LLM returns invalid category ID', async () => {
  const invalidCategoryProvider = new MockLLMProvider({
    categoryId: 'non-existent-category-id',
    categoryName: 'Invalid Category',
    confidence: 0.90,
  });

  await assert.rejects(
    () => categorizeByLLM(sampleTx, invalidCategoryProvider),
    /not in the allowed taxonomy/
  );
});

test('LLM Categorizer: Handles provider failures gracefully via exception', async () => {
  const failingProvider = new MockLLMProvider();
  failingProvider.shouldFail = true;
  failingProvider.failureMessage = 'API quota exceeded';

  await assert.rejects(
    () => categorizeByLLM(sampleTx, failingProvider),
    /API quota exceeded/
  );
});
