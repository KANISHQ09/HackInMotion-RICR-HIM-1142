"use client"

import dynamic from "next/dynamic"
import { useCallback, useDeferredValue, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ActionBar } from "@/components/dashboard/import/action-bar"
import { HowItWorksCard } from "@/components/dashboard/import/how-it-works-card"
import { ManualTransactionModal } from "@/components/dashboard/import/manual-transaction-modal"
import { PageHeader } from "@/components/dashboard/import/page-header"
import { PreviewCardSkeleton } from "@/components/dashboard/import/preview-card-skeleton"
import { UploadCard } from "@/components/dashboard/import/upload-card"
import { useTransactionImport } from "@/components/dashboard/import/use-transaction-import"
import type { Transaction } from "@/lib/api-client"

const PreviewCard = dynamic(
  () => import("@/components/dashboard/import/preview-card").then((module) => module.PreviewCard),
  {
    loading: () => <PreviewCardSkeleton />,
  },
)

export function TransactionImportDashboard() {
  const importState = useTransactionImport()
  const deferredFile = useDeferredValue(importState.file)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [createdTransactions, setCreatedTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (searchParams.get("add") === "manual") {
      setIsManualModalOpen(true)
    }
  }, [searchParams])

  const openManualModal = useCallback(() => {
    setIsManualModalOpen(true)
  }, [])

  const closeManualModal = useCallback(() => {
    setIsManualModalOpen(false)
    if (searchParams.get("add") === "manual") {
      router.replace("/dashboard/import-transactions", { scroll: false })
    }
  }, [router, searchParams])

  const handleTransactionCreated = useCallback((transaction: Transaction) => {
    setCreatedTransactions((current) => [transaction, ...current].slice(0, 4))
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 pb-32 pt-12 md:px-6 md:pt-20">
      <PageHeader onAddClick={openManualModal} />

      {createdTransactions.length > 0 && (
        <section className="rounded-lg border border-zinc-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:p-6" aria-labelledby="manual-transactions-title">
          <div className="border-b border-zinc-200 pb-4">
            <h2 id="manual-transactions-title" className="font-serif text-2xl font-medium tracking-normal text-zinc-950">
              Recently Added
            </h2>
            <p className="mt-1 text-sm text-zinc-600">Manual transactions saved in this session.</p>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {createdTransactions.map((transaction) => (
              <article key={transaction.id} className="rounded-lg border border-zinc-200 bg-[#fdf8f8] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-zinc-950">
                      {transaction.merchant || transaction.description}
                    </h3>
                    <p className="mt-1 truncate text-sm text-zinc-600">{transaction.description}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold capitalize text-emerald-800">
                    {transaction.source}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                  <span className="text-zinc-500">{transaction.date}</span>
                  <strong className="text-zinc-950">₹{transaction.amount}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]" aria-label="Transaction import">
        <UploadCard {...importState} />
        <HowItWorksCard />
      </section>

      <PreviewCard
        file={deferredFile}
        importSummary={importState.importSummary}
        parseResult={importState.parseResult}
      />

      <ActionBar
        hasFile={Boolean(importState.file)}
        isImporting={importState.isImporting}
        onCancel={importState.clearFile}
        onContinue={importState.submitImport}
      />
      <ManualTransactionModal
        isOpen={isManualModalOpen}
        onClose={closeManualModal}
        onCreated={handleTransactionCreated}
      />
    </div>
  )
}
