"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Github, Star } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  const allProjects = [
    {
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
    {
      title: "Parallax Experience",
      description:
        "Immersive scrolling experience with parallax effects, mouse tracking, floating particles, and interactive mini-games.",
      image: "🌟",
      tech: ["HTML5", "CSS3", "JavaScript", "Canvas API"],
      liveUrl: "/parallax",
      githubUrl: "#",
      featured: false,
      color: "from-green-500 to-teal-600",
      status: "Live",
    },
    {
      title: "Cognivex Admin",
      description:
        "Comprehensive admin dashboard with JWT authentication, role management, and real-time monitoring capabilities.",
      image: "🏢",
      tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "MongoDB"],
      liveUrl: "https://cognivex.vercel.app/",
      githubUrl: "https://github.com/Turbo9k/cognivex",
      featured: false,
      color: "from-indigo-500 to-blue-600",
      status: "Live",
    },
    {
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
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              All Projects
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            My Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A comprehensive showcase of my work, from interactive experiences to full-stack applications
          </p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-400" />
            Featured Projects
          </h3>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {allProjects
              .filter((project) => project.featured)
              .map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} />
              ))}
          </div>
        </motion.div>

        {/* All Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3 className="text-3xl font-bold mb-8">All Projects</h3>
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {allProjects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden h-full">
        <CardContent className="p-0">
          <div
            className={`h-48 bg-gradient-to-br ${project.color} flex items-center justify-center text-6xl relative overflow-hidden`}
          >
            <span className="relative z-10">{project.image}</span>

            {/* Status Badge */}
            <Badge
              className={`absolute top-4 right-4 z-20 ${
                project.status === "Live"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : project.status === "In Development"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    : "bg-blue-500/20 text-blue-400 border-blue-500/30"
              }`}
            >
              {project.status}
            </Badge>

            {project.featured && (
              <Badge className="absolute top-4 left-4 bg-purple-500/20 text-purple-400 border-purple-500/30 z-20">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-30">
              {project.liveUrl !== "#" && (
                <Button
                  size="sm"
                  variant="secondary"
                  asChild
                  className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100"
                >
                  <Link href={project.liveUrl}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Link>
                </Button>
              )}
              {project.githubUrl !== "#" && (
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200 border-white/30 hover:bg-white/20"
                >
                  <Link href={project.githubUrl}>
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <Badge key={tech} variant="secondary" className="bg-white/10 text-blue-400 border-blue-500/30">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
