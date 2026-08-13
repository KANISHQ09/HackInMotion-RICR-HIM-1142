import { memo } from "react"
import Link from "next/link"
import { Check, Trophy } from "lucide-react"
import { milestones } from "@/components/dashboard/goals/data"

export const MilestonesCard = memo(function MilestonesCard() {
  return (
    <article className="flex flex-1 flex-col rounded-lg border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-28px_rgba(24,24,27,0.35)]">
      <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-medium tracking-normal text-zinc-950">
        <Trophy className="h-5 w-5" aria-hidden="true" />
        Milestones
      </h2>
      <ul className="grid gap-3">
        {milestones.map(([name, date]) => (
          <li key={name} className="flex items-center gap-3 rounded-lg bg-[#f7f3f2] p-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-zinc-950 text-white">
              <Check className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="grid gap-0.5">
              <strong className="text-sm font-semibold text-zinc-950 line-through decoration-zinc-300">
                {name}
              </strong>
              <small className="text-xs font-semibold text-zinc-500">{date}</small>
            </div>
          </li>
        ))}
      </ul>
      <Link
        href="/dashboard/goals"
        className="mt-6 block text-center text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 transition hover:text-zinc-950"
      >
        View All History
      </Link>
    </article>
  )
})
