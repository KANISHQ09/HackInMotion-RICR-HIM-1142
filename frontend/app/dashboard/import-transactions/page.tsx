import type { Metadata } from "next"
import { TransactionImportDashboard } from "@/components/dashboard/transaction-import-dashboard"

export const metadata: Metadata = {
  title: "Import Transactions | Spendly",
  description: "Upload CSV bank statements and prepare transactions for Spendly.",
}

export default function ImportTransactionsPage() {
  return <TransactionImportDashboard />
}
