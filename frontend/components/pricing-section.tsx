"use client"

import { useRef, useEffect, useState } from "react"
import { PropertyBookingCard } from "./property-booking-card"

const properties = [
  {
    propertyName: "Automatic Categorization Engine",
    location: "AI & Rule-Based",
    duration: "Instant Parsing",
    availableDate: "7 Categories Built-in",
    image: "/images/property-beach-villa.jpg",
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
    image: "/images/property-mountain-cabin.jpg",
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
    image: "/images/property-city-loft.jpg",
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
    image: "/images/property-tuscan-estate.jpg",
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
    image: "/images/property-tropical-bungalow.jpg",
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
    image: "/images/property-lakefront-modern.jpg",
    pricePerNight: 0,
    propertyType: "Advanced Analytics",
    features: ["What-If Scenarios", "Cut Expense Impact", "Peer Comparisons", "Anonymized Benchmarks"],
    amenities: ["Simulator", "Peer Benchmark", "Projections"],
    rating: 4.9,
  },
]

export function PricingSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const positionRef = useRef(0)
  const animationRef = useRef<number | undefined>(undefined)

  const duplicatedProperties = [...properties, ...properties, ...properties]

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const speed = isHovered ? 0.3 : 1 // Slow down on hover instead of changing animation duration
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      positionRef.current += speed * (deltaTime / 16)

      const totalWidth = scrollContainer.scrollWidth / 3

      if (positionRef.current >= totalWidth) {
        positionRef.current = 0
      }

      scrollContainer.style.transform = `translateX(-${positionRef.current}px)`
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered])

  return (
    <section id="pricing" className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-normal mb-6 text-balance font-serif">Key Requirements & Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Explore the core requirements and advanced capabilities built into Smart Expense Analyzer.
        </p>
      </div>

      <div className="relative w-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div ref={scrollRef} className="flex gap-6" style={{ width: "fit-content" }}>
          {duplicatedProperties.map((property, index) => (
            <div key={index} className="flex-shrink-0 w-[85vw] sm:w-[60vw] lg:w-[400px]">
              <PropertyBookingCard {...property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
