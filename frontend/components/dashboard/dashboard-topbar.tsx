"use client"

import { memo, useMemo, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BadgeDollarSign,
  Bell,
  CalendarDays,
  ChevronDown,
  Plus,
  Search,
} from "lucide-react"
import {
  dashboardNavigation,
  isDashboardNavigationItemActive,
} from "@/components/dashboard/constants"
import {
  insights,
  monthlySummary,
  netWorthCards,
  recentTransactions,
} from "@/components/dashboard/overview/data"
import { formatCurrency, upcomingBills } from "@/components/dashboard/budgets/data"

const pageCopy = {
  "/dashboard": {
    title: "Financial Overview",
    subtitle: "Cash flow, savings, and recent movement",
  },
  "/dashboard/import-transactions": {
    title: "Import Transactions",
    subtitle: "Upload statements and review parsed records",
  },
  "/dashboard/budgets": {
    title: "Budgets",
    subtitle: "Monthly limits, upcoming bills, and pacing alerts",
  },
  "/dashboard/goals": {
    title: "Goals",
    subtitle: "Milestones, projections, and monthly targets",
  },
  "/dashboard/settings": {
    title: "Settings",
    subtitle: "Account, notification, and security preferences",
  },
} as const

export const DashboardTopbar = memo(function DashboardTopbar() {
  const pathname = usePathname()
  const [activePanel, setActivePanel] = useState<"search" | "month" | "notifications" | null>(null)
  const [query, setQuery] = useState("")
  const activeItem =
    dashboardNavigation.find((item) => isDashboardNavigationItemActive(pathname, item)) ??
    dashboardNavigation[0]
  const copy = pageCopy[activeItem.href] ?? pageCopy["/dashboard"]
  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return recentTransactions

    return recentTransactions.filter((transaction) =>
      [transaction.merchant, transaction.category, transaction.amount, transaction.date]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    )
  }, [query])

  const togglePanel = (panel: "search" | "month" | "notifications") => {
    setActivePanel((current) => (current === panel ? null : panel))
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-[#fdf8f8]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-5 md:h-20 md:px-8 xl:px-12">
        <div className="flex min-w-0 items-center gap-3 md:hidden">
          <Link
            href="/dashboard"
            aria-label="Go to dashboard"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-950 text-white transition hover:bg-zinc-800"
          >
            <BadgeDollarSign className="h-4 w-4" aria-hidden="true" />
          </Link>
          <strong className="truncate font-serif text-2xl font-semibold tracking-normal">
            Spendly
          </strong>
        </div>

        <div className="hidden min-w-0 md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {activeItem.label}
          </p>
          <div className="mt-1 flex items-center gap-3">
            <h2 className="truncate font-serif text-2xl font-semibold tracking-normal text-zinc-950">
              {copy.title}
            </h2>
            <span className="hidden h-1.5 w-1.5 rounded-full bg-emerald-500 xl:block" />
            <p className="hidden truncate text-sm text-zinc-500 xl:block">{copy.subtitle}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Search"
            onClick={() => togglePanel("search")}
            className="hidden h-11 min-w-56 items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 text-left text-sm font-medium text-zinc-500 transition hover:text-zinc-950 xl:flex"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Search
          </button>

          <button
            type="button"
            onClick={() => togglePanel("month")}
            className="hidden min-h-11 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-600 transition hover:text-zinc-950 lg:inline-flex"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            This Month
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>

          <Link
            href="/dashboard/import-transactions?add=manual"
            className="hidden min-h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-semibold text-white transition hover:bg-zinc-800 md:inline-flex lg:px-4"
            aria-label="Add Transaction"
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="hidden whitespace-nowrap lg:inline">Add Transaction</span>
          </Link>

          <button
            type="button"
            aria-label="Notifications"
            onClick={() => togglePanel("notifications")}
            className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:text-zinc-950 md:h-11 md:w-11"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </button>

          <Link
            href="/dashboard/settings"
            aria-label="Open profile settings"
            className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-[#e5e2e1] text-xs font-semibold transition hover:bg-[#d9d5d4] md:h-11 md:w-11"
          >
            HB
          </Link>
        </div>
      </div>

      {activePanel ? (
        <div className="absolute right-5 top-[calc(100%+0.5rem)] z-40 w-[min(92vw,420px)] rounded-lg border border-zinc-200 bg-white p-4 shadow-[0_24px_70px_-35px_rgba(24,24,27,0.45)] md:right-8 xl:right-12">
          {activePanel === "search" ? (
            <div>
              <label htmlFor="dashboard-search" className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Search Transactions
              </label>
              <input
                id="dashboard-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="mt-2 min-h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-500"
                placeholder="Merchant, category, amount"
              />
              <div className="mt-4 grid gap-2">
                {searchResults.map((transaction) => (
                  <Link
                    key={`${transaction.date}-${transaction.merchant}`}
                    href="/dashboard/import-transactions"
                    className="flex items-center justify-between gap-3 rounded-lg bg-[#f7f3f2] px-3 py-2 text-sm transition hover:bg-[#f1edec]"
                  >
                    <span className="min-w-0">
                      <strong className="block truncate text-zinc-950">{transaction.merchant}</strong>
                      <span className="text-xs font-medium text-zinc-500">{transaction.category} · {transaction.date}</span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-zinc-950">{transaction.amount}</span>
                  </Link>
                ))}
                {searchResults.length === 0 ? (
                  <p className="rounded-lg bg-[#f7f3f2] px-3 py-3 text-sm font-medium text-zinc-500">
                    No matching dashboard transactions.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {activePanel === "month" ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">This Month</p>
              <strong className="mt-1 block font-serif text-2xl font-semibold text-zinc-950">
                {monthlySummary.totalSpend} spent
              </strong>
              <p className="mt-1 text-sm font-medium text-zinc-500">{monthlySummary.dateRange}</p>
              <dl className="mt-4 grid gap-2">
                {netWorthCards.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg bg-[#f7f3f2] px-3 py-2">
                    <dt className="text-sm text-zinc-500">{item.label}</dt>
                    <dd className="text-sm font-semibold text-zinc-950">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {activePanel === "notifications" ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">Notifications</p>
              <div className="mt-3 grid gap-3">
                {insights.map((insight) => (
                  <article key={insight.title} className="rounded-lg bg-[#f7f3f2] p-3">
                    <h3 className="text-sm font-semibold text-zinc-950">{insight.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-600">{insight.copy}</p>
                  </article>
                ))}
                <Link
                  href="/dashboard/budgets#upcoming-bills"
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-[#f1edec]"
                >
                  {upcomingBills.length} upcoming bills · {formatCurrency(upcomingBills.reduce((total, bill) => total + bill.amount, 0))}
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  )
})
