import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Loads environment variables from .env file if available
 */
export function loadEnv(): void {
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

export interface AIConfig {
  port: number;
  host: string;
  provider: string;
  confidenceThreshold: number;
  geminiApiKey: string;
  geminiModel: string;
  openaiApiKey: string;
  openaiModel: string;
  llmTimeoutMs: number;
}

export function getConfig(): AIConfig {
  loadEnv();

  const threshold = parseFloat(process.env.AI_CONFIDENCE_THRESHOLD || '0.70');

  return {
    port: Number(process.env.AI_PORT || process.env.PORT) || 3001,
    host: process.env.AI_HOST || process.env.HOST || '127.0.0.1',
    provider: (process.env.AI_PROVIDER || 'gemini').toLowerCase(),
    confidenceThreshold: Number.isNaN(threshold) ? 0.70 : threshold,
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    llmTimeoutMs: Number(process.env.AI_LLM_TIMEOUT_MS) || 5000,
  };
}
