import { FinancialInsight, ActionableRecommendation, UnifiedContext } from './types.js';

/**
 * Generates evidence-backed actionable recommendations from detected insights and context.
 */
export function generateRecommendations(
  insights: FinancialInsight[],
  context: UnifiedContext
): ActionableRecommendation[] {
  const recommendations: ActionableRecommendation[] = [];
  const currency = context.currency || 'INR';

  for (const insight of insights) {
    switch (insight.type) {
      case 'budget_overspending': {
        const spent = Number(insight.metrics.spent ?? 0);
        const limit = Number(insight.metrics.limitAmount ?? 0);
        const excess = Number(insight.metrics.excessAmount ?? (spent - limit));
        const category = insight.title.replace('Over budget in ', '');

        recommendations.push({
          id: `rec-budget-over-${category.toLowerCase()}`,
          title: `Cap spending in ${category}`,
          action: `Pause non-essential ${category} purchases to halt budget overspend.`,
          reason: `Currently over budget by ${currency} ${excess.toLocaleString()} (${spent} spent vs ${limit} limit).`,
          supportingMetric: `Excess spend: ${currency} ${excess.toLocaleString()}`,
          estimatedMonthlyImpact: excess,
          priority: 'high',
        });
        break;
      }

      case 'category_spending_increase': {
        const category = insight.title.replace(' spending increased', '');
        const currentAmount = Number(insight.metrics.currentAmount ?? 0);
        const changePercent = Number(insight.metrics.changePercent ?? 0);
        // Estimate 20% reduction impact
        const estimatedImpact = Math.round(currentAmount * 0.2);

        recommendations.push({
          id: `rec-reduce-${category.toLowerCase()}`,
          title: `Reduce ${category} spending`,
          action: `Aim for a 20% reduction in ${category} expense next month.`,
          reason: `${category} spending increased by ${changePercent}% compared to previous period.`,
          supportingMetric: `Current ${category} spend: ${currency} ${currentAmount.toLocaleString()}`,
          estimatedMonthlyImpact: estimatedImpact,
          priority: changePercent >= 40 ? 'high' : 'medium',
        });
        break;
      }

      case 'high_recurring_expenses': {
        const totalRecurring = Number(insight.metrics.totalRecurringAmount ?? 0);
        const count = Number(insight.metrics.recurringCount ?? 0);
        const estimatedImpact = Math.round(totalRecurring * 0.25); // Estimated 25% savings from audit

        recommendations.push({
          id: 'rec-audit-recurring',
          title: 'Audit monthly recurring subscriptions',
          action: 'Review all recurring digital subscriptions and cancel inactive memberships.',
          reason: `You have ${count} active recurring payments totaling ${currency} ${totalRecurring.toLocaleString()}/month.`,
          supportingMetric: `Total recurring: ${currency} ${totalRecurring.toLocaleString()}/mo`,
          estimatedMonthlyImpact: estimatedImpact,
          priority: 'high',
        });
        break;
      }

      case 'significant_anomaly': {
        const category = insight.title.replace('Unusual spending spike in ', '');
        const amount = Number(insight.metrics.amount ?? 0);
        const average = Number(insight.metrics.average ?? 0);
        const diff = Math.max(0, amount - average);

        recommendations.push({
          id: `rec-anomaly-${category.toLowerCase()}`,
          title: `Investigate ${category} expense spike`,
          action: `Review recent receipts or transaction logs in ${category}.`,
          reason: `${category} spend (${currency} ${amount.toLocaleString()}) was significantly above your average (${currency} ${average.toLocaleString()}).`,
          supportingMetric: `Spike amount: ${currency} ${amount.toLocaleString()}`,
          estimatedMonthlyImpact: Math.round(diff),
          priority: 'medium',
        });
        break;
      }

      case 'low_savings_rate': {
        const currentRate = Number(insight.metrics.savingsRate ?? 0);
        const income = Number(insight.metrics.income ?? 0);
        const targetIncrease = Math.round(income * 0.05); // 5% boost goal

        recommendations.push({
          id: 'rec-boost-savings',
          title: 'Boost monthly savings rate',
          action: 'Set up an automated recurring transfer to savings on payday.',
          reason: `Your current savings rate is ${currentRate}%, below the standard 20% benchmark.`,
          supportingMetric: `Current savings rate: ${currentRate}%`,
          estimatedMonthlyImpact: targetIncrease,
          priority: 'high',
        });
        break;
      }

      case 'spending_concentration': {
        const category = insight.title.replace('High spending concentration in ', '');
        const share = Number(insight.metrics.percentageShare ?? 0);
        const amount = Number(insight.metrics.categoryAmount ?? 0);

        recommendations.push({
          id: `rec-balance-${category.toLowerCase()}`,
          title: `Diversify spend away from ${category}`,
          action: `Set a monthly spending limit for ${category}.`,
          reason: `${category} represents ${share}% of your total expenses.`,
          supportingMetric: `${category} share: ${share}%`,
          estimatedMonthlyImpact: Math.round(amount * 0.15),
          priority: 'medium',
        });
        break;
      }

      case 'goal_risk': {
        const goalName = insight.title.replace('Goal "', '').replace('" is falling behind', '');
        const progress = Number(insight.metrics.progressPercent ?? 0);

        recommendations.push({
          id: `rec-goal-${goalName.toLowerCase().replace(/\s+/g, '-')}`,
          title: `Increase contributions to "${goalName}"`,
          action: `Redirect 10% of monthly net savings toward your "${goalName}" goal.`,
          reason: `Progress is currently at ${progress}%, falling behind your target schedule.`,
          supportingMetric: `Current progress: ${progress}%`,
          priority: 'medium',
        });
        break;
      }
    }
  }

  // Include backend recommendations if provided and non-duplicate
  if (context.recommendations && context.recommendations.length > 0) {
    context.recommendations.forEach((backendRec, index) => {
      recommendations.push({
        id: `rec-backend-${index}`,
        title: backendRec.title,
        action: backendRec.action,
        reason: 'Identified by backend analytics engine.',
        supportingMetric: 'Backend Analytics',
        priority: 'low',
      });
    });
  }

  // Deduplicate recommendations by title
  const seen = new Set<string>();
  const uniqueRecs: ActionableRecommendation[] = [];
  for (const r of recommendations) {
    if (!seen.has(r.title.toLowerCase())) {
      seen.add(r.title.toLowerCase());
      uniqueRecs.push(r);
    }
  }

  return uniqueRecs;
}
