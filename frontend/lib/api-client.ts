import { getAuthToken, type AuthUser } from "@/lib/auth-storage"

type ApiSuccess<T> = {
  success: true
  result: T
}

type ApiError = {
  success: false
  errorMessage?: string
}

type AuthResponse = {
  token: string
  user: AuthUser
}

export type PlannedAddOn = {
  id: string
  expectedDate: string
  description: string
  merchant: string
  amount: string
  type: "debit" | "credit"
  category: string
  note: string
  status: string
  createdAt: number
}

export type PlannedAddOnPayload = {
  expectedDate: string
  description: string
  merchant: string
  amount: string
  type: "debit" | "credit"
  category: string
  note: string
}

export type Transaction = {
  id: string
  date: string
  description: string
  merchant: string
  amount: string
  type: "debit" | "credit"
  category: string
  source: string
  createdAt: number
}

export type TransactionPayload = {
  date: string
  description: string
  merchant: string
  amount: string
  type: "debit" | "credit"
  category: string
}

export type TransactionImportRowResult = {
  row: number
  status: "imported" | "duplicate" | "failed"
  reason?: string
  traceId?: string
}

export type TransactionImportSummary = {
  rowsProcessed: number
  rowsImported: number
  rowsFailed: number
  duplicatesSkipped: number
  results: TransactionImportRowResult[]
}

const apiRequestTimeoutMs = 15_000

async function request<T>(path: string, init: RequestInit) {
  const controller = new AbortController()
  const timeout = globalThis.setTimeout(() => controller.abort(), apiRequestTimeoutMs)
  const isFormData = init.body instanceof FormData

  let response: Response

  try {
    response = await fetch(path, {
      ...init,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...init.headers,
      },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The backend took too long to respond. Please try again.")
    }

    throw new Error("Unable to reach the Spendly backend. Make sure the API server is running.")
  } finally {
    globalThis.clearTimeout(timeout)
  }

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiError | null

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.success === false ? payload.errorMessage || "Request failed" : "Request failed")
  }

  return payload.result
}

function authHeaders() {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Please log in again to continue.")
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

function authenticatedRequest<T>(path: string, init: RequestInit = {}) {
  return request<T>(path, {
    ...init,
    headers: {
      ...authHeaders(),
      ...init.headers,
    },
  })
}

export function registerUser(name: string, email: string, password: string) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })
}

export function loginUser(email: string, password: string) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function listPlannedAddOns() {
  return authenticatedRequest<PlannedAddOn[]>("/api/planned-addons")
}

export function createPlannedAddOn(payload: PlannedAddOnPayload) {
  return authenticatedRequest<PlannedAddOn>("/api/planned-addons", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function createTransaction(payload: TransactionPayload) {
  return authenticatedRequest<Transaction>("/api/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function importTransactions(file: File) {
  const body = new FormData()
  body.append("file", file)

  return authenticatedRequest<TransactionImportSummary>("/api/transactions/import", {
    method: "POST",
    body,
  })
}
