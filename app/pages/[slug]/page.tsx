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

  const safeContent = page.content.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-16">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {page.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <time dateTime={page.updatedAt}>
                Last updated: {new Date(page.updatedAt).toLocaleDateString()}
              </time>
            </div>
          </header>

          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white
              prose-p:text-gray-300
              prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-code:text-purple-300 prose-code:bg-purple-900/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-slate-800 prose-pre:border prose-pre:border-white/10
              prose-blockquote:border-l-purple-500 prose-blockquote:text-gray-300
              prose-ul:text-gray-300 prose-ol:text-gray-300
              prose-li:text-gray-300"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />

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
