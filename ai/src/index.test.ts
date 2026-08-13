import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { server } from './index.js';

const TEST_PORT = 3099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

before((_, done) => {
  server.listen(TEST_PORT, '127.0.0.1', () => done());
});

after((_, done) => {
  server.close(() => done());
});

function postJson(pathname: string, payload: unknown): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      `${BASE_URL}${pathname}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode || 500, body: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode || 500, body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(pathname: string): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${pathname}`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode || 500, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode || 500, body });
        }
      });
    });
    req.on('error', reject);
  });
}

test('HTTP GET /health returns status ok', async () => {
  const res = await getJson('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
  assert.equal(res.body.service, 'ai');
});

test('HTTP POST /api/v1/categorize categorizes known merchant via rule engine', async () => {
  const payload = {
    transaction: {
      id: 'tx-100',
      userId: '42',
      amount: 450,
      type: 'expense',
      date: '2026-08-13T10:00:00.000Z',
      merchant: 'SWIGGY',
      description: 'SWIGGY INSTAMART',
      accountId: '1',
      currency: 'INR',
    },
  };

  const res = await postJson('/api/v1/categorize', payload);
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.prediction.categoryId, 'food');
  assert.equal(res.body.prediction.categoryName, 'Food');
  assert.equal(res.body.prediction.method, 'rule');
  assert.deepEqual(res.body.prediction.matchedSignals, ['swiggy']);
});

test('HTTP POST /api/v1/categorize handles unknown merchant with fallback', async () => {
  const payload = {
    transaction: {
      id: 'tx-200',
      userId: '42',
      amount: 1500,
      type: 'expense',
      date: '2026-08-13T10:00:00.000Z',
      merchant: 'XYZ Unknown Store',
      description: 'Misc items',
      currency: 'INR',
    },
  };

  const res = await postJson('/api/v1/categorize', payload);
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.prediction.categoryId);
  assert.ok(['rule', 'llm', 'fallback'].includes(res.body.prediction.method));
});

test('HTTP POST /api/v1/categorize rejects invalid transaction payload with 400', async () => {
  const payload = {
    transaction: {
      id: '', // Empty ID is invalid
      amount: 'not-a-number',
    },
  };

  const res = await postJson('/api/v1/categorize', payload);
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.error.includes('Transaction validation failed'));
});

test('HTTP GET /unhandled-route returns 404 Not Found', async () => {
  const res = await getJson('/unhandled-route');
  assert.equal(res.status, 404);
  assert.equal(res.body.error, 'Not Found');
});
