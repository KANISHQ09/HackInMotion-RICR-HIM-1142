"use client"

import { memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BadgeDollarSign, LogOut } from "lucide-react"
import {
  dashboardNavigation,
  isDashboardNavigationItemActive,
} from "@/components/dashboard/constants"
import { cn } from "@/lib/utils"

export const DashboardSidebar = memo(function DashboardSidebar({
  onLogout,
}: {
  onLogout: () => void
}) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-zinc-200/70 bg-[#fdf8f8] p-6 md:flex">
      <div className="mb-12 flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Go to dashboard"
          className="grid h-8 w-8 place-items-center rounded-full bg-zinc-950 text-white transition hover:bg-zinc-800"
        >
          <BadgeDollarSign className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div className="grid gap-1">
          <strong className="font-serif text-[22px] leading-none tracking-normal">Spendly Pro</strong>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Premium Account
          </span>
        </div>
      </div>

      <nav className="flex-1" aria-label="Primary navigation">
        <ul className="grid gap-2">
          {dashboardNavigation.map((item) => {
            const Icon = item.icon
            const isActive = isDashboardNavigationItemActive(pathname, item)

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 transition hover:bg-[#f1edec] hover:text-zinc-950",
                    isActive && "translate-x-1 bg-[#e5e2e1] text-zinc-950",
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="grid gap-4">
        <div className="grid gap-2 border-t border-zinc-200/70 pt-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-left text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 transition hover:bg-[#f1edec] hover:text-zinc-950"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  )
})
