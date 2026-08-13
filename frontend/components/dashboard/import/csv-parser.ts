export type ParsedTransactionRow = {
  row: number
  date: string
  description: string
  merchant: string
  amount: string
  type: "debit" | "credit"
  status: "ready" | "duplicate" | "failed"
  reason?: string
}

export type TransactionCsvParseResult = {
  rows: ParsedTransactionRow[]
  rowsProcessed: number
  rowsReady: number
  rowsFailed: number
  duplicatesSkipped: number
  error: string
}

const emptyParseResult: TransactionCsvParseResult = {
  rows: [],
  rowsProcessed: 0,
  rowsReady: 0,
  rowsFailed: 0,
  duplicatesSkipped: 0,
  error: "",
}

const monthIndexes: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
}

export function parseTransactionCsv(text: string): TransactionCsvParseResult {
  const parsed = parseCsv(text)

  if (parsed.error) {
    return {
      ...emptyParseResult,
      rowsFailed: 1,
      error: parsed.error,
      rows: [
        {
          row: 1,
          date: "",
          description: "",
          merchant: "",
          amount: "",
          type: "debit",
          status: "failed",
          reason: parsed.error,
        },
      ],
    }
  }

  const rows = parsed.rows.filter((row) => row.some((cell) => cell.trim() !== ""))
  if (rows.length === 0) {
    return {
      ...emptyParseResult,
      rowsFailed: 1,
      error: "CSV is empty.",
    }
  }

  const header = createHeaderMap(rows[0])
  const hasRequiredHeaders =
    hasHeader(header, "date", "transactiondate", "txndate") &&
    hasHeader(header, "description", "details", "narration", "particulars", "merchant", "payee") &&
    hasHeader(header, "amount", "transactionamount", "value", "debit", "withdrawal", "credit", "deposit")

  if (!hasRequiredHeaders) {
    return {
      ...emptyParseResult,
      rowsFailed: 1,
      error: "CSV needs Date, Description, and Amount columns. Type is optional.",
      rows: [
        {
          row: 1,
          date: "",
          description: "",
          merchant: "",
          amount: "",
          type: "debit",
          status: "failed",
          reason: "CSV needs Date, Description, and Amount columns. Type is optional.",
        },
      ],
    }
  }

  const seen = new Set<string>()
  const results = rows.slice(1).map((row, index) => {
    const rowNumber = index + 2
    const date = normalizeDate(readCell(row, header, "date", "transactiondate", "txndate"))
    const merchant = readCell(row, header, "merchant", "payee", "vendor")
    const description =
      readCell(row, header, "description", "details", "narration", "particulars") || merchant
    const amount = normalizeAmount(readImportAmount(row, header))
    const type = readImportType(row, header)
    const issue = validateRow({ date, description, amount, type })
    const duplicateKey = `${date}|${description.toLowerCase()}|${amount}|${type}`

    if (issue) {
      return createParsedRow(rowNumber, date, description, merchant, amount, type, "failed", issue)
    }

    if (seen.has(duplicateKey)) {
      return createParsedRow(rowNumber, date, description, merchant, amount, type, "duplicate", "Duplicate transaction in this file.")
    }

    seen.add(duplicateKey)
    return createParsedRow(rowNumber, date, description, merchant || merchantFromDescription(description), amount, type, "ready")
  })

  return {
    rows: results,
    rowsProcessed: results.length,
    rowsReady: results.filter((row) => row.status === "ready").length,
    rowsFailed: results.filter((row) => row.status === "failed").length,
    duplicatesSkipped: results.filter((row) => row.status === "duplicate").length,
    error: "",
  }
}

function parseCsv(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let isQuoted = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const next = text[index + 1]

    if (char === '"') {
      if (isQuoted && next === '"') {
        cell += '"'
        index += 1
      } else {
        isQuoted = !isQuoted
      }
      continue
    }

    if (char === "," && !isQuoted) {
      row.push(cell)
      cell = ""
      continue
    }

    if ((char === "\n" || char === "\r") && !isQuoted) {
      if (char === "\r" && next === "\n") {
        index += 1
      }
      row.push(cell)
      rows.push(row)
      row = []
      cell = ""
      continue
    }

    cell += char
  }

  if (isQuoted) {
    return { rows: [], error: "Malformed CSV: a quoted value is not closed." }
  }

  row.push(cell)
  rows.push(row)

  return { rows, error: "" }
}

function createHeaderMap(row: string[]) {
  return row.reduce<Record<string, number>>((result, column, index) => {
    const normalized = normalizeHeader(column)
    if (normalized) {
      result[normalized] = index
    }
    return result
  }, {})
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "")
}

function hasHeader(header: Record<string, number>, ...columns: string[]) {
  return columns.some((column) => header[normalizeHeader(column)] !== undefined)
}

function readCell(row: string[], header: Record<string, number>, ...columns: string[]) {
  for (const column of columns) {
    const index = header[normalizeHeader(column)]
    if (index !== undefined && row[index]?.trim()) {
      return row[index].trim()
    }
  }
  return ""
}

function readImportAmount(row: string[], header: Record<string, number>) {
  return (
    readCell(row, header, "amount", "transactionamount", "value") ||
    readCell(row, header, "debit", "withdrawal", "withdrawals") ||
    readCell(row, header, "credit", "deposit", "deposits")
  )
}

function readImportType(row: string[], header: Record<string, number>): "debit" | "credit" {
  const explicitType = readCell(row, header, "type", "transactiontype").toLowerCase()
  if (["credit", "income", "deposit", "cr"].includes(explicitType)) {
    return "credit"
  }

  if (readCell(row, header, "credit", "deposit", "deposits")) {
    return "credit"
  }

  return "debit"
}

function normalizeDate(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""

  const isoMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (isoMatch) {
    return formatDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]))
  }

  const numericMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})(?:[-/](\d{2,4}))?$/)
  if (numericMatch) {
    const year = normalizeYear(numericMatch[3])
    return formatDate(year, Number(numericMatch[2]), Number(numericMatch[1]))
  }

  const monthMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{2,4}))?$/)
  if (monthMatch) {
    const month = monthIndexes[monthMatch[2].toLowerCase()]
    if (month !== undefined) {
      return formatDate(normalizeYear(monthMatch[3]), month + 1, Number(monthMatch[1]))
    }
  }

  return ""
}

function normalizeYear(value?: string) {
  if (!value) return new Date().getFullYear()
  const year = Number(value)
  return year < 100 ? 2000 + year : year
}

function formatDate(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return ""
  }

  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-")
}

function normalizeAmount(value: string) {
  const cleaned = value.replace(/₹|INR/gi, "").replace(/,/g, "").trim()
  const parsed = Number.parseFloat(cleaned)
  if (!Number.isFinite(parsed) || parsed === 0) {
    return ""
  }
  return Math.abs(parsed).toFixed(2)
}

function validateRow({
  date,
  description,
  amount,
  type,
}: {
  date: string
  description: string
  amount: string
  type: string
}) {
  if (!date) return "Missing or unsupported date."
  if (!description.trim()) return "Missing description or merchant."
  if (!amount) return "Missing or invalid amount."
  if (type !== "debit" && type !== "credit") return "Type must be debit or credit."
  return ""
}

function createParsedRow(
  row: number,
  date: string,
  description: string,
  merchant: string,
  amount: string,
  type: "debit" | "credit",
  status: ParsedTransactionRow["status"],
  reason?: string,
) {
  return {
    row,
    date,
    description,
    merchant,
    amount,
    type,
    status,
    reason,
  }
}

function merchantFromDescription(description: string) {
  return description.trim().split(/\s+/)[0] ?? ""
}
