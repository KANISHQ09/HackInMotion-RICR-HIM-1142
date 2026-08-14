"use client"

import { memo, useState } from "react"
import { Bell, GitCommit, Globe2, ShieldCheck, Tags, UserRound, type LucideIcon } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-auth-api"
import { useCategoryRules, useSystemVersion } from "@/hooks/use-finance-api"

export const SettingsDashboard = memo(function SettingsDashboard() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const currentUser = useCurrentUser()
  const categoryRules = useCategoryRules()
  const systemVersion = useSystemVersion()
  const profileRows = [
    { label: "Name", value: currentUser.data?.nickname || currentUser.data?.username || "Spendly user" },
    { label: "Email", value: currentUser.data?.email || "Loading..." },
    { label: "Currency", value: currentUser.data?.defaultCurrency || "INR" },
  ]

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-4 pb-28 pt-10 sm:px-6 md:px-12 md:py-20">
      <header className="border-b border-zinc-200/80 pb-6">
        <h1 className="font-serif text-4xl font-semibold tracking-normal text-zinc-950 md:text-5xl">
          Settings
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-600">
          Manage account preferences, notifications, and security defaults.
        </p>
      </header>

      <section className="flex flex-col gap-5" aria-label="Account settings">
        <article className="rounded-lg border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.32)]">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-950">
            <UserRound className="h-5 w-5" aria-hidden="true" />
            Profile
          </h2>
          {currentUser.error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">
              {currentUser.error.message}
            </p>
          ) : null}
          <div className="mt-5 divide-y divide-zinc-100">
            {profileRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm font-medium text-zinc-500">{row.label}</span>
                <strong className="text-sm font-semibold text-zinc-950">{row.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.32)]">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-950">
            <Tags className="h-5 w-5" aria-hidden="true" />
            Category Rules
          </h2>
          <div className="mt-5 grid gap-3">
            {categoryRules.isLoading ? (
              <p className="rounded-lg bg-[#f7f3f2] p-4 text-sm font-medium text-zinc-500">
                Loading merchant rules...
              </p>
            ) : null}

            {categoryRules.error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">
                {categoryRules.error.message}
              </p>
            ) : null}

            {!categoryRules.isLoading && !categoryRules.error && categoryRules.data?.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-300 bg-[#f7f3f2] p-4 text-sm font-medium text-zinc-500">
                No custom category rules yet.
              </p>
            ) : null}

            {categoryRules.data?.slice(0, 5).map((rule) => (
              <div key={rule.id} className="flex items-center justify-between gap-4 rounded-lg bg-[#f7f3f2] p-4">
                <span className="min-w-0">
                  <strong className="block truncate text-sm font-semibold text-zinc-950">
                    {rule.merchantPattern}
                  </strong>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    {rule.type}
                  </span>
                </span>
                <span className="shrink-0 rounded-md bg-zinc-950 px-2 py-1 text-xs font-semibold text-white">
                  {rule.category}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-zinc-200/80 bg-white p-6 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.32)]">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-950">
            <Bell className="h-5 w-5" aria-hidden="true" />
            Notifications
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            <PreferenceToggle
              checked={emailAlerts}
              label="Email alerts"
              note="Send alerts when a budget reaches its review threshold."
              onChange={() => setEmailAlerts((value) => !value)}
            />
            <PreferenceToggle
              checked={weeklySummary}
              label="Weekly summary"
              note="Receive a short digest of spending, goals, and imports."
              onChange={() => setWeeklySummary((value) => !value)}
            />
          </div>
        </article>

        <div className="flex flex-col gap-5 lg:flex-row">
          <StatusCard
            icon={ShieldCheck}
            label="Security"
            value="Two-factor review ready"
          />
          <StatusCard
            icon={Globe2}
            label="Region"
            value={`${currentUser.data?.defaultCurrency || "INR"}, English`}
          />
          <StatusCard
            icon={GitCommit}
            label="Backend"
            value={
              systemVersion.data
                ? `${systemVersion.data.version} (${systemVersion.data.commitHash || "local"})`
                : systemVersion.isLoading
                  ? "Checking version"
                  : "Version unavailable"
            }
          />
        </div>
      </section>
    </div>
  )
})

function PreferenceToggle({
  checked,
  label,
  note,
  onChange,
}: {
  checked: boolean
  label: string
  note: string
  onChange: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onChange}
      className="flex items-center justify-between gap-4 rounded-lg bg-[#f7f3f2] p-4 text-left transition hover:bg-[#f1edec]"
    >
      <span>
        <strong className="block text-sm font-semibold text-zinc-950">{label}</strong>
        <span className="mt-1 block text-sm leading-6 text-zinc-600">{note}</span>
      </span>
      <span
        className={
          checked
            ? "relative h-6 w-11 shrink-0 rounded-full bg-zinc-950"
            : "relative h-6 w-11 shrink-0 rounded-full bg-zinc-300"
        }
      >
        <span
          className={
            checked
              ? "absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition"
              : "absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition"
          }
        />
      </span>
    </button>
  )
}

function StatusCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <article className="flex flex-1 items-center gap-3 rounded-lg border border-zinc-200/80 bg-white p-5 shadow-[0_18px_45px_-32px_rgba(24,24,27,0.32)]">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#f1edec] text-zinc-950">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-sm font-medium text-zinc-500">{label}</h2>
        <p className="mt-1 text-sm font-semibold text-zinc-950">{value}</p>
      </div>
    </article>
  )
}
