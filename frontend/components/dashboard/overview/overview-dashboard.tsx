"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import {
  ArrowDownLeft,
  ArrowUpRight,
  HeartPulse,
  Home,
  PiggyBank,
  Sparkles,
  Utensils,
  WalletCards,
  type LucideIcon,
} from "lucide-react"
import type { Transaction } from "@/api/types"
import {
  overviewMetrics,
  type Insight,
  type Metric,
  type SpendingCategory,
  type Transaction as OverviewTransaction,
} from "@/components/dashboard/overview/data"
import { MetricCard } from "@/components/dashboard/overview/metric-card"
import { OverviewHeader } from "@/components/dashboard/overview/overview-header"
import { PanelSkeleton } from "@/components/dashboard/overview/panel-skeleton"
import { useAnalyticsSummary, useHealthScore, useRecommendations } from "@/hooks/use-finance-api"
import { useTransactions } from "@/hooks/use-transactions-api"
import { formatCurrency, parseApiAmount } from "@/lib/finance-format"

const SpendingBreakdownPanel = dynamic(
  () =>
    import("@/components/dashboard/overview/spending-breakdown-panel").then(
      (module) => module.SpendingBreakdownPanel,
    ),
  {
    loading: () => <PanelSkeleton label="Loading spending breakdown" />,
  },
)

const IntelligencePanel = dynamic(
  () =>
    import("@/components/dashboard/overview/intelligence-panel").then(
      (module) => module.IntelligencePanel,
    ),
  {
    loading: () => <PanelSkeleton label="Loading intelligence panel" compact />,
  },
)

const RecentActivityPanel = dynamic(
  () =>
    import("@/components/dashboard/overview/recent-activity-panel").then(
      (module) => module.RecentActivityPanel,
    ),
  {
    loading: () => <PanelSkeleton label="Loading recent activity" />,
  },
)

const categoryIcons: Record<string, LucideIcon> = {
  food: Utensils,
  dining: Utensils,
  transport: WalletCards,
  shopping: WalletCards,
  entertainment: Sparkles,
  housing: Home,
  rent: Home,
  utilities: Home,
}

const categoryTones = ["bg-zinc-950", "bg-emerald-600", "bg-sky-600", "bg-violet-600", "bg-red-600", "bg-amber-600"]

function iconForCategory(category: string) {
  const key = category.toLowerCase()
  return Object.entries(categoryIcons).find(([match]) => key.includes(match))?.[1] ?? WalletCards
}

function compactMoney(value: string) {
  return formatCurrency(parseApiAmount(value), { compact: true })
}

function fullMoney(value: string) {
  return formatCurrency(parseApiAmount(value))
}

function buildMetrics(totalIncome: string, totalExpenses: string, netSavings: string, healthScore?: number): Metric[] {
  const income = parseApiAmount(totalIncome)
  const savings = parseApiAmount(netSavings)
  const savingsRate = income > 0 ? Math.max(0, (savings / income) * 100) : 0

  return [
    {
      label: "Health Score",
      icon: HeartPulse,
      value: healthScore === undefined ? "--" : String(healthScore),
      suffix: "/100",
      detail: healthScore === undefined ? "Waiting for live data" : healthScore >= 75 ? "Strong trajectory" : "Needs attention",
      tone: "health",
    },
    {
      label: "Total Income",
      icon: ArrowDownLeft,
      value: compactMoney(totalIncome),
      detail: `Actual: ${fullMoney(totalIncome)}`,
      tone: "income",
    },
    {
      label: "Total Expenses",
      icon: ArrowUpRight,
      value: compactMoney(totalExpenses),
      detail: `Actual: ${fullMoney(totalExpenses)}`,
      tone: "expense",
    },
    {
      label: "Savings Rate",
      icon: PiggyBank,
      value: `${savingsRate.toFixed(1)}%`,
      detail: `Net savings: ${fullMoney(netSavings)}`,
      tone: "savings",
      progress: savingsRate,
    },
  ]
}

function buildSpendingCategories(breakdown?: { category: string; amount: string; percentage: string }[]): SpendingCategory[] {
  return (breakdown ?? []).map((category, index) => ({
    name: category.category,
    amount: formatCurrency(parseApiAmount(category.amount)),
    percentage: Math.max(0, Math.min(100, Number(category.percentage) || 0)),
    icon: iconForCategory(category.category),
    toneClassName: categoryTones[index % categoryTones.length],
  }))
}

function buildInsights(recommendations?: { title: string; action: string }[], healthInsights?: string[]): Insight[] {
  const recommendationInsights =
    recommendations?.map((recommendation) => ({
      title: recommendation.title,
      copy: recommendation.action,
      action: recommendation.title.toLowerCase().includes("budget") ? "Review budgets" : undefined,
    })) ?? []

  const scoreInsights =
    healthInsights?.slice(0, Math.max(0, 2 - recommendationInsights.length)).map((copy, index) => ({
      title: index === 0 ? "Health Score Signal" : "Financial Signal",
      copy,
    })) ?? []

  return [...recommendationInsights, ...scoreInsights].slice(0, 2)
}

function buildRecentTransactions(transactions?: Transaction[]): OverviewTransaction[] {
  return (transactions ?? []).slice(0, 6).map((transaction) => {
    const amount = formatCurrency(parseApiAmount(transaction.amount))

    return {
      date: new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(transaction.date)),
      merchant: transaction.merchant || transaction.description,
      category: transaction.category,
      amount: transaction.type === "credit" ? `+${amount}` : `-${amount}`,
      type: transaction.type === "credit" ? "income" : "expense",
    }
  })
}

export function OverviewDashboard() {
  const analytics = useAnalyticsSummary()
  const healthScore = useHealthScore()
  const recommendations = useRecommendations()
  const transactions = useTransactions()
  const metrics = useMemo(
    () =>
      analytics.data && !analytics.isLoading
        ? buildMetrics(
            analytics.data.totalIncome,
            analytics.data.totalExpenses,
            analytics.data.netSavings,
            healthScore.data?.score,
          )
        : overviewMetrics,
    [analytics.data, analytics.isLoading, healthScore.data?.score],
  )
  const spendingCategories = useMemo(
    () => buildSpendingCategories(analytics.data?.breakdown),
    [analytics.data?.breakdown],
  )
  const intelligence = useMemo(
    () => buildInsights(recommendations.data, healthScore.data?.insights),
    [healthScore.data?.insights, recommendations.data],
  )
  const recentTransactions = useMemo(() => buildRecentTransactions(transactions.data), [transactions.data])

  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-12 px-4 pb-28 pt-10 sm:px-6 md:px-12 md:py-20 lg:gap-16">
      <OverviewHeader />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" aria-label="Financial metrics">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <SpendingBreakdownPanel
          categories={spendingCategories}
          totalSpend={analytics.data ? compactMoney(analytics.data.totalExpenses) : undefined}
          isLoading={analytics.isLoading}
          error={analytics.error?.message ?? ""}
        />
        <IntelligencePanel
          insights={intelligence}
          isLoading={recommendations.isLoading || healthScore.isLoading}
          error={recommendations.error?.message || healthScore.error?.message || ""}
        />
      </section>

      <RecentActivityPanel
        transactions={recentTransactions}
        isLoading={transactions.isLoading}
        error={transactions.error?.message ?? ""}
      />
    </div>
  )
}
