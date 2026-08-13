import { Check } from "lucide-react"
import { RealtimePropertyCard } from "./realtime-property-card"

const features = [
  "CSV & Bank Export Import",
  "Auto Categorization Engine",
  "Financial Health Score",
  "Budget & Goal Tracking",
  "Subscription Detector",
  "AI Financial Assistant",
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-center pointer-events-none z-0">
        <span className="font-bold text-center text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[14vw] leading-none tracking-tighter text-zinc-100 whitespace-nowrap">
          ANALYZE
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <RealtimePropertyCard />
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="animate-fade-up">
              <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">
                Smart Expense Analyzer & Financial Health
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Input or upload financial transactions, get spending automatically categorized and analyzed, and receive clear financial health insights with actionable guidance.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center p-3 rounded-xl hover:bg-zinc-50 transition-colors duration-300 gap-2 py-1"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
