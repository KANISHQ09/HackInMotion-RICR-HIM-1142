import { ArrowRight, Loader2 } from "lucide-react"

type AuthSubmitButtonProps = {
  isSubmitting: boolean
  children: string
}

export function AuthSubmitButton({ isSubmitting, children }: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-zinc-950 px-5 text-sm font-semibold uppercase text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
      {!isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
    </button>
  )
}
