import http from 'node:http';
import { getConfig } from './config.js';
import { normalizeTransaction } from './normalization/transaction.js';
import { categorizeTransaction } from './categorization/index.js';
import { processAssistantMessage } from './assistant/index.js';
import { runSavingsSimulation } from './simulation/index.js';

const config = getConfig();
const PORT = config.port;
const HOST = config.host;

/**
 * Helper to read request body as a string
 */
function readRequestBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        // 1MB size limit safeguard
        req.destroy();
        reject(new Error('Request body payload size limit exceeded'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', (err) => reject(err));
  });
}

/**
 * Helper to send JSON responses
 */
function sendJson(res: http.ServerResponse, statusCode: number, payload: unknown): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

// Create a minimal lightweight HTTP server
export const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const method = (req.method || 'GET').toUpperCase();

  // GET /health
  if (method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, {
      status: 'ok',
      service: 'ai',
    });
    return;
  }

  // POST /api/v1/categorize
  if (method === 'POST' && url.pathname === '/api/v1/categorize') {
    try {
      const rawBody = await readRequestBody(req);
      if (!rawBody.trim()) {
        sendJson(res, 400, {
          success: false,
          error: 'Missing request body',
        });
        return;
      }

      let parsedBody: Record<string, unknown>;
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        sendJson(res, 400, {
          success: false,
          error: 'Invalid JSON payload in request body',
        });
        return;
      }

      // Support both { "transaction": { ... } } and direct { "id": "...", ... }
      const rawTx = (parsedBody.transaction && typeof parsedBody.transaction === 'object'
        ? parsedBody.transaction
        : parsedBody) as Record<string, unknown>;

      let normalizedTx;
      try {
        normalizedTx = normalizeTransaction(rawTx);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Invalid transaction payload';
        sendJson(res, 400, {
          success: false,
          error: `Transaction validation failed: ${message}`,
        });
        return;
      }

      const prediction = await categorizeTransaction(normalizedTx);

      sendJson(res, 200, {
        success: true,
        prediction,
      });
      return;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal categorization error';
      sendJson(res, 500, {
        success: false,
        error: message,
      });
      return;
    }
  }

  // POST /api/v1/assistant
  if (method === 'POST' && url.pathname === '/api/v1/assistant') {
    try {
      const rawBody = await readRequestBody(req);
      if (!rawBody.trim()) {
        sendJson(res, 400, {
          success: false,
          error: 'Missing request body',
        });
        return;
      }

      let parsedBody: unknown;
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        sendJson(res, 400, {
          success: false,
          error: 'Invalid JSON payload in request body',
        });
        return;
      }

      try {
        const data = await processAssistantMessage(parsedBody);
        sendJson(res, 200, {
          success: true,
          data,
        });
        return;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Assistant request validation failed';
        sendJson(res, 400, {
          success: false,
          error: message,
        });
        return;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal assistant processing error';
      sendJson(res, 500, {
        success: false,
        error: message,
      });
      return;
    }
  }

  // POST /api/v1/simulate
  if (method === 'POST' && url.pathname === '/api/v1/simulate') {
    try {
      const rawBody = await readRequestBody(req);
      if (!rawBody.trim()) {
        sendJson(res, 400, {
          success: false,
          error: 'Missing request body',
        });
        return;
      }

      let parsedBody: unknown;
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        sendJson(res, 400, {
          success: false,
          error: 'Invalid JSON payload in request body',
        });
        return;
      }

      try {
        const simulation = await runSavingsSimulation(parsedBody);
        sendJson(res, 200, {
          success: true,
          simulation,
        });
        return;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Simulation validation failed';
        sendJson(res, 400, {
          success: false,
          error: message,
        });
        return;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Internal simulation processing error';
      sendJson(res, 500, {
        success: false,
        error: message,
      });
      return;
    }
  }

  // Fallback for unhandled routes
  sendJson(res, 404, {
    error: 'Not Found',
  });
});

// Start the HTTP server if run directly
if (process.argv[1] && (process.argv[1].endsWith('index.ts') || process.argv[1].endsWith('index.js'))) {
  server.listen(PORT, HOST, () => {
    console.log(`[AI Service] Server listening on http://${HOST}:${PORT}`);
  });
}
