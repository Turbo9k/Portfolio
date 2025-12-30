import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { ApiResponse } from "@/lib/types"

const contentFilePath = path.join(process.cwd(), "data", "content.json")
const KV_CONTENT_KEY = "portfolio:content"

// Try to import Upstash Redis, but it's optional
let redis: any = null
try {
  const { Redis } = require("@upstash/redis")
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch {
  // Redis not available, will use file system
}

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(contentFilePath)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Default content data
const defaultContent = {
  hero: {
    name: "Ian Siats",
    greeting: "Hi, I'm",
    title: "Creative developer crafting exceptional digital experiences with cutting-edge web technologies. I transform ideas into interactive, performant applications that users love.",
    subtitle: "I build full-stack applications using modern JavaScript frameworks. My recent work includes interactive UIs, backend APIs, and deploying full-stack projects using Vercel and MongoDB.",
    availability: "Open to relocation and remote opportunities worldwide.",
    primaryButton: "Get In Touch",
    secondaryButton: "View Projects",
  },
  about: {
    title: "About Me",
    subtitle: "Passionate about creating digital experiences that not only function flawlessly but also captivate and inspire users through innovative design and interaction.",
    journeyTitle: "My Journey",
    journeyParagraph1: "Based in the beautiful state of Colorado, I'm a passionate developer who believes in creating digital experiences that not only function flawlessly but also captivate and inspire.",
    journeyParagraph2: "My journey in development is driven by curiosity and a love for interactive design. I specialize in crafting websites and applications that respond to user interaction in meaningful ways, creating memorable experiences that leave lasting impressions.",
    skills: {
      frontend: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Responsive Design"],
      backend: ["Node.js", "Express.js", "Python", "REST APIs", "JWT Auth"],
      database: ["PostgreSQL", "MongoDB", "MySQL"],
      other: ["Git", "GitHub", "Vercel", "Docker", "Figma", "VS Code"],
    },
  },
  resume: {
    name: "IAN SIATS",
    title: "Full-Stack Web Developer",
    email: "iansiats9@gmail.com",
    location: "Colorado, USA",
    github: "github.com/Turbo9k",
    website: "iansiats.vercel.app",
    professionalSummary: "Self-taught Full-Stack Web Developer seeking an entry-level position to launch my professional career. Through intensive self-directed learning, I have developed strong proficiency in modern web development technologies including React, Next.js, TypeScript, and full-stack JavaScript development. My portfolio demonstrates hands-on experience building production-ready applications with complex features such as payment processing, authentication systems, and responsive user interfaces. Highly motivated, detail-oriented, and committed to writing clean, maintainable code that follows industry best practices.",
    technicalSkills: {
      frontend: "React • Next.js • TypeScript • JavaScript (ES6) • HTML5 • CSS3 • Tailwind CSS • Responsive Web Design • UI/UX",
      backend: "Node.js • Express.js • Python • REST APIs • PostgreSQL • MongoDB • JWT Auth • CRUD • MVC Architecture • API Integration",
      tools: "Git • GitHub • Vercel • Stripe • Docker (basic) • D3.js • CI/CD • Linux • Agile Scrum • Figma • Unit Testing • Postman • VS Code",
    },
    education: {
      title: "Self-Directed Full-Stack Web Development Program",
      period: "2022 - Present",
      description: "Completed coursework in JavaScript ES6, React, Next.js, Node.js, TypeScript, and modern web development frameworks through online platforms, documentation, and hands-on projects.",
    },
  },
  contact: {
    email: "iansiats9@gmail.com",
    location: "Colorado, USA",
    github: "https://github.com/Turbo9k",
    website: "https://iansiats.vercel.app",
  },
  siteSettings: {
    siteName: "Ian Siats - Web Developer Portfolio",
    siteDescription: "Web Developer crafting exceptional digital experiences with cutting-edge web technologies. Based in Colorado, USA.",
    authorName: "Ian Siats",
    authorEmail: "iansiats9@gmail.com",
  },
}

export async function GET() {
  try {
    let content: typeof defaultContent = defaultContent

    // Try Upstash Redis first (for production)
    if (redis) {
      try {
        const redisData = await redis.get(KV_CONTENT_KEY) as typeof defaultContent | null
        if (redisData && typeof redisData === "object") {
          content = redisData
        }
      } catch (redisError) {
      // KV not available, try file system (for local development)
      console.log("KV not available, trying file system...")
      try {
        await ensureDataDirectory()
        const fileContents = await fs.readFile(contentFilePath, "utf8")
        content = JSON.parse(fileContents)
      } catch (fileError) {
        // File doesn't exist, use default content
        console.log("File doesn't exist, using defaults")
        content = defaultContent
      }
      }
    } else {
      // KV not available, try file system (for local development)
      try {
        await ensureDataDirectory()
        const fileContents = await fs.readFile(contentFilePath, "utf8")
        content = JSON.parse(fileContents)
      } catch (fileError) {
        // File doesn't exist, use default content
        console.log("File doesn't exist, using defaults")
        content = defaultContent
      }
    }

    const response: ApiResponse<typeof content> = {
      success: true,
      data: content,
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      },
    })
  } catch (error) {
    console.error("Error reading content:", error)

    const response: ApiResponse = {
      success: false,
      error: "Failed to load content",
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== "object") {
      const response: ApiResponse = {
        success: false,
        error: "Invalid content data",
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Try Upstash Redis first (for production)
    if (redis) {
      try {
        await redis.set(KV_CONTENT_KEY, content)
        // Also try to sync to file system for backup (if possible)
        try {
          await ensureDataDirectory()
          await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), "utf8")
        } catch (fileError) {
          // File write failed, but Redis succeeded, so that's okay
          console.log("File write failed, but Redis save succeeded")
        }
      } catch (redisError) {
      // KV not available, try file system (for local development)
      console.log("KV not available, trying file system...")
      try {
        await ensureDataDirectory()
        await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), "utf8")
      } catch (writeError: any) {
        console.error("Error writing content:", writeError)
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
        await fs.writeFile(contentFilePath, JSON.stringify(content, null, 2), "utf8")
      } catch (writeError: any) {
        console.error("Error writing content:", writeError)
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
      message: "Content saved successfully",
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error("Error saving content:", error)

    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to save content",
    }

    return NextResponse.json(response, { status: 500 })
  }
}

