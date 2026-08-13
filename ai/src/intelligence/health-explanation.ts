import { UnifiedContext, FinancialInsight } from './types.js';

export interface HealthExplanationDetails {
  score: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
  explanation: string;
  strongestPositive: string;
  strongestNegative: string;
  actionableImprovement: string;
}

/**
 * Explains the backend financial health score deterministically without changing the score.
 */
export function explainFinancialHealth(
  context: UnifiedContext,
  insights: FinancialInsight[]
): HealthExplanationDetails {
  const score = context.healthScore?.score ?? 70;
  const currency = context.currency || 'INR';

  let rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement';
  if (score >= 80) rating = 'Excellent';
  else if (score >= 65) rating = 'Good';
  else if (score >= 50) rating = 'Fair';
  else rating = 'Needs Improvement';

  // Identify positive & negative factors
  const positiveInsights = insights.filter((i) => i.severity === 'positive');
  const criticalInsights = insights.filter((i) => i.severity === 'critical');
  const warningInsights = insights.filter((i) => i.severity === 'warning');

  let strongestPositive = 'Consistent financial tracking.';
  if (positiveInsights.length > 0) {
    strongestPositive = positiveInsights[0].explanation;
  } else if (context.summary && context.summary.savingsRate && context.summary.savingsRate > 15) {
    strongestPositive = `Healthy savings rate of ${context.summary.savingsRate.toFixed(1)}%.`;
  }

  let strongestNegative = 'No major financial risks detected.';
  if (criticalInsights.length > 0) {
    strongestNegative = criticalInsights[0].explanation;
  } else if (warningInsights.length > 0) {
    strongestNegative = warningInsights[0].explanation;
  }

  let actionableImprovement = 'Maintain your current spending pattern and regular savings.';
  if (criticalInsights.length > 0 && criticalInsights[0].recommendation) {
    actionableImprovement = criticalInsights[0].recommendation;
  } else if (warningInsights.length > 0 && warningInsights[0].recommendation) {
    actionableImprovement = warningInsights[0].recommendation;
  }

  let explanation = `Your Financial Health Score is ${score}/100 (${rating}). `;
  if (score >= 80) {
    explanation += `Your financial health is strong, supported by ${strongestPositive.toLowerCase()}`;
  } else if (score >= 65) {
    explanation += `Your financial health is stable. It is supported by ${strongestPositive.toLowerCase()} However, ${strongestNegative.toLowerCase()}`;
  } else {
    explanation += `Your financial score is held back by ${strongestNegative.toLowerCase()} ${actionableImprovement}`;
  }

  return {
    score,
    rating,
    explanation,
    strongestPositive,
    strongestNegative,
    actionableImprovement,
  };
}
