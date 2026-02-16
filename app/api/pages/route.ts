import { NextRequest, NextResponse } from "next/server"
import type { CustomPage, ApiResponse } from "@/lib/types"
import { requireAuth } from "@/lib/middleware"

const KV_KEY = "portfolio:pages"

// Try to import Upstash Redis, but it's optional
let redis: any = null
try {
  const { Redis } = require("@upstash/redis")
  // Support both naming conventions (Vercel uses KV_REST_API_URL/TOKEN)
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

// Default pages data (empty array)
const defaultPages: CustomPage[] = []

export async function GET() {
  try {
    let pages: CustomPage[] = defaultPages

    // Try Upstash Redis first (for production)
    if (redis) {
      try {
        const redisData = (await redis.get(KV_KEY)) as CustomPage[] | null
        if (redisData && Array.isArray(redisData)) {
          pages = redisData
          console.log("✅ Loaded pages from Redis:", pages.length)
        } else {
          // Key missing or invalid: ensure key exists so POST can write later
          await redis.set(KV_KEY, defaultPages)
          pages = defaultPages
          console.log("⚠️ Redis pages key missing or invalid, initialized to []")
        }
      } catch (redisError) {
        console.error("❌ Redis error:", redisError)
      }
    }

    const response: ApiResponse<{ pages: CustomPage[] }> = {
      success: true,
      data: { pages },
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    })
  } catch (error) {
    console.error("Error reading pages:", error)
    const response: ApiResponse = {
      success: false,
      error: "Failed to read pages",
    }
    return NextResponse.json(response, { status: 500 })
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

    // Validate pages structure (lenient: allow optional fields to be missing)
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const id = page?.id ?? ""
      const title = page?.title ?? ""
      const slug = (page?.slug ?? "").trim().toLowerCase()
      const content = page?.content ?? ""
      if (!id || !title || !slug) {
        const response: ApiResponse = {
          success: false,
          error: `Invalid page at index ${i}: each page must have id, title, and slug.`,
        }
        return NextResponse.json(response, { status: 400 })
      }
      // Normalize so stored data is consistent
      pages[i] = {
        id,
        title,
        slug,
        content: typeof content === "string" ? content : "",
        published: Boolean(page?.published),
        createdAt: page?.createdAt ?? new Date().toISOString(),
        updatedAt: page?.updatedAt ?? new Date().toISOString(),
        metaDescription: page?.metaDescription,
        metaKeywords: page?.metaKeywords,
        showInNav: page?.showInNav,
        navLabel: page?.navLabel,
        showContactForm: page?.showContactForm,
      }
    }

    // Try Upstash Redis first (for production)
    if (redis) {
      try {
        await redis.set(KV_KEY, pages)
        console.log("✅ Saved pages to Redis:", pages.length)
      } catch (redisError) {
        console.error("❌ Redis error:", redisError)
        const response: ApiResponse = {
          success: false,
          error: "Failed to save pages to Redis",
        }
        return NextResponse.json(response, { status: 500 })
      }
    } else {
      const response: ApiResponse = {
        success: false,
        error: "Redis is not configured. Please set up Upstash Redis through Vercel Marketplace.",
      }
      return NextResponse.json(response, { status: 500 })
    }

    const response: ApiResponse = {
      success: true,
      message: "Pages saved successfully",
    }
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error saving pages:", error)
    const response: ApiResponse = {
      success: false,
      error: "Failed to save pages",
    }
    return NextResponse.json(response, { status: 500 })
  }
}
