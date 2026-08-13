import { PropertyBookingCard } from "./property-booking-card"

const properties = [
  {
    propertyName: "Automatic Categorization Engine",
    location: "AI & Rule-Based",
    duration: "Instant Parsing",
    availableDate: "7 Categories Built-in",
    image: "/images/property-beach-villa.webp",
    pricePerNight: 0,
    propertyType: "Core Engine",
    features: ["Food, Rent & Shopping", "Subscriptions & Travel", "Bills & Entertainment", "Zero Manual Tagging"],
    amenities: ["CSV Import", "Auto-tag", "Real-time"],
    rating: 4.9,
  },
  {
    propertyName: "Financial Health Score",
    location: "Personalized Score & Rating",
    duration: "Real-time Metrics",
    availableDate: "Monthly Health Reports",
    image: "/images/property-mountain-cabin.webp",
    pricePerNight: 0,
    propertyType: "Analytics & Guidance",
    features: ["Spending vs Income", "Savings Rate Metric", "Budget Adherence", "Actionable Guidance"],
    amenities: ["Health Score", "Personalized", "Reports"],
    rating: 4.9,
  },
  {
    propertyName: "Subscription Detector & Reminders",
    location: "Automated Detection",
    duration: "24/7 Monitoring",
    availableDate: "Bill Reminders Built-in",
    image: "/images/property-city-loft.webp",
    pricePerNight: 0,
    propertyType: "Smart Detector",
    features: ["Flag Unused Subs", "Forgotten Payments", "Upcoming Bill Alerts", "Recurring Tracker"],
    amenities: ["Sub Detector", "Bill Reminders", "Alerts"],
    rating: 4.8,
  },
  {
    propertyName: "AI Financial Assistant",
    location: "Natural Language Chat",
    duration: "Instant Answers",
    availableDate: "Always Available",
    image: "/images/property-tuscan-estate.webp",
    pricePerNight: 0,
    propertyType: "AI Assistant",
    features: ["Ask Natural Questions", "Spending Summaries", "Pattern Diagnostics", "Custom Recommendations"],
    amenities: ["AI Chat", "NLP Queries", "Insights"],
    rating: 4.9,
  },
  {
    propertyName: "Budget & Savings Goal Tracking",
    location: "Category & Target Budgets",
    duration: "Monthly Tracking",
    availableDate: "Progress Dashboard",
    image: "/images/property-tropical-bungalow.webp",
    pricePerNight: 0,
    propertyType: "Budget Management",
    features: ["Monthly Limits", "Savings Targets", "Visual Progress Bars", "Spike Detection"],
    amenities: ["Budgets", "Savings Goals", "Progress"],
    rating: 4.8,
  },
  {
    propertyName: "Savings Simulator & Benchmarking",
    location: "What-If Scenarios",
    duration: "Interactive Projections",
    availableDate: "Peer Comparison",
    image: "/images/property-lakefront-modern.webp",
    pricePerNight: 0,
    propertyType: "Advanced Analytics",
    features: ["What-If Scenarios", "Cut Expense Impact", "Peer Comparisons", "Anonymized Benchmarks"],
    amenities: ["Simulator", "Peer Benchmark", "Projections"],
    rating: 4.9,
  },
]

export function PricingSection() {
  const duplicatedProperties = [...properties, ...properties, ...properties]

  return (
    <section id="pricing" className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">Key Requirements & Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Explore the core requirements and advanced capabilities built into Smart Expense Analyzer.
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="flex w-max gap-6 animate-feature-marquee hover:[animation-play-state:paused]">
          {duplicatedProperties.map((property, index) => (
            <div key={`${property.propertyName}-${index}`} className="flex-shrink-0 w-[85vw] sm:w-[60vw] lg:w-[400px]">
              <PropertyBookingCard {...property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
