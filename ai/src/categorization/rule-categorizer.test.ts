import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { NormalizedTransaction, categoryPredictionSchema } from '../types/transaction.js';
import { categorizeTransaction, categorizeByRules } from './index.js';

describe('Expense Categorization Rule Engine', () => {
  const baseTransaction: NormalizedTransaction = {
    id: 'tx_test_001',
    userId: 'usr_001',
    amount: 250,
    type: 'expense',
    date: '2026-08-12T12:00:00Z',
    currency: 'INR',
  };

  test('Swiggy categorizes as Food', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: 'Swiggy',
    };

    const res = categorizeTransaction(tx);
    assert.equal(res.categoryId, 'food');
    assert.equal(res.categoryName, 'Food');
    assert.equal(res.method, 'rule');
    assert.ok(res.confidence >= 0.9);
    assert.ok(res.matchedSignals.includes('swiggy'));

    // Validate using Zod schema
    const validation = categoryPredictionSchema.safeParse({
      category: res.categoryId!,
      confidence: res.confidence,
      method: res.method,
    });
    assert.equal(validation.success, true);
  });

  test('Netflix categorizes as Subscriptions', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: 'Netflix',
    };

    const res = categorizeTransaction(tx);
    assert.equal(res.categoryId, 'subscriptions');
    assert.equal(res.categoryName, 'Subscriptions');
    assert.equal(res.method, 'rule');
    assert.ok(res.confidence >= 0.9);
    assert.ok(res.matchedSignals.includes('netflix'));
  });

  test('Uber categorizes as Transport', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: 'Uber',
    };

    const res = categorizeTransaction(tx);
    assert.equal(res.categoryId, 'transport');
    assert.equal(res.categoryName, 'Transport');
    assert.equal(res.method, 'rule');
    assert.ok(res.confidence >= 0.9);
    assert.ok(res.matchedSignals.includes('uber'));
  });

  test('Amazon categorizes as Shopping', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: 'Amazon',
    };

    const res = categorizeTransaction(tx);
    assert.equal(res.categoryId, 'shopping');
    assert.equal(res.categoryName, 'Shopping');
    assert.equal(res.method, 'rule');
    assert.ok(res.confidence >= 0.9);
    assert.ok(res.matchedSignals.includes('amazon'));
  });

  test('Airtel categorizes as Bills', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: 'Airtel Broadband',
    };

    const res = categorizeTransaction(tx);
    assert.equal(res.categoryId, 'bills');
    assert.equal(res.categoryName, 'Bills');
    assert.equal(res.method, 'rule');
    assert.ok(res.confidence >= 0.85);
  });

  test('Blinkit categorizes as Groceries', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: 'Blinkit',
    };

    const res = categorizeTransaction(tx);
    assert.equal(res.categoryId, 'groceries');
    assert.equal(res.categoryName, 'Groceries');
    assert.equal(res.method, 'rule');
    assert.ok(res.confidence >= 0.9);
    assert.ok(res.matchedSignals.includes('blinkit'));
  });

  test('uppercase merchant matches correctly', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: 'SWIGGY',
    };

    const res = categorizeTransaction(tx);
    assert.equal(res.categoryId, 'food');
    assert.equal(res.method, 'rule');
    assert.ok(res.confidence >= 0.9);
  });

  test('lowercase merchant matches correctly', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: 'swiggy',
    };

    const res = categorizeTransaction(tx);
    assert.equal(res.categoryId, 'food');
    assert.equal(res.method, 'rule');
  });

  test('extra whitespace in merchant matches correctly', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: '   SWIGGY    FOOD   ',
    };

    const res = categorizeByRules(tx);
    assert.equal(res.categoryId, 'food');
    assert.equal(res.method, 'rule');
  });

  test('merchant signal takes precedence over description signal', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: 'Uber',
      description: 'Grocery shopping trip',
    };

    const res = categorizeTransaction(tx);
    // Merchant 'Uber' (Transport) takes precedence over description 'Grocery'
    assert.equal(res.categoryId, 'transport');
    assert.equal(res.method, 'rule');
  });

  test('unknown merchant with no matching signals returns null category', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: 'Random Unknown Store XYZ',
      description: 'Miscellaneous item',
    };

    const res = categorizeTransaction(tx);
    assert.equal(res.categoryId, null);
    assert.equal(res.categoryName, null);
    assert.equal(res.confidence, 0);
    assert.deepEqual(res.matchedSignals, []);
    assert.equal(res.method, 'rule');
  });

  test('empty merchant and description returns null category', () => {
    const tx: NormalizedTransaction = {
      ...baseTransaction,
      merchant: undefined,
      description: undefined,
    };

    const res = categorizeTransaction(tx);
    assert.equal(res.categoryId, null);
    assert.equal(res.categoryName, null);
    assert.equal(res.confidence, 0);
    assert.equal(res.method, 'rule');
  });
});
