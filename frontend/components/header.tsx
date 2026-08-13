"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Menu, X, ArrowUpRight, ArrowRight } from "lucide-react"

const navItems = [
  { label: "About", href: "/#how-it-works", targetId: "how-it-works" },
  { label: "Features", href: "/#features", targetId: "features" },
  { label: "Pricing", href: "/#pricing", targetId: "pricing" },
  { label: "Reviews", href: "/#testimonials", targetId: "testimonials" },
  { label: "FAQ", href: "/#faq", targetId: "faq" },
] as const

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const isScrolled = true

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    const element = document.getElementById(targetId)

    if (!element) {
      setIsOpen(false)
      return
    }

    e.preventDefault()
    const headerOffset = 100
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
    setIsOpen(false)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "px-3 pt-3 sm:px-4 sm:pt-4" : ""}`}>
      <div
        className={`mx-auto max-w-7xl transition-all duration-300 rounded-lg ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border border-zinc-200 px-4 py-3 sm:px-5 lg:px-6"
            : "bg-background/90 backdrop-blur-md px-4 py-5 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <svg
              className={`w-6 h-6 transition-colors duration-300 ${isScrolled ? "text-black" : "text-foreground"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span
              className={`text-lg font-medium tracking-tight transition-colors duration-300 ${isScrolled ? "text-black" : "text-foreground"}`}
            >
              Spendly
            </span>
          </Link>

          <nav className="hidden min-w-0 items-center gap-4 md:flex lg:gap-6" aria-label="Top navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) => handleSmoothScroll(event, item.targetId)}
                className={`whitespace-nowrap text-sm transition-colors ${
                  isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 md:flex lg:gap-4">
            <Link
              href="/login"
              className={`whitespace-nowrap text-sm transition-colors ${
                isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Log in
            </Link>
            <Link
              href="/register"
              className={`relative flex items-center gap-0 border rounded-full pl-5 pr-1 py-1 transition-all duration-300 group overflow-hidden ${
                isScrolled ? "border-zinc-300" : "border-border"
              }`}
            >
              <span
                className={`absolute inset-0 rounded-full scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300 ${
                  isScrolled ? "bg-black" : "bg-foreground"
                }`}
              />
              <span
                className={`text-sm pr-3 relative z-10 transition-colors duration-300 ${
                  isScrolled ? "text-black group-hover:text-white" : "text-foreground group-hover:text-background"
                }`}
              >
                Create account
              </span>
              <span className="w-8 h-8 rounded-full flex items-center justify-center relative z-10">
                <ArrowRight
                  className={`w-4 h-4 group-hover:opacity-0 absolute transition-opacity duration-300 ${
                    isScrolled ? "text-black" : "text-foreground"
                  }`}
                />
                <ArrowUpRight
                  className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                    isScrolled ? "text-black group-hover:text-white" : "text-foreground group-hover:text-background"
                  }`}
                />
              </span>
            </Link>
          </div>

          <button
            className={`md:hidden transition-colors duration-300 ${isScrolled ? "text-black" : "text-foreground"}`}
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <nav
            className={`mt-6 flex max-h-[calc(100svh-6rem)] flex-col gap-4 overflow-y-auto border-t pb-6 pt-6 md:hidden ${
              isScrolled ? "border-zinc-200" : "border-border"
            }`}
            aria-label="Mobile top navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) => handleSmoothScroll(event, item.targetId)}
                className={`transition-colors ${
                  isScrolled ? "text-zinc-600 hover:text-black" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            ))}
            <div
              className={`flex flex-col gap-3 mt-4 pt-4 border-t ${isScrolled ? "border-zinc-200" : "border-border"}`}
            >
              <Link href="/login" className={isScrolled ? "text-black" : "text-foreground"} onClick={() => setIsOpen(false)}>
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className={`relative flex items-center gap-0 border rounded-full pl-5 pr-1 py-1 w-fit transition-all duration-300 group overflow-hidden ${
                  isScrolled ? "border-zinc-300" : "border-border"
                }`}
              >
                <span
                  className={`absolute inset-0 rounded-full scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-300 ${
                    isScrolled ? "bg-black" : "bg-foreground"
                  }`}
                />
                <span
                  className={`text-sm pr-3 relative z-10 transition-colors duration-300 ${
                    isScrolled ? "text-black group-hover:text-white" : "text-foreground group-hover:text-background"
                  }`}
                >
                  Create account
                </span>
                <span className="w-8 h-8 rounded-full flex items-center justify-center relative z-10">
                  <ArrowRight
                    className={`w-4 h-4 group-hover:opacity-0 absolute transition-opacity duration-300 ${
                      isScrolled ? "text-black" : "text-foreground"
                    }`}
                  />
                  <ArrowUpRight
                    className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                      isScrolled ? "text-black group-hover:text-white" : "text-foreground group-hover:text-background"
                    }`}
                  />
                </span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
