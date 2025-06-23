import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import type { Project, ApiResponse } from "@/lib/types"

const projectsFilePath = path.join(process.cwd(), "data", "projects.json")

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
    await ensureDataDirectory()

    let projects: Project[]
    try {
      const fileContents = await fs.readFile(projectsFilePath, "utf8")
      const data = JSON.parse(fileContents)
      projects = data.projects || defaultProjects
    } catch {
      // File doesn't exist, use default projects
      projects = defaultProjects
      await fs.writeFile(projectsFilePath, JSON.stringify({ projects }, null, 2))
    }

    const response: ApiResponse<{ projects: Project[] }> = {
      success: true,
      data: { projects },
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      },
    })
  } catch (error) {
    console.error("Error reading projects file:", error)

    const response: ApiResponse = {
      success: false,
      error: "Failed to load projects",
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await ensureDataDirectory()

    const body = await request.json()
    const { projects } = body

    if (!Array.isArray(projects)) {
      const response: ApiResponse = {
        success: false,
        error: "Invalid projects data",
      }
      return NextResponse.json(response, { status: 400 })
    }

    const data = { projects }
    await fs.writeFile(projectsFilePath, JSON.stringify(data, null, 2))

    const response: ApiResponse = {
      success: true,
      message: "Projects saved successfully",
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error saving projects:", error)

    const response: ApiResponse = {
      success: false,
      error: "Failed to save projects",
    }

    return NextResponse.json(response, { status: 500 })
  }
}
