import {
  Car,
  Plane,
  ShieldPlus,
  type LucideIcon,
} from "lucide-react"

export type Period = "6M" | "1Y" | "3Y"

export type Goal = {
  icon: LucideIcon
  name: "Emergency Fund" | "New Vehicle" | "Kyoto Trip"
  saved: number
  target: number
  progress: number
  completion: string
}

export type GoalName = Goal["name"]

type ChartBar = {
  height: number
  value: string
  tone?: "current" | "future"
}

export const periods: readonly Period[] = ["6M", "1Y", "3Y"] as const

export const goals: readonly Goal[] = [
  {
    icon: ShieldPlus,
    name: "Emergency Fund",
    saved: 15400,
    target: 20000,
    progress: 77,
    completion: "Nov 2024",
  },
  {
    icon: Car,
    name: "New Vehicle",
    saved: 8250,
    target: 35000,
    progress: 23,
    completion: "Aug 2025",
  },
  {
    icon: Plane,
    name: "Kyoto Trip",
    saved: 4100,
    target: 5000,
    progress: 82,
    completion: "May 2024",
  },
] as const

export const milestones = [
  ["Home Down Payment", "Reached Oct 2023"],
  ["Laptop Replacement", "Reached Jun 2023"],
] as const

export const chartBars: readonly ChartBar[] = [
  { height: 20, value: "$4k" },
  { height: 35, value: "$7k" },
  { height: 45, value: "$9k" },
  { height: 60, value: "$12k" },
  { height: 75, value: "$15.4k", tone: "current" },
  { height: 90, value: "$18k", tone: "future" },
  { height: 100, value: "$20k", tone: "future" },
] as const
