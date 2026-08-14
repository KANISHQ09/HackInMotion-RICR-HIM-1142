import type { FormEvent } from "react"
import { memo } from "react"
import {
  chartBars,
  periods,
  type Goal,
  type GoalName,
  type Period,
} from "@/components/dashboard/goals/data"
import { cn } from "@/lib/utils"

type ProjectionCardProps = {
  contribution: number
  goalName: GoalName
  goals: readonly Goal[]
  monthsRemaining: number
  period: Period
  projectedTotal: number
  target: number
  onContributionChange: (value: number) => void
  onGoalNameChange: (value: GoalName) => void
  onPeriodChange: (period: Period) => void
  onSubmit: () => void
}

export const ProjectionCard = memo(function ProjectionCard({
  contribution,
  goalName,
  goals,
  monthsRemaining,
  period,
  projectedTotal,
  target,
  onContributionChange,
  onGoalNameChange,
  onPeriodChange,
  onSubmit,
}: ProjectionCardProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <article className="rounded-lg border border-zinc-200/80 bg-white p-5 shadow-[0_18px_45px_-28px_rgba(24,24,27,0.35)] md:p-12">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
            Savings Projection
          </h2>
          <p className="mt-1 max-w-xl leading-7 text-zinc-600">
            Visualize how monthly contributions impact your timeline.
          </p>
        </div>
        <div className="flex gap-3" aria-label="Projection period">
          {periods.map((item) => (
            <button
              type="button"
              key={item}
              className={cn(
                "min-h-8 rounded-md px-3 text-xs font-semibold text-zinc-500 transition hover:bg-[#f1edec] hover:text-zinc-950",
                period === item && "bg-[#e5e2e1] text-zinc-950",
              )}
              onClick={() => onPeriodChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div
        className="relative flex h-[270px] items-end gap-2 overflow-hidden rounded-lg border border-zinc-200/80 bg-[#f7f3f2] bg-[linear-gradient(to_top,#ebe7e6_1px,transparent_1px),linear-gradient(to_right,#ebe7e6_1px,transparent_1px)] bg-[size:100%_20%,10%_100%] px-3 pb-6 pt-12 sm:gap-3 sm:px-6"
        aria-label={`${period} projection ending at ₹${projectedTotal.toLocaleString("en-IN")}`}
      >
        {chartBars.map((bar, index) => (
          <div
            key={`${bar.value}-${index}`}
            className={cn(
              "group relative w-full rounded-t bg-zinc-400/30",
              bar.tone === "current" && "bg-emerald-700/80",
              bar.tone === "future" && "border border-dashed border-zinc-500/70 bg-zinc-300/30",
            )}
            style={{ height: `${bar.height}%` }}
          >
            <span className="pointer-events-none absolute bottom-[calc(100%+0.45rem)] left-1/2 z-10 -translate-x-1/2 rounded bg-zinc-800 px-2 py-1 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
              {bar.value}
            </span>
          </div>
        ))}
        <div className="absolute inset-x-0 top-[10%] border-t-2 border-dashed border-emerald-700/50">
          <span className="absolute right-4 top-[-1.4rem] rounded bg-[#f7f3f2] px-1.5 py-0.5 text-[11px] font-semibold uppercase text-emerald-700">
            Target: ₹{(target / 1000).toFixed(0)}k
          </span>
        </div>
      </div>

      <form className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end" onSubmit={handleSubmit}>
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Monthly Contribution
          <span className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">₹</span>
            <input
              type="number"
              min="1"
              value={contribution}
              onChange={(event) => onContributionChange(Number(event.target.value))}
              className="min-h-11 w-full rounded-lg border border-zinc-200 bg-[#f7f3f2] py-2 pl-8 pr-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-500"
            />
          </span>
        </label>

        <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
          Target Goal
          <select
            value={goalName}
            onChange={(event) => onGoalNameChange(event.target.value as GoalName)}
            className="min-h-11 w-full rounded-lg border border-zinc-200 bg-[#f7f3f2] px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-zinc-500"
            disabled={goals.length === 0}
          >
            {goals.map((goal) => (
              <option key={goal.name}>{goal.name}</option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="min-h-11 rounded-lg border border-zinc-200 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-[#f1edec]"
        >
          Recalculate
        </button>
      </form>

      <p className="mt-4 text-sm font-semibold text-emerald-700" aria-live="polite">
        At ₹{contribution.toLocaleString("en-IN")}/month, your {goalName} target is approximately{" "}
        {monthsRemaining} months away.
      </p>
    </article>
  )
})
