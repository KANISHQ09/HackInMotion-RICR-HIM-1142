import { memo, useState } from "react"
import { ChevronDown, ChevronUp, Database, Loader2 } from "lucide-react"
import type { Transaction } from "@/api/types"

type PersistedTransactionsCardProps = {
  transactions: Transaction[]
  error: string
  isLoading: boolean
}

export const PersistedTransactionsCard = memo(function PersistedTransactionsCard({
  transactions,
  error,
  isLoading,
}: PersistedTransactionsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const visibleTransactions = isExpanded ? transactions : transactions.slice(0, 10)

  return (
    <section
      className="overflow-hidden rounded-lg border border-zinc-200/80 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
      aria-labelledby="persisted-transactions-title"
    >
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200/70 bg-[#f7f3f2]/60 p-4 md:p-6">
        <div>
          <h2 id="persisted-transactions-title" className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
            Imported Transactions
          </h2>
          <p className="mt-1 text-sm text-zinc-600">CSV expenses saved to your account.</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-800">
          {transactions.length} saved
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 p-10 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Loading saved transactions
        </div>
      ) : error ? (
        <p className="p-6 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : transactions.length === 0 ? (
        <div className="grid place-items-center gap-3 p-10 text-center">
          <Database className="h-9 w-9 text-zinc-300" aria-hidden="true" />
          <p className="text-sm text-zinc-500">Your persisted CSV transactions will appear here after import.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left">
            <thead>
              <tr>
                {["Date", "Merchant", "Description", "Category", "Saved at", "Amount"].map((heading) => (
                  <th key={heading} className="border-b border-zinc-200/70 bg-[#fdf8f8] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 last:text-right">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">{transaction.date}</td>
                  <td className="border-b border-zinc-200/70 px-6 py-3 text-sm font-medium text-zinc-700">{transaction.merchant || "-"}</td>
                  <td className="max-w-[280px] border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">
                    <span className="block truncate">{transaction.description}</span>
                  </td>
                  <td className="border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">{transaction.category}</td>
                  <td className="whitespace-nowrap border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">
                    {formatSavedAt(transaction.createdAt)}
                  </td>
                  <td className="border-b border-zinc-200/70 px-6 py-3 text-right text-sm font-semibold tabular-nums text-zinc-950">
                    {transaction.type === "debit" ? "-" : "+"}₹{transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length > 10 && (
            <div className="flex justify-center border-t border-zinc-200/70 p-4">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-700 transition hover:bg-zinc-50"
                aria-expanded={isExpanded}
                onClick={() => setIsExpanded((current) => !current)}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {isExpanded ? "Show fewer transactions" : `Show all ${transactions.length} transactions`}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
})

function formatSavedAt(createdAt: number) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt * 1000))
}
