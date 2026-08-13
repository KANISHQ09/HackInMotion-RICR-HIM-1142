"use client"

import { memo, useState, type FormEvent } from "react"
import { Loader2, ReceiptText, Save, X } from "lucide-react"
import {
  createTransaction,
  type Transaction,
  type TransactionPayload,
} from "@/lib/api-client"

type ManualTransactionModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreated: (transaction: Transaction) => void
}

function createInitialForm(): TransactionPayload {
  return {
    amount: "₹450",
    date: "12 Aug",
    merchant: "Zomato",
    description: "Food delivery",
    type: "debit",
    category: "Food",
  }
}

export const ManualTransactionModal = memo(function ManualTransactionModal({
  isOpen,
  onClose,
  onCreated,
}: ManualTransactionModalProps) {
  const [form, setForm] = useState<TransactionPayload>(() => createInitialForm())
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const updateField = (field: keyof TransactionPayload, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const created = await createTransaction({
        ...form,
        amount: form.amount.trim(),
        date: form.date.trim(),
        merchant: form.merchant.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
      })
      onCreated(created)
      setForm(createInitialForm())
      onClose()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to save this transaction.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-zinc-950/45 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manual-transaction-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <form
        className="w-full max-w-[560px] rounded-lg border border-zinc-200 bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:p-6"
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
          <div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#f7f3f2] text-zinc-950">
              <ReceiptText className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2 id="manual-transaction-title" className="mt-3 font-serif text-2xl font-semibold tracking-normal text-zinc-950">
              Add Transaction
            </h2>
          </div>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
            <div className="grid gap-2">
              <label htmlFor="manual-amount" className="text-sm font-semibold text-zinc-950">
                Amount
              </label>
              <input
                id="manual-amount"
                inputMode="decimal"
                className="min-h-11 rounded-lg border border-zinc-300 px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
                value={form.amount}
                onChange={(event) => updateField("amount", event.target.value)}
                placeholder="₹450"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="manual-date" className="text-sm font-semibold text-zinc-950">
                Date
              </label>
              <input
                id="manual-date"
                className="min-h-11 rounded-lg border border-zinc-300 px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                placeholder="12 Aug or 2026-08-12"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="manual-merchant" className="text-sm font-semibold text-zinc-950">
              Merchant
            </label>
            <input
              id="manual-merchant"
              className="min-h-11 rounded-lg border border-zinc-300 px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
              value={form.merchant}
              onChange={(event) => updateField("merchant", event.target.value)}
              placeholder="Zomato"
              maxLength={96}
              required
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="manual-description" className="text-sm font-semibold text-zinc-950">
              Description
            </label>
            <input
              id="manual-description"
              className="min-h-11 rounded-lg border border-zinc-300 px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
              value={form.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Food delivery"
              maxLength={255}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
            <div className="grid gap-2">
              <label htmlFor="manual-category" className="text-sm font-semibold text-zinc-950">
                Category
              </label>
              <input
                id="manual-category"
                className="min-h-11 rounded-lg border border-zinc-300 px-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950"
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                placeholder="Food"
                maxLength={64}
              />
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-semibold text-zinc-950">Type</span>
              <div className="grid min-h-11 grid-cols-2 rounded-lg border border-zinc-300 p-1">
                {(["debit", "credit"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`rounded-md px-2 text-sm font-semibold capitalize transition ${
                      form.type === type ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                    onClick={() => updateField("type", type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-zinc-300 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
            onClick={onClose}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  )
})
