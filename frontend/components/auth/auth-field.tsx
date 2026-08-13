import type { InputHTMLAttributes, ReactNode } from "react"

type AuthFieldProps = {
  id: string
  label: string
  icon: ReactNode
  action?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export function AuthField({ id, label, icon, action, className, ...inputProps }: AuthFieldProps) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-xs font-semibold uppercase text-zinc-800">
          {label}
        </label>
        {action}
      </div>
      <div className="flex min-h-12 items-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 transition focus-within:border-zinc-950 focus-within:ring-4 focus-within:ring-zinc-950/10">
        <span className="text-zinc-500 [&>svg]:h-4 [&>svg]:w-4" aria-hidden="true">
          {icon}
        </span>
        <input
          id={id}
          className={`min-w-0 flex-1 bg-transparent text-base text-zinc-950 outline-none placeholder:text-zinc-400 md:text-sm ${
            className ?? ""
          }`}
          {...inputProps}
        />
      </div>
    </div>
  )
}
