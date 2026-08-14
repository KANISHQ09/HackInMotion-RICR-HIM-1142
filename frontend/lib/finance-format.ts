export function parseApiAmount(value?: string | number | null) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0
  }

  if (!value) return 0

  const parsed = Number(String(value).replace(/[₹,\s]/g, ""))
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatCurrency(value: number, options: { compact?: boolean } = {}) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: options.compact ? 1 : Number.isInteger(value) ? 0 : 2,
    notation: options.compact ? "compact" : "standard",
  }).format(value)
}

export function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, value)).toFixed(value % 1 === 0 ? 0 : 1)}%`
}
