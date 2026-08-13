import { z } from 'zod';

/**
 * Category spending summary in financial context
 */
export const categorySpendContextSchema = z.object({
  category: z.string().min(1),
  amount: z.number().nonnegative(),
  percentage: z.number().optional(),
  changePercent: z.number().optional(),
});
export type CategorySpendContext = z.infer<typeof categorySpendContextSchema>;

/**
 * Monthly spending trend item
 */
export const monthlyTrendContextSchema = z.object({
  month: z.string().min(1), // e.g. "2026-07"
  totalIncome: z.number().nonnegative(),
  totalExpense: z.number().nonnegative(),
  netSavings: z.number(),
});
export type MonthlyTrendContext = z.infer<typeof monthlyTrendContextSchema>;

/**
 * Budget context item
 */
export const budgetContextSchema = z.object({
  category: z.string().min(1),
  limitAmount: z.number().positive(),
  spent: z.number().nonnegative(),
  remaining: z.number(),
  progress: z.number().nonnegative(), // percentage e.g. 85.5
});
export type BudgetContext = z.infer<typeof budgetContextSchema>;

/**
 * Savings goal context item
 */
export const goalContextSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  targetDate: z.string().min(1),
  currentProgress: z.number().nonnegative(),
  progress: z.number().nonnegative(), // percentage
});
export type GoalContext = z.infer<typeof goalContextSchema>;

/**
 * Recurring transaction context item
 */
export const recurringContextSchema = z.object({
  description: z.string().min(1),
  category: z.string().default('Other'),
  type: z.enum(['debit', 'credit', 'expense', 'income']).default('debit'),
  count: z.number().int().positive().default(2),
  firstDate: z.string().optional(),
  lastDate: z.string().optional(),
  amount: z.number().positive(),
});
export type RecurringContext = z.infer<typeof recurringContextSchema>;

/**
 * Anomaly context item
 */
export const anomalyContextSchema = z.object({
  category: z.string().min(1),
  amount: z.number().positive(),
  average: z.number().nonnegative(),
  reason: z.string().min(1),
});
export type AnomalyContext = z.infer<typeof anomalyContextSchema>;

/**
 * Financial Health Score context
 */
export const healthScoreContextSchema = z.object({
  score: z.number().min(0).max(100),
  signals: z
    .object({
      savingsRate: z.number().optional(),
      budgetAdherence: z.number().optional(),
      volatilityScore: z.number().optional(),
    })
    .optional(),
  insights: z.array(z.string()).optional(),
});
export type HealthScoreContext = z.infer<typeof healthScoreContextSchema>;

/**
 * Recent transaction item in context
 */
export const transactionContextItemSchema = z.object({
  id: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  amount: z.number(),
  type: z.enum(['debit', 'credit', 'expense', 'income']).optional(),
  category: z.string().optional(),
});
export type TransactionContextItem = z.infer<typeof transactionContextItemSchema>;

/**
 * Overall Summary context
 */
export const financialSummaryContextSchema = z.object({
  income: z.number().nonnegative().default(0),
  expenses: z.number().nonnegative().default(0),
  savings: z.number().default(0),
  savingsRate: z.number().default(0),
});
export type FinancialSummaryContext = z.infer<typeof financialSummaryContextSchema>;

/**
 * Main Validated Financial Context Schema
 */
export const financialContextSchema = z.object({
  currency: z.string().min(1).default('INR'),
  summary: financialSummaryContextSchema.optional(),
  categories: z.array(categorySpendContextSchema).optional(),
  monthlyTrends: z.array(monthlyTrendContextSchema).optional(),
  budgets: z.array(budgetContextSchema).optional(),
  goals: z.array(goalContextSchema).optional(),
  recurring: z.array(recurringContextSchema).optional(),
  anomalies: z.array(anomalyContextSchema).optional(),
  healthScore: healthScoreContextSchema.optional(),
  recentTransactions: z.array(transactionContextItemSchema).optional(),
});

export type FinancialContext = z.infer<typeof financialContextSchema>;
