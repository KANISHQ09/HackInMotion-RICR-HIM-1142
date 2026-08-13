"use client"

import { memo } from "react"
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
  const activeItem =
    dashboardNavigation.find((item) => isDashboardNavigationItemActive(pathname, item)) ??
    dashboardNavigation[0]
  const copy = pageCopy[activeItem.href] ?? pageCopy["/dashboard"]

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-[#fdf8f8]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-5 md:h-20 md:px-8 xl:px-12">
        <div className="flex min-w-0 items-center gap-3 md:hidden">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-950 text-white">
            <BadgeDollarSign className="h-4 w-4" aria-hidden="true" />
          </div>
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
            className="hidden h-11 min-w-56 items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 text-left text-sm font-medium text-zinc-500 transition hover:text-zinc-950 xl:flex"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Search
          </button>

          <button
            type="button"
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
            className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:text-zinc-950 md:h-11 md:w-11"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </button>

          <span className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-[#e5e2e1] text-xs font-semibold md:h-11 md:w-11">
            HB
          </span>
        </div>
      </div>
    </header>
  )
})
