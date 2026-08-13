"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { AnimatedText } from "./animated-text"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const frame = frameRef.current
    const brand = brandRef.current

    if (!frame || !brand) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    let rafId = 0
    let currentProgress = 0

    const easeOutQuad = (t: number) => t * (2 - t)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const updateStyles = () => {
      const scrollY = window.scrollY
      const maxScroll = 400
      const targetProgress = Math.min(scrollY / maxScroll, 1)

      const smoothUpdate = () => {
        currentProgress += (targetProgress - currentProgress) * 0.1

        if (Math.abs(targetProgress - currentProgress) > 0.001) {
          const scale = 1 - easeOutQuad(currentProgress) * 0.15
          const borderRadius = easeOutCubic(currentProgress) * 48
          const heightVh = 100 - easeOutQuad(currentProgress) * 37.5

          frame.style.transform = `scale(${scale})`
          frame.style.borderRadius = `${borderRadius}px`
          frame.style.height = `${heightVh}vh`
          brand.style.transform = `translateY(${currentProgress * 150}px)`
          brand.style.opacity = `${1 - currentProgress * 0.8}`

          rafId = requestAnimationFrame(smoothUpdate)
        } else {
          const scale = 1 - easeOutQuad(targetProgress) * 0.15
          const borderRadius = easeOutCubic(targetProgress) * 48
          const heightVh = 100 - easeOutQuad(targetProgress) * 37.5

          frame.style.transform = `scale(${scale})`
          frame.style.borderRadius = `${borderRadius}px`
          frame.style.height = `${heightVh}vh`
          brand.style.transform = `translateY(${targetProgress * 150}px)`
          brand.style.opacity = `${1 - targetProgress * 0.8}`
        }
      }

      cancelAnimationFrame(rafId)
      smoothUpdate()
    }

    updateStyles()
    window.addEventListener("scroll", updateStyles, { passive: true })
    return () => {
      window.removeEventListener("scroll", updateStyles)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section className="pt-32 pb-12 px-6 min-h-[100svh] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 top-0">
        <div
          ref={frameRef}
          className="w-full will-change-transform overflow-hidden"
          style={{
            height: "100vh",
          }}
        >
          <Image
            src="/images/7aecbceb-cbd3-4cbd-901c-dd0125d41525.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      <div
        ref={brandRef}
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none z-[5] flex items-end justify-center"
        style={{
          height: "100%",
        }}
      >
        <span
          className="block text-white font-bold text-[28vw] sm:text-[25vw] md:text-[22vw] lg:text-[20vw] tracking-tighter select-none text-center leading-none"
          style={{ marginBottom: "0" }}
        >
          SPENDLY
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-12">
          <div
            className={`transition-all duration-1000 delay-[800ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <h1 className="font-serif text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] 2xl:text-[8.5rem] font-normal leading-tight mb-6 w-full px-4 max-w-6xl mx-auto text-balance">
              <AnimatedText text="Smart Expense Analyzer & Financial Health Dashboard" delay={0.3} />
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-8">
          <div className="relative">
            <div
              className={`relative w-[234px] md:w-[281px] lg:w-[351px] will-change-transform transition-all duration-[1500ms] ease-out delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[400px]"
              }`}
            >
              <Image
                src="/images/iphone-frame.webp"
                alt="Smart Expense Analyzer application"
                width={609}
                height={1243}
                priority
                sizes="(min-width: 1024px) 351px, (min-width: 768px) 281px, 234px"
                className="w-full h-auto relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
