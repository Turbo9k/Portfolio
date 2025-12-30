/**
 * API route to initialize Upstash Redis with default data
 * 
 * This endpoint should be called ONCE after setting up Upstash Redis on Vercel.
 * It will populate Redis with data from the default JSON files.
 * 
 * Usage:
 * POST /api/init-redis
 * 
 * Note: This endpoint will only work if:
 * 1. Upstash Redis is configured (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set)
 * 2. Redis is empty (to prevent overwriting existing data)
 */

import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"
import { readFileSync } from "fs"
import { join } from "path"

const KV_CONTENT_KEY = "portfolio:content"
const KV_PROJECTS_KEY = "portfolio:projects"

async function initializeRedis() {
  // Check for environment variables
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return {
      success: false,
      error: "Upstash Redis is not configured. Please set up Upstash Redis through Vercel Marketplace first.",
      status: 400,
    }
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  // Check if data already exists
  const existingContent = await redis.get(KV_CONTENT_KEY)
  const existingProjects = await redis.get(KV_PROJECTS_KEY)

  if (existingContent || existingProjects) {
    return {
      success: false,
      error: "Redis already contains data. To prevent data loss, this endpoint will not overwrite existing data.",
      existingData: {
        content: !!existingContent,
        projects: !!existingProjects,
      },
      status: 409,
    }
  }

  // Load default data from JSON files
  const contentPath = join(process.cwd(), "data", "content.json")
  const projectsPath = join(process.cwd(), "data", "projects.json")

  const contentData = JSON.parse(readFileSync(contentPath, "utf-8"))
  const projectsData = JSON.parse(readFileSync(projectsPath, "utf-8"))

  // Initialize Redis with default data
  await redis.set(KV_CONTENT_KEY, contentData)
  await redis.set(KV_PROJECTS_KEY, projectsData.projects)

  return {
    success: true,
    message: "Successfully initialized Redis with default data!",
    data: {
      content: true,
      projects: true,
    },
    status: 200,
  }
}

export async function GET() {
  try {
    const result = await initializeRedis()
    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        error: result.error,
        existingData: result.existingData,
        data: result.data,
      },
      { status: result.status }
    )
  } catch (error: any) {
    console.error("Error initializing Redis:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to initialize Redis",
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const result = await initializeRedis()
    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        error: result.error,
        existingData: result.existingData,
        data: result.data,
      },
      { status: result.status }
    )
  } catch (error: any) {
    console.error("Error initializing Redis:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to initialize Redis",
      },
      { status: 500 }
    )
  }
}

