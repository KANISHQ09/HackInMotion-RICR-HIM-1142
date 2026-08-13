import {
  LLMProvider,
  LLMClassificationRequest,
  LLMClassificationResponse,
  llmResponseSchema,
} from './types.js';
import { getConfig } from '../config.js';

/**
 * Builds the strict categorization system prompt for LLM providers.
 */
export function buildCategorizationPrompt(request: LLMClassificationRequest): string {
  const { transaction, categories } = request;

  const categoryListText = categories
    .map((c) => `- "${c.id}": ${c.name} (${c.description})`)
    .join('\n');

  return `You are a precision financial transaction categorization intelligence system.

## Task
Categorize the following financial transaction into exactly ONE category from the allowed category list.

## Allowed Categories:
${categoryListText}

## Transaction Data:
- ID: "${transaction.id}"
- Merchant: "${transaction.merchant || 'N/A'}"
- Description: "${transaction.description || 'N/A'}"
- Amount: ${transaction.amount} ${transaction.currency}
- Type: ${transaction.type}
- Date: ${transaction.date}

## Strict Operational Rules:
1. Choose exactly ONE category from the supplied category list.
2. Never invent a new category or category ID.
3. Return structured JSON ONLY. Do not include markdown formatting outside the JSON, commentary, or text before/after.
4. Return low confidence (e.g. 0.20 to 0.45) when categorization evidence is weak or ambiguous.
5. Do not provide generic financial advice or extra notes.
6. Do not invent transaction facts not provided in the input.

## Required Output JSON Format:
{
  "categoryId": "<string from allowed category IDs>",
  "categoryName": "<matching category name>",
  "confidence": <number between 0.0 and 1.0>,
  "reason": "<short 1-sentence explanation of why this category was selected>"
}`;
}

/**
 * Helper to clean JSON string from LLM response (strip ```json block quotes if present)
 */
export function cleanJsonText(rawText: string): string {
  let text = rawText.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }
  return text;
}

/**
 * Gemini API Provider implementation using native fetch
 */
export class GeminiProvider implements LLMProvider {
  name = 'gemini';
  private apiKey: string;
  private model: string;
  private timeoutMs: number;

  constructor(apiKey: string, model = 'gemini-1.5-flash', timeoutMs = 5000) {
    this.apiKey = apiKey;
    this.model = model;
    this.timeoutMs = timeoutMs;
  }

  async classifyTransaction(request: LLMClassificationRequest): Promise<LLMClassificationResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const prompt = buildCategorizationPrompt(request);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Gemini API error (${response.status}): ${errorText.slice(0, 200)}`);
      }

      const data = (await response.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('Gemini API returned an empty or missing response text');
      }

      const jsonString = cleanJsonText(rawText);
      const parsed = JSON.parse(jsonString);
      return llmResponseSchema.parse(parsed);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`Gemini API request timed out after ${this.timeoutMs}ms`);
      }
      throw err;
    }
  }
}

/**
 * OpenAI API Provider implementation using native fetch
 */
export class OpenAIProvider implements LLMProvider {
  name = 'openai';
  private apiKey: string;
  private model: string;
  private timeoutMs: number;

  constructor(apiKey: string, model = 'gpt-4o-mini', timeoutMs = 5000) {
    this.apiKey = apiKey;
    this.model = model;
    this.timeoutMs = timeoutMs;
  }

  async classifyTransaction(request: LLMClassificationRequest): Promise<LLMClassificationResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const prompt = buildCategorizationPrompt(request);
    const url = 'https://api.openai.com/v1/chat/completions';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a precise financial transaction categorization assistant that outputs JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`OpenAI API error (${response.status}): ${errorText.slice(0, 200)}`);
      }

      const data = (await response.json()) as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };

      const rawText = data?.choices?.[0]?.message?.content;
      if (!rawText) {
        throw new Error('OpenAI API returned an empty response content');
      }

      const jsonString = cleanJsonText(rawText);
      const parsed = JSON.parse(jsonString);
      return llmResponseSchema.parse(parsed);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error(`OpenAI API request timed out after ${this.timeoutMs}ms`);
      }
      throw err;
    }
  }
}

/**
 * Mock LLM Provider for unit testing and deterministic simulation
 */
export class MockLLMProvider implements LLMProvider {
  name = 'mock';
  public responseToReturn?: Partial<LLMClassificationResponse>;
  public shouldFail = false;
  public failureMessage = 'Mock LLM provider forced failure';

  constructor(customResponse?: Partial<LLMClassificationResponse>) {
    this.responseToReturn = customResponse;
  }

  async classifyTransaction(request: LLMClassificationRequest): Promise<LLMClassificationResponse> {
    if (this.shouldFail) {
      throw new Error(this.failureMessage);
    }

    if (this.responseToReturn) {
      return llmResponseSchema.parse({
        categoryId: this.responseToReturn.categoryId || 'other',
        categoryName: this.responseToReturn.categoryName || 'Other',
        confidence: this.responseToReturn.confidence ?? 0.85,
        reason: this.responseToReturn.reason || 'Mock LLM prediction',
      });
    }

    // Default intelligent mock behavior based on request
    const merchant = (request.transaction.merchant || request.transaction.description || '').toLowerCase();
    
    if (merchant.includes('steam') || merchant.includes('nintendo') || merchant.includes('playstation')) {
      return {
        categoryId: 'entertainment',
        categoryName: 'Entertainment',
        confidence: 0.88,
        reason: 'Identified gaming software merchant.',
      };
    }

    if (merchant.includes('cloud') || merchant.includes('aws') || merchant.includes('vercel')) {
      return {
        categoryId: 'subscriptions',
        categoryName: 'Subscriptions',
        confidence: 0.92,
        reason: 'Identified cloud infrastructure subscription service.',
      };
    }

    return {
      categoryId: 'other',
      categoryName: 'Other',
      confidence: 0.30,
      reason: 'No clear category signal identified by LLM.',
    };
  }
}

/**
 * Provider factory function
 */
export function createLLMProvider(
  providerName?: string,
  apiKey?: string,
  modelName?: string,
  timeoutMs?: number
): LLMProvider | null {
  const config = getConfig();
  const provider = (providerName || config.provider).toLowerCase();
  const timeout = timeoutMs || config.llmTimeoutMs;

  if (provider === 'gemini') {
    const key = apiKey || config.geminiApiKey;
    if (!key) return null;
    return new GeminiProvider(key, modelName || config.geminiModel, timeout);
  }

  if (provider === 'openai') {
    const key = apiKey || config.openaiApiKey;
    if (!key) return null;
    return new OpenAIProvider(key, modelName || config.openaiModel, timeout);
  }

  if (provider === 'mock') {
    return new MockLLMProvider();
  }

  return null;
}
