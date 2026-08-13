"use client"

import { memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  dashboardNavigation,
  isDashboardNavigationItemActive,
} from "@/components/dashboard/constants"
import { cn } from "@/lib/utils"

export const DashboardMobileNav = memo(function DashboardMobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-zinc-200/80 bg-[#fdf8f8]/95 px-3 pb-[calc(0.625rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
      aria-label="Mobile navigation"
    >
      {dashboardNavigation.map((item) => {
        const Icon = item.icon
        const isActive = isDashboardNavigationItemActive(pathname, item)

        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-w-14 flex-col items-center gap-1 text-[10px] font-semibold text-zinc-500 transition hover:text-zinc-950",
              isActive && "text-zinc-950",
            )}
          >
            <span
              className={cn(
                "grid h-7 w-11 place-items-center rounded-full transition",
                isActive && "bg-[#e5e2e1]",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>{item.label === "Transactions" ? "Transact" : item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
})
