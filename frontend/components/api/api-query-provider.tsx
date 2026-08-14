"use client"

import { Component, useState, type ErrorInfo, type ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/api/queryClient"

type ApiErrorBoundaryState = {
  error: Error | null
}

class ApiErrorBoundary extends Component<{ children: ReactNode }, ApiErrorBoundaryState> {
  state: ApiErrorBoundaryState = {
    error: null,
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("API boundary caught an error", error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              Spendly
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-normal text-zinc-950">
              Something went wrong
            </h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
              Refresh the page to retry the last action.
            </p>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export function ApiQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => queryClient)

  return (
    <QueryClientProvider client={client}>
      <ApiErrorBoundary>{children}</ApiErrorBoundary>
    </QueryClientProvider>
  )
}
