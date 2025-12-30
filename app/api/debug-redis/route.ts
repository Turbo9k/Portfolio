/**
 * Debug endpoint to check Redis connection and data
 * GET /api/debug-redis
 */

import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const KV_CONTENT_KEY = "portfolio:content"
const KV_PROJECTS_KEY = "portfolio:projects"

export async function GET() {
  try {
    // Support both naming conventions
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

    if (!redisUrl || !redisToken) {
      return NextResponse.json({
        success: false,
        error: "Redis environment variables not found",
        envVars: {
          UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
          UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
          KV_REST_API_URL: !!process.env.KV_REST_API_URL,
          KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
        },
      })
    }

    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    })

    // Check if keys exist
    const contentExists = await redis.exists(KV_CONTENT_KEY)
    const projectsExists = await redis.exists(KV_PROJECTS_KEY)

    // Try to get data
    const contentData = await redis.get(KV_CONTENT_KEY)
    const projectsData = await redis.get(KV_PROJECTS_KEY)

    return NextResponse.json({
      success: true,
      redis: {
        url: redisUrl.substring(0, 30) + "...", // Partial URL for security
        connected: true,
      },
      keys: {
        content: {
          exists: contentExists === 1,
          hasData: !!contentData,
          type: contentData ? typeof contentData : null,
        },
        projects: {
          exists: projectsExists === 1,
          hasData: !!projectsData,
          type: projectsData ? typeof projectsData : null,
          isArray: Array.isArray(projectsData),
          length: Array.isArray(projectsData) ? projectsData.length : null,
        },
      },
      message: contentExists === 1 && projectsExists === 1
        ? "Redis is initialized with data"
        : "Redis keys not found - run /api/init-redis first",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to connect to Redis",
      },
      { status: 500 }
    )
  }
}

