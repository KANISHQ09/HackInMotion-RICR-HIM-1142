"use client"

import dynamic from "next/dynamic"
import { Plus } from "lucide-react"
import { BudgetCard } from "@/components/dashboard/budgets/budget-card"
import { BudgetSidePanelSkeleton } from "@/components/dashboard/budgets/budget-side-panel-skeleton"
import { BudgetSummaryCard } from "@/components/dashboard/budgets/budget-summary-card"
import { budgets } from "@/components/dashboard/budgets/data"

const BudgetSidePanel = dynamic(
  () =>
    import("@/components/dashboard/budgets/budget-side-panel").then(
      (module) => module.BudgetSidePanel,
    ),
  {
    loading: () => <BudgetSidePanelSkeleton />,
  },
)

export function BudgetsDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-[1296px] flex-col gap-12 px-4 pb-28 pt-10 sm:px-6 md:px-12 md:py-20 lg:gap-16">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-normal text-zinc-950 md:text-5xl">
            Budgets
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
            Track your spending limits and manage your financial targets for this month.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:px-8"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create Budget
        </button>
      </header>

      <BudgetSummaryCard />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div>
          <h2 className="mb-6 border-b border-zinc-200/60 pb-2 font-serif text-2xl font-medium tracking-normal text-zinc-950">
            Category Limits
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {budgets.map((budget) => (
              <BudgetCard key={budget.name} budget={budget} />
            ))}
          </div>
        </div>

        <BudgetSidePanel />
      </section>
    </div>
  )
}
