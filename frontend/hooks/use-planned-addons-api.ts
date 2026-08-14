"use client"

import { spendlyQueryKeys, useApiMutation, useApiQuery } from "@/api/queryClient"
import { normalizePlannedAddOn, normalizePlannedAddOns } from "@/api/normalizers"
import type { PlannedAddOn, PlannedAddOnPayload } from "@/api/types"

/**
 * GET /api/planned-addons
 * Returns upcoming planned add-ons sorted by expected date.
 */
export function usePlannedAddOns(options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, PlannedAddOn[]>({
    path: "/api/planned-addons",
    queryKey: spendlyQueryKeys.plannedAddOns,
    transform: normalizePlannedAddOns,
    enabled: options.enabled,
  })
}

/**
 * POST /api/planned-addons
 * Creates a planned add-on and refreshes the planned add-ons list.
 */
export function useCreatePlannedAddOn() {
  return useApiMutation<PlannedAddOnPayload, unknown, PlannedAddOn>({
    path: "/api/planned-addons",
    transform: normalizePlannedAddOn,
    invalidateKeys: [spendlyQueryKeys.plannedAddOns],
  })
}
