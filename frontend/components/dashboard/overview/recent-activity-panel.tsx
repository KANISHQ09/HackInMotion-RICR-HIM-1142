import Link from "next/link"
import { memo } from "react"
import { ArrowUpRight } from "lucide-react"
import { recentTransactions } from "@/components/dashboard/overview/data"
import { cn } from "@/lib/utils"

export const RecentActivityPanel = memo(function RecentActivityPanel() {
  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200/80 bg-white shadow-[0_18px_45px_-32px_rgba(24,24,27,0.35)]" aria-labelledby="recent-activity-title">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200/70 bg-[#fdf8f8]/80 p-6">
        <h2 id="recent-activity-title" className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
          Recent Activity
        </h2>
        <Link
          href="/dashboard/import-transactions"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 transition hover:text-zinc-950"
        >
          View all
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead>
            <tr>
              {["Date", "Merchant", "Category", "Amount"].map((heading) => (
                <th
                  key={heading}
                  className={cn(
                    "border-b border-zinc-200/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500",
                    heading === "Amount" && "text-right",
                  )}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((transaction) => (
              <tr key={`${transaction.date}-${transaction.merchant}`} className="transition hover:bg-[#f7f3f2]/60">
                <td className="border-b border-zinc-200/70 px-6 py-4 text-sm tabular-nums text-zinc-500">
                  {transaction.date}
                </td>
                <td className="border-b border-zinc-200/70 px-6 py-4 text-sm font-semibold text-zinc-950">
                  {transaction.merchant}
                </td>
                <td className="border-b border-zinc-200/70 px-6 py-4 text-sm">
                  <span
                    className={cn(
                      "rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-600",
                      transaction.type === "income" && "bg-emerald-100 text-emerald-800",
                    )}
                  >
                    {transaction.category}
                  </span>
                </td>
                <td
                  className={cn(
                    "border-b border-zinc-200/70 px-6 py-4 text-right text-sm font-semibold tabular-nums text-zinc-700",
                    transaction.type === "income" && "text-emerald-700",
                  )}
                >
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
})
