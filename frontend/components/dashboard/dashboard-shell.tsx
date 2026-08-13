"use client"

import type { ReactNode } from "react"
import { memo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { clearAuthSession } from "@/lib/auth-storage"
import { DashboardMobileNav } from "@/components/dashboard/dashboard-mobile-nav"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { cn } from "@/lib/utils"

type DashboardShellProps = {
  children: ReactNode
  mainClassName?: string
  showMobileNav?: boolean
}

export const DashboardShell = memo(function DashboardShell({
  children,
  mainClassName,
  showMobileNav = true,
}: DashboardShellProps) {
  const router = useRouter()

  const handleLogout = useCallback(() => {
    clearAuthSession()
    router.replace("/login")
  }, [router])

  return (
    <div className="min-h-screen bg-[#fdf8f8] text-zinc-950">
      <DashboardSidebar onLogout={handleLogout} />

      <div className="flex min-h-screen flex-col md:ml-64">
        <DashboardTopbar />

        <main className={cn("flex-1", mainClassName)}>{children}</main>
      </div>

      {showMobileNav ? <DashboardMobileNav /> : null}
    </div>
  )
})
