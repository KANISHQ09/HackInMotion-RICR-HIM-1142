import type { Metadata } from "next"
import { BudgetsDashboard } from "@/components/dashboard/budgets/budgets-dashboard"

export const metadata: Metadata = {
  title: "Budgets | Spendly",
  description: "Track budget limits, spending progress, and category alerts.",
}

export default function BudgetsPage() {
  return <BudgetsDashboard />
}
