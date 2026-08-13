import { memo } from "react"
import { Sparkles } from "lucide-react"
import { steps } from "@/components/dashboard/import/constants"
import { cn } from "@/lib/utils"

export const HowItWorksCard = memo(function HowItWorksCard() {
  return (
    <aside className="rounded-lg border border-zinc-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:p-6">
      <div className="mb-6 flex items-center gap-2 border-b border-zinc-200/70 pb-4">
        <Sparkles className="h-5 w-5 text-zinc-950" aria-hidden="true" />
        <h2 className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
          How it works
        </h2>
      </div>

      <ol className="grid gap-6">
        {steps.map(({ title, description }, index) => (
          <li key={title} className="flex gap-4">
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e5e2e1] text-xs font-semibold text-zinc-600",
                index === 2 && "bg-emerald-200 text-emerald-800",
              )}
            >
              {index + 1}
            </span>
            <div>
              <h3 className="font-semibold leading-6 text-zinc-950">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  )
})
