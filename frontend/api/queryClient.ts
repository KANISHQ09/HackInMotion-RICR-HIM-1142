"use client"

import { useMemo } from "react"
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query"
import axiosInstance, {
  normalizeApiError,
  SpendlyApiError,
  type SpendlyApiEnvelope,
} from "@/api/axiosInstance"

type RequestMethod = "get" | "post" | "put" | "delete"

type ApiQueryOptions<TRaw, TData> = {
  path: string
  queryKey: QueryKey
  queryFn?: () => Promise<TRaw>
  transform: (raw: TRaw) => TData
  enabled?: boolean
  staleTime?: number
  gcTime?: number
  retry?: UseQueryOptions<TData, SpendlyApiError>["retry"]
}

type ApiMutationOptions<TVariables, TRaw, TData> = {
  path: string | ((variables: TVariables) => string)
  method?: Exclude<RequestMethod, "get">
  mutationFn?: (variables: TVariables) => Promise<TRaw>
  getBody?: (variables: TVariables) => unknown
  transform: (raw: TRaw) => TData
  invalidateKeys?: QueryKey[]
  options?: Omit<UseMutationOptions<TData, SpendlyApiError, TVariables>, "mutationFn">
}

export const apiCacheTimes = {
  short: 30_000,
  standard: 60_000,
  long: 5 * 60_000,
  gc: 10 * 60_000,
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: apiCacheTimes.standard,
      gcTime: apiCacheTimes.gc,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const apiError = normalizeApiError(error)

        if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
          return false
        }

        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})

export const spendlyQueryKeys = {
  currentUser: ["auth", "me"] as const,
  transactions: (filters?: unknown) => ["transactions", normalizeQueryKeyPart(filters)] as const,
  importedTransactions: ["transactions", "imported"] as const,
  analyticsSummary: (filters?: unknown) => ["analytics", "summary", normalizeQueryKeyPart(filters)] as const,
  recurringTransactions: (filters?: unknown) =>
    ["analytics", "recurring", normalizeQueryKeyPart(filters)] as const,
  anomalies: (filters?: unknown) => ["analytics", "anomalies", normalizeQueryKeyPart(filters)] as const,
  healthScore: (filters?: unknown) => ["health-score", normalizeQueryKeyPart(filters)] as const,
  recommendations: (filters?: unknown) => ["recommendations", normalizeQueryKeyPart(filters)] as const,
  budgets: ["budgets"] as const,
  goals: ["goals"] as const,
  categoryRules: ["category-rules"] as const,
  plannedAddOns: ["planned-addons"] as const,
  systemVersion: ["system", "version"] as const,
}

function normalizeQueryKeyPart(value: unknown) {
  if (!value || typeof value !== "object") {
    return value ?? null
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined && entryValue !== "")
      .sort(([left], [right]) => left.localeCompare(right)),
  )
}

function unwrapEnvelope<T>(envelope: SpendlyApiEnvelope<T>) {
  if (!envelope.success) {
    throw new SpendlyApiError(envelope.errorMessage || "Request failed")
  }

  return envelope.result
}

export async function apiRequest<T>(path: string, method: RequestMethod = "get", body?: unknown) {
  const response = await axiosInstance.request<SpendlyApiEnvelope<T>>({
    url: path,
    method,
    data: body,
  })

  return unwrapEnvelope(response.data)
}

export function useApiQuery<TRaw, TData>({
  path,
  queryKey,
  queryFn,
  transform,
  enabled = true,
  staleTime = apiCacheTimes.standard,
  gcTime = apiCacheTimes.gc,
  retry,
}: ApiQueryOptions<TRaw, TData>) {
  const query = useQuery<TData, SpendlyApiError>({
    queryKey,
    queryFn: async () => {
      const raw = queryFn ? await queryFn() : await apiRequest<TRaw>(path)
      return transform(raw)
    },
    enabled,
    staleTime,
    gcTime,
    retry,
  })

  return useMemo(
    () => ({
      data: query.data,
      error: query.error ? normalizeApiError(query.error) : null,
      isError: query.isError,
      isFetching: query.isFetching,
      isLoading: query.isLoading,
      isPending: query.isPending,
      isSuccess: query.isSuccess,
      refetch: query.refetch,
    }),
    [
      query.data,
      query.error,
      query.isError,
      query.isFetching,
      query.isLoading,
      query.isPending,
      query.isSuccess,
      query.refetch,
    ],
  )
}

export function useApiMutation<TVariables, TRaw, TData>({
  path,
  method = "post",
  mutationFn,
  getBody = (variables) => variables,
  transform,
  invalidateKeys = [],
  options,
}: ApiMutationOptions<TVariables, TRaw, TData>) {
  const client = useQueryClient()

  return useMutation<TData, SpendlyApiError, TVariables>({
    ...options,
    mutationFn: async (variables) => {
      const raw = mutationFn
        ? await mutationFn(variables)
        : await apiRequest<TRaw>(
            typeof path === "function" ? path(variables) : path,
            method,
            getBody(variables),
          )

      return transform(raw)
    },
    onSuccess: async (data, variables, context, mutationContext) => {
      await Promise.all(invalidateKeys.map((queryKey) => client.invalidateQueries({ queryKey })))
      await options?.onSuccess?.(data, variables, context, mutationContext)
    },
  })
}
