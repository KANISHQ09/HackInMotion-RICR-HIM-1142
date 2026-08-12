import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Helper function to load environment variables from a .env file if present
function loadEnv(): void {
  try {
    let baseDir = process.env.PWD || '';
    if (!baseDir) {
      try {
        const __filename = fileURLToPath(import.meta.url);
        baseDir = path.dirname(path.dirname(__filename));
      } catch {
        baseDir = '.';
      }
    }
    const envPath = path.resolve(baseDir, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const lines = envContent.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...valueParts] = trimmed.split('=');
          const envKey = key.trim();
          const envVal = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          if (envKey && process.env[envKey] === undefined) {
            process.env[envKey] = envVal;
          }
        }
      }
    }
  } catch {
    // Ignore errors if env loading fails
  }
}

// Load environment configuration
loadEnv();

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '127.0.0.1';

// Create a minimal lightweight HTTP server
export const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const method = (req.method || 'GET').toUpperCase();

  // GET /health
  if (method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ok',
        service: 'ai',
      })
    );
    return;
  }

  // Fallback for unhandled routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      error: 'Not Found',
    })
  );
});

// Start the HTTP server if run directly
if (process.argv[1] && process.argv[1].endsWith('index.ts') || process.argv[1] && process.argv[1].endsWith('index.js')) {
  server.listen(PORT, HOST, () => {
    console.log(`[AI Service] Server listening on http://${HOST}:${PORT}`);
  });
}
