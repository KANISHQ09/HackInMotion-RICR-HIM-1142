import {
  LayoutDashboard,
  PiggyBank,
  ReceiptText,
  Settings,
  Target,
} from "lucide-react"

export const dashboardNavigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/import-transactions", icon: ReceiptText },
  { label: "Budgets", href: "/dashboard/budgets", icon: PiggyBank },
  { label: "Goals", href: "/dashboard/goals", icon: Target },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const

export type DashboardNavigationItem = (typeof dashboardNavigation)[number]

export function isDashboardNavigationItemActive(
  pathname: string,
  item: DashboardNavigationItem,
) {
  if (item.href === "/dashboard") {
    return pathname === item.href
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}
