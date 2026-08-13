"use client"

import { useEffect, useMemo, useState } from "react"
import { TrendingUp, Home, Key, Calendar, Shield } from "lucide-react"

const revenueCategories = [
  { name: "Food & Dining", icon: Calendar, color: "#3b82f6" },
  { name: "Housing & Rent", icon: Key, color: "#10b981" },
  { name: "Subscriptions", icon: Home, color: "#8b5cf6" },
  { name: "Bills & Utilities", icon: Shield, color: "#f59e0b" },
]

function generateRandomData() {
  return revenueCategories.map((cat) => ({
    ...cat,
    value: Math.floor(Math.random() * 30000) + 10000,
  }))
}

export function AnimatedRevenueChart() {
  const [data, setData] = useState(generateRandomData())
  const [growth, setGrowth] = useState(12.5)
  const [activeIndex, setActiveIndex] = useState(0)

  const totalRevenue = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data])

  const chartGradient = useMemo(() => {
    let start = 0

    return data
      .map((item) => {
        const end = start + (item.value / totalRevenue) * 100
        const segment = `${item.color} ${start}% ${end}%`
        start = end
        return segment
      })
      .join(", ")
  }, [data])

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const interval = setInterval(() => {
      setData(generateRandomData())
      setGrowth(Math.round((Math.random() * 20 + 5) * 10) / 10)
      setActiveIndex((prev) => (prev + 1) % revenueCategories.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="w-full max-w-md mx-auto rounded-3xl bg-white p-8 animate-fade-up"
      style={{
        boxShadow:
          "rgba(14, 63, 126, 0.06) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.06) 0px 6px 6px -3px, rgba(42, 51, 70, 0.06) 0px 12px 12px -6px, rgba(14, 63, 126, 0.06) 0px 24px 24px -12px",
      }}
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Spending Breakdown</h3>
          <p className="text-sm text-slate-500">This Month</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 transition-opacity">
            ${totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center justify-end gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-600">+{growth}%</p>
          </div>
        </div>
      </div>

      <div className="h-56 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-44 w-44 rounded-full p-[26px] transition-all duration-700"
            style={{
              background: `conic-gradient(${chartGradient})`,
              boxShadow: `0 0 28px ${data[activeIndex].color}40`,
            }}
          >
            <div className="h-full w-full rounded-full bg-white" />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center transition-transform duration-300">
            {(() => {
              const Icon = data[activeIndex].icon
              return <Icon className="w-6 h-6 mx-auto mb-1" style={{ color: data[activeIndex].color }} />
            })()}
            <p className="text-xs text-slate-500">{data[activeIndex].name}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {data.map((item, index) => {
          const Icon = item.icon
          const percentage = ((item.value / totalRevenue) * 100).toFixed(0)
          return (
            <div
              key={item.name}
              className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
                index === activeIndex ? "bg-slate-50" : ""
              }`}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: item.color + "20" }}
              >
                <Icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <span className="text-sm text-slate-600 flex-1">{item.name}</span>
              <div className="text-right">
                <span className="text-xs text-slate-400">{percentage}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
