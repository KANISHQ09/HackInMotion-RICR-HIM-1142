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
  total: 45000,
  spent: 31500,
  remaining: 13500,
  utilizedPercentage: 70,
} as const

export const budgets = [
  {
    icon: Utensils,
    name: "Food & Dining",
    frequency: "Monthly",
    spent: 4500,
    total: 8000,
    progress: 56,
    remaining: "₹3,500 left",
    status: "On Track",
    tone: "good",
  },
  {
    icon: ShoppingBag,
    name: "Shopping",
    frequency: "Monthly",
    spent: 4200,
    total: 5000,
    progress: 84,
    remaining: "₹800 left",
    status: "Nearing Limit",
    tone: "warning",
  },
  {
    icon: Home,
    name: "Housing",
    frequency: "Fixed",
    spent: 20000,
    total: 20000,
    progress: 100,
    remaining: "Paid",
    tone: "fixed",
  },
  {
    icon: Clapperboard,
    name: "Entertainment",
    frequency: "Monthly",
    spent: 3500,
    total: 3000,
    progress: 100,
    remaining: "-₹500 over budget",
    status: "Exceeded",
    tone: "danger",
  },
] satisfies readonly BudgetCategory[]

export const upcomingBills = [
  {
    icon: Flame,
    name: "Netflix",
    detail: "Oct 15 - Entertainment",
    amount: 649,
  },
  {
    icon: Zap,
    name: "Electric Utility",
    detail: "Oct 18 - Housing",
    amount: 2450,
  },
  {
    icon: Sparkles,
    name: "Cult.fit",
    detail: "Oct 22 - Health",
    amount: 1800,
  },
  {
    icon: Home,
    name: "Rent",
    detail: "Oct 28 - Housing",
    amount: 24000,
  },
  {
    icon: Utensils,
    name: "Swiggy One",
    detail: "Oct 30 - Food & Dining",
    amount: 899,
  },
] satisfies readonly UpcomingBill[]

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}
