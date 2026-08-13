import { NormalizedTransaction } from '../types/transaction.js';
import { EXPENSE_CATEGORIES, getCategoryById } from './categories.js';
import { LLMProvider } from '../llm/types.js';

export interface LLMCategorizationResult {
  categoryId: string;
  categoryName: string;
  confidence: number;
  reason: string;
  method: 'llm';
}

/**
 * Categorizes a transaction using an LLM Provider.
 */
export async function categorizeByLLM(
  transaction: NormalizedTransaction,
  provider: LLMProvider
): Promise<LLMCategorizationResult> {
  const categoriesList = Object.values(EXPENSE_CATEGORIES);

  const rawResult = await provider.classifyTransaction({
    transaction,
    categories: categoriesList,
  });

  // Verify that returned categoryId is valid and exists in our taxonomy
  const categoryDef = getCategoryById(rawResult.categoryId);
  if (!categoryDef) {
    throw new Error(
      `LLM returned category ID "${rawResult.categoryId}" which is not in the allowed taxonomy`
    );
  }

  // Ensure confidence score is valid
  const confidence = Math.max(0, Math.min(1, Number(rawResult.confidence) || 0));

  return {
    categoryId: categoryDef.id,
    categoryName: categoryDef.name,
    confidence: Number(confidence.toFixed(2)),
    reason: rawResult.reason || `Categorized as ${categoryDef.name} by LLM (${provider.name})`,
    method: 'llm',
  };
}
