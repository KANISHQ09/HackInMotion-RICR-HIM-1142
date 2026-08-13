import type { LucideIcon } from "lucide-react"
import {
  Clapperboard,
  Flame,
  Home,
  ShoppingBag,
  Sparkles,
  Utensils,
  Zap,
} from "lucide-react"

export type BudgetTone = "good" | "warning" | "fixed" | "danger"

export type BudgetCategory = {
  icon: LucideIcon
  name: string
  frequency: string
  spent: number
  total: number
  progress: number
  remaining: string
  status?: string
  tone: BudgetTone
}

export type UpcomingBill = {
  icon: LucideIcon
  name: string
  detail: string
  amount: number
}

export const budgetSummary = {
  total: 4500,
  spent: 3150,
  remaining: 1350,
  utilizedPercentage: 70,
} as const

export const budgets = [
  {
    icon: Utensils,
    name: "Food & Dining",
    frequency: "Monthly",
    spent: 450,
    total: 800,
    progress: 56,
    remaining: "$350 left",
    status: "On Track",
    tone: "good",
  },
  {
    icon: ShoppingBag,
    name: "Shopping",
    frequency: "Monthly",
    spent: 420,
    total: 500,
    progress: 84,
    remaining: "$80 left",
    status: "Nearing Limit",
    tone: "warning",
  },
  {
    icon: Home,
    name: "Housing",
    frequency: "Fixed",
    spent: 2000,
    total: 2000,
    progress: 100,
    remaining: "Paid",
    tone: "fixed",
  },
  {
    icon: Clapperboard,
    name: "Entertainment",
    frequency: "Monthly",
    spent: 350,
    total: 300,
    progress: 100,
    remaining: "-$50 over budget",
    status: "Exceeded",
    tone: "danger",
  },
] satisfies readonly BudgetCategory[]

export const upcomingBills = [
  {
    icon: Flame,
    name: "Netflix",
    detail: "Oct 15 - Entertainment",
    amount: 15.99,
  },
  {
    icon: Zap,
    name: "Electric Utility",
    detail: "Oct 18 - Housing",
    amount: 124.5,
  },
  {
    icon: Sparkles,
    name: "Equinox",
    detail: "Oct 22 - Health",
    amount: 180,
  },
] satisfies readonly UpcomingBill[]

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}
