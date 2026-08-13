import { UnifiedContext, FinancialInsight } from './types.js';

/**
 * Interprets backend-detected recurring transactions to generate subscription intelligence.
 */
export function generateRecurringInsights(context: UnifiedContext): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  const recurring = context.recurring || [];
  const currency = context.currency || 'INR';

  if (recurring.length === 0) {
    return insights;
  }

  // Calculate total recurring expense
  const totalRecurring = recurring.reduce((sum, item) => sum + item.amount, 0);
  const largest = [...recurring].sort((a, b) => b.amount - a.amount)[0];

  // 1. Highlight largest recurring subscription
  if (largest && largest.amount > 0) {
    insights.push({
      id: `recurring-largest-${largest.description.toLowerCase().replace(/\s+/g, '-')}`,
      type: 'recurring_largest_item',
      severity: 'info',
      title: `Largest recurring expense: ${largest.description}`,
      explanation: `${largest.description} is your single largest recurring payment at ${currency} ${largest.amount.toLocaleString()}/month (${largest.count} payments detected).`,
      metrics: {
        amount: largest.amount,
        paymentCount: largest.count,
      },
      sourceData: `recurring:${largest.description}`,
      recommendation: `Verify if you still actively use ${largest.description}.`,
    });
  }

  // 2. High recurring burden
  const income = context.summary?.income ?? 0;
  const expenses = context.summary?.expenses ?? 0;
  const denominator = income > 0 ? income : expenses;

  if (denominator > 0) {
    const share = (totalRecurring / denominator) * 100;
    if (share >= 15) {
      insights.push({
        id: 'recurring-high-burden',
        type: 'recurring_high_burden',
        severity: share >= 30 ? 'critical' : 'warning',
        title: 'Significant subscription overhead',
        explanation: `Your ${recurring.length} recurring subscriptions sum to ${currency} ${totalRecurring.toLocaleString()}/month, representing ${share.toFixed(1)}% of your monthly funds.`,
        metrics: {
          totalRecurring,
          recurringCount: recurring.length,
          percentageShare: Number(share.toFixed(1)),
        },
        sourceData: 'recurring_transactions',
        recommendation: 'Potential recurring expense worth reviewing: consider canceling unused services.',
      });
    }
  }

  return insights;
}
