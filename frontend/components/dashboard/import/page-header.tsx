import { memo } from "react"
import Link from "next/link"
import { ArrowLeft, CalendarPlus, Plus } from "lucide-react"

type PageHeaderProps = {
  onAddClick: () => void
  onPlanClick: () => void
}

export const PageHeader = memo(function PageHeader({ onAddClick, onPlanClick }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="grid gap-2">
        <Link
          href="/dashboard"
          className="mb-2 inline-flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 transition hover:text-zinc-950"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Overview
        </Link>
        <h1 className="font-serif text-3xl font-semibold tracking-normal text-zinc-950 md:text-[32px]">
          Import Transactions
        </h1>
        <p className="max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
          Upload your bank statements to automatically categorize and track your spending patterns.
        </p>
      </div>
      <div className="grid gap-3 sm:flex sm:w-auto">
        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50 sm:w-auto"
          onClick={onPlanClick}
        >
          <CalendarPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Plan Add-on</span>
        </button>
        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:w-auto"
          onClick={onAddClick}
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Add Transaction</span>
        </button>
      </div>
    </header>
  )
})
