import { memo } from "react"
import Link from "next/link"
import { Lightbulb, Sparkles } from "lucide-react"
import { insights, type Insight } from "@/components/dashboard/overview/data"

type IntelligencePanelProps = {
  insights?: Insight[]
  isLoading?: boolean
  error?: string
}

export const IntelligencePanel = memo(function IntelligencePanel({
  insights: panelInsights = insights,
  isLoading = false,
  error = "",
}: IntelligencePanelProps) {
  return (
    <aside className="rounded-lg border border-zinc-200/80 border-t-violet-500 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.35)] xl:border-t-4" aria-labelledby="intelligence-title">
      <h2 id="intelligence-title" className="flex items-center gap-2 font-serif text-2xl font-medium tracking-normal text-zinc-950">
        <Sparkles className="h-5 w-5 text-violet-600" aria-hidden="true" />
        Intelligence
      </h2>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4">
        {isLoading ? (
          <article className="rounded-lg border border-zinc-200/70 bg-[#f7f3f2]/70 p-4 text-sm font-medium text-zinc-500">
            Loading live insights...
          </article>
        ) : null}

        {!isLoading && panelInsights.length === 0 ? (
          <article className="rounded-lg border border-dashed border-zinc-300 bg-[#f7f3f2]/70 p-4 text-sm font-medium text-zinc-500">
            Add transactions to generate recommendations.
          </article>
        ) : null}

        {!isLoading && panelInsights.map((insight) => (
          <article key={insight.title} className="rounded-lg border border-zinc-200/70 bg-[#f7f3f2]/70 p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-zinc-950">{insight.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{insight.copy}</p>
                {insight.action ? (
                  <Link
                    href="/dashboard/budgets#upcoming-bills"
                    className="mt-4 inline-flex min-h-9 items-center rounded-lg bg-zinc-950 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-zinc-800"
                  >
                    {insight.action}
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  )
})
