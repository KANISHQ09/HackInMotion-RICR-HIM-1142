import { memo } from "react"
import type { Metric } from "@/components/dashboard/overview/data"
import { cn } from "@/lib/utils"

const metricToneStyles: Record<Metric["tone"], string> = {
  health: "bg-emerald-100 text-emerald-800",
  income: "bg-sky-100 text-sky-800",
  expense: "bg-rose-100 text-rose-800",
  savings: "bg-violet-100 text-violet-800",
}

export const MetricCard = memo(function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon

  return (
    <article className="flex min-h-[190px] flex-col justify-between rounded-lg border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-30px_rgba(24,24,27,0.38)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-34px_rgba(24,24,27,0.5)]">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          {metric.label}
        </h2>
        <span className={cn("grid h-9 w-9 place-items-center rounded-lg", metricToneStyles[metric.tone])}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div>
        <p className="font-serif text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-normal text-zinc-950">
          {metric.value}
          {metric.suffix ? (
            <span className="ml-1 text-2xl text-zinc-500">{metric.suffix}</span>
          ) : null}
        </p>
        {metric.progress ? (
          <div className="mt-4">
            <div
              className="h-2 overflow-hidden rounded-full bg-zinc-200"
              role="progressbar"
              aria-label={`${metric.label} ${metric.value}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={metric.progress}
            >
              <div className="h-full rounded-full bg-zinc-950" style={{ width: `${metric.progress}%` }} />
            </div>
            <p className="mt-2 text-sm font-medium text-zinc-500">{metric.detail}</p>
          </div>
        ) : (
          <p
            className={cn(
              "mt-2 text-sm font-medium text-zinc-500",
              metric.tone === "health" &&
                "inline-flex rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800",
            )}
          >
            {metric.detail}
          </p>
        )}
      </div>
    </article>
  )
})
