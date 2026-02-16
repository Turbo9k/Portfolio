import { NextRequest, NextResponse } from "next/server"
import type { CustomPage, ApiResponse, PageService } from "@/lib/types"
import { requireAuth } from "@/lib/middleware"

// Use same Redis key as content so pages persist (portfolio:content already works)
const KV_CONTENT_KEY = "portfolio:content"

let redis: any = null
try {
  const { Redis } = require("@upstash/redis")
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (redisUrl && redisToken) {
    redis = new Redis({ url: redisUrl, token: redisToken })
  }
} catch {
  // Redis not available
}

export async function GET() {
  try {
    let pages: CustomPage[] = []

    if (redis) {
      try {
        const content = (await redis.get(KV_CONTENT_KEY)) as { pages?: CustomPage[] } | null
        if (content && typeof content === "object" && Array.isArray(content.pages)) {
          pages = content.pages
        }
        console.log("✅ Loaded pages from Redis (content.pages):", pages.length)
      } catch (redisError) {
        console.error("❌ Redis error:", redisError)
      }
    }

    return NextResponse.json(
      { success: true, data: { pages } },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    )
  } catch (error) {
    console.error("Error reading pages:", error)
    return NextResponse.json({ success: false, error: "Failed to read pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication for write operations
    const auth = await requireAuth(request)
    if (!auth.authenticated) {
      return auth.response!
    }
    
    const body = await request.json()
    const { pages } = body

    if (!Array.isArray(pages)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid pages data",
      }
      return NextResponse.json(response, { status: 400 })
    }

    function normalizeService(s: unknown): PageService {
      if (s && typeof s === "object" && "title" in s) {
        const bullets = Array.isArray((s as PageService).bullets)
          ? (s as PageService).bullets.filter((b) => typeof b === "string")
          : []
        return { title: String((s as PageService).title ?? ""), bullets }
      }
      return { title: "", bullets: [] }
    }

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const id = page?.id ?? ""
      const title = page?.title ?? ""
      const slug = (page?.slug ?? "").trim().toLowerCase()
      if (!id || !title || !slug) {
        return NextResponse.json(
          { success: false, error: `Invalid page at index ${i}: each page must have id, title, and slug.` },
          { status: 400 }
        )
      }
      const rawServices = page?.services
      const services = Array.isArray(rawServices)
        ? rawServices.map(normalizeService)
        : []

      pages[i] = {
        id,
        title,
        slug,
        content: typeof page?.content === "string" ? page.content : undefined,
        published: Boolean(page?.published),
        createdAt: page?.createdAt ?? new Date().toISOString(),
        updatedAt: page?.updatedAt ?? new Date().toISOString(),
        metaDescription: page?.metaDescription,
        metaKeywords: page?.metaKeywords,
        showInNav: page?.showInNav,
        navLabel: page?.navLabel,
        showContactForm: page?.showContactForm,
        hero_title: typeof page?.hero_title === "string" ? page.hero_title : "",
        hero_description: typeof page?.hero_description === "string" ? page.hero_description : "",
        services,
        pricing_text: typeof page?.pricing_text === "string" ? page.pricing_text : "",
        advanced_features: typeof page?.advanced_features === "string" ? page.advanced_features : "",
        cta_text: typeof page?.cta_text === "string" ? page.cta_text : "",
      }
    }

    if (!redis) {
      return NextResponse.json(
        { success: false, error: "Redis is not configured." },
        { status: 500 }
      )
    }

    try {
      const content = (await redis.get(KV_CONTENT_KEY)) as Record<string, unknown> | null
      const next = content && typeof content === "object" ? { ...content } : {}
      next.pages = pages
      await redis.set(KV_CONTENT_KEY, next)
      console.log("✅ Saved pages to Redis (content.pages):", pages.length)
    } catch (redisError) {
      console.error("❌ Redis error:", redisError)
      return NextResponse.json(
        { success: false, error: "Failed to save pages to Redis" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: "Pages saved successfully" })
  } catch (error) {
    console.error("Error saving pages:", error)
    const response: ApiResponse = {
      success: false,
      error: "Failed to save pages",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
