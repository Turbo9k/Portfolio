"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import {
  Wrench,
  Zap,
  Shield,
  Settings,
  Code2,
  Layers,
  CheckCircle2,
  MessageSquare,
} from "lucide-react"
import type { CustomPage } from "@/lib/types"
import { SiteNav } from "@/components/site-nav"

const SERVICE_ICONS = [Wrench, Zap, Shield, Settings, Code2, Layers]

export default function CustomPageRoute() {
  const params = useParams()
  const slug = (params?.slug as string) || ""
  const [page, setPage] = useState<CustomPage | null | undefined>(undefined)
  const [navLinks, setNavLinks] = useState<{ href: string; label: string }[]>([])
  const [status, setStatus] = useState<"loading" | "found" | "notfound">("loading")

  useEffect(() => {
    if (!slug) {
      setStatus("notfound")
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/pages", { cache: "no-store" })
        if (!res.ok) {
          if (!cancelled) setStatus("notfound")
          return
        }
        const data = await res.json()
        const pages: CustomPage[] = data.data?.pages ?? data.pages ?? []
        const normalizedSlug = slug.trim().toLowerCase()
        const found = pages.find(
          (p) =>
            (p.slug || "").trim().toLowerCase() === normalizedSlug && p.published
        )
        const links = pages
          .filter((p) => p.published && p.showInNav)
          .map((p) => ({
            href: `/pages/${p.slug}`,
            label: (p.navLabel || p.title || p.slug) || "Page",
          }))
        if (!cancelled) {
          setNavLinks(links)
          if (found) setPage(found)
          setStatus(found ? "found" : "notfound")
        }
      } catch {
        if (!cancelled) setStatus("notfound")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/80 to-slate-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (status === "notfound" || !page) {
    notFound()
  }

  const hasStructured =
    (page.hero_title ?? "") !== "" ||
    (page.hero_description ?? "") !== "" ||
    (Array.isArray(page.services) && page.services.length > 0) ||
    (page.pricing_text ?? "") !== "" ||
    (page.advanced_features ?? "") !== "" ||
    (page.cta_text ?? "") !== ""

  const proseClass =
    "prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/80 to-slate-900 text-white">
      <SiteNav extraLinks={navLinks} />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              {page.hero_title || page.title}
            </h1>
            {(page.hero_description ?? "") !== "" && (
              <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {page.hero_description}
              </p>
            )}
          </div>
        </section>

        {hasStructured ? (
          <div className="space-y-24 pb-24">
            {/* Services – card grid */}
            {Array.isArray(page.services) && page.services.length > 0 && (
              <section className="max-w-6xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl font-bold text-white text-center mb-4">
                  Services
                </h2>
                <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
                  What we offer
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {page.services.map((svc, i) => {
                    const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length]
                    return (
                      <div
                        key={i}
                        className="group rounded-2xl bg-white/5 border border-white/10 p-6 shadow-lg transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 transition-colors group-hover:from-blue-500/30 group-hover:to-purple-500/30">
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">
                            {svc.title || "Service"}
                          </h3>
                        </div>
                        <ul className="space-y-2">
                          {(svc.bullets ?? []).filter(Boolean).map((bullet, bi) => (
                            <li
                              key={bi}
                              className="flex items-start gap-2 text-gray-300 text-sm leading-relaxed"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Pricing – highlighted centered card */}
            {(page.pricing_text ?? "") !== "" && (
              <section className="max-w-4xl mx-auto px-4 sm:px-6">
                <h2 className="text-3xl font-bold text-white text-center mb-4">
                  Pricing
                </h2>
                <p className="text-gray-400 text-center max-w-xl mx-auto mb-10">
                  Transparent, flexible options
                </p>
                <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-slate-800/80 border border-white/20 p-8 sm:p-10 shadow-2xl text-center transition-shadow hover:shadow-blue-500/10">
                  <div className={proseClass}>
                    <p className="text-gray-200 whitespace-pre-wrap text-left max-w-2xl mx-auto">
                      {page.pricing_text}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Advanced features – contrast section */}
            {(page.advanced_features ?? "") !== "" && (
              <section className="bg-white/5 border-y border-white/10 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                  <h2 className="text-3xl font-bold text-white text-center mb-4">
                    Advanced features
                  </h2>
                  <p className="text-gray-400 text-center max-w-xl mx-auto mb-10">
                    The details that matter
                  </p>
                  <div className={proseClass}>
                    <p className="text-gray-300 whitespace-pre-wrap text-center sm:text-left">
                      {page.advanced_features}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* CTA – distinct section with strong button */}
            {(page.cta_text ?? "") !== "" && (
              <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                <p className="text-2xl sm:text-3xl font-semibold text-white mb-8">
                  {page.cta_text}
                </p>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 active:scale-100"
                >
                  <MessageSquare className="w-5 h-5" />
                  Get in touch
                </Link>
              </section>
            )}
          </div>
        ) : (
          (page.content ?? "") !== "" && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
              <div
                className={
                  proseClass +
                  " prose-pre:bg-slate-800 prose-pre:border prose-pre:border-white/10 prose-blockquote:border-l-purple-500 prose-blockquote:text-gray-300 prose-code:text-purple-300 prose-code:bg-purple-900/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                }
                dangerouslySetInnerHTML={{
                  __html: (page.content ?? "").replace(
                    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                    ""
                  ),
                }}
              />
            </div>
          )
        )}

        {/* Contact section */}
        {page.showContactForm && (
          <section
            id="contact"
            className="border-t border-white/10 bg-white/5 py-20"
          >
            <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Contact me
              </h2>
              <p className="text-gray-300 mb-8">
                Have a project in mind or want to work together? Get in touch.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 active:scale-100"
              >
                Go to contact form
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
