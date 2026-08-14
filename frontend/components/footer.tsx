import Link from "next/link"
import { Twitter, Linkedin, Instagram, Facebook } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Transactions", href: "/dashboard/import-transactions" },
    { label: "Categorization", href: "/#features" },
    { label: "Health Score", href: "/dashboard" },
    { label: "AI Assistant", href: "/dashboard" },
  ],
  company: [
    { label: "About", href: "/#features" },
    { label: "Careers", href: "/#contact" },
    { label: "Press", href: "/#contact" },
    { label: "Blog", href: "/#stats-section" },
  ],
  legal: [
    { label: "Terms", href: "/register" },
    { label: "Privacy", href: "/register" },
    { label: "Cookies", href: "/register" },
    { label: "Security", href: "/dashboard/settings" },
  ],
  support: [
    { label: "Help Center", href: "/#contact" },
    { label: "Contact", href: "/#contact" },
    { label: "FAQ", href: "/#faq" },
    { label: "Documentation", href: "/dashboard/import-transactions" },
  ],
}

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-base font-medium text-foreground">Spendly</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">Smart Expense Analyzer & Financial Health Dashboard.</p>
            <div className="flex gap-4">
              <span
                className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </span>
              <span
                className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </span>
              <span
                className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </span>
              <span
                className="w-9 h-9 border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Smart Expense Analyzer. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">FinTech & Personal Finance System</p>
        </div>
      </div>
    </footer>
  )
}
