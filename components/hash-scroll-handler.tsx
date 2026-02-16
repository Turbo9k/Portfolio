"use client"

import { useHashScroll } from "@/hooks/useHashScroll"

/**
 * Renders nothing; runs useHashScroll so anchor navigation works globally.
 * Place once in the root layout so #contact (and other hash links) scroll
 * into view after client-side navigation from any route.
 */
export function HashScrollHandler() {
  useHashScroll()
  return null
}
