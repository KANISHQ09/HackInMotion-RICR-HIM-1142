import type { Metadata } from "next"
import { GoalsDashboard } from "@/components/dashboard/goals/goals-dashboard"

export const metadata: Metadata = {
  title: "Goals | Spendly",
  description: "Track active savings goals and project monthly contribution timelines.",
}

export default function GoalsPage() {
  return <GoalsDashboard />
}
