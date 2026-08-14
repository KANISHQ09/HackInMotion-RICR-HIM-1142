"use client"

import dynamic from "next/dynamic"
import { useMemo } from "react"
import {
  CalendarDays,
  Clapperboard,
  Home,
  ShoppingBag,
  Utensils,
  WalletCards,
  Zap,
  type LucideIcon,
} from "lucide-react"
import type { Budget, PlannedAddOn } from "@/api/types"
import { BudgetCard } from "@/components/dashboard/budgets/budget-card"
import { BudgetSidePanelSkeleton } from "@/components/dashboard/budgets/budget-side-panel-skeleton"
import { BudgetSummaryCard } from "@/components/dashboard/budgets/budget-summary-card"
import { budgets, type BudgetCategory, type BudgetTone, type UpcomingBill } from "@/components/dashboard/budgets/data"
import { useBudgets, useRecommendations } from "@/hooks/use-finance-api"
import { usePlannedAddOns } from "@/hooks/use-planned-addons-api"
import { parseApiAmount } from "@/lib/finance-format"

const BudgetSidePanel = dynamic(
  () =>
    import("@/components/dashboard/budgets/budget-side-panel").then(
      (module) => module.BudgetSidePanel,
    ),
  {
    loading: () => <BudgetSidePanelSkeleton />,
  },
)

const budgetIcons: Record<string, LucideIcon> = {
  food: Utensils,
  dining: Utensils,
  shopping: ShoppingBag,
  entertainment: Clapperboard,
  housing: Home,
  rent: Home,
  utilities: Zap,
  bills: Zap,
}

function iconForCategory(category: string) {
  const key = category.toLowerCase()
  return Object.entries(budgetIcons).find(([match]) => key.includes(match))?.[1] ?? WalletCards
}

function budgetTone(progress: number): BudgetTone {
  if (progress >= 100) return "danger"
  if (progress >= 80) return "warning"
  return "good"
}

function budgetStatus(progress: number) {
  if (progress >= 100) return "Exceeded"
  if (progress >= 80) return "Nearing Limit"
  return "On Track"
}

function buildBudgetCards(apiBudgets?: Budget[]): BudgetCategory[] {
  return (apiBudgets ?? []).map((budget) => {
    const spent = parseApiAmount(budget.spent)
    const total = parseApiAmount(budget.limitAmount)
    const remaining = parseApiAmount(budget.remaining)
    const progress = Number(budget.progress) || 0
    const tone = budgetTone(progress)

    return {
      icon: iconForCategory(budget.category),
      name: budget.category,
      frequency: budget.period || "Monthly",
      spent,
      total,
      progress,
      remaining: remaining >= 0 ? `₹${remaining.toLocaleString("en-IN")} left` : `₹${Math.abs(remaining).toLocaleString("en-IN")} over budget`,
      status: budgetStatus(progress),
      tone,
    }
  })
}

function buildBudgetSummary(apiBudgets?: Budget[]) {
  const total = (apiBudgets ?? []).reduce((sum, budget) => sum + parseApiAmount(budget.limitAmount), 0)
  const spent = (apiBudgets ?? []).reduce((sum, budget) => sum + parseApiAmount(budget.spent), 0)
  const remaining = total - spent
  const utilizedPercentage = total > 0 ? (spent / total) * 100 : 0

  return {
    total,
    spent,
    remaining,
    utilizedPercentage,
  }
}

function buildUpcomingBills(addOns?: PlannedAddOn[]): UpcomingBill[] {
  return (addOns ?? [])
    .filter((addOn) => addOn.type === "debit")
    .slice(0, 8)
    .map((addOn) => ({
      icon: CalendarDays,
      name: addOn.merchant || addOn.description,
      detail: `${addOn.expectedDate} - ${addOn.category || "Planned"}`,
      amount: parseApiAmount(addOn.amount),
    }))
}

export function BudgetsDashboard() {
  const budgetsQuery = useBudgets()
  const recommendations = useRecommendations()
  const plannedAddOns = usePlannedAddOns()
  const liveBudgets = useMemo(() => buildBudgetCards(budgetsQuery.data), [budgetsQuery.data])
  const displayedBudgets = budgetsQuery.isLoading ? budgets : liveBudgets
  const summary = useMemo(() => buildBudgetSummary(budgetsQuery.data), [budgetsQuery.data])
  const upcomingBills = useMemo(() => buildUpcomingBills(plannedAddOns.data), [plannedAddOns.data])
  const insight =
    recommendations.data?.find((item) => item.title.toLowerCase().includes("category"))?.action ??
    recommendations.data?.[0]?.action

  return (
    <div className="mx-auto flex w-full max-w-[1296px] flex-col gap-12 px-4 pb-28 pt-10 sm:px-6 md:px-12 md:py-20 lg:gap-16">
      <header className="border-b border-zinc-200/80 pb-6">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-normal text-zinc-950 md:text-5xl">
            Budgets
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
            Track your spending limits and manage your financial targets for this month.
          </p>
        </div>
      </header>

      <BudgetSummaryCard summary={summary} isLoading={budgetsQuery.isLoading} />

      {budgetsQuery.error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {budgetsQuery.error.message}
        </p>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div>
          <h2 className="mb-6 border-b border-zinc-200/60 pb-2 font-serif text-2xl font-medium tracking-normal text-zinc-950">
            Category Limits
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {!budgetsQuery.isLoading && displayedBudgets.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm font-medium text-zinc-500 md:col-span-2">
                No budgets yet.
              </div>
            ) : null}

            {displayedBudgets.map((budget) => (
              <BudgetCard key={budget.name} budget={budget} />
            ))}
          </div>
        </div>

        <BudgetSidePanel
          upcomingBills={upcomingBills}
          insight={insight}
          isLoading={plannedAddOns.isLoading || recommendations.isLoading}
          error={plannedAddOns.error?.message || recommendations.error?.message || ""}
        />
      </section>
    </div>
  )
}
