import { FinancialInsight } from './types.js';

/**
 * Calculates priority score for ranking insights
 * Higher score = higher priority for display
 */
export function calculateInsightPriorityScore(insight: FinancialInsight): number {
  let score = 0;

  // Base score from severity
  switch (insight.severity) {
    case 'critical':
      score += 100;
      break;
    case 'warning':
      score += 60;
      break;
    case 'info':
      score += 30;
      break;
    case 'positive':
      score += 10;
      break;
  }

  // Type-specific magnitude boost
  switch (insight.type) {
    case 'budget_overspending':
      score += 40; // Immediate financial action needed
      break;
    case 'high_expense_income_ratio':
      score += 35; // Systemic solvency concern
      break;
    case 'high_recurring_expenses':
      score += 25; // Continuous drain on monthly funds
      break;
    case 'significant_anomaly':
      score += 20; // Unexpected expense spike
      break;
    case 'category_spending_increase':
      score += 15; // Spending trend change
      break;
    case 'goal_risk':
      score += 10; // Goal milestone risk
      break;
    case 'low_savings_rate':
      score += 10;
      break;
  }

  // Financial metrics scale boost (e.g. higher excess amount or percentage change gives additional points)
  if (typeof insight.metrics.excessAmount === 'number' && insight.metrics.excessAmount > 0) {
    score += Math.min(20, Math.floor(insight.metrics.excessAmount / 1000));
  }

  if (typeof insight.metrics.changePercent === 'number' && insight.metrics.changePercent > 0) {
    score += Math.min(15, Math.floor(insight.metrics.changePercent / 10));
  }

  return score;
}

/**
 * Ranks insights deterministically from highest priority to lowest priority.
 */
export function prioritizeInsights(insights: FinancialInsight[]): FinancialInsight[] {
  return [...insights].sort((a, b) => {
    const scoreA = calculateInsightPriorityScore(a);
    const scoreB = calculateInsightPriorityScore(b);
    return scoreB - scoreA;
  });
}
