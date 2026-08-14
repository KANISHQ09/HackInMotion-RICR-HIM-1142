"use client"

import {
  apiRequest,
  apiCacheTimes,
  spendlyQueryKeys,
  useApiMutation,
  useApiQuery,
} from "@/api/queryClient"
import {
  normalizeDeleteResponse,
  normalizeTransaction,
  normalizeTransactionImportSummary,
  normalizeTransactions,
} from "@/api/normalizers"
import type {
  DeleteResponse,
  Transaction,
  TransactionFilters,
  TransactionImportSummary,
  TransactionPayload,
} from "@/api/types"

function transactionSearchParams(filters?: TransactionFilters) {
  const params = new URLSearchParams()

  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })

  const query = params.toString()
  return query ? `/api/transactions?${query}` : "/api/transactions"
}

/**
 * GET /api/transactions
 * Supports startDate, endDate, type, category, and search query parameters.
 */
export function useTransactions(filters?: TransactionFilters, options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, Transaction[]>({
    path: transactionSearchParams(filters),
    queryKey: spendlyQueryKeys.transactions(filters),
    transform: normalizeTransactions,
    enabled: options.enabled,
    staleTime: apiCacheTimes.short,
  })
}

/**
 * GET /api/transactions/import
 * Loads CSV transactions persisted for the authenticated user.
 */
export function useImportedTransactions() {
  return useApiQuery<unknown, Transaction[]>({
    path: "/api/transactions/import",
    queryKey: spendlyQueryKeys.importedTransactions,
    transform: normalizeTransactions,
    staleTime: apiCacheTimes.short,
  })
}

/**
 * POST /api/transactions
 * Creates a manual transaction and invalidates transaction/analytics caches.
 */
export function useCreateTransaction() {
  return useApiMutation<TransactionPayload, unknown, Transaction>({
    path: "/api/transactions",
    transform: normalizeTransaction,
    invalidateKeys: [
      spendlyQueryKeys.transactions(),
      spendlyQueryKeys.importedTransactions,
      spendlyQueryKeys.analyticsSummary(),
      spendlyQueryKeys.recurringTransactions(),
      spendlyQueryKeys.anomalies(),
      spendlyQueryKeys.healthScore(),
      spendlyQueryKeys.recommendations(),
      spendlyQueryKeys.budgets,
      spendlyQueryKeys.goals,
    ],
  })
}

/**
 * PUT /api/transactions/:id
 * Updates a transaction by id and invalidates transaction/analytics caches.
 */
export function useUpdateTransaction() {
  return useApiMutation<{ id: string; payload: TransactionPayload }, unknown, Transaction>({
    path: ({ id }) => `/api/transactions/${id}`,
    method: "put",
    getBody: ({ payload }) => payload,
    transform: normalizeTransaction,
    invalidateKeys: [
      spendlyQueryKeys.transactions(),
      spendlyQueryKeys.analyticsSummary(),
      spendlyQueryKeys.recurringTransactions(),
      spendlyQueryKeys.anomalies(),
      spendlyQueryKeys.healthScore(),
      spendlyQueryKeys.recommendations(),
      spendlyQueryKeys.budgets,
      spendlyQueryKeys.goals,
    ],
  })
}

/**
 * DELETE /api/transactions/:id
 * Deletes a transaction by id and invalidates transaction/analytics caches.
 */
export function useDeleteTransaction() {
  return useApiMutation<string, unknown, DeleteResponse>({
    path: (id) => `/api/transactions/${id}`,
    method: "delete",
    getBody: () => undefined,
    transform: normalizeDeleteResponse,
    invalidateKeys: [
      spendlyQueryKeys.transactions(),
      spendlyQueryKeys.analyticsSummary(),
      spendlyQueryKeys.recurringTransactions(),
      spendlyQueryKeys.anomalies(),
      spendlyQueryKeys.healthScore(),
      spendlyQueryKeys.recommendations(),
      spendlyQueryKeys.budgets,
      spendlyQueryKeys.goals,
    ],
  })
}

/**
 * POST /api/transactions/import
 * Uploads a CSV FormData payload and returns a normalized import summary.
 */
export function useImportTransactions() {
  return useApiMutation<File, unknown, TransactionImportSummary>({
    path: "/api/transactions/import",
    mutationFn: (file) => {
      const body = new FormData()
      body.append("file", file)

      return apiRequest<unknown>("/api/transactions/import", "post", body)
    },
    transform: normalizeTransactionImportSummary,
    invalidateKeys: [
      spendlyQueryKeys.transactions(),
      spendlyQueryKeys.importedTransactions,
      spendlyQueryKeys.analyticsSummary(),
      spendlyQueryKeys.recurringTransactions(),
      spendlyQueryKeys.anomalies(),
      spendlyQueryKeys.healthScore(),
      spendlyQueryKeys.recommendations(),
      spendlyQueryKeys.budgets,
      spendlyQueryKeys.goals,
    ],
  })
}
