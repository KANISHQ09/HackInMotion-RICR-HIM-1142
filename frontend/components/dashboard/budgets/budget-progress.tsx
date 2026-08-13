import { cn } from "@/lib/utils"

const progressToneClass = {
  good: "bg-emerald-700",
  warning: "bg-amber-500",
  fixed: "bg-zinc-300",
  danger: "bg-red-600",
  neutral: "bg-zinc-950",
} as const

type BudgetProgressProps = {
  value: number
  tone?: keyof typeof progressToneClass
  className?: string
}

export function BudgetProgress({
  value,
  tone = "neutral",
  className,
}: BudgetProgressProps) {
  const normalizedValue = Math.max(0, Math.min(value, 100))

  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-[#ebe7e6]", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={normalizedValue}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", progressToneClass[tone])}
        style={{ width: `${normalizedValue}%` }}
      />
    </div>
  )
}
