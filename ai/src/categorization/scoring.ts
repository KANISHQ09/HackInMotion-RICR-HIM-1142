/**
 * Categorization Scoring and Confidence Rules
 * 
 * Logic & Reasoning:
 * 1. Exact Merchant Match (0.96):
 *    When the merchant name precisely matches a known brand signal (e.g., "Swiggy", "Netflix"),
 *    confidence is extremely high.
 * 
 * 2. Partial Merchant Match (0.90):
 *    When the merchant name contains a known signal keyword (e.g., "Swiggy India Pvt Ltd"),
 *    confidence is high.
 * 
 * 3. Description Keyword Match (0.70):
 *    When a keyword is found in the description text rather than the merchant name,
 *    confidence is moderate since descriptions can contain ambiguous words.
 * 
 * 4. Multi-Signal Reinforcement (+0.02 per extra signal, capped at 0.99):
 *    If multiple distinct signals point to the same category, confidence receives a deterministic boost.
 * 
 * 5. Precedence & Ambiguity Reduction:
 *    Merchant matches strictly take precedence over description-only matches.
 *    If signals conflict across different categories, merchant signals override description signals.
 */

export const BASE_SCORES = {
  EXACT_MERCHANT_MATCH: 0.96,
  PARTIAL_MERCHANT_MATCH: 0.9,
  DESCRIPTION_KEYWORD_MATCH: 0.7,
} as const;

export const MINIMUM_CONFIDENCE_THRESHOLD = 0.5;

export interface SignalMatchResult {
  pattern: string;
  categoryId: string;
  isMerchantMatch: boolean;
  isExactMerchantMatch: boolean;
}

export interface CalculatedCategoryScore {
  categoryId: string;
  confidence: number;
  matchedSignals: string[];
  hasMerchantMatch: boolean;
}

/**
 * Calculates a deterministic confidence score for a set of matches belonging to the same category.
 */
export function calculateCategoryConfidence(matches: SignalMatchResult[]): CalculatedCategoryScore {
  if (matches.length === 0) {
    return {
      categoryId: '',
      confidence: 0,
      matchedSignals: [],
      hasMerchantMatch: false,
    };
  }

  const categoryId = matches[0].categoryId;
  const matchedSignals = Array.from(new Set(matches.map((m) => m.pattern)));

  const hasExactMerchant = matches.some((m) => m.isExactMerchantMatch);
  const hasMerchantMatch = matches.some((m) => m.isMerchantMatch);

  let baseScore: number;
  if (hasExactMerchant) {
    baseScore = BASE_SCORES.EXACT_MERCHANT_MATCH;
  } else if (hasMerchantMatch) {
    baseScore = BASE_SCORES.PARTIAL_MERCHANT_MATCH;
  } else {
    baseScore = BASE_SCORES.DESCRIPTION_KEYWORD_MATCH;
  }

  // Multi-signal boost for multiple matching patterns in the same category
  const bonus = (matchedSignals.length - 1) * 0.02;
  const finalConfidence = Math.min(0.99, Number((baseScore + bonus).toFixed(2)));

  return {
    categoryId,
    confidence: finalConfidence,
    matchedSignals,
    hasMerchantMatch,
  };
}
