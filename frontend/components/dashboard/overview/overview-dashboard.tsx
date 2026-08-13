"use client"

import dynamic from "next/dynamic"
import { overviewMetrics } from "@/components/dashboard/overview/data"
import { MetricCard } from "@/components/dashboard/overview/metric-card"
import { OverviewHeader } from "@/components/dashboard/overview/overview-header"
import { PanelSkeleton } from "@/components/dashboard/overview/panel-skeleton"

const SpendingBreakdownPanel = dynamic(
  () =>
    import("@/components/dashboard/overview/spending-breakdown-panel").then(
      (module) => module.SpendingBreakdownPanel,
    ),
  {
    loading: () => <PanelSkeleton label="Loading spending breakdown" />,
  },
)

const IntelligencePanel = dynamic(
  () =>
    import("@/components/dashboard/overview/intelligence-panel").then(
      (module) => module.IntelligencePanel,
    ),
  {
    loading: () => <PanelSkeleton label="Loading intelligence panel" compact />,
  },
)

const RecentActivityPanel = dynamic(
  () =>
    import("@/components/dashboard/overview/recent-activity-panel").then(
      (module) => module.RecentActivityPanel,
    ),
  {
    loading: () => <PanelSkeleton label="Loading recent activity" />,
  },
)

export function OverviewDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-12 px-4 pb-28 pt-10 sm:px-6 md:px-12 md:py-20 lg:gap-16">
      <OverviewHeader />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4" aria-label="Financial metrics">
        {overviewMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <SpendingBreakdownPanel />
        <IntelligencePanel />
      </section>

      <RecentActivityPanel />
    </div>
  )
}
