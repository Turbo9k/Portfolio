import Head from "next/head"
import { APP_CONFIG } from "@/lib/constants"

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article"
}

export function SEOHead({
  title,
  description = APP_CONFIG.description,
  image = "/images/ian-portrait.jpg",
  url = APP_CONFIG.url,
  type = "website",
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${APP_CONFIG.name}` : APP_CONFIG.name

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={APP_CONFIG.name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="author" content={APP_CONFIG.author.name} />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#3b82f6" />
    </Head>
  )
}
