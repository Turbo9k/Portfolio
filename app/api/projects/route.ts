import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Project, ApiResponse } from "@/lib/types"
import { requireAuth } from "@/lib/middleware"

const projectsFilePath = path.join(process.cwd(), "data", "projects.json")
const KV_KEY = "portfolio:projects"

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
  // Redis not available, will use file system
}

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(projectsFilePath)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Default projects data
const defaultProjects: Project[] = [
  {
    id: "dynamic-dashboard",
    title: "Dynamic Dashboard",
    description:
      "Real-time data visualization with animated charts, interactive elements, and drag-and-drop functionality. Features live notifications and responsive design.",
    image: "⚡",
    tech: ["JavaScript", "D3.js", "CSS3", "HTML5"],
    liveUrl: "/dashboard",
    githubUrl: "#",
    featured: true,
    color: "from-blue-500 to-purple-600",
    status: "Live",
  },
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description:
      "Modern e-commerce solution with product management, payment integration, and real-time inventory tracking.",
    image: "🛒",
    tech: ["React", "Node.js", "PostgreSQL", "Stripe API"],
    liveUrl: "https://ecommerce-store-mu-five.vercel.app/",
    githubUrl: "https://github.com/Turbo9k/Ecommerce",
    featured: true,
    color: "from-pink-500 to-rose-600",
    status: "Live",
  },
  {
    id: "advanced-calculator",
    title: "Advanced Calculator",
    description:
      "Sophisticated calculator with scientific functions, history tracking, memory operations, and modern UI design.",
    image: "🧮",
    tech: ["JavaScript", "Python", "CSS3", "LocalStorage"],
    liveUrl: "/calculator",
    githubUrl: "https://github.com/Turbo9k/Calculator",
    featured: true,
    color: "from-orange-500 to-red-600",
    status: "Live",
  },
]

export async function GET() {
  try {
    let projects: Project[] = defaultProjects

    // Try Upstash Redis first (for production)
    if (redis) {
      try {
        const redisData = await redis.get(KV_KEY) as Project[] | null
        if (redisData && Array.isArray(redisData)) {
          projects = redisData
          console.log("✅ Loaded projects from Redis:", projects.length)
        } else {
          console.log("⚠️ Redis returned null/empty, using defaults")
        }
      } catch (redisError) {
        console.error("❌ Redis error:", redisError)
      // KV not available, try file system (for local development)
      console.log("KV not available, trying file system...")
      try {
        await ensureDataDirectory()
        const fileContents = await fs.readFile(projectsFilePath, "utf8")
        const data = JSON.parse(fileContents)
        projects = data.projects || defaultProjects
      } catch (fileError) {
        // File doesn't exist, use default projects
        console.log("File doesn't exist, using defaults")
        projects = defaultProjects
      }
      }
    } else {
      // KV not available, try file system (for local development)
      try {
        await ensureDataDirectory()
        const fileContents = await fs.readFile(projectsFilePath, "utf8")
        const data = JSON.parse(fileContents)
        projects = data.projects || defaultProjects
      } catch (fileError) {
        // File doesn't exist, use default projects
        console.log("File doesn't exist, using defaults")
        projects = defaultProjects
      }
    }

    const response: ApiResponse<{ projects: Project[] }> = {
      success: true,
      data: { projects },
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    })
  } catch (error) {
    console.error("Error reading projects:", error)

    const response: ApiResponse = {
      success: false,
      error: "Failed to load projects",
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
    const { projects } = body

    if (!Array.isArray(projects)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid projects data",
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Try Upstash Redis first (for production)
    if (redis) {
      try {
        await redis.set(KV_KEY, projects)
        // Also try to sync to file system for backup (if possible)
        try {
          await ensureDataDirectory()
          await fs.writeFile(projectsFilePath, JSON.stringify({ projects }, null, 2), "utf8")
        } catch (fileError) {
          // File write failed, but Redis succeeded, so that's okay
          console.log("File write failed, but Redis save succeeded")
        }
      } catch (redisError) {
      // KV not available, try file system (for local development)
      console.log("KV not available, trying file system...")
      try {
        await ensureDataDirectory()
        await fs.writeFile(projectsFilePath, JSON.stringify({ projects }, null, 2), "utf8")
      } catch (writeError: any) {
        console.error("Error writing projects:", writeError)
        // Check if it's a filesystem permission issue
        if (writeError.code === "EACCES" || writeError.code === "EROFS") {
          return NextResponse.json({
            success: false,
            error: "File system is read-only. Please set up Upstash Redis through Vercel Marketplace for production use.",
          }, { status: 500 })
        }
        throw writeError
      }
      }
    } else {
      // KV not available, try file system (for local development)
      try {
        await ensureDataDirectory()
        await fs.writeFile(projectsFilePath, JSON.stringify({ projects }, null, 2), "utf8")
      } catch (writeError: any) {
        console.error("Error writing projects:", writeError)
        // Check if it's a filesystem permission issue
        if (writeError.code === "EACCES" || writeError.code === "EROFS") {
          return NextResponse.json({
            success: false,
            error: "File system is read-only. Please set up Upstash Redis through Vercel Marketplace for production use.",
          }, { status: 500 })
        }
        throw writeError
      }
    }

    const response: ApiResponse = {
      success: true,
      message: "Projects saved successfully",
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Error saving projects:", error)

    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to save projects",
    }

    return NextResponse.json(response, { status: 500 })
  }
}
