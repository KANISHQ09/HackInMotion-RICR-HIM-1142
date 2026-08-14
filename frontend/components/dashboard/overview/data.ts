import {
  ArrowDownLeft,
  ArrowUpRight,
  HeartPulse,
  Home,
  Landmark,
  PiggyBank,
  Sparkles,
  Utensils,
  WalletCards,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Metric = {
  label: string
  icon: LucideIcon
  value: string
  suffix?: string
  detail: string
  tone: "health" | "income" | "expense" | "savings"
  progress?: number
}

export type SpendingCategory = {
  name: string
  amount: string
  percentage: number
  icon: LucideIcon
  toneClassName: string
}

export type Insight = {
  title: string
  copy: string
  action?: string
}

export type Transaction = {
  date: string
  merchant: string
  category: string
  amount: string
  type: "income" | "expense"
}

export const overviewMetrics: Metric[] = [
  {
    label: "Health Score",
    icon: HeartPulse,
    value: "86",
    suffix: "/100",
    detail: "Excellent trajectory",
    tone: "health",
  },
  {
    label: "Total Income",
    icon: ArrowDownLeft,
    value: "₹1.24L",
    detail: "Actual: ₹1,24,450",
    tone: "income",
  },
  {
    label: "Total Expenses",
    icon: ArrowUpRight,
    value: "₹41.1K",
    detail: "Actual: ₹41,120",
    tone: "expense",
  },
  {
    label: "Savings Rate",
    icon: PiggyBank,
    value: "66.9%",
    detail: "Target: 55%",
    tone: "savings",
    progress: 66.9,
  },
]

export const spendingCategories: SpendingCategory[] = [
  {
    name: "Housing & Utilities",
    amount: "₹18,500",
    percentage: 45,
    icon: Home,
    toneClassName: "bg-zinc-950",
  },
  {
    name: "Food & Dining",
    amount: "₹12,200",
    percentage: 30,
    icon: Utensils,
    toneClassName: "bg-emerald-600",
  },
  {
    name: "Transportation",
    amount: "₹5,420",
    percentage: 13,
    icon: WalletCards,
    toneClassName: "bg-sky-600",
  },
  {
    name: "Entertainment",
    amount: "₹5,000",
    percentage: 12,
    icon: Sparkles,
    toneClassName: "bg-violet-600",
  },
]

export const insights: Insight[] = [
  {
    title: "Dining Outlier Detected",
    copy: "Restaurant spending is 15% higher than the 6-month baseline. Trimming two dinners this week keeps the month on target.",
  },
  {
    title: "Subscription Optimization",
    copy: "StreamPlus has not appeared in activity for 45 days. Canceling it could save ₹899 every month.",
    action: "Review subscriptions",
  },
]

export const recentTransactions: Transaction[] = [
  {
    date: "Oct 28",
    merchant: "Whole Foods Market",
    category: "Groceries",
    amount: "-₹3,450",
    type: "expense",
  },
  {
    date: "Oct 27",
    merchant: "Uber Ride",
    category: "Transport",
    amount: "-₹450",
    type: "expense",
  },
  {
    date: "Oct 26",
    merchant: "TechNova Salary",
    category: "Income",
    amount: "+₹1,24,450",
    type: "income",
  },
  {
    date: "Oct 25",
    merchant: "Blue Bottle Coffee",
    category: "Dining",
    amount: "-₹320",
    type: "expense",
  },
]

export const monthlySummary = {
  dateRange: "Oct 1 - Oct 31, 2023",
  totalSpend: "₹41K",
}

export const netWorthCards = [
  { label: "Cash buffer", value: "7.4 months" },
  { label: "Upcoming bills", value: "₹9,860" },
  { label: "Investable surplus", value: "₹83,330" },
]

export const overviewHeroIcon = Landmark
