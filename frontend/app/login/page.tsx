import type { Metadata } from "next"
import { AuthForm } from "@/components/auth/auth-form"
import { AuthRouteGuard } from "@/components/auth/auth-route-guard"
import { AuthShell } from "@/components/auth/auth-shell"

export const metadata: Metadata = {
  title: "Log In | Spendly",
  description: "Log in to Spendly to continue tracking transactions and financial health.",
}

export default function LoginPage() {
  return (
    <AuthRouteGuard mode="guest">
      <AuthShell
        eyebrow="Welcome back"
        title="Log in to Spendly"
        subtitle="Continue tracking your transactions, budgets, and financial health in one place."
      >
        <AuthForm mode="login" />
      </AuthShell>
    </AuthRouteGuard>
  )
}
