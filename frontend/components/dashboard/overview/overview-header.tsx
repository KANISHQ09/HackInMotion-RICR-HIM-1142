"use client"

import { Download } from "lucide-react"
import {
  insights,
  monthlySummary,
  netWorthCards,
  overviewHeroIcon,
  overviewMetrics,
  recentTransactions,
  spendingCategories,
} from "@/components/dashboard/overview/data"

export function OverviewHeader() {
  const HeroIcon = overviewHeroIcon

  const exportOverview = () => {
    const rows = [
      ["Section", "Name", "Value", "Detail"],
      ...overviewMetrics.map((metric) => ["Metric", metric.label, metric.value, metric.detail]),
      ...spendingCategories.map((category) => [
        "Spending",
        category.name,
        category.amount,
        `${category.percentage}%`,
      ]),
      ...recentTransactions.map((transaction) => [
        "Recent transaction",
        transaction.merchant,
        transaction.amount,
        `${transaction.category} on ${transaction.date}`,
      ]),
      ...insights.map((insight) => ["Insight", insight.title, insight.copy, insight.action ?? ""]),
    ]
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = "spendly-overview.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

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
              onClick={exportOverview}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export
            </button>
          </div>
        </div>

        <div className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-600">
          {monthlySummary.dateRange}
        </div>
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
              ₹83.3K
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
