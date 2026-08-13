const passwordStrengthLabels = ["Too short", "Basic", "Good", "Strong"] as const

export function getPasswordStrength(password: string) {
  if (password.length < 6) {
    return 0
  }

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]

  return Math.min(3, 1 + checks.filter(Boolean).length)
}

type PasswordStrengthProps = {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) {
    return null
  }

  const strength = getPasswordStrength(password)

  return (
    <div className="grid gap-2" aria-live="polite">
      <div className="grid grid-cols-4 gap-2" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <span
            key={index}
            className={`h-1 rounded-full ${
              index <= strength ? "bg-zinc-950" : "bg-zinc-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-500">Password strength: {passwordStrengthLabels[strength]}</p>
    </div>
  )
}
