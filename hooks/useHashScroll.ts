"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const INITIAL_DELAY_MS = 350
const MAX_RETRIES = 20
const RETRY_INTERVAL_MS = 100

/**
 * Scrolls the element matching the current hash into view after route transition
 * or on first load. Handles client-side navigation (App Router) and hydration:
 * waits for the DOM (and any gated sections like #contact) to be mounted,
 * then smooth-scrolls. Prevents double-scroll by tracking the last scrolled key.
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
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    function doScroll(el: HTMLElement) {
      const alreadyScrolled = lastScrolledRef.current === scrollKey
      if (!alreadyScrolled) {
        lastScrolledRef.current = scrollKey
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }

    function tryScroll(retries = 0) {
      const el = document.getElementById(id)
      if (el) {
        doScroll(el)
        return
      }
      if (retries < MAX_RETRIES) {
        timeoutId = setTimeout(() => tryScroll(retries + 1), RETRY_INTERVAL_MS)
      }
    }

    timeoutId = setTimeout(() => {
      requestAnimationFrame(() => tryScroll())
    }, INITIAL_DELAY_MS)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [pathname])

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
