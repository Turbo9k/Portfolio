import { notFound } from "next/navigation"
import type { CustomPage } from "@/lib/types"

const KV_KEY = "portfolio:pages"

// Try to import Upstash Redis
let redis: any = null
try {
  const { Redis } = require("@upstash/redis")
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (redisUrl && redisToken) {
    redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })
  }
} catch {
  // Redis not available
}

async function getPage(slug: string): Promise<CustomPage | null> {
  try {
    let pages: CustomPage[] = []
    
    if (redis) {
      const redisData = await redis.get(KV_KEY) as CustomPage[] | null
      if (redisData && Array.isArray(redisData)) {
        pages = redisData
      }
    } else {
      // Fallback to API if Redis not available
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      
      const response = await fetch(`${baseUrl}/api/pages`, {
        cache: "no-store",
      })
      
      if (response.ok) {
        const data = await response.json()
        pages = data.data?.pages || data.pages || []
      }
    }
    
    return pages.find((p) => p.slug === slug && p.published) || null
  } catch (error) {
    console.error("Error fetching page:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug)
  
  if (!page) {
    return {
      title: "Page Not Found",
    }
  }
  
  return {
    title: page.title,
    description: page.metaDescription || page.content.substring(0, 160),
    keywords: page.metaKeywords?.split(",").map((k) => k.trim()),
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug)
  
  if (!page) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-16">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{page.title}</h1>
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
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </article>
      </div>
    </div>
  )
}
