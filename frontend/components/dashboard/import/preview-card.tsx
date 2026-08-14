import { memo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CopyCheck,
  Table2,
  XCircle,
  type LucideIcon,
} from "lucide-react"
import type { TransactionImportSummary } from "@/lib/api-client"
import type { TransactionCsvParseResult, ParsedTransactionRow } from "@/components/dashboard/import/csv-parser"
import { previewRows } from "@/components/dashboard/import/constants"
import { cn } from "@/lib/utils"

type PreviewCardProps = {
  file: File | null
  parseResult: TransactionCsvParseResult
  importSummary: TransactionImportSummary | null
}

export const PreviewCard = memo(function PreviewCard({
  file,
  parseResult,
  importSummary,
}: PreviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasRows = parseResult.rows.length > 0
  const visibleRows = hasRows ? (isExpanded ? parseResult.rows : parseResult.rows.slice(0, 8)) : []

  return (
    <section
      className="overflow-hidden rounded-lg border border-zinc-200/80 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
      aria-labelledby="preview-title"
    >
      <div className="flex flex-col gap-4 border-b border-zinc-200/70 bg-[#f7f3f2]/60 p-4 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <h2 id="preview-title" className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
          Transaction Preview
        </h2>
        <span
          className={cn(
            "w-fit rounded-full bg-[#f1edec] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500",
            parseResult.rowsReady > 0 && "bg-emerald-200 text-emerald-800",
            parseResult.rowsFailed > 0 && "bg-amber-100 text-amber-800",
          )}
        >
          {file ? `${parseResult.rowsReady} ready` : "Waiting for upload"}
        </span>
      </div>

      {file && (
        <div className="grid gap-3 border-b border-zinc-200/70 p-4 sm:grid-cols-3 md:p-6">
          <SummaryItem icon={CheckCircle2} label="Ready" value={String(parseResult.rowsReady)} />
          <SummaryItem icon={CopyCheck} label="Duplicates" value={String(parseResult.duplicatesSkipped)} />
          <SummaryItem icon={AlertTriangle} label="Needs Review" value={String(parseResult.rowsFailed)} />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead>
            <tr>
              <th className="border-b border-zinc-200/70 bg-[#fdf8f8] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Date
              </th>
              <th className="border-b border-zinc-200/70 bg-[#fdf8f8] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Merchant
              </th>
              <th className="border-b border-zinc-200/70 bg-[#fdf8f8] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Description
              </th>
              <th className="border-b border-zinc-200/70 bg-[#fdf8f8] px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Amount
              </th>
              <th className="border-b border-zinc-200/70 bg-[#fdf8f8] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {hasRows
              ? visibleRows.map((row) => <ParsedRow key={row.row} row={row} />)
              : previewRows.map(([date, merchant, description, amount]) => (
                  <tr key={`${date}-${merchant}-${description}-${amount}`}>
                    <td className="border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">{date}</td>
                    <td className="border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">{merchant}</td>
                    <td className="border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">
                      {description}
                    </td>
                    <td className="border-b border-zinc-200/70 px-6 py-3 text-right text-sm tabular-nums text-zinc-500">
                      {amount}
                    </td>
                    <td className="border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">Example</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {parseResult.rows.length > 8 && (
        <div className="flex justify-center border-t border-zinc-200/70 bg-white p-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-700 transition hover:bg-zinc-50"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((current) => !current)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {isExpanded ? "Show fewer rows" : `Show all ${parseResult.rows.length} rows`}
          </button>
        </div>
      )}

      <div className="grid place-items-center gap-3 bg-[#fdf8f8]/50 p-6 text-center md:p-10">
        {parseResult.error ? (
          <XCircle className="h-10 w-10 text-red-500" aria-hidden="true" />
        ) : (
          <Table2 className="h-10 w-10 text-zinc-300" aria-hidden="true" />
        )}
        <p className="max-w-xl break-words text-base leading-7 text-zinc-600">
          {importSummary
            ? `${importSummary.rowsImported} imported, ${importSummary.duplicatesSkipped} duplicates skipped, ${importSummary.rowsFailed} failed.`
            : file
              ? `${file.name} was checked. Review any warnings before continuing.`
              : "Upload a CSV with Date, Description, and Amount. Type is optional and defaults to debit."}
        </p>
      </div>
    </section>
  )
})

function ParsedRow({ row }: { row: ParsedTransactionRow }) {
  return (
    <tr>
      <td className="border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">
        {row.date || `Row ${row.row}`}
      </td>
      <td className="border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">{row.merchant || "-"}</td>
      <td className="max-w-[320px] border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">
        <span className="block truncate">{row.description || "-"}</span>
      </td>
      <td className="border-b border-zinc-200/70 px-6 py-3 text-right text-sm tabular-nums text-zinc-500">
        {row.amount ? `₹${row.amount}` : "-"}
      </td>
      <td className="border-b border-zinc-200/70 px-6 py-3 text-sm text-zinc-500">
        <span
          className={cn(
            "inline-flex max-w-[180px] items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
            row.status === "ready" && "bg-emerald-100 text-emerald-800",
            row.status === "duplicate" && "bg-zinc-100 text-zinc-600",
            row.status === "failed" && "bg-amber-100 text-amber-800",
          )}
          title={row.reason}
        >
          {row.reason ?? row.status}
        </span>
      </td>
    </tr>
  )
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#fdf8f8] p-3">
      <Icon className="h-4 w-4 text-zinc-600" aria-hidden="true" />
      <span className="text-sm font-medium text-zinc-500">{label}</span>
      <strong className="ml-auto text-sm font-semibold text-zinc-950">{value}</strong>
    </div>
  )
}
