import type { Metadata } from "next"
import { AuthForm } from "@/components/auth/auth-form"
import { AuthRouteGuard } from "@/components/auth/auth-route-guard"
import { AuthShell } from "@/components/auth/auth-shell"

export const metadata: Metadata = {
  title: "Create Account | Spendly",
  description: "Create a Spendly account to analyze spending and track financial health.",
}

export default function RegisterPage() {
  return (
    <AuthRouteGuard mode="guest">
      <AuthShell
        eyebrow="Get started"
        title="Start your journey"
        subtitle="Create your Spendly account and start building a clearer view of your spending."
      >
        <AuthForm mode="register" />
      </AuthShell>
    </AuthRouteGuard>
  )
}
