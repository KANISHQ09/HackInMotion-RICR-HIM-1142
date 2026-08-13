import type { Metadata } from "next"
import { SettingsDashboard } from "@/components/dashboard/settings/settings-dashboard"

export const metadata: Metadata = {
  title: "Settings | Spendly",
  description: "Manage Spendly account, notification, and security preferences.",
}

export default function SettingsPage() {
  return <SettingsDashboard />
}
