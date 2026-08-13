"use client"

import type { ReactNode } from "react"
import { memo, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { hasAuthSession } from "@/lib/auth-storage"

type AuthRouteGuardProps = {
  children: ReactNode
  mode: "guest" | "protected"
  redirectTo?: string
}

export const AuthRouteGuard = memo(function AuthRouteGuard({
  children,
  mode,
  redirectTo,
}: AuthRouteGuardProps) {
  const router = useRouter()
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    const isLoggedIn = hasAuthSession()

    if (mode === "protected" && !isLoggedIn) {
      router.replace(redirectTo ?? "/login")
      return
    }

    if (mode === "guest" && isLoggedIn) {
      router.replace(redirectTo ?? "/dashboard")
      return
    }

    setIsAllowed(true)
  }, [mode, redirectTo, router])

  if (!isAllowed) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Spendly
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-normal text-zinc-950">
            Checking your session
          </h1>
        </div>
      </main>
    )
  }

  return children
})
