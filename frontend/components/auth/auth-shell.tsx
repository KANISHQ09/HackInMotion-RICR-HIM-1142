import Link from "next/link"
import type React from "react"
import { AuthVisual } from "@/components/auth/auth-visual"

type AuthShellProps = {
  children: React.ReactNode
  eyebrow: string
  title: string
  subtitle: string
}

export function AuthShell({ children, eyebrow, title, subtitle }: AuthShellProps) {
  return (
    <main className="min-h-[100svh] bg-[#fdf8f8] text-zinc-950 lg:grid lg:grid-cols-2">
      <section className="flex min-h-[100svh] items-center justify-center px-6 py-16 sm:px-10 lg:px-20">
        <div className="w-full max-w-[440px]">
          <Link href="/" className="mb-12 inline-flex font-serif text-2xl font-bold tracking-tight">
            Spendly
          </Link>

          <header className="mb-10">
            <p className="mb-3 text-xs font-semibold uppercase text-emerald-700">{eyebrow}</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
            <p className="mt-4 text-base leading-7 text-zinc-600">{subtitle}</p>
          </header>

          {children}
        </div>
      </section>

      <AuthVisual />
    </main>
  )
}
