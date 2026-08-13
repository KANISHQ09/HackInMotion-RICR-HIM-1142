"use client"

import { useState, useEffect, useMemo } from "react"
import { Home, Eye } from "lucide-react"

const defaultHourlyData = [
  { hour: "12am", visitors: 120 },
  { hour: "2am", visitors: 80 },
  { hour: "4am", visitors: 45 },
  { hour: "6am", visitors: 90 },
  { hour: "8am", visitors: 280 },
  { hour: "10am", visitors: 420 },
  { hour: "12pm", visitors: 380 },
  { hour: "2pm", visitors: 450 },
  { hour: "4pm", visitors: 520 },
  { hour: "6pm", visitors: 480 },
  { hour: "8pm", visitors: 350 },
  { hour: "10pm", visitors: 220 },
]

const defaultTopProperties = [
  { page: "Food & Dining", visitors: 245 },
  { page: "Housing & Rent", visitors: 189 },
  { page: "Subscriptions", visitors: 156 },
  { page: "Bills & Utilities", visitors: 98 },
]

export function RealtimePropertyCard() {
  const [currentVisitors, setCurrentVisitors] = useState(847)
  const [pageViews, setPageViews] = useState(3420)
  const [hourlyData, setHourlyData] = useState(defaultHourlyData)
  const [topProperties, setTopProperties] = useState(defaultTopProperties)
  const [highlightedBar, setHighlightedBar] = useState(8)

  const maxVisitors = useMemo(() => Math.max(...hourlyData.map((d) => d.visitors)), [hourlyData])

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const interval = setInterval(() => {
      setCurrentVisitors((prev) => Math.max(0, prev + Math.floor(Math.random() * 10) - 3))
      setPageViews((prev) => prev + Math.floor(Math.random() * 5))
      setHighlightedBar((prev) => (prev + 1) % hourlyData.length)
      setHourlyData((prev) =>
        prev.map((item) => ({
          ...item,
          visitors: Math.max(30, item.visitors + Math.floor(Math.random() * 40) - 20),
        })),
      )
      setTopProperties((prev) =>
        prev.map((item) => ({
          ...item,
          visitors: Math.max(50, item.visitors + Math.floor(Math.random() * 20) - 10),
        })),
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [hourlyData.length])

  return (
    <div
      className="w-full rounded-2xl bg-white p-6 animate-fade-up"
      style={{
        boxShadow:
          "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px",
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Expense Activity</h3>
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
        </div>
        <span className="text-sm text-slate-500">Live</span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 p-4 text-black transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 opacity-60" />
            <p className="text-sm opacity-80">Monthly Budget</p>
          </div>
          <p className="text-3xl font-bold tabular-nums">{currentVisitors.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 p-4 text-black transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-2 mb-1">
            <Home className="w-4 h-4 opacity-60" />
            <p className="text-sm opacity-80">Total Expenses</p>
          </div>
          <p className="text-3xl font-bold tabular-nums">{pageViews.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-medium text-slate-700">Daily Expense Activity</p>
        <div className="grid h-32 grid-cols-12 items-end gap-1.5 border-b border-slate-100 pb-5">
          {hourlyData.map((entry, index) => (
            <div key={entry.hour} className="group relative flex h-full items-end justify-center">
              <div
                className={`w-full rounded-t transition-all duration-500 ${
                  index === highlightedBar ? "bg-blue-500" : entry.visitors === maxVisitors ? "bg-blue-400" : "bg-slate-200"
                }`}
                style={{ height: `${Math.max(12, (entry.visitors / maxVisitors) * 100)}%` }}
              />
              <span className="absolute -bottom-5 text-[10px] text-slate-500">{index % 2 === 0 ? entry.hour : ""}</span>
              <span className="pointer-events-none absolute bottom-full mb-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                {entry.visitors}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-700">Top Expense Categories</p>
        <div className="space-y-2">
          {topProperties.map((property, index) => (
            <div
              key={property.page}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
            >
              <span className="text-sm text-slate-600">{property.page}</span>
              <span className="text-sm font-medium text-slate-900 tabular-nums">{property.visitors}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
