import { memo } from "react"
import { ArrowRight, Loader2, X } from "lucide-react"

export const ActionBar = memo(function ActionBar({
  hasFile,
  rowCount,
  isImporting,
  onCancel,
  onContinue,
}: {
  hasFile: boolean
  rowCount: number
  isImporting: boolean
  onCancel: () => void
  onContinue: () => void
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex gap-3 border-t border-zinc-200/70 bg-[#fdf8f8]/85 p-4 backdrop-blur-xl md:left-64 md:justify-end md:gap-4 md:p-6">
      <button
        type="button"
        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-950 transition hover:bg-[#f1edec] md:flex-none"
        onClick={onCancel}
      >
        <X className="h-4 w-4" aria-hidden="true" />
        Cancel
      </button>
      <button
        type="button"
        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 md:flex-none md:px-5"
        disabled={!hasFile || rowCount === 0 || isImporting}
        onClick={onContinue}
      >
        {isImporting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        )}
        {isImporting ? "Importing" : `Import & Save ${rowCount || ""}`}
      </button>
    </div>
  )
})
