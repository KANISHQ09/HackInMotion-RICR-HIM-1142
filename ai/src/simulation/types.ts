import { z } from 'zod';

export const categoryReductionScenarioSchema = z.object({
  type: z.literal('category_reduction'),
  category: z.string().min(1, 'Category is required'),
  currentMonthlySpend: z.number().positive({ message: 'Current monthly spend must be positive' }),
  reductionPercent: z.number().min(0).max(100).optional(),
  reductionAmount: z.number().nonnegative().optional(),
});

export const recurringCancellationScenarioSchema = z.object({
  type: z.literal('recurring_cancellation'),
  description: z.string().min(1, 'Description is required'),
  monthlyAmount: z.number().positive({ message: 'Monthly amount must be positive' }),
  category: z.string().optional(),
});

export const multiCategoryItemSchema = z.object({
  category: z.string().min(1),
  currentMonthlySpend: z.number().positive(),
  reductionPercent: z.number().min(0).max(100).optional(),
  reductionAmount: z.number().nonnegative().optional(),
});

export const multiCategoryReductionScenarioSchema = z.object({
  type: z.literal('multi_category_reduction'),
  categories: z.array(multiCategoryItemSchema).min(1, 'At least one category is required'),
});

export const savingsRateTargetScenarioSchema = z.object({
  type: z.literal('savings_rate_target'),
  targetSavingsRate: z.number().min(1).max(99, 'Target savings rate must be between 1% and 99%'),
});

export const simulationScenarioSchema = z.discriminatedUnion('type', [
  categoryReductionScenarioSchema,
  recurringCancellationScenarioSchema,
  multiCategoryReductionScenarioSchema,
  savingsRateTargetScenarioSchema,
]);

export type SimulationScenario = z.infer<typeof simulationScenarioSchema>;

export const simulationRequestSchema = z.object({
  currency: z.string().min(1).default('INR'),
  monthlyIncome: z.number().positive('Monthly income must be greater than zero'),
  currentMonthlyExpenses: z.number().nonnegative('Current monthly expenses must be non-negative'),
  currentMonthlySavings: z.number().optional(),
  scenario: simulationScenarioSchema,
  months: z.number().int().min(1).max(60).default(12),
});

export type SimulationRequest = z.infer<typeof simulationRequestSchema>;

/**
 * Validates simulation request payload
 */
export function validateSimulationRequest(input: unknown): SimulationRequest {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid simulation payload: must be a non-null JSON object');
  }

  const raw = input as Record<string, unknown>;

  if (raw.monthlyIncome !== undefined && (typeof raw.monthlyIncome !== 'number' || raw.monthlyIncome <= 0)) {
    throw new Error('Monthly income must be a positive number');
  }

  if (raw.currentMonthlyExpenses !== undefined && (typeof raw.currentMonthlyExpenses !== 'number' || raw.currentMonthlyExpenses < 0)) {
    throw new Error('Current monthly expenses must be a non-negative number');
  }

  return simulationRequestSchema.parse({
    currency: raw.currency || 'INR',
    monthlyIncome: raw.monthlyIncome,
    currentMonthlyExpenses: raw.currentMonthlyExpenses,
    currentMonthlySavings: raw.currentMonthlySavings,
    scenario: raw.scenario,
    months: raw.months !== undefined ? Number(raw.months) : 12,
  });
}
