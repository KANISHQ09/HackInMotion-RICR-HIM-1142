import { memo } from "react"
import { monthlySummary, spendingCategories, type SpendingCategory } from "@/components/dashboard/overview/data"

type SpendingBreakdownPanelProps = {
  categories?: SpendingCategory[]
  totalSpend?: string
  isLoading?: boolean
  error?: string
}

export const SpendingBreakdownPanel = memo(function SpendingBreakdownPanel({
  categories = spendingCategories,
  totalSpend = monthlySummary.totalSpend,
  isLoading = false,
  error = "",
}: SpendingBreakdownPanelProps) {
  const gradientStops = categories.reduce(
    (state, category, index) => {
      const next = index === categories.length - 1 ? 100 : state.total + category.percentage
      const color = ["#18181b", "#059669", "#0284c7", "#7c3aed", "#dc2626", "#d97706"][index % 6]

      state.parts.push(`${color} ${state.total}% ${next}%`)
      state.total = next
      return state
    },
    { total: 0, parts: [] as string[] },
  )
  const chartBackground =
    categories.length > 0
      ? `conic-gradient(${gradientStops.parts.join(",")})`
      : "conic-gradient(#e4e4e7 0 100%)"

  return (
    <section className="rounded-lg border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.35)]" aria-labelledby="spending-breakdown-title">
      <h2 id="spending-breakdown-title" className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
        Spending Breakdown
      </h2>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
        <div
          className="mx-auto grid aspect-square w-full max-w-[220px] place-items-center rounded-full"
          style={{ background: chartBackground }}
          role="img"
          aria-label={categories.map((category) => `${category.name} ${category.percentage}%`).join(", ")}
        >
          <div className="grid aspect-square w-[74%] place-content-center justify-items-center rounded-full bg-white text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Total
            </span>
            <strong className="font-serif text-3xl font-semibold tracking-normal text-zinc-950">
              {isLoading ? "..." : totalSpend}
            </strong>
          </div>
        </div>

        <ul className="grid gap-3">
          {categories.length === 0 && !isLoading ? (
            <li className="rounded-lg border border-dashed border-zinc-300 bg-[#fdf8f8]/60 p-6 text-center text-sm font-medium text-zinc-500">
              No expense categories for this period.
            </li>
          ) : null}

          {categories.map((category) => {
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
