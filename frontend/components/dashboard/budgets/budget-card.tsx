import { AlertTriangle } from "lucide-react"
import { BudgetProgress } from "@/components/dashboard/budgets/budget-progress"
import { formatCurrency, type BudgetCategory, type BudgetTone } from "@/components/dashboard/budgets/data"
import { cn } from "@/lib/utils"

const cardToneClass: Record<BudgetTone, string> = {
  good: "border-zinc-200/70 bg-white",
  warning: "border-amber-200/80 bg-white",
  fixed: "border-zinc-200/70 bg-white",
  danger: "border-red-200 bg-red-50/35",
}

const iconToneClass: Record<BudgetTone, string> = {
  good: "bg-[#f1edec] text-zinc-950",
  warning: "bg-amber-100 text-amber-800",
  fixed: "bg-[#f1edec] text-zinc-500",
  danger: "bg-red-100 text-red-800",
}

const statusToneClass: Partial<Record<BudgetTone, string>> = {
  good: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-600 text-white",
}

const remainingToneClass: Record<BudgetTone, string> = {
  good: "text-zinc-500",
  warning: "text-amber-700",
  fixed: "text-zinc-500",
  danger: "text-red-700",
}

export function BudgetCard({ budget }: { budget: BudgetCategory }) {
  const Icon = budget.icon
  const isExceeded = budget.tone === "danger"

  return (
    <article
      className={cn(
        "flex min-h-[220px] flex-col justify-between rounded-lg border p-6 shadow-[0_18px_45px_-34px_rgba(24,24,27,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_65px_-42px_rgba(24,24,27,0.44)]",
        cardToneClass[budget.tone],
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", iconToneClass[budget.tone])}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-medium text-zinc-950">{budget.name}</h3>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              {budget.frequency}
            </p>
          </div>
        </div>

        {budget.status ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded px-2 py-1.5 text-[11px] font-semibold",
              statusToneClass[budget.tone],
            )}
          >
            {isExceeded ? <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> : null}
            {budget.status}
          </span>
        ) : null}
      </div>

      <div>
        <div className="mb-2 flex items-end justify-between gap-3">
          <strong className="text-sm font-semibold text-zinc-950">
            {formatCurrency(budget.spent)}
          </strong>
          <span className="text-sm font-medium text-zinc-500">
            of {formatCurrency(budget.total)}
          </span>
        </div>

        <BudgetProgress value={budget.progress} tone={budget.tone} />

        <p className={cn("mt-2 text-right text-[11px] font-semibold", remainingToneClass[budget.tone])}>
          {budget.remaining}
        </p>
      </div>
    </article>
  )
}
