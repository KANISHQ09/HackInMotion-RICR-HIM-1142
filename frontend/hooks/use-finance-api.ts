"use client"

import { apiCacheTimes, spendlyQueryKeys, useApiMutation, useApiQuery } from "@/api/queryClient"
import {
  normalizeAnalyticsSummary,
  normalizeBudget,
  normalizeBudgets,
  normalizeCategoryRule,
  normalizeCategoryRules,
  normalizeDeleteResponse,
  normalizeHealthScore,
  normalizeRecommendations,
  normalizeRecurringTransactions,
  normalizeSavingsGoal,
  normalizeSavingsGoals,
  normalizeSpendingAnomalies,
  normalizeSystemVersion,
} from "@/api/normalizers"
import type {
  AnalyticsFilters,
  AnalyticsSummary,
  Budget,
  BudgetPayload,
  BudgetUpdatePayload,
  CategoryRule,
  CategoryRulePayload,
  CategoryRuleUpdatePayload,
  DeleteResponse,
  HealthScore,
  Recommendation,
  RecurringTransaction,
  SavingsGoal,
  SavingsGoalPayload,
  SavingsGoalUpdatePayload,
  SpendingAnomaly,
  SystemVersion,
} from "@/api/types"

function analyticsPath(path: string, filters?: AnalyticsFilters) {
  const params = new URLSearchParams()

  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })

  const query = params.toString()
  return query ? `${path}?${query}` : path
}

/**
 * GET /api/analytics/summary
 * Supports period, startDate, and endDate query parameters.
 */
export function useAnalyticsSummary(filters?: AnalyticsFilters, options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, AnalyticsSummary>({
    path: analyticsPath("/api/analytics/summary", filters),
    queryKey: spendlyQueryKeys.analyticsSummary(filters),
    transform: normalizeAnalyticsSummary,
    enabled: options.enabled,
  })
}

/**
 * GET /api/analytics/recurring
 * Supports period, startDate, and endDate query parameters.
 */
export function useRecurringTransactions(
  filters?: AnalyticsFilters,
  options: { enabled?: boolean } = {},
) {
  return useApiQuery<unknown, RecurringTransaction[]>({
    path: analyticsPath("/api/analytics/recurring", filters),
    queryKey: spendlyQueryKeys.recurringTransactions(filters),
    transform: normalizeRecurringTransactions,
    enabled: options.enabled,
  })
}

/**
 * GET /api/analytics/anomalies
 * Supports period, startDate, and endDate query parameters.
 */
export function useSpendingAnomalies(filters?: AnalyticsFilters, options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, SpendingAnomaly[]>({
    path: analyticsPath("/api/analytics/anomalies", filters),
    queryKey: spendlyQueryKeys.anomalies(filters),
    transform: normalizeSpendingAnomalies,
    enabled: options.enabled,
  })
}

/**
 * GET /api/health-score
 * Supports period, startDate, and endDate query parameters.
 */
export function useHealthScore(filters?: AnalyticsFilters, options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, HealthScore>({
    path: analyticsPath("/api/health-score", filters),
    queryKey: spendlyQueryKeys.healthScore(filters),
    transform: normalizeHealthScore,
    enabled: options.enabled,
    staleTime: apiCacheTimes.short,
  })
}

/**
 * GET /api/recommendations
 * Supports period, startDate, and endDate query parameters.
 */
export function useRecommendations(filters?: AnalyticsFilters, options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, Recommendation[]>({
    path: analyticsPath("/api/recommendations", filters),
    queryKey: spendlyQueryKeys.recommendations(filters),
    transform: normalizeRecommendations,
    enabled: options.enabled,
  })
}

/**
 * GET /api/budgets
 */
export function useBudgets(options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, Budget[]>({
    path: "/api/budgets",
    queryKey: spendlyQueryKeys.budgets,
    transform: normalizeBudgets,
    enabled: options.enabled,
  })
}

/**
 * POST /api/budgets
 */
export function useCreateBudget() {
  return useApiMutation<BudgetPayload, unknown, Budget>({
    path: "/api/budgets",
    transform: normalizeBudget,
    invalidateKeys: [spendlyQueryKeys.budgets, spendlyQueryKeys.healthScore()],
  })
}

