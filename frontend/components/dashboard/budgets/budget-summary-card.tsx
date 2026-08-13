import { BudgetProgress } from "@/components/dashboard/budgets/budget-progress"
import { budgetSummary, formatCurrency } from "@/components/dashboard/budgets/data"

export function BudgetSummaryCard() {
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
          {formatCurrency(budgetSummary.total)}
          <small className="font-sans text-base font-normal text-zinc-500">.00</small>
        </strong>
      </div>

      <div className="grid content-center gap-3">
        <div className="flex items-end justify-between gap-4">
          <div className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Currently Spent
            </span>
            <strong className="font-serif text-2xl font-semibold tracking-normal text-zinc-950">
              {formatCurrency(budgetSummary.spent)}.00
            </strong>
          </div>
          <div className="grid gap-1 text-right">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Remaining
            </span>
            <strong className="font-serif text-2xl font-semibold tracking-normal text-emerald-700">
              {formatCurrency(budgetSummary.remaining)}.00
            </strong>
          </div>
        </div>

        <BudgetProgress value={budgetSummary.utilizedPercentage} className="h-3" />

        <div className="flex justify-between text-sm font-medium text-zinc-500">
          <span>{budgetSummary.utilizedPercentage}% utilized</span>
          <span>{100 - budgetSummary.utilizedPercentage}% available</span>
        </div>
      </div>
    </section>
  )
}
