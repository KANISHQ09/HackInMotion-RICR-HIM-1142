import { z } from 'zod';
import { AssistantRequest, validateAssistantRequest } from './request.js';
import { detectAssistantIntent, assistantIntentSchema, AssistantIntent } from './intent.js';
import { analyzeFinancialContext, FactItem } from './financial-analysis.js';
import { LLMProvider } from '../llm/types.js';
import { createLLMProvider, cleanJsonText } from '../llm/provider.js';

export const factItemSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  currency: z.string().optional(),
});

export const assistantResponseSchema = z.object({
  answer: z.string().min(1),
  intent: assistantIntentSchema,
  facts: z.array(factItemSchema).default([]),
  recommendations: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).default(0.95),
});

export type AssistantResponse = z.infer<typeof assistantResponseSchema>;

export interface AssistantEngineOptions {
  provider?: LLMProvider | null;
}

/**
 * Builds the prompt for LLM explanation layer in Assistant pipeline.
 */
function buildAssistantPrompt(
  message: string,
  intent: AssistantIntent,
  summary: string,
  facts: FactItem[],
  contextJson: string
): string {
  const factsText = facts.map((f) => `- ${f.label}: ${f.value}${f.currency ? ' ' + f.currency : ''}`).join('\n');

  return `You are Spendly's Financial Assistant.

## Strict Operational Rules:
1. Use ONLY the supplied financial context and computed facts below.
2. NEVER invent transactions, bank account balances, or spending amounts.
3. NEVER claim direct access to bank logins or live bank APIs.
4. If data is insufficient or missing, state: "I don't have enough financial data to answer that accurately."
5. Provide clear, concise, actionable financial guidance.
6. Return structured JSON ONLY matching the required format.

## Question:
"${message}"

## Intent Identified:
${intent}

## Computed Facts:
Summary: ${summary}
Facts:
${factsText || 'No specific facts extracted.'}

## Full Financial Context:
${contextJson}

## Required JSON Response Format:
{
  "answer": "<1 to 3 sentence natural language answer explaining the computed facts>",
  "intent": "${intent}",
  "facts": ${JSON.stringify(facts)},
  "recommendations": ["<actionable tip 1>", "<actionable tip 2>"],
  "confidence": 0.95
}`;
}

/**
 * Primary Assistant Execution Pipeline
 */
export async function processAssistantMessage(
  input: unknown,
  options?: AssistantEngineOptions
): Promise<AssistantResponse> {
  const request: AssistantRequest = validateAssistantRequest(input);
  const intent = detectAssistantIntent(request.message);

  // Compute deterministic facts & summary from context
  const analysis = analyzeFinancialContext(request.message, intent, request.context);

  // Determine LLM provider
  const provider = options?.provider !== undefined ? options.provider : createLLMProvider();

  if (provider && analysis.hasData) {
    try {
      const prompt = buildAssistantPrompt(
        request.message,
        intent,
        analysis.summary,
        analysis.facts,
        JSON.stringify(request.context, null, 2)
      );

      const rawResult = await provider.classifyTransaction({
        transaction: {
          id: 'assistant-req',
          userId: 'usr',
          amount: 0,
          type: 'expense',
          date: new Date().toISOString(),
          description: prompt,
          currency: request.context.currency || 'INR',
        },
        categories: [],
      });

      // If provider returns raw JSON text in reason or categoryName
      const jsonText = cleanJsonText(rawResult.reason || '');
      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(jsonText);
      } catch {
        parsedJson = null;
      }

      if (parsedJson && typeof parsedJson === 'object') {
        const validated = assistantResponseSchema.safeParse(parsedJson);
        if (validated.success) {
          return validated.data;
        }
      }

      // If provider gave a direct text explanation
      if (rawResult.reason && rawResult.reason.length > 5 && !rawResult.reason.startsWith('{')) {
        return {
          answer: rawResult.reason,
          intent,
          facts: analysis.facts,
          recommendations: analysis.recommendations,
          confidence: 0.90,
        };
      }
    } catch {
      // LLM failed or timed out -> fall back to deterministic response
    }
  }

  // Deterministic Response Fallback (used when LLM is unconfigured, unavailable, or failed)
  return {
    answer: analysis.summary,
    intent,
    facts: analysis.facts,
    recommendations: analysis.recommendations,
    confidence: analysis.hasData ? 0.95 : 0.40,
  };
}
