import { memo } from "react"
import { Sparkles } from "lucide-react"

export const InsightCard = memo(function InsightCard({
  title = "Accelerate Your Timeline",
  copy = "Add savings goals and transactions to generate goal guidance.",
  isLoading = false,
}: {
  title?: string
  copy?: string
  isLoading?: boolean
}) {
  return (
    <article className="rounded-lg border border-zinc-200/80 border-t-violet-500 bg-white p-6 shadow-[0_18px_45px_-28px_rgba(24,24,27,0.35)]">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Smart Insight
      </div>
      <h3 className="font-semibold tracking-normal text-zinc-950">{isLoading ? "Loading Insight" : title}</h3>
      <p className="mt-1 text-sm leading-6 text-zinc-600">
        {isLoading ? "Checking live goal and recommendation data..." : copy}
      </p>
    </article>
  )
})
