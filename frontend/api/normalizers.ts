import type {
  AnalyticsSummary,
  AuthResponse,
  AuthUser,
  Budget,
  CategoryRule,
  DeleteResponse,
  HealthScore,
  PlannedAddOn,
  Recommendation,
  RecurringTransaction,
  SavingsGoal,
  SpendingAnomaly,
  SpendingBreakdownItem,
  SystemVersion,
  Transaction,
  TransactionImportRowResult,
  TransactionImportSummary,
  TransactionType,
} from "@/api/types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function record(value: unknown, label: string) {
  if (!isRecord(value)) {
    throw new Error(`${label} response is not an object`)
  }

  return value
}

function stringField(source: Record<string, unknown>, key: string, label: string) {
  const value = source[key]

  if (typeof value !== "string") {
    throw new Error(`${label}.${key} is missing or invalid`)
  }

  return value
}

function optionalStringField(source: Record<string, unknown>, key: string) {
  const value = source[key]
  return typeof value === "string" ? value : undefined
}

function numberField(source: Record<string, unknown>, key: string, label: string) {
  const value = source[key]

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${label}.${key} is missing or invalid`)
  }

  return value
}

function stringArrayField(source: Record<string, unknown>, key: string, label: string) {
  const value = source[key]

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${label}.${key} is missing or invalid`)
  }

  return value
}

