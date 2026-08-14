"use client"

import {
  apiRequest,
  apiCacheTimes,
  spendlyQueryKeys,
  useApiMutation,
  useApiQuery,
} from "@/api/queryClient"
import { normalizeAuthResponse, normalizeUser } from "@/api/normalizers"
import type { AuthResponse, AuthUser } from "@/api/types"

type LoginCredentials = {
  email: string
  password: string
}

type RegisterCredentials = LoginCredentials & {
  name: string
}

/**
 * GET /api/auth/me
 * Returns the current cookie-authenticated user after validating the API envelope.
 */
export function useCurrentUser(options: { enabled?: boolean } = {}) {
  return useApiQuery<unknown, AuthUser>({
    path: "/api/auth/me",
    queryKey: spendlyQueryKeys.currentUser,
    transform: normalizeUser,
    enabled: options.enabled,
    staleTime: apiCacheTimes.long,
    retry: false,
  })
}

/**
 * POST /api/auth/login
 * Accepts email/password and returns the authenticated user.
 */
export function useLoginUser() {
  return useApiMutation<LoginCredentials, unknown, AuthResponse>({
    path: "/api/auth/login",
    transform: normalizeAuthResponse,
    invalidateKeys: [spendlyQueryKeys.currentUser],
  })
}

/**
 * POST /api/auth/register
 * Accepts name/email/password and returns the created authenticated user.
 */
export function useRegisterUser() {
  return useApiMutation<RegisterCredentials, unknown, AuthResponse>({
    path: "/api/auth/register",
    transform: normalizeAuthResponse,
    invalidateKeys: [spendlyQueryKeys.currentUser],
  })
}

/**
 * POST /api/auth/logout
 * Clears the auth cookie and removes user-scoped query cache.
 */
export function useLogoutUser() {
  return useApiMutation<void, null, null>({
    path: "/api/auth/logout",
    getBody: () => undefined,
    mutationFn: () => apiRequest<null>("/api/auth/logout", "post"),
    transform: () => null,
    invalidateKeys: [spendlyQueryKeys.currentUser],
  })
}
