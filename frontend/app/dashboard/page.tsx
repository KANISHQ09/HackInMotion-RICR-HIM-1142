import type { Metadata } from "next"
import { OverviewDashboard } from "@/components/dashboard/overview/overview-dashboard"

export const metadata: Metadata = {
  title: "Financial Overview | Spendly",
  description: "Review financial health, spending insights, and recent activity.",
}

export default function DashboardPage() {
  return <OverviewDashboard />
}
