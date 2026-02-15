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
        const redisData = await redis.get(KV_KEY) as CustomPage[] | null
        if (redisData && Array.isArray(redisData)) {
          pages = redisData
          console.log("✅ Loaded pages from Redis:", pages.length)
        } else {
          console.log("⚠️ Redis returned null/empty, using defaults")
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

    // Validate pages structure
    for (const page of pages) {
      if (!page.id || !page.title || !page.slug || !page.content) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid page structure. Each page must have id, title, slug, and content.",
        }
        return NextResponse.json(response, { status: 400 })
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
