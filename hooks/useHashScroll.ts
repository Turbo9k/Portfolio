"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const SCROLL_DELAY_MS = 150
const MAX_RETRIES = 8
const RETRY_INTERVAL_MS = 80

/**
 * Scrolls the element matching the current hash into view after route transition.
 * Handles client-side navigation (App Router): when pathname or hash changes,
 * waits for the DOM to be ready then smooth-scrolls to the target element.
 * Prevents double-scroll by tracking the last scrolled hash.
 */
export function useHashScroll() {
  const pathname = usePathname()
  const lastScrolledRef = useRef<string | null>(null)

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : ""
    if (!hash || hash.length < 2) {
      lastScrolledRef.current = null
      return
    }

    const id = hash.slice(1)
    const scrollKey = `${pathname ?? ""}${hash}`

    function tryScroll(retries = 0) {
      const el = document.getElementById(id)
      if (el) {
        const alreadyScrolled = lastScrolledRef.current === scrollKey
        if (!alreadyScrolled) {
          lastScrolledRef.current = scrollKey
          el.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
        return
      }
      if (retries < MAX_RETRIES) {
        setTimeout(() => tryScroll(retries + 1), RETRY_INTERVAL_MS)
      }
    }

    const t = setTimeout(() => tryScroll(), SCROLL_DELAY_MS)
    return () => clearTimeout(t)
  }, [pathname])

  // Also run when hash changes without pathname change (e.g. in-page link)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (!hash || hash.length < 2) return
      const id = hash.slice(1)
      const scrollKey = `${pathname ?? ""}${hash}`
      const el = document.getElementById(id)
      if (el) {
        lastScrolledRef.current = scrollKey
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [pathname])
}
