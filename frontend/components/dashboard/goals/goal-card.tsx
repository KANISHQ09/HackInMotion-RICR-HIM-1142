import { memo } from "react"
import { CalendarDays } from "lucide-react"
import type { Goal } from "@/components/dashboard/goals/data"
import { cn } from "@/lib/utils"

export const GoalCard = memo(function GoalCard({ goal }: { goal: Goal }) {
  const Icon = goal.icon

  return (
    <article className="flex min-h-[310px] flex-col rounded-lg border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-28px_rgba(24,24,27,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-32px_rgba(24,24,27,0.45)]">
      <div className="mb-12 flex items-start justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#f1edec] text-zinc-950">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-medium tracking-normal text-zinc-950">{goal.name}</h3>
        <p className="mt-1">
          <strong className="font-serif text-[31px] font-semibold leading-tight tracking-normal text-zinc-950">
            ₹{goal.saved.toLocaleString("en-IN")}
          </strong>
          <span className="ml-1 text-zinc-500">/ ₹{goal.target.toLocaleString("en-IN")}</span>
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
        <span>Progress</span>
        <strong className="text-sm tracking-normal text-zinc-950">{goal.progress}%</strong>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5e2e1]"
        role="progressbar"
        aria-label={`${goal.name} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={goal.progress}
      >
        <div
          className={cn("h-full rounded-full bg-emerald-700", goal.progress > 80 && "bg-emerald-600")}
          style={{ width: `${goal.progress}%` }}
        />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
        Est. Completion: {goal.completion}
      </p>
    </article>
  )
})
