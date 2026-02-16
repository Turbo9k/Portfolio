"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import dynamic from "next/dynamic"

const MobileNav = dynamic<{ extraLinks?: { href: string; label: string }[] }>(
  () => import("@/components/mobile-nav").then((m) => m.MobileNav),
  { ssr: false }
)

interface SiteNavProps {
  /** Custom pages to show in nav (from API, published + showInNav) */
  extraLinks?: { href: string; label: string }[]
}

export function SiteNav({ extraLinks = [] }: SiteNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center w-full">
        <Link href="/" className="block">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25 hover:opacity-90 transition-opacity">
            <span className="text-xl font-bold text-white tracking-wider">IS</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/#about"
            className="text-white/90 hover:text-white transition-colors"
            prefetch={false}
          >
            About
          </Link>
          <Link
            href="/projects"
            className="text-white/90 hover:text-white transition-colors"
            prefetch={false}
          >
            Projects
          </Link>
          {extraLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/90 hover:text-white transition-colors"
              prefetch={false}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="text-white/90 hover:text-white transition-colors"
            prefetch={false}
          >
            Contact
          </Link>
          <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20" asChild>
            <Link href="/resume" prefetch={false}>
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Link>
          </Button>
        </div>

        <MobileNav extraLinks={extraLinks} />
      </div>
    </nav>
  )
}
