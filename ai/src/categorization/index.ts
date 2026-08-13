import { NormalizedTransaction } from '../types/transaction.js';
import { categorizeByRules, CategorizationResult } from './rule-categorizer.js';
import { categorizeByLLM } from './llm-categorizer.js';
import { LLMProvider } from '../llm/types.js';
import { createLLMProvider } from '../llm/provider.js';
import { getConfig } from '../config.js';

export * from './categories.js';
export * from './merchant-signals.js';
export * from './scoring.js';
export * from './rule-categorizer.js';
export * from './llm-categorizer.js';

export interface CategorizeOptions {
  confidenceThreshold?: number;
  provider?: LLMProvider | null;
}

/**
 * High-level Hybrid Categorization Orchestrator Pipeline
 * 
 * Flow:
 * 1. Rule-Based Classification (Deterministic, 0ms latency, zero API cost)
 * 2. Confidence Threshold Check (e.g. 0.70)
 *    -> If confidence >= threshold: return rule prediction immediately ("rule")
 * 3. LLM Fallback (if rule confidence < threshold and provider is available)
 *    -> If LLM succeeds: return LLM prediction ("llm")
 * 4. Safe Fallback (if LLM fails, times out, or no provider configured)
 *    -> Return controlled fallback result ("fallback" or low-confidence rule)
 */
export async function categorizeTransaction(
  transaction: NormalizedTransaction,
  options?: CategorizeOptions
): Promise<CategorizationResult> {
  const config = getConfig();
  const threshold =
    options?.confidenceThreshold !== undefined
      ? options.confidenceThreshold
      : config.confidenceThreshold;

  // Stage 1: Deterministic Rule-Based Classification
  const rulePrediction = categorizeByRules(transaction);

  // Stage 2: High-Confidence Threshold Check
  if (rulePrediction.confidence >= threshold && rulePrediction.categoryId) {
    return {
      ...rulePrediction,
      reason: rulePrediction.reason || `Matched keyword/merchant signals: ${rulePrediction.matchedSignals.join(', ')}`,
    };
  }

  // Stage 3: LLM Classifier Fallback
  const provider = options?.provider !== undefined ? options.provider : createLLMProvider();

  if (provider) {
    try {
      const llmResult = await categorizeByLLM(transaction, provider);
      return {
        categoryId: llmResult.categoryId,
        categoryName: llmResult.categoryName,
        confidence: llmResult.confidence,
        matchedSignals: rulePrediction.matchedSignals || [],
        method: 'llm',
        reason: llmResult.reason,
      };
    } catch {
      // LLM failed, timed out, or returned invalid JSON -> fall through to safe fallback
    }
  }

  // Stage 4: Controlled Safe Fallback
  if (rulePrediction.categoryId) {
    return {
      ...rulePrediction,
      reason: rulePrediction.reason || `Low confidence rule match (${rulePrediction.confidence.toFixed(2)}) without LLM backup.`,
    };
  }

  return {
    categoryId: 'other',
    categoryName: 'Other',
    confidence: 0.20,
    matchedSignals: [],
    method: 'fallback',
    reason: 'No reliable categorization evidence was available.',
  };
}