function arrayField<T>(value: unknown, label: string, transform: (item: unknown) => T) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} response is not an array`)
  }

  return value.map(transform)
}

function transactionType(source: Record<string, unknown>, key: string, label: string): TransactionType {
  const value = stringField(source, key, label)

  if (value !== "debit" && value !== "credit") {
    throw new Error(`${label}.${key} must be debit or credit`)
  }

  return value
}

export function normalizeUser(raw: unknown): AuthUser {
  const source = record(raw, "user")

  return {
    id: stringField(source, "id", "user"),
    email: stringField(source, "email", "user"),
    username: optionalStringField(source, "username"),
    nickname: optionalStringField(source, "nickname"),
    defaultCurrency: optionalStringField(source, "defaultCurrency"),
    emailVerified: typeof source.emailVerified === "boolean" ? source.emailVerified : undefined,
  }
}

export function normalizeAuthResponse(raw: unknown): AuthResponse {
  const source = record(raw, "auth")

  return {
    user: normalizeUser(source.user),
  }
}

export function normalizeTransaction(raw: unknown): Transaction {
  const source = record(raw, "transaction")

  return {
    id: stringField(source, "id", "transaction"),
    date: stringField(source, "date", "transaction"),
    description: stringField(source, "description", "transaction"),
    merchant: stringField(source, "merchant", "transaction"),
    amount: stringField(source, "amount", "transaction"),
    type: transactionType(source, "type", "transaction"),
    category: stringField(source, "category", "transaction"),
    source: stringField(source, "source", "transaction"),
    createdAt: numberField(source, "createdAt", "transaction"),
  }
}

export function normalizeTransactions(raw: unknown) {
  return arrayField(raw, "transactions", normalizeTransaction)
}

function normalizeImportRow(raw: unknown): TransactionImportRowResult {
  const source = record(raw, "transactionImportRow")
  const status = stringField(source, "status", "transactionImportRow")

  if (status !== "imported" && status !== "duplicate" && status !== "failed") {
    throw new Error("transactionImportRow.status is invalid")
  }

  return {
    row: numberField(source, "row", "transactionImportRow"),
    status,
    reason: optionalStringField(source, "reason"),
    traceId: optionalStringField(source, "traceId"),
  }
}

export function normalizeTransactionImportSummary(raw: unknown): TransactionImportSummary {
  const source = record(raw, "transactionImportSummary")

  return {
    rowsProcessed: numberField(source, "rowsProcessed", "transactionImportSummary"),
    rowsImported: numberField(source, "rowsImported", "transactionImportSummary"),
    rowsFailed: numberField(source, "rowsFailed", "transactionImportSummary"),
    duplicatesSkipped: numberField(source, "duplicatesSkipped", "transactionImportSummary"),
    results: arrayField(source.results, "transactionImportSummary.results", normalizeImportRow),
  }
}

function normalizeBreakdownItem(raw: unknown): SpendingBreakdownItem {
  const source = record(raw, "spendingBreakdown")

  return {
    category: stringField(source, "category", "spendingBreakdown"),
    amount: stringField(source, "amount", "spendingBreakdown"),
    percentage: stringField(source, "percentage", "spendingBreakdown"),
  }
}

function normalizeTrendItem(raw: unknown) {
  const source = record(raw, "analyticsTrend")

  return {
    month: stringField(source, "month", "analyticsTrend"),
    income: stringField(source, "totalIncome", "analyticsTrend"),
    expenses: stringField(source, "totalExpense", "analyticsTrend"),
    netSavings: stringField(source, "netSavings", "analyticsTrend"),
  }
}

export function normalizeAnalyticsSummary(raw: unknown): AnalyticsSummary {
  const source = record(raw, "analyticsSummary")
  const period = record(source.period, "analyticsSummary.period")

  return {
    period: {
      period: stringField(period, "period", "analyticsSummary.period"),
      startDate: stringField(period, "startDate", "analyticsSummary.period"),
      endDate: stringField(period, "endDate", "analyticsSummary.period"),
    },
    totalIncome: stringField(source, "totalIncome", "analyticsSummary"),
    totalExpenses: stringField(source, "totalExpenses", "analyticsSummary"),
    netSavings: stringField(source, "netSavings", "analyticsSummary"),
    breakdown: arrayField(source.breakdown, "analyticsSummary.breakdown", normalizeBreakdownItem),
    trends: arrayField(source.trends, "analyticsSummary.trends", normalizeTrendItem),
  }
}

export function normalizeRecurringTransaction(raw: unknown): RecurringTransaction {
  const source = record(raw, "recurringTransaction")

  return {
    description: stringField(source, "description", "recurringTransaction"),
    type: transactionType(source, "type", "recurringTransaction"),
    category: stringField(source, "category", "recurringTransaction"),
    count: numberField(source, "count", "recurringTransaction"),
    firstDate: stringField(source, "firstDate", "recurringTransaction"),
    lastDate: stringField(source, "lastDate", "recurringTransaction"),
    amount: stringField(source, "amount", "recurringTransaction"),
  }
}

export function normalizeRecurringTransactions(raw: unknown) {
  return arrayField(raw, "recurringTransactions", normalizeRecurringTransaction)
}

export function normalizeSpendingAnomaly(raw: unknown): SpendingAnomaly {
  const source = record(raw, "spendingAnomaly")

  return {
    category: stringField(source, "category", "spendingAnomaly"),
    amount: stringField(source, "amount", "spendingAnomaly"),
    average: stringField(source, "average", "spendingAnomaly"),
    reason: stringField(source, "reason", "spendingAnomaly"),
  }
}

export function normalizeSpendingAnomalies(raw: unknown) {
  return arrayField(raw, "spendingAnomalies", normalizeSpendingAnomaly)
}

export function normalizeHealthScore(raw: unknown): HealthScore {
  const source = record(raw, "healthScore")
  const signals = record(source.signals, "healthScore.signals")

  return {
    score: numberField(source, "score", "healthScore"),
    signals: {
      savingsRate: stringField(signals, "savingsRate", "healthScore.signals"),
      budgetAdherence: stringField(signals, "budgetAdherence", "healthScore.signals"),
      volatilityScore: stringField(signals, "volatilityScore", "healthScore.signals"),
    },
    insights: stringArrayField(source, "insights", "healthScore"),
  }
}

export function normalizeRecommendation(raw: unknown): Recommendation {
  const source = record(raw, "recommendation")

  return {
    title: stringField(source, "title", "recommendation"),
    action: stringField(source, "action", "recommendation"),
  }
}

export function normalizeRecommendations(raw: unknown) {
  return arrayField(raw, "recommendations", normalizeRecommendation)
}

export function normalizeBudget(raw: unknown): Budget {
  const source = record(raw, "budget")

  return {
    id: stringField(source, "id", "budget"),
    category: stringField(source, "category", "budget"),
    limitAmount: stringField(source, "limitAmount", "budget"),
    period: stringField(source, "period", "budget"),
    spent: stringField(source, "spent", "budget"),
    remaining: stringField(source, "remaining", "budget"),
    progress: stringField(source, "progress", "budget"),
  }
}

export function normalizeBudgets(raw: unknown) {
  return arrayField(raw, "budgets", normalizeBudget)
}

export function normalizeSavingsGoal(raw: unknown): SavingsGoal {
  const source = record(raw, "savingsGoal")

  return {
    id: stringField(source, "id", "savingsGoal"),
    name: stringField(source, "name", "savingsGoal"),
    targetAmount: stringField(source, "targetAmount", "savingsGoal"),
    targetDate: stringField(source, "targetDate", "savingsGoal"),
    currentProgress: stringField(source, "currentProgress", "savingsGoal"),
    progress: stringField(source, "progress", "savingsGoal"),
  }
}

export function normalizeSavingsGoals(raw: unknown) {
  return arrayField(raw, "savingsGoals", normalizeSavingsGoal)
}

export function normalizeCategoryRule(raw: unknown): CategoryRule {
  const source = record(raw, "categoryRule")

  return {
    id: stringField(source, "id", "categoryRule"),
    merchantPattern: stringField(source, "merchantPattern", "categoryRule"),
    category: stringField(source, "category", "categoryRule"),
    type: transactionType(source, "type", "categoryRule"),
    createdAt: numberField(source, "createdAt", "categoryRule"),
    updatedAt: numberField(source, "updatedAt", "categoryRule"),
  }
}

export function normalizeCategoryRules(raw: unknown) {
  return arrayField(raw, "categoryRules", normalizeCategoryRule)
}

export function normalizePlannedAddOn(raw: unknown): PlannedAddOn {
  const source = record(raw, "plannedAddOn")

  return {
    id: stringField(source, "id", "plannedAddOn"),
    expectedDate: stringField(source, "expectedDate", "plannedAddOn"),
    description: stringField(source, "description", "plannedAddOn"),
    merchant: stringField(source, "merchant", "plannedAddOn"),
    amount: stringField(source, "amount", "plannedAddOn"),
    type: transactionType(source, "type", "plannedAddOn"),
    category: stringField(source, "category", "plannedAddOn"),
    note: stringField(source, "note", "plannedAddOn"),
    status: stringField(source, "status", "plannedAddOn"),
    createdAt: numberField(source, "createdAt", "plannedAddOn"),
  }
}

export function normalizePlannedAddOns(raw: unknown) {
  return arrayField(raw, "plannedAddOns", normalizePlannedAddOn)
}

export function normalizeDeleteResponse(raw: unknown): DeleteResponse {
  const source = record(raw, "deleteResponse")

  if (source.deleted !== true) {
    throw new Error("deleteResponse.deleted must be true")
  }

  return { deleted: true }
}

export function normalizeSystemVersion(raw: unknown): SystemVersion {
  const source = record(raw, "systemVersion")

  return {
    version: stringField(source, "version", "systemVersion"),
    commitHash: stringField(source, "commitHash", "systemVersion"),
  }
}
