import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeTransaction,
  normalizeMerchant,
  normalizeAmount,
  normalizeDate,
  normalizeTransactionType,
} from './transaction.js';

describe('Transaction Normalization Layer', () => {
  test('normal transaction is normalized and validated correctly', () => {
    const raw = {
      id: 'tx_100',
      userId: 'user_1',
      amount: 50.25,
      type: 'expense',
      date: '2026-08-12T10:00:00.000Z',
      merchant: 'Target',
      description: 'Household items',
      category: 'Shopping',
      accountId: 'acc_main',
      currency: 'usd',
    };

    const normalized = normalizeTransaction(raw);
    assert.equal(normalized.id, 'tx_100');
    assert.equal(normalized.userId, 'user_1');
    assert.equal(normalized.amount, 50.25);
    assert.equal(normalized.type, 'expense');
    assert.equal(normalized.date, '2026-08-12T10:00:00.000Z');
    assert.equal(normalized.merchant, 'Target');
    assert.equal(normalized.currency, 'USD');
  });

  test('merchant with extra spaces is trimmed and collapsed', () => {
    const merchant = normalizeMerchant('   STARBUCKS    COFFEE   ');
    assert.equal(merchant, 'Starbucks Coffee');

    const raw = {
      id: 'tx_101',
      userId: 'user_1',
      amount: 5.5,
      type: 'EXPENSE',
      date: '2026-08-12',
      merchant: '   WHOLE   FOODS   MARKET  ',
      currency: 'USD',
    };

    const normalized = normalizeTransaction(raw);
    assert.equal(normalized.merchant, 'Whole Foods Market');
  });

  test('merchant with inconsistent casing is converted to Title Case', () => {
    const merchant1 = normalizeMerchant('sTaRbUcKs cOfFeE');
    assert.equal(merchant1, 'Starbucks Coffee');

    const merchant2 = normalizeMerchant('ubEr eATs');
    assert.equal(merchant2, 'Uber Eats');
  });

  test('numeric amount provided as a string is converted to number', () => {
    const amount = normalizeAmount('12.99');
    assert.equal(amount, 12.99);

    const raw = {
      id: 'tx_102',
      userId: 'user_1',
      amount: '125.75 ',
      type: 'income',
      date: '2026-08-12',
      currency: 'EUR',
    };

    const normalized = normalizeTransaction(raw);
    assert.equal(normalized.amount, 125.75);
    assert.equal(normalized.type, 'income');
  });

  test('valid date is converted to ISO-8601 string format', () => {
    const isoDate = normalizeDate('2026-08-12');
    assert.equal(isoDate.startsWith('2026-08-12'), true);
    assert.equal(isoDate.endsWith('Z'), true);

    const timestampDate = normalizeDate(1700000000000);
    assert.equal(typeof timestampDate, 'string');
    assert.equal(timestampDate.endsWith('Z'), true);
  });

  test('invalid amount throws an error', () => {
    assert.throws(
      () => normalizeAmount('not-a-number'),
      /cannot parse "not-a-number" as number/
    );

    assert.throws(
      () => normalizeTransaction({
        id: 'tx_103',
        userId: 'user_1',
        amount: 'abc',
        type: 'expense',
        date: '2026-08-12',
        currency: 'USD',
      }),
      /cannot parse "abc" as number/
    );
  });

  test('invalid date throws an error', () => {
    assert.throws(
      () => normalizeDate('invalid-date-string'),
      /cannot be parsed as a valid date/
    );

    assert.throws(
      () => normalizeTransaction({
        id: 'tx_104',
        userId: 'user_1',
        amount: 10,
        type: 'expense',
        date: 'not-a-date',
        currency: 'USD',
      }),
      /cannot be parsed as a valid date/
    );
  });

  test('invalid transaction type throws an error', () => {
    assert.throws(
      () => normalizeTransactionType('unknown_type'),
      /is not supported/
    );

    assert.throws(
      () => normalizeTransaction({
        id: 'tx_105',
        userId: 'user_1',
        amount: 10,
        type: 'subscription', // invalid type
        date: '2026-08-12',
        currency: 'USD',
      }),
      /is not supported/
    );
  });
});
