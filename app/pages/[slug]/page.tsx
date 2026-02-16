"use client"

import { useEffect, useState } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import type { CustomPage } from "@/lib/types"

export default function CustomPageRoute() {
  const params = useParams()
  const slug = (params?.slug as string) || ""
  const [page, setPage] = useState<CustomPage | null | undefined>(undefined)
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
        if (cancelled) return
        if (found) {
          setPage(found)
          setStatus("found")
        } else {
          setStatus("notfound")
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
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
    "prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-16">
        <article className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {page.hero_title || page.title}
            </h1>
            {(page.hero_description ?? "") !== "" && (
              <p className="mt-4 text-lg text-gray-300">{page.hero_description}</p>
            )}
          </header>

          {hasStructured ? (
            <div className="space-y-12">
              {Array.isArray(page.services) && page.services.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-white mb-6">Services</h2>
                  <div className="space-y-8">
                    {page.services.map((svc, i) => (
                      <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">{svc.title || "Service"}</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                          {(svc.bullets ?? []).filter(Boolean).map((bullet, bi) => (
                            <li key={bi}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(page.pricing_text ?? "") !== "" && (
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Pricing</h2>
                  <div className={proseClass}>
                    <p className="text-gray-300 whitespace-pre-wrap">{page.pricing_text}</p>
                  </div>
                </section>
              )}

              {(page.advanced_features ?? "") !== "" && (
                <section>
                  <h2 className="text-2xl font-bold text-white mb-4">Advanced features</h2>
                  <div className={proseClass}>
                    <p className="text-gray-300 whitespace-pre-wrap">{page.advanced_features}</p>
                  </div>
                </section>
              )}

              {(page.cta_text ?? "") !== "" && (
                <section className="pt-4">
                  <p className="text-xl text-gray-200">{page.cta_text}</p>
                </section>
              )}
            </div>
          ) : (
            (page.content ?? "") !== "" && (
              <div
                className={proseClass + " prose-pre:bg-slate-800 prose-pre:border prose-pre:border-white/10 prose-blockquote:border-l-purple-500 prose-blockquote:text-gray-300 prose-code:text-purple-300 prose-code:bg-purple-900/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"}
                dangerouslySetInnerHTML={{
                  __html: (page.content ?? "").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ""),
                }}
              />
            )
          )}

          {page.showContactForm && (
            <section id="contact" className="mt-16 pt-12 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Contact me</h2>
              <p className="text-gray-300 mb-6">
                Have a project in mind or want to work together? Get in touch.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Go to contact form
              </Link>
            </section>
          )}
        </article>
      </div>
    </div>
  )
}
