import { NormalizedTransaction } from '../types/transaction.js';
import { categorizeByRules, CategorizationResult } from './rule-categorizer.js';

export * from './categories.js';
export * from './merchant-signals.js';
export * from './scoring.js';
export * from './rule-categorizer.js';

/**
 * High-level Categorization Orchestrator function.
 * 
 * Pipeline Stage 1: Rule-Based Classifier
 * (Future commits will append: Confidence Check -> LLM Classifier Fallback)
 */
export function categorizeTransaction(transaction: NormalizedTransaction): CategorizationResult {
  // Stage 1: Fast & deterministic rule-based classification
  const rulePrediction = categorizeByRules(transaction);

  // Stage 2 & 3 (Reserved for Future Commit):
  // If rulePrediction.confidence < LLM_THRESHOLD, fall back to LLM Classifier.

  return rulePrediction;
}
