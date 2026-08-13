import { validateUnifiedContext, UnifiedIntelligenceResult } from './types.js';
import { detectFinancialInsights } from './insights.js';
import { prioritizeInsights } from './prioritize.js';
import { generateRecommendations } from './recommendations.js';
import { generateRecurringInsights } from './recurring-insights.js';
import { generateAnomalyInsights } from './anomaly-insights.js';
import { generateUnifiedIntelligence, ExplainerOptions } from './explainer.js';

export * from './types.js';
export * from './insights.js';
export * from './prioritize.js';
export * from './recommendations.js';
export * from './health-explanation.js';
export * from './recurring-insights.js';
export * from './anomaly-insights.js';
export * from './explainer.js';

/**
 * Main Orchestrator for Financial Intelligence
 * Analyzes validated financial context and returns prioritized insights, recommendations, and explanations.
 */
export async function analyzeFinancialIntelligence(
  input: unknown,
  options?: ExplainerOptions
): Promise<UnifiedIntelligenceResult> {
  // 1. Validate incoming financial context
  const context = validateUnifiedContext(input);

  // 2. Detect deterministic financial insights across categories, budgets, income/savings, goals
  const rawInsights = detectFinancialInsights(context);

  // 3. Add recurring subscription insights & anomaly interpretations
  const recurringInsights = generateRecurringInsights(context);
  const anomalyInsights = generateAnomalyInsights(context);

  const combinedInsights = [...rawInsights, ...recurringInsights, ...anomalyInsights];

  // 4. Prioritize insights by severity, magnitude, and financial urgency
  const prioritized = prioritizeInsights(combinedInsights);

  // 5. Generate evidence-backed actionable recommendations
  const recommendations = generateRecommendations(prioritized, context);

  // 6. Synthesize explanations via LLM or deterministic fallback
  return generateUnifiedIntelligence(context, prioritized, recommendations, options);
}
