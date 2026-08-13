import { FinancialContext } from './types.js';
import { AssistantIntent } from './intent.js';

export interface FactItem {
  label: string;
  value: string | number;
  currency?: string;
}

export interface FinancialAnalysisResult {
  intent: AssistantIntent;
  summary: string;
  facts: FactItem[];
  recommendations: string[];
  hasData: boolean;
}

/**
 * Extracts target category name from user message text if present.
 */
export function extractCategoryFromMessage(message: string): string | null {
  const text = message.toLowerCase();
  const knownCategories = [
    'food',
    'groceries',
    'rent',
    'bills',
    'shopping',
    'transport',
    'travel',
    'entertainment',
    'healthcare',
    'health',
    'education',
    'subscriptions',
    'personal-care',
    'insurance',
    'fees',
  ];

  for (const cat of knownCategories) {
    if (text.includes(cat)) {
      if (cat === 'health') return 'Healthcare';
      return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  }

  return null;
}

/**
 * Deterministically analyzes financial context based on intent and computes strict facts.
 */
export function analyzeFinancialContext(
  message: string,
  intent: AssistantIntent,
  context: FinancialContext
): FinancialAnalysisResult {
  const currency = context.currency || 'INR';
  const facts: FactItem[] = [];
  const recommendations: string[] = [];

  switch (intent) {
    case 'category_spending': {
      const targetCategory = extractCategoryFromMessage(message);
      if (targetCategory && context.categories && context.categories.length > 0) {
        const found = context.categories.find((c) =>
          c.category.toLowerCase().includes(targetCategory.toLowerCase())
        );
        if (found) {
          facts.push({
            label: `${found.category} spending`,
            value: found.amount,
            currency,
          });
          if (found.percentage !== undefined) {
            facts.push({
              label: 'Share of total expenses',
              value: `${found.percentage}%`,
            });
          }
          return {
            intent,
            summary: `You spent ${currency} ${found.amount.toLocaleString()} on ${found.category}.`,
            facts,
            recommendations,
            hasData: true,
          };
        }
      }

      // Fallback to listing top categories if specific category not found or not mentioned
      if (context.categories && context.categories.length > 0) {
        const sorted = [...context.categories].sort((a, b) => b.amount - a.amount);
        sorted.slice(0, 3).forEach((c) => {
          facts.push({
            label: `${c.category} spending`,
            value: c.amount,
            currency,
          });
        });
        return {
          intent,
          summary: `Top category spend is ${sorted[0].category} at ${currency} ${sorted[0].amount.toLocaleString()}.`,
          facts,
          recommendations,
          hasData: true,
        };
      }

      return {
        intent,
        summary: "I don't have category spending data in your context to answer that accurately.",
        facts: [],
        recommendations: [],
        hasData: false,
      };
    }

    case 'budget_status': {
      if (context.budgets && context.budgets.length > 0) {
        const overBudget = context.budgets.filter((b) => b.spent > b.limitAmount);
        context.budgets.forEach((b) => {
          facts.push({
            label: `${b.category} budget`,
            value: `${b.spent} / ${b.limitAmount}`,
            currency,
          });
        });

        if (overBudget.length > 0) {
          recommendations.push(
            `Review discretionary spending in ${overBudget.map((b) => b.category).join(', ')}.`
          );
          return {
            intent,
            summary: `You are over budget in ${overBudget.length} category: ${overBudget.map((b) => b.category).join(', ')}.`,
            facts,
            recommendations,
            hasData: true,
          };
        }

        return {
          intent,
          summary: 'All your category budgets are currently within limit.',
          facts,
          recommendations,
          hasData: true,
        };
      }

      return {
        intent,
        summary: "I don't have budget information in your context.",
        facts: [],
        recommendations: [],
        hasData: false,
      };
    }

    case 'savings_status': {
      if (context.summary) {
        facts.push({
          label: 'Total Income',
          value: context.summary.income,
          currency,
        });
        facts.push({
          label: 'Total Expenses',
          value: context.summary.expenses,
          currency,
        });
        facts.push({
          label: 'Net Savings',
          value: context.summary.savings,
          currency,
        });
        facts.push({
          label: 'Savings Rate',
          value: `${context.summary.savingsRate.toFixed(2)}%`,
        });

        if (context.summary.savingsRate < 20) {
          recommendations.push(
            'Aim to raise your savings rate closer to 20% by cutting high non-essential spend.'
          );
        }

        return {
          intent,
          summary: `Your net savings are ${currency} ${context.summary.savings.toLocaleString()} (${context.summary.savingsRate.toFixed(2)}% savings rate).`,
          facts,
          recommendations,
          hasData: true,
        };
      }

      return {
        intent,
        summary: "I don't have savings or summary context to answer that.",
        facts: [],
        recommendations: [],
        hasData: false,
      };
    }

    case 'recurring_expenses': {
      if (context.recurring && context.recurring.length > 0) {
        let totalRecurring = 0;
        context.recurring.forEach((r) => {
          totalRecurring += r.amount;
          facts.push({
            label: `Recurring: ${r.description}`,
            value: r.amount,
            currency,
          });
        });

        facts.unshift({
          label: 'Total Recurring Subscriptions',
          value: totalRecurring,
          currency,
        });

        return {
          intent,
          summary: `You have ${context.recurring.length} recurring subscription payments totaling ${currency} ${totalRecurring.toLocaleString()}.`,
          facts,
          recommendations: ['Consider canceling unused recurring services to boost savings.'],
          hasData: true,
        };
      }

      return {
        intent,
        summary: 'No recurring subscriptions were detected in your data.',
        facts: [],
        recommendations: [],
        hasData: false,
      };
    }

    case 'anomaly_explanation': {
      if (context.anomalies && context.anomalies.length > 0) {
        context.anomalies.forEach((a) => {
          facts.push({
            label: `Unusual spend: ${a.category}`,
            value: `${a.amount} (avg ${a.average})`,
            currency,
          });
        });

        return {
          intent,
          summary: `Detected ${context.anomalies.length} spending anomalies above normal average.`,
          facts,
          recommendations: ['Review these unusual transactions for possible billing errors or extra spend.'],
          hasData: true,
        };
      }

      return {
        intent,
        summary: 'No unusual spending anomalies detected.',
        facts: [],
        recommendations: [],
        hasData: false,
      };
    }

    case 'financial_health': {
      if (context.healthScore) {
        facts.push({
          label: 'Financial Health Score',
          value: `${context.healthScore.score} / 100`,
        });

        if (context.healthScore.insights) {
          recommendations.push(...context.healthScore.insights);
        }

        return {
          intent,
          summary: `Your overall Financial Health Score is ${context.healthScore.score} out of 100.`,
          facts,
          recommendations,
          hasData: true,
        };
      }

      return {
        intent,
        summary: "I don't have health score context for your account.",
        facts: [],
        recommendations: [],
        hasData: false,
      };
    }

    case 'spending_summary':
    default: {
      if (context.summary) {
        facts.push({
          label: 'Total Income',
          value: context.summary.income,
          currency,
        });
        facts.push({
          label: 'Total Expenses',
          value: context.summary.expenses,
          currency,
        });
        facts.push({
          label: 'Net Savings',
          value: context.summary.savings,
          currency,
        });

        if (context.categories && context.categories.length > 0) {
          const sorted = [...context.categories].sort((a, b) => b.amount - a.amount);
          facts.push({
            label: 'Largest Spend Category',
            value: `${sorted[0].category} (${currency} ${sorted[0].amount})`,
          });
        }

        return {
          intent,
          summary: `Total income is ${currency} ${context.summary.income.toLocaleString()} and total expenses are ${currency} ${context.summary.expenses.toLocaleString()}.`,
          facts,
          recommendations,
          hasData: true,
        };
      }

      return {
        intent,
        summary: "I don't have sufficient transaction summary context.",
        facts: [],
        recommendations: [],
        hasData: false,
      };
    }
  }
}
