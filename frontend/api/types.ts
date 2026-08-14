export type ApiSuccess<T> = {
  success: true
  result: T
}

export type ApiErrorEnvelope = {
  success: false
  errorMessage?: string
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiErrorEnvelope

export type TransactionType = "debit" | "credit"

export type AuthUser = {
  id: string
  email: string
  username?: string
  nickname?: string
  defaultCurrency?: string
  emailVerified?: boolean
}

export type AuthResponse = {
  user: AuthUser
}

export type TransactionFilters = {
  startDate?: string
  endDate?: string
  type?: TransactionType
  category?: string
  search?: string
}

export type Transaction = {
  id: string
  date: string
  description: string
  merchant: string
  amount: string
  type: TransactionType
  category: string
  source: string
  createdAt: number
}

export type TransactionPayload = {
  date: string
  description: string
  merchant: string
  amount: string
  type: TransactionType
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

export type AnalyticsFilters = {
  period?: string
  startDate?: string
  endDate?: string
}

export type SpendingBreakdownItem = {
  category: string
  amount: string
  percentage: string
}

export type AnalyticsTrendItem = {
  month: string
  income: string
  expenses: string
  netSavings: string
}

export type AnalyticsSummary = {
  period: {
    period: string
    startDate: string
    endDate: string
  }
  totalIncome: string
  totalExpenses: string
  netSavings: string
  breakdown: SpendingBreakdownItem[]
  trends: AnalyticsTrendItem[]
}

export type RecurringTransaction = {
  description: string
  type: TransactionType
  category: string
  count: number
  firstDate: string
  lastDate: string
  amount: string
}

export type SpendingAnomaly = {
  category: string
  amount: string
  average: string
  reason: string
}

export type HealthScore = {
  score: number
  signals: {
    savingsRate: string
    budgetAdherence: string
    volatilityScore: string
  }
  insights: string[]
}

export type Recommendation = {
  title: string
  action: string
}

export type Budget = {
  id: string
  category: string
  limitAmount: string
  period: string
  spent: string
  remaining: string
  progress: string
}

export type BudgetPayload = {
  category: string
  limitAmount: string
  period?: string
}

export type BudgetUpdatePayload = Partial<BudgetPayload>

export type SavingsGoal = {
  id: string
  name: string
  targetAmount: string
  targetDate: string
  currentProgress: string
  progress: string
}

export type SavingsGoalPayload = {
  name: string
  targetAmount: string
  targetDate: string
}

export type SavingsGoalUpdatePayload = Partial<SavingsGoalPayload>

export type CategoryRule = {
  id: string
  merchantPattern: string
  category: string
  type: TransactionType
  createdAt: number
  updatedAt: number
}

export type CategoryRulePayload = {
  merchantPattern?: string
  merchant?: string
  category: string
  type?: TransactionType
}

export type CategoryRuleUpdatePayload = Partial<CategoryRulePayload>

export type PlannedAddOn = {
  id: string
  expectedDate: string
  description: string
  merchant: string
  amount: string
  type: TransactionType
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
  type: TransactionType
  category: string
  note: string
}

export type DeleteResponse = {
  deleted: boolean
}

export type SystemVersion = {
  version: string
  commitHash: string
}
