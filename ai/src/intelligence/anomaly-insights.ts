import { UnifiedContext, FinancialInsight } from './types.js';

/**
 * Transforms backend-detected anomalies into user-facing interpretations.
 */
export function generateAnomalyInsights(context: UnifiedContext): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  const anomalies = context.anomalies || [];
  const currency = context.currency || 'INR';

  for (const anomaly of anomalies) {
    const ratio = anomaly.average > 0 ? anomaly.amount / anomaly.average : 1.5;
    const severity = ratio >= 2.5 ? 'critical' : 'warning';

    insights.push({
      id: `anomaly-interp-${anomaly.category.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'anomaly_interpretation',
      severity,
      title: `Unusual spend in ${anomaly.category}`,
      explanation: `Your spending in ${anomaly.category} was ${currency} ${anomaly.amount.toLocaleString()} this month, which is ${ratio.toFixed(1)}x higher than your average (${currency} ${anomaly.average.toLocaleString()}).`,
      metrics: {
        amount: anomaly.amount,
        average: anomaly.average,
        ratio: Number(ratio.toFixed(1)),
      },
      sourceData: `anomaly:${anomaly.category}`,
      recommendation: `Check your recent ${anomaly.category} transactions to confirm if this was an intentional one-off purchase or an unexpected charge.`,
    });
  }

  return insights;
}
