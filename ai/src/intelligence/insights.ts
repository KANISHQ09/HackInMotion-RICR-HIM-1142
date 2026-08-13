import { UnifiedContext, FinancialInsight } from './types.js';

/**
 * Deterministically detects financial insights from validated context.
 */
export function detectFinancialInsights(context: UnifiedContext): FinancialInsight[] {
  const insights: FinancialInsight[] = [];
  const currency = context.currency || 'INR';

  // Extract baseline metrics from summary or calculate from components
  const income = context.summary?.income ?? 0;
  const expenses = context.summary?.expenses ?? 0;
  const savings = context.summary?.savings ?? (income - expenses);
  const savingsRate =
    context.summary?.savingsRate ?? (income > 0 ? (savings / income) * 100 : 0);

  // 1 & 2. Category Spending Increase / Decrease / Concentration
  if (context.categories && context.categories.length > 0) {
    let topCategory = context.categories[0];
    for (const cat of context.categories) {
      if (cat.amount > topCategory.amount) {
        topCategory = cat;
      }

      // Check MoM changes
      if (cat.changePercent !== undefined) {
        if (cat.changePercent >= 15) {
          insights.push({
            id: `insight-inc-${cat.category.toLowerCase()}`,
            type: 'category_spending_increase',
            severity: cat.changePercent >= 40 ? 'critical' : 'warning',
            title: `${cat.category} spending increased`,
            explanation: `${cat.category} spending increased by ${cat.changePercent.toFixed(1)}% compared to previous period.`,
            metrics: {
              currentAmount: cat.amount,
              changePercent: Number(cat.changePercent.toFixed(1)),
              previousAmount: cat.previousAmount ?? 0,
            },
            sourceData: `category:${cat.category}`,
            recommendation: `Consider reducing non-essential purchases in ${cat.category}.`,
          });
        } else if (cat.changePercent <= -15) {
          insights.push({
            id: `insight-dec-${cat.category.toLowerCase()}`,
            type: 'category_spending_decrease',
            severity: 'positive',
            title: `${cat.category} spending decreased`,
            explanation: `${cat.category} spending dropped by ${Math.abs(cat.changePercent).toFixed(1)}% compared to previous period.`,
            metrics: {
              currentAmount: cat.amount,
              changePercent: Number(cat.changePercent.toFixed(1)),
            },
            sourceData: `category:${cat.category}`,
          });
        }
      }
    }

    // 13. Spending Concentration (Single category > 30% of total expenses)
    if (expenses > 0 && topCategory.amount > 0) {
      const share = topCategory.percentage ?? (topCategory.amount / expenses) * 100;
      if (share >= 30) {
        insights.push({
          id: `insight-conc-${topCategory.category.toLowerCase()}`,
          type: 'spending_concentration',
          severity: share >= 45 ? 'critical' : 'warning',
          title: `High spending concentration in ${topCategory.category}`,
          explanation: `${topCategory.category} accounts for ${share.toFixed(1)}% of your total monthly expenses.`,
          metrics: {
            categoryAmount: topCategory.amount,
            percentageShare: Number(share.toFixed(1)),
            totalExpenses: expenses,
          },
          sourceData: `category:${topCategory.category}`,
          recommendation: `Look for ways to optimize costs in ${topCategory.category} to balance your overall budget.`,
        });
      }
    }
  }

  // 3 & 4. Budget Overspending / Nearing Limit
  if (context.budgets && context.budgets.length > 0) {
    for (const b of context.budgets) {
      const progress = b.progress ?? (b.limitAmount > 0 ? (b.spent / b.limitAmount) * 100 : 0);
      if (b.spent > b.limitAmount) {
        const excess = b.spent - b.limitAmount;
        insights.push({
          id: `insight-budget-over-${b.category.toLowerCase()}`,
          type: 'budget_overspending',
          severity: 'critical',
          title: `Over budget in ${b.category}`,
          explanation: `You have exceeded your ${b.category} budget by ${currency} ${excess.toLocaleString()} (${progress.toFixed(1)}% of limit).`,
          metrics: {
            spent: b.spent,
            limitAmount: b.limitAmount,
            excessAmount: excess,
            progress: Number(progress.toFixed(1)),
          },
          sourceData: `budget:${b.category}`,
          recommendation: `Pause discretionary spend in ${b.category} for the rest of this period.`,
        });
      } else if (progress >= 80) {
        insights.push({
          id: `insight-budget-near-${b.category.toLowerCase()}`,
          type: 'budget_nearing_limit',
          severity: 'warning',
          title: `Nearing budget limit in ${b.category}`,
          explanation: `You have used ${progress.toFixed(1)}% of your ${b.category} budget (${currency} ${b.spent.toLocaleString()} / ${b.limitAmount.toLocaleString()}).`,
          metrics: {
            spent: b.spent,
            limitAmount: b.limitAmount,
            remaining: b.limitAmount - b.spent,
            progress: Number(progress.toFixed(1)),
          },
          sourceData: `budget:${b.category}`,
          recommendation: `Monitor ${b.category} purchases closely to avoid exceeding your limit.`,
        });
      }
    }
  }

  // 5. High Recurring Expenses
  if (context.recurring && context.recurring.length > 0) {
    const totalRecurring = context.recurring.reduce((sum, r) => sum + r.amount, 0);
    const denominator = income > 0 ? income : expenses;
    if (denominator > 0) {
      const recurringShare = (totalRecurring / denominator) * 100;
      if (recurringShare >= 20 || context.recurring.length >= 4) {
        insights.push({
          id: 'insight-high-recurring',
          type: 'high_recurring_expenses',
          severity: recurringShare >= 35 ? 'critical' : 'warning',
          title: 'High recurring subscription burden',
          explanation: `You have ${context.recurring.length} recurring payments totaling ${currency} ${totalRecurring.toLocaleString()} (${recurringShare.toFixed(1)}% of monthly funds).`,
          metrics: {
            recurringCount: context.recurring.length,
            totalRecurringAmount: totalRecurring,
            recurringShare: Number(recurringShare.toFixed(1)),
          },
          sourceData: 'recurring_transactions',
          recommendation: 'Audit your recurring subscriptions and cancel unneeded services.',
        });
      }
    }
  }

  // 6. Significant Anomaly
  if (context.anomalies && context.anomalies.length > 0) {
    for (const a of context.anomalies) {
      insights.push({
        id: `insight-anomaly-${a.category.toLowerCase()}`,
        type: 'significant_anomaly',
        severity: 'warning',
        title: `Unusual spending spike in ${a.category}`,
        explanation: `${a.category} spend of ${currency} ${a.amount.toLocaleString()} is ${a.reason} (avg ${currency} ${a.average.toLocaleString()}).`,
        metrics: {
          amount: a.amount,
          average: a.average,
          multiplier: Number((a.average > 0 ? a.amount / a.average : 1.5).toFixed(2)),
        },
        sourceData: `anomaly:${a.category}`,
        recommendation: `Review recent transactions in ${a.category} to verify billing details.`,
      });
    }
  }

  // 7, 8, 9, 10. Income/Expense Ratios & Savings Performance
  if (income > 0) {
    const expenseRatio = (expenses / income) * 100;

    // 9. High expense-to-income ratio (> 80%)
    if (expenseRatio > 80) {
      insights.push({
        id: 'insight-high-expense-ratio',
        type: 'high_expense_income_ratio',
        severity: expenseRatio > 95 ? 'critical' : 'warning',
        title: 'High expense-to-income ratio',
        explanation: `Your expenses account for ${expenseRatio.toFixed(1)}% of your income, leaving limited margin for savings.`,
        metrics: {
          income,
          expenses,
          expenseRatio: Number(expenseRatio.toFixed(1)),
        },
        sourceData: 'summary',
        recommendation: 'Aim to lower overall monthly expenses to keep the ratio below 80%.',
      });
    }

    // 7. Low savings rate (< 15%)
    if (savingsRate < 15) {
      insights.push({
        id: 'insight-low-savings-rate',
        type: 'low_savings_rate',
        severity: savingsRate < 5 ? 'critical' : 'warning',
        title: 'Low savings rate',
        explanation: `Your savings rate is currently ${savingsRate.toFixed(1)}% (${currency} ${savings.toLocaleString()}), below the recommended 20% benchmark.`,
        metrics: {
          income,
          expenses,
          savings,
          savingsRate: Number(savingsRate.toFixed(1)),
        },
        sourceData: 'summary',
        recommendation: 'Target small reductions in top discretionary categories to boost savings.',
      });
    } else if (savingsRate >= 25) {
      // 10. Strong savings performance (>= 25%)
      insights.push({
        id: 'insight-strong-savings',
        type: 'strong_savings_performance',
        severity: 'positive',
        title: 'Strong savings performance',
        explanation: `Your savings rate is ${savingsRate.toFixed(1)}% (${currency} ${savings.toLocaleString()}), exceeding the 20% financial goal.`,
        metrics: {
          savings,
          savingsRate: Number(savingsRate.toFixed(1)),
        },
        sourceData: 'summary',
      });
    }
  }

  // 8. Declining Savings Rate Trend
  if (context.trends && context.trends.length >= 2) {
    const recent = context.trends[context.trends.length - 1];
    const prev = context.trends[context.trends.length - 2];
    const recentRate =
      recent.savingsRate ??
      (recent.totalIncome > 0 ? ((recent.totalIncome - recent.totalExpense) / recent.totalIncome) * 100 : 0);
    const prevRate =
      prev.savingsRate ??
      (prev.totalIncome > 0 ? ((prev.totalIncome - prev.totalExpense) / prev.totalIncome) * 100 : 0);

    if (prevRate - recentRate > 5) {
      insights.push({
        id: 'insight-declining-savings-trend',
        type: 'declining_savings_rate',
        severity: 'warning',
        title: 'Declining monthly savings trend',
        explanation: `Your savings rate dropped from ${prevRate.toFixed(1)}% in ${prev.month} to ${recentRate.toFixed(1)}% in ${recent.month}.`,
        metrics: {
          previousMonth: prev.month,
          previousRate: Number(prevRate.toFixed(1)),
          recentMonth: recent.month,
          recentRate: Number(recentRate.toFixed(1)),
          dropAmount: Number((prevRate - recentRate).toFixed(1)),
        },
        sourceData: 'trends',
        recommendation: 'Reassess variable expenses to prevent further savings degradation.',
      });
    }
  }

  // 11 & 12. Goals Progress & Risk
  if (context.goals && context.goals.length > 0) {
    for (const g of context.goals) {
      const progress = g.progress ?? (g.targetAmount > 0 ? (g.currentProgress / g.targetAmount) * 100 : 0);
      if (progress >= 50) {
        insights.push({
          id: `insight-goal-progress-${g.name.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'goal_progress',
          severity: 'positive',
          title: `Good progress on "${g.name}" goal`,
          explanation: `You have reached ${progress.toFixed(1)}% of your "${g.name}" goal (${currency} ${g.currentProgress.toLocaleString()} / ${g.targetAmount.toLocaleString()}).`,
          metrics: {
            currentProgress: g.currentProgress,
            targetAmount: g.targetAmount,
            progressPercent: Number(progress.toFixed(1)),
          },
          sourceData: `goal:${g.name}`,
        });
      } else if (progress < 25) {
        insights.push({
          id: `insight-goal-risk-${g.name.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'goal_risk',
          severity: 'warning',
          title: `Goal "${g.name}" is falling behind`,
          explanation: `Only ${progress.toFixed(1)}% of your target amount is funded for "${g.name}".`,
          metrics: {
            currentProgress: g.currentProgress,
            targetAmount: g.targetAmount,
            progressPercent: Number(progress.toFixed(1)),
          },
          sourceData: `goal:${g.name}`,
          recommendation: `Allocate a portion of monthly net savings directly toward "${g.name}".`,
        });
      }
    }
  }

  return insights;
}
