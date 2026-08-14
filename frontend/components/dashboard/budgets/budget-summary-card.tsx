import { BudgetProgress } from "@/components/dashboard/budgets/budget-progress"
import { budgetSummary, formatCurrency } from "@/components/dashboard/budgets/data"

type BudgetSummary = {
  total: number
  spent: number
  remaining: number
  utilizedPercentage: number
}

export function BudgetSummaryCard({
  summary = budgetSummary,
  isLoading = false,
}: {
  summary?: BudgetSummary
  isLoading?: boolean
}) {
  const totalLabel = isLoading ? "..." : `${formatCurrency(summary.total)}.00`
  const spentLabel = isLoading ? "..." : `${formatCurrency(summary.spent)}.00`
  const remainingLabel = isLoading ? "..." : `${formatCurrency(summary.remaining)}.00`

  return (
    <section
      className="grid gap-8 rounded-lg border border-zinc-200/70 bg-white p-6 shadow-[0_24px_65px_-44px_rgba(24,24,27,0.42)] lg:grid-cols-[minmax(220px,0.35fr)_1fr] lg:p-12"
      aria-label="Monthly budget summary"
    >
      <div className="grid content-center gap-1">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Total Monthly Budget
        </span>
        <strong className="font-serif text-4xl font-semibold tracking-normal text-zinc-950 md:text-5xl">
          {totalLabel}
        </strong>
      </div>

      <div className="grid content-center gap-3">
        <div className="flex items-end justify-between gap-4">
          <div className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Currently Spent
            </span>
            <strong className="font-serif text-2xl font-semibold tracking-normal text-zinc-950">
              {spentLabel}
            </strong>
          </div>
          <div className="grid gap-1 text-right">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Remaining
            </span>
            <strong className="font-serif text-2xl font-semibold tracking-normal text-emerald-700">
              {remainingLabel}
            </strong>
          </div>
        </div>

        <BudgetProgress value={summary.utilizedPercentage} className="h-3" />

        <div className="flex justify-between text-sm font-medium text-zinc-500">
          <span>{Math.round(summary.utilizedPercentage)}% utilized</span>
          <span>{Math.max(0, Math.round(100 - summary.utilizedPercentage))}% available</span>
        </div>
      </div>
    </section>
  )
}
