"use client"

import { useMemo, useState } from "react"
import { CalendarDays, ChevronRight, Sparkles, type LucideIcon } from "lucide-react"
import { formatCurrency, upcomingBills, type UpcomingBill } from "@/components/dashboard/budgets/data"

type BudgetSidePanelProps = {
  upcomingBills?: UpcomingBill[]
  insight?: string
  isLoading?: boolean
  error?: string
}

export function BudgetSidePanel({
  upcomingBills: bills = upcomingBills,
  insight = "Add budgets and transactions to generate spending guidance for this month.",
  isLoading = false,
  error = "",
}: BudgetSidePanelProps) {
  const [showAllBills, setShowAllBills] = useState(false)
  const visibleBills = showAllBills ? bills : bills.slice(0, 3)
  const totalUpcomingBills = useMemo(
    () => bills.reduce((total, bill) => total + bill.amount, 0),
    [bills],
  )

  return (
    <aside className="grid gap-6 lg:grid-cols-2 xl:flex xl:flex-col" aria-label="Budget insights">
      <article className="rounded-lg border border-zinc-200/70 border-t-[#7a5b9c] border-t-2 bg-white p-6 shadow-[0_18px_45px_-34px_rgba(24,24,27,0.35)]">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7a5b9c]">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Insight
        </div>
        <p className="text-base leading-7 text-zinc-700">
          {isLoading ? "Loading live budget insight..." : insight}
        </p>
        {error ? (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </article>

      <article id="upcoming-bills" className="rounded-lg border border-zinc-200/70 bg-white p-6 shadow-[0_18px_45px_-34px_rgba(24,24,27,0.35)] xl:flex-1">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-zinc-200/60 pb-2">
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
              Upcoming Bills
            </h2>
            <p className="mt-1 text-sm font-medium text-zinc-500">
              {bills.length} bills totaling {formatCurrency(totalUpcomingBills)}
            </p>
          </div>
        </div>
        <ul className="grid" aria-label="Upcoming bills">
          {isLoading ? (
            <li className="rounded-lg border border-dashed border-zinc-300 bg-[#f7f3f2]/60 p-4 text-center text-sm font-medium text-zinc-500">
              Loading planned add-ons...
            </li>
          ) : null}

          {!isLoading && bills.length === 0 ? (
            <li className="rounded-lg border border-dashed border-zinc-300 bg-[#f7f3f2]/60 p-4 text-center text-sm font-medium text-zinc-500">
              No planned expenses yet.
            </li>
          ) : null}

          {visibleBills.map((bill) => {
            const Icon: LucideIcon = bill.icon ?? CalendarDays

            return (
              <li
                key={bill.name}
                className="flex items-center justify-between gap-3 rounded px-1 py-3 transition hover:bg-[#ebe7e6]/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-[#f1edec] text-zinc-600">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <strong className="block truncate text-sm font-medium text-zinc-950">{bill.name}</strong>
                    <span className="block truncate text-[11px] font-semibold text-zinc-500">{bill.detail}</span>
                  </div>
                </div>
                <b className="shrink-0 text-sm font-medium text-zinc-950">{formatCurrency(bill.amount)}</b>
              </li>
            )
          })}
        </ul>

        {bills.length > 3 ? (
          <button
            type="button"
            onClick={() => setShowAllBills((current) => !current)}
            className="mt-6 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded border border-zinc-200/80 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700 transition hover:bg-[#ebe7e6]"
          >
            {showAllBills ? "Show Fewer Bills" : "View All Bills"}
            <ChevronRight className={`h-4 w-4 transition ${showAllBills ? "rotate-90" : ""}`} aria-hidden="true" />
          </button>
        ) : null}
      </article>
    </aside>
  )
}
