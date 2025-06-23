"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Zap } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  image: string
  tech: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
  color: string
  status: string
}

interface QuickAddProjectsProps {
  onAddProject: (project: Project) => void
  existingProjects: Project[]
}

const predefinedProjects: Project[] = [
  {
    id: "task-management-app",
    title: "Task Management App",
    description:
      "Collaborative task management with real-time updates, team collaboration, and project tracking features.",
    image: "📋",
    tech: ["Vue.js", "Express.js", "Socket.io", "MySQL"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    color: "from-cyan-500 to-blue-600",
    status: "Planning",
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    description: "Real-time weather tracking with interactive maps, forecasts, and location-based alerts.",
    image: "🌤️",
    tech: ["React", "OpenWeather API", "Chart.js", "Geolocation"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    color: "from-blue-500 to-cyan-600",
    status: "Planning",
  },
  {
    id: "social-media-analytics",
    title: "Social Media Analytics",
    description: "Comprehensive analytics dashboard for social media performance tracking and insights.",
    image: "📊",
    tech: ["Next.js", "TypeScript", "D3.js", "REST APIs"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    color: "from-purple-500 to-pink-600",
    status: "Planning",
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot Interface",
    description: "Intelligent chatbot with natural language processing and context-aware responses.",
    image: "🤖",
    tech: ["React", "OpenAI API", "Node.js", "WebSocket"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    color: "from-green-500 to-emerald-600",
    status: "Planning",
  },
  {
    id: "portfolio-cms",
    title: "Portfolio CMS",
    description: "Content management system for portfolio websites with drag-and-drop builder.",
    image: "🎨",
    tech: ["React", "Node.js", "MongoDB", "AWS S3"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    color: "from-orange-500 to-yellow-600",
    status: "Planning",
  },
  {
    id: "crypto-tracker",
    title: "Crypto Portfolio Tracker",
    description: "Real-time cryptocurrency portfolio tracking with price alerts and market analysis.",
    image: "₿",
    tech: ["Vue.js", "CoinGecko API", "Chart.js", "LocalStorage"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false,
    color: "from-yellow-500 to-orange-600",
    status: "Planning",
  },
]

export function QuickAddProjects({ onAddProject, existingProjects }: QuickAddProjectsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Filter out projects that already exist
  const availableProjects = predefinedProjects.filter(
    (predefined) => !existingProjects.some((existing) => existing.id === predefined.id),
  )

  const handleAddProject = (project: Project) => {
    onAddProject(project)
  }

  if (availableProjects.length === 0) {
    return null
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Add Projects
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300"
          >
            {isExpanded ? "Hide" : "Show"} ({availableProjects.length})
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl">{project.image}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm truncate">{project.title}</h4>
                    <p className="text-gray-400 text-xs line-clamp-2 mt-1">{project.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tech.slice(0, 2).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs border-white/20 text-gray-300">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech.length > 2 && (
                    <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                      +{project.tech.length - 2}
                    </Badge>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={() => handleAddProject(project)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Project
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              These are template projects you can quickly add and customize later.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
