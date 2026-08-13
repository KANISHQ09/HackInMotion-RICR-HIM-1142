import { ChevronRight, Sparkles } from "lucide-react"
import { formatCurrency, upcomingBills } from "@/components/dashboard/budgets/data"

export function BudgetSidePanel() {
  return (
    <aside className="grid gap-6 lg:grid-cols-2 xl:flex xl:flex-col" aria-label="Budget insights">
      <article className="rounded-lg border border-zinc-200/70 border-t-[#7a5b9c] border-t-2 bg-white p-6 shadow-[0_18px_45px_-34px_rgba(24,24,27,0.35)]">
        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#7a5b9c]">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Insight
        </div>
        <p className="text-base leading-7 text-zinc-700">
          You are spending 15% more on <strong className="font-semibold text-zinc-950">Shopping</strong> this
          month compared to last month. Consider holding off on non-essential purchases until next week to stay
          within your $500 limit.
        </p>
      </article>

      <article className="rounded-lg border border-zinc-200/70 bg-white p-6 shadow-[0_18px_45px_-34px_rgba(24,24,27,0.35)] xl:flex-1">
        <h2 className="mb-6 border-b border-zinc-200/60 pb-2 font-serif text-2xl font-medium tracking-normal text-zinc-950">
          Upcoming Bills
        </h2>
        <ul className="grid" aria-label="Upcoming bills">
          {upcomingBills.map((bill) => {
            const Icon = bill.icon

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

        <button
          type="button"
          className="mt-6 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded border border-zinc-200/80 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-700 transition hover:bg-[#ebe7e6]"
        >
          View All Bills
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </article>
    </aside>
  )
}
