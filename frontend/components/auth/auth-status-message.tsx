import { AlertCircle, CheckCircle2 } from "lucide-react"

type AuthStatusMessageProps = {
  error: string
  success: string
}

export function AuthStatusMessage({ error, success }: AuthStatusMessageProps) {
  if (!error && !success) {
    return null
  }

  const isError = Boolean(error)

  return (
    <p
      className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm leading-6 ${
        isError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"
      }`}
      role="status"
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
      )}
      <span>{error || success}</span>
    </p>
  )
}
