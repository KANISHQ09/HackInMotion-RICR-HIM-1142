"use client"

import { memo } from "react"
import { CalendarDays, CircleDollarSign, Loader2 } from "lucide-react"
import type { PlannedAddOn } from "@/lib/api-client"
import { cn } from "@/lib/utils"

type PlannedAddOnsCardProps = {
  addOns: PlannedAddOn[]
  error: string
  isLoading: boolean
}

export const PlannedAddOnsCard = memo(function PlannedAddOnsCard({
  addOns,
  error,
  isLoading,
}: PlannedAddOnsCardProps) {
  return (
    <section className="rounded-lg border border-zinc-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:p-6" aria-labelledby="planned-addons-title">
      <div className="flex flex-col gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="planned-addons-title" className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
            Planned Add-ons
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            {addOns.length} upcoming {addOns.length === 1 ? "item" : "items"}
          </p>
        </div>
        {isLoading && (
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading
          </span>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && addOns.length === 0 && (
        <div className="mt-4 flex min-h-24 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-[#f7f3f2]/50 px-4 text-center text-sm font-medium text-zinc-500">
          No planned add-ons yet.
        </div>
      )}

      {addOns.length > 0 && (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {addOns.slice(0, 6).map((addOn) => (
            <article key={addOn.id} className="rounded-lg border border-zinc-200 bg-[#fdf8f8] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-zinc-950">
                    {addOn.description}
                  </h3>
                  <p className="mt-1 truncate text-sm text-zinc-600">
                    {addOn.merchant || addOn.category}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                    addOn.type === "credit"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800",
                  )}
                >
                  {addOn.type}
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-zinc-600">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Amount
                  </span>
                  <strong className="text-zinc-950">INR {addOn.amount}</strong>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Date
                  </span>
                  <strong className="text-zinc-950">{addOn.expectedDate}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
})
