import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  transactionSchema,
  categoryPredictionSchema,
  NormalizedTransaction,
  CategoryPrediction,
} from './transaction.js';

describe('Transaction Data Contract & Validation', () => {
  test('valid transaction passes validation', () => {
    const validTx: NormalizedTransaction = {
      id: 'tx_12345',
      userId: 'user_99',
      amount: 45.5,
      type: 'expense',
      date: '2026-08-12T14:30:00Z',
      merchant: 'Starbucks',
      description: 'Coffee meeting',
      category: 'Food & Dining',
      accountId: 'acc_01',
      currency: 'USD',
    };

    const result = transactionSchema.safeParse(validTx);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.id, 'tx_12345');
      assert.equal(result.data.amount, 45.5);
      assert.equal(result.data.type, 'expense');
    }
  });

  test('invalid amount fails validation', () => {
    const invalidTx = {
      id: 'tx_12345',
      userId: 'user_99',
      amount: 'forty-five', // invalid type
      type: 'expense',
      date: '2026-08-12T14:30:00Z',
      currency: 'USD',
    };

    const result = transactionSchema.safeParse(invalidTx);
    assert.equal(result.success, false);
  });

  test('invalid transaction type fails validation', () => {
    const invalidTx = {
      id: 'tx_12345',
      userId: 'user_99',
      amount: 100,
      type: 'invalid_type', // not income/expense/transfer
      date: '2026-08-12T14:30:00Z',
      currency: 'USD',
    };

    const result = transactionSchema.safeParse(invalidTx);
    assert.equal(result.success, false);
  });

  test('missing required field fails validation', () => {
    const incompleteTx = {
      id: 'tx_12345',
      // userId missing
      amount: 100,
      type: 'income',
      date: '2026-08-12T14:30:00Z',
      currency: 'USD',
    };

    const result = transactionSchema.safeParse(incompleteTx);
    assert.equal(result.success, false);
  });

  test('valid category prediction passes validation', () => {
    const prediction: CategoryPrediction = {
      category: 'Groceries',
      confidence: 0.95,
      method: 'rule',
    };

    const result = categoryPredictionSchema.safeParse(prediction);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.category, 'Groceries');
      assert.equal(result.data.confidence, 0.95);
      assert.equal(result.data.method, 'rule');
    }
  });
});
