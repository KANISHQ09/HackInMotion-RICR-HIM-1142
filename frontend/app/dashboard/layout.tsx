import type { ReactNode } from "react"
import { AuthRouteGuard } from "@/components/auth/auth-route-guard"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthRouteGuard mode="protected">
      <DashboardShell>{children}</DashboardShell>
    </AuthRouteGuard>
  )
}
