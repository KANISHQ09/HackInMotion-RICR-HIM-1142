import { z } from 'zod';

/**
 * Coerces string or number values into a valid number (e.g. "8400.00" -> 8400)
 */
export const numericCoerce = z.union([
  z.number(),
  z.string().transform((val) => {
    const cleaned = val.replace(/,/g, '').trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }),
]).default(0);

/**
 * Spending breakdown per category
 */
export const categorySpendSchema = z.object({
  category: z.string().min(1),
  amount: numericCoerce,
  percentage: numericCoerce.optional(),
  changePercent: numericCoerce.optional(),
  previousAmount: numericCoerce.optional(),
});
export type CategorySpend = z.infer<typeof categorySpendSchema>;

/**
 * Month-over-month trend item
 */
export const trendItemSchema = z.object({
  month: z.string().min(1),
  totalIncome: numericCoerce,
  totalExpense: numericCoerce,
  netSavings: numericCoerce,
  savingsRate: numericCoerce.optional(),
});
export type TrendItem = z.infer<typeof trendItemSchema>;

/**
 * Recurring expense item from backend
 */
export const recurringItemSchema = z.object({
  description: z.string().min(1),
  category: z.string().default('Other'),
  type: z.string().default('debit'),
  count: z.number().int().positive().default(2),
  firstDate: z.string().optional(),
  lastDate: z.string().optional(),
  amount: numericCoerce,
});
export type RecurringItem = z.infer<typeof recurringItemSchema>;

/**
 * Spending anomaly item from backend
 */
export const anomalyItemSchema = z.object({
  category: z.string().min(1),
  amount: numericCoerce,
  average: numericCoerce,
  reason: z.string().default('above category average'),
  transactionId: z.string().optional(),
});
export type AnomalyItem = z.infer<typeof anomalyItemSchema>;

/**
 * Financial Health Score from backend
 */
export const healthScoreSchema = z.object({
  score: z.number().min(0).max(100),
  signals: z
    .object({
      savingsRate: numericCoerce.optional(),
      budgetAdherence: numericCoerce.optional(),
      volatilityScore: numericCoerce.optional(),
    })
    .optional(),
  insights: z.array(z.string()).optional().default([]),
});
export type HealthScore = z.infer<typeof healthScoreSchema>;

/**
 * Budget context item
 */
export const budgetItemSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1),
  limitAmount: numericCoerce,
  spent: numericCoerce,
  remaining: numericCoerce.optional(),
  progress: numericCoerce.optional(), // percentage e.g. 105.0
  period: z.string().optional().default('monthly'),
});
export type BudgetItem = z.infer<typeof budgetItemSchema>;

/**
 * Savings goal item
 */
export const goalItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  targetAmount: numericCoerce,
  targetDate: z.string().optional(),
  currentProgress: numericCoerce,
  progress: numericCoerce.optional(), // percentage e.g. 45.0
});
export type GoalItem = z.infer<typeof goalItemSchema>;

/**
 * Deterministic recommendation item from backend
 */
export const backendRecommendationSchema = z.object({
  title: z.string().min(1),
  action: z.string().min(1),
});
export type BackendRecommendation = z.infer<typeof backendRecommendationSchema>;

/**
 * Overall Summary context
 */
export const financialSummarySchema = z.object({
  income: numericCoerce,
  expenses: numericCoerce,
  savings: numericCoerce.optional(),
  savingsRate: numericCoerce.optional(),
});
export type FinancialSummary = z.infer<typeof financialSummarySchema>;

/**
 * Unified Financial Intelligence Context Schema
 */
export const unifiedContextSchema = z.object({
  currency: z.string().min(1).default('INR'),
  summary: financialSummarySchema.optional(),
  categories: z.array(categorySpendSchema).optional().default([]),
  trends: z.array(trendItemSchema).optional().default([]),
  recurring: z.array(recurringItemSchema).optional().default([]),
  anomalies: z.array(anomalyItemSchema).optional().default([]),
  healthScore: healthScoreSchema.optional(),
  budgets: z.array(budgetItemSchema).optional().default([]),
  goals: z.array(goalItemSchema).optional().default([]),
  recommendations: z.array(backendRecommendationSchema).optional().default([]),
  recentTransactions: z
    .array(
      z.object({
        id: z.string().optional(),
        date: z.string().optional(),
        description: z.string().optional(),
        amount: numericCoerce,
        type: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

export type UnifiedContext = z.infer<typeof unifiedContextSchema>;

/**
 * Severity level for detected financial insights
 */
export const insightSeveritySchema = z.enum(['critical', 'warning', 'info', 'positive']);
export type InsightSeverity = z.infer<typeof insightSeveritySchema>;

/**
 * Detected Financial Insight Structure
 */
export const financialInsightSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  severity: insightSeveritySchema,
  title: z.string().min(1),
  explanation: z.string().min(1),
  metrics: z.record(z.union([z.string(), z.number()])),
  sourceData: z.string(),
  recommendation: z.string().optional(),
});
export type FinancialInsight = z.infer<typeof financialInsightSchema>;

/**
 * Actionable Recommendation Structure
 */
export const actionableRecommendationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  action: z.string().min(1),
  reason: z.string().min(1),
  supportingMetric: z.string(),
  estimatedMonthlyImpact: z.number().nonnegative().optional(),
  priority: z.enum(['high', 'medium', 'low']),
});
export type ActionableRecommendation = z.infer<typeof actionableRecommendationSchema>;

/**
 * Intelligence Summary Structure
 */
export const intelligenceSummarySchema = z.object({
  healthScore: z.number().optional(),
  topIssue: z.string(),
  totalInsights: z.number().int().nonnegative(),
  criticalCount: z.number().int().nonnegative(),
});
export type IntelligenceSummary = z.infer<typeof intelligenceSummarySchema>;

/**
 * Complete Unified Intelligence API Output
 */
export const unifiedIntelligenceResultSchema = z.object({
  summary: intelligenceSummarySchema,
  insights: z.array(financialInsightSchema),
  recommendations: z.array(actionableRecommendationSchema),
  healthExplanation: z.string(),
  assistantReadyContext: z.record(z.unknown()),
});
export type UnifiedIntelligenceResult = z.infer<typeof unifiedIntelligenceResultSchema>;

/**
 * Validates and normalizes unified financial context
 */
export function validateUnifiedContext(input: unknown): UnifiedContext {
  if (!input || typeof input !== 'object') {
    return unifiedContextSchema.parse({});
  }

  const raw = input as Record<string, unknown>;

  // Normalize field names if caller used aliases e.g. monthlyTrends -> trends
  const normalized: Record<string, unknown> = {
    ...raw,
    trends: raw.trends || raw.monthlyTrends || [],
  };

  return unifiedContextSchema.parse(normalized);
}
