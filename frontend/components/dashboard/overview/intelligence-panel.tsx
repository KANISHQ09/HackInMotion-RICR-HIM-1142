import { memo } from "react"
import { Lightbulb, Sparkles } from "lucide-react"
import { insights } from "@/components/dashboard/overview/data"

export const IntelligencePanel = memo(function IntelligencePanel() {
  return (
    <aside className="rounded-lg border border-zinc-200/80 border-t-violet-500 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.35)] xl:border-t-4" aria-labelledby="intelligence-title">
      <h2 id="intelligence-title" className="flex items-center gap-2 font-serif text-2xl font-medium tracking-normal text-zinc-950">
        <Sparkles className="h-5 w-5 text-violet-600" aria-hidden="true" />
        Intelligence
      </h2>

      <div className="mt-6 grid gap-4">
        {insights.map((insight) => (
          <article key={insight.title} className="rounded-lg border border-zinc-200/70 bg-[#f7f3f2]/70 p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">{insight.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{insight.copy}</p>
                {insight.action ? (
                  <button
                    type="button"
                    className="mt-4 min-h-9 rounded-lg bg-zinc-950 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-zinc-800"
                  >
                    {insight.action}
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  )
})