/**
 * PUT /api/budgets/:id
 */
export function useUpdateBudget() {
  return useApiMutation<{ id: string; payload: BudgetUpdatePayload }, unknown, Budget>({
    path: ({ id }) => `/api/budgets/${id}`,
    method: "put",
    getBody: ({ payload }) => payload,
    transform: normalizeBudget,
    invalidateKeys: [spendlyQueryKeys.budgets, spendlyQueryKeys.healthScore()],
  })
}

/**
 * DELETE /api/budgets/:id
 */
export function useDeleteBudget() {
  return useApiMutation<string, unknown, DeleteResponse>({
    path: (id) => `/api/budgets/${id}`,
    method: "delete",
    getBody: () => undefined,
    transform: normalizeDeleteResponse,
    invalidateKeys: [spendlyQueryKeys.budgets, spendlyQueryKeys.healthScore()],
  })
}

/**
 * GET /api/goals
 */
export function useGoals(options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, SavingsGoal[]>({
    path: "/api/goals",
    queryKey: spendlyQueryKeys.goals,
    transform: normalizeSavingsGoals,
    enabled: options.enabled,
  })
}

/**
 * POST /api/goals
 */
export function useCreateGoal() {
  return useApiMutation<SavingsGoalPayload, unknown, SavingsGoal>({
    path: "/api/goals",
    transform: normalizeSavingsGoal,
    invalidateKeys: [spendlyQueryKeys.goals],
  })
}

/**
 * PUT /api/goals/:id
 */
export function useUpdateGoal() {
  return useApiMutation<{ id: string; payload: SavingsGoalUpdatePayload }, unknown, SavingsGoal>({
    path: ({ id }) => `/api/goals/${id}`,
    method: "put",
    getBody: ({ payload }) => payload,
    transform: normalizeSavingsGoal,
    invalidateKeys: [spendlyQueryKeys.goals],
  })
}

/**
 * DELETE /api/goals/:id
 */
export function useDeleteGoal() {
  return useApiMutation<string, unknown, DeleteResponse>({
    path: (id) => `/api/goals/${id}`,
    method: "delete",
    getBody: () => undefined,
    transform: normalizeDeleteResponse,
    invalidateKeys: [spendlyQueryKeys.goals],
  })
}

/**
 * GET /api/category-rules
 */
export function useCategoryRules(options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, CategoryRule[]>({
    path: "/api/category-rules",
    queryKey: spendlyQueryKeys.categoryRules,
    transform: normalizeCategoryRules,
    enabled: options.enabled,
  })
}

/**
 * POST /api/category-rules
 */
export function useCreateCategoryRule() {
  return useApiMutation<CategoryRulePayload, unknown, CategoryRule>({
    path: "/api/category-rules",
    transform: normalizeCategoryRule,
    invalidateKeys: [spendlyQueryKeys.categoryRules],
  })
}

/**
 * PUT /api/category-rules/:id
 */
export function useUpdateCategoryRule() {
  return useApiMutation<{ id: string; payload: CategoryRuleUpdatePayload }, unknown, CategoryRule>({
    path: ({ id }) => `/api/category-rules/${id}`,
    method: "put",
    getBody: ({ payload }) => payload,
    transform: normalizeCategoryRule,
    invalidateKeys: [spendlyQueryKeys.categoryRules],
  })
}

/**
 * DELETE /api/category-rules/:id
 */
export function useDeleteCategoryRule() {
  return useApiMutation<string, unknown, DeleteResponse>({
    path: (id) => `/api/category-rules/${id}`,
    method: "delete",
    getBody: () => undefined,
    transform: normalizeDeleteResponse,
    invalidateKeys: [spendlyQueryKeys.categoryRules],
  })
}

/**
 * GET /api/system/version
 */
export function useSystemVersion(options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, SystemVersion>({
    path: "/api/system/version",
    queryKey: spendlyQueryKeys.systemVersion,
    transform: normalizeSystemVersion,
    enabled: options.enabled,
    staleTime: apiCacheTimes.long,
  })
}
