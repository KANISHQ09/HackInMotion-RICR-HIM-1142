import { CalendarDays, ChevronDown, Download, Search } from "lucide-react"
import { monthlySummary, netWorthCards, overviewHeroIcon } from "@/components/dashboard/overview/data"

export function OverviewHeader() {
  const HeroIcon = overviewHeroIcon

  return (
    <header className="grid gap-8 border-b border-zinc-200/80 pb-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col justify-between gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl font-semibold tracking-normal text-zinc-950 md:text-5xl">
              Financial Overview
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
              Your current financial health, spending momentum, and useful signals for the month.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search financial overview"
              className="grid h-11 w-11 place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:text-zinc-950"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </button>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950"
        >
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          {monthlySummary.dateRange}
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <aside className="rounded-lg border border-zinc-200/80 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.35)]">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-emerald-100 text-emerald-800">
            <HeroIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Net position
            </p>
            <strong className="mt-1 block font-serif text-3xl font-semibold tracking-normal text-zinc-950">
              Rs 83.3K
            </strong>
          </div>
        </div>

        <dl className="mt-8 grid gap-3">
          {netWorthCards.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4 border-t border-zinc-200/70 pt-3">
              <dt className="text-sm text-zinc-500">{item.label}</dt>
              <dd className="text-sm font-semibold tabular-nums text-zinc-950">{item.value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </header>
  )
}
