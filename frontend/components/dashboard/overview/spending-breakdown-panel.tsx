import { memo } from "react"
import { monthlySummary, spendingCategories } from "@/components/dashboard/overview/data"

export const SpendingBreakdownPanel = memo(function SpendingBreakdownPanel() {
  return (
    <section className="rounded-lg border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.35)]" aria-labelledby="spending-breakdown-title">
      <h2 id="spending-breakdown-title" className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
        Spending Breakdown
      </h2>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
        <div
          className="mx-auto grid aspect-square w-full max-w-[220px] place-items-center rounded-full bg-[conic-gradient(#18181b_0_45%,#059669_45%_75%,#0284c7_75%_88%,#7c3aed_88%_100%)]"
          role="img"
          aria-label="Housing 45%, dining 30%, transport 13%, entertainment 12%"
        >
          <div className="grid aspect-square w-[74%] place-content-center justify-items-center rounded-full bg-white text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Total
            </span>
            <strong className="font-serif text-3xl font-semibold tracking-normal text-zinc-950">
              {monthlySummary.totalSpend}
            </strong>
          </div>
        </div>

        <ul className="grid gap-3">
          {spendingCategories.map((category) => {
            const Icon = category.icon

            return (
              <li
                key={category.name}
                className="grid gap-3 rounded-lg border border-zinc-200/70 bg-[#fdf8f8]/60 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white ${category.toneClassName}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-950">{category.name}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className={`h-full rounded-full ${category.toneClassName}`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <strong className="block text-sm font-semibold tabular-nums text-zinc-950">
                    {category.amount}
                  </strong>
                  <span className="text-xs font-medium tabular-nums text-zinc-500">
                    {category.percentage}%
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
})
