"use client"

import Link from "next/link"

export interface CallToActionProps {
  title: string
  description?: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  /** When true, uses dark background; when false, uses lighter contrast section */
  darkMode?: boolean
}

export function CallToAction({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  darkMode = true,
}: CallToActionProps) {
  return (
    <section
      className={
        darkMode
          ? "py-20 bg-white/5 border-y border-white/10"
          : "py-20 bg-white/10 border-y border-white/10"
      }
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
          {title}
        </h2>
        {description ? (
          <p className="text-gray-300 mb-8 text-lg">{description}</p>
        ) : null}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={primaryButtonLink}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 active:scale-100 w-full sm:w-auto"
          >
            {primaryButtonText}
          </Link>
          {secondaryButtonText && secondaryButtonLink ? (
            <Link
              href={secondaryButtonLink}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-gray-200 font-medium transition-all duration-200 hover:bg-white/10 w-full sm:w-auto"
            >
              {secondaryButtonText}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
