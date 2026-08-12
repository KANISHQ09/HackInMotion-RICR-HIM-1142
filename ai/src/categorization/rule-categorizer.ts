import { NormalizedTransaction } from '../types/transaction.js';
import { EXPENSE_CATEGORIES, getCategoryById } from './categories.js';
import { MERCHANT_SIGNALS } from './merchant-signals.js';
import {
  calculateCategoryConfidence,
  SignalMatchResult,
  CalculatedCategoryScore,
  MINIMUM_CONFIDENCE_THRESHOLD,
} from './scoring.js';

export interface CategorizationResult {
  categoryId: string | null;
  categoryName: string | null;
  confidence: number;
  matchedSignals: string[];
  method: 'rule';
}

/**
 * Categorizes a normalized transaction using deterministic merchant and keyword signal rules.
 */
export function categorizeByRules(transaction: NormalizedTransaction): CategorizationResult {
  const merchantText = (transaction.merchant || '').toLowerCase().trim();
  const descriptionText = (transaction.description || '').toLowerCase().trim();

  if (!merchantText && !descriptionText) {
    return {
      categoryId: null,
      categoryName: null,
      confidence: 0,
      matchedSignals: [],
      method: 'rule',
    };
  }

  // Collect all signal matches
  const matchesByCategory = new Map<string, SignalMatchResult[]>();

  for (const signal of MERCHANT_SIGNALS) {
    const pattern = signal.pattern.toLowerCase();

    const isExactMerchantMatch = merchantText === pattern;
    const isPartialMerchantMatch = merchantText.length > 0 && merchantText.includes(pattern);
    const isMerchantMatch = isExactMerchantMatch || isPartialMerchantMatch;
    const isDescriptionMatch = descriptionText.length > 0 && descriptionText.includes(pattern);

    if (isMerchantMatch || isDescriptionMatch) {
      if (!matchesByCategory.has(signal.categoryId)) {
        matchesByCategory.set(signal.categoryId, []);
      }

      matchesByCategory.get(signal.categoryId)!.push({
        pattern: signal.pattern,
        categoryId: signal.categoryId,
        isMerchantMatch,
        isExactMerchantMatch,
      });
    }
  }

  if (matchesByCategory.size === 0) {
    return {
      categoryId: null,
      categoryName: null,
      confidence: 0,
      matchedSignals: [],
      method: 'rule',
    };
  }

  // Calculate scores per category
  let categoryScores: CalculatedCategoryScore[] = Array.from(matchesByCategory.values()).map(
    (matches) => calculateCategoryConfidence(matches)
  );

  // Precedence Rule: If any category has merchant-level matches, exclude description-only category matches
  const hasAnyMerchantMatch = categoryScores.some((s) => s.hasMerchantMatch);
  if (hasAnyMerchantMatch) {
    categoryScores = categoryScores.filter((s) => s.hasMerchantMatch);
  }

  // Sort candidate categories by merchant match priority and highest confidence score
  categoryScores.sort((a, b) => {
    if (a.hasMerchantMatch !== b.hasMerchantMatch) {
      return a.hasMerchantMatch ? -1 : 1;
    }
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    return b.matchedSignals.length - a.matchedSignals.length;
  });

  const bestMatch = categoryScores[0];

  // Return prediction if score meets minimum confidence threshold
  if (bestMatch && bestMatch.confidence >= MINIMUM_CONFIDENCE_THRESHOLD) {
    const categoryDef = getCategoryById(bestMatch.categoryId);
    return {
      categoryId: bestMatch.categoryId,
      categoryName: categoryDef ? categoryDef.name : bestMatch.categoryId,
      confidence: bestMatch.confidence,
      matchedSignals: bestMatch.matchedSignals,
      method: 'rule',
    };
  }

  // Return unknown result if no match meets threshold
  return {
    categoryId: null,
    categoryName: null,
    confidence: 0,
    matchedSignals: [],
    method: 'rule',
  };
}
