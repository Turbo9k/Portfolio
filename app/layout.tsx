import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ian Siats - Web Developer Portfolio",
  description:
    "Web Developer crafting exceptional digital experiences with cutting-edge web technologies. Based in Colorado, USA.",
  keywords: [
    "web developer",
    "frontend developer",
    "react developer",
    "portfolio",
    "colorado developer",
    "javascript",
    "python",
    "next.js",
  ],
  authors: [{ name: "Ian Siats" }],
  creator: "Ian Siats",
  publisher: "Ian Siats",
  robots: "index, follow",
  openGraph: {
    title: "Ian Siats - Web Developer Portfolio",
    description: "Web Developer crafting exceptional digital experiences with cutting-edge web technologies.",
    type: "website",
    locale: "en_US",
    url: "https://iansiats.vercel.app",
    siteName: "Ian Siats - Web Developer Portfolio",
    images: [
      {
        url: "/images/ian-portrait.jpg",
        width: 1200,
        height: 630,
        alt: "Ian Siats - Web Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ian Siats - Web Developer Portfolio",
    description: "Web Developer crafting exceptional digital experiences with cutting-edge web technologies.",
    images: ["/images/ian-portrait.jpg"],
  },
    generator: 'v0.dev'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/images/ian-portrait.jpg" imageSrcSet="/images/ian-portrait.jpg 1x" />
      </head>
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>
          <div id="root">{children}</div>
        </Suspense>
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        <Analytics />
      </body>
    </html>
  )
}
