import Image from "next/image"
import { CheckCircle2 } from "lucide-react"

const benefits = [
  "Auto-categorize spending",
  "Track financial health",
  "Detect subscriptions",
  "AI finance insights",
] as const

export function AuthVisual() {
  return (
    <aside className="relative hidden min-h-[100svh] items-center justify-center overflow-hidden bg-zinc-200 px-12 py-16 lg:flex">
      <Image
        src="/images/7aecbceb-cbd3-4cbd-901c-dd0125d41525.webp"
        alt=""
        fill
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#fdf8f8]/95 via-[#fdf8f8]/55 to-transparent" />

      <div className="relative w-full max-w-[420px] rounded-lg border border-white/50 bg-white/75 p-10 shadow-[0_24px_80px_rgb(0_0_0/0.14)] backdrop-blur-xl">
        <h2 className="font-serif text-3xl font-medium leading-tight">Intelligent wealth management</h2>
        <ul className="mt-10 grid gap-5">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-4 text-base leading-7 text-zinc-800">
              <CheckCircle2 className="mt-0.5 h-6 w-6 flex-none text-emerald-700" aria-hidden="true" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
