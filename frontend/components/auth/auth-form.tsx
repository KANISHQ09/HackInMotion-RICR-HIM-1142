"use client"

import type { FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react"
import { AuthField } from "@/components/auth/auth-field"
import { AuthStatusMessage } from "@/components/auth/auth-status-message"
import { AuthSubmitButton } from "@/components/auth/auth-submit-button"
import { PasswordStrength, getPasswordStrength } from "@/components/auth/password-strength"
import { loginUser, registerUser } from "@/lib/api-client"
import { saveAuthSession } from "@/lib/auth-storage"

type AuthMode = "register" | "login"

type AuthFormProps = {
  mode: AuthMode
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const isRegister = mode === "register"
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") || "").trim()
    const email = String(formData.get("email") || "").trim().toLowerCase()
    const password = String(formData.get("password") || "")
    const confirmPassword = String(formData.get("confirmPassword") || "")

    if (isRegister && !name) {
      setError("Please enter your full name.")
      return
    }

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (isRegister && passwordStrength < 1) {
      setError("Use at least 6 characters for your password.")
      return
    }

    try {
      setIsSubmitting(true)
      const auth = isRegister
        ? await registerUser(name, email, password)
        : await loginUser(email, password)
      saveAuthSession(auth.token, auth.user)
      setSuccess(
        isRegister
          ? "Account created. Taking you back to Spendly."
          : "Logged in. Taking you back to Spendly.",
      )
      window.setTimeout(() => router.replace("/dashboard"), 650)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete the request")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      {isRegister && (
        <AuthField
          id="name"
          name="name"
          type="text"
          label="Full name"
          autoComplete="name"
          maxLength={64}
          required
          icon={<UserRound />}
          placeholder="Alex Morgan"
        />
      )}

      <AuthField
        id="email"
        name="email"
        type="email"
        label="Email address"
        inputMode="email"
        autoComplete="email"
        required
        icon={<Mail />}
        placeholder="name@company.com"
      />

      <AuthField
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        autoComplete={isRegister ? "new-password" : "current-password"}
        minLength={6}
        maxLength={128}
        required
        icon={<LockKeyhole />}
        placeholder="••••••••"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        action={
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        }
      />

      {isRegister && <PasswordStrength password={password} />}

      {isRegister && (
        <AuthField
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          label="Confirm password"
          autoComplete="new-password"
          minLength={6}
          maxLength={128}
          required
          icon={<LockKeyhole />}
          placeholder="••••••••"
        />
      )}

      {isRegister && (
        <div className="flex items-start gap-3">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 accent-zinc-950"
          />
          <label htmlFor="terms" className="text-sm leading-6 text-zinc-600">
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </label>
        </div>
      )}

      <AuthStatusMessage error={error} success={success} />

      <AuthSubmitButton isSubmitting={isSubmitting}>
        {isRegister ? "Create account" : "Log in"}
      </AuthSubmitButton>

      <p className="text-center text-sm leading-6 text-zinc-600">
        {isRegister ? "Already have an account?" : "New to Spendly?"}{" "}
        <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-zinc-950">
          {isRegister ? "Log in" : "Create account"}
        </Link>
      </p>
    </form>
  )
}
